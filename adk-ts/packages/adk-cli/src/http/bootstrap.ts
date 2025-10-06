import "reflect-metadata";

import { existsSync, readFileSync, watch } from "node:fs";
import type { FSWatcher } from "node:fs";
import { resolve, sep } from "node:path";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { HttpModule } from "./http.module";
import { AgentManager } from "./providers/agent-manager.service";
import { DIRECTORIES_TO_SKIP } from "./providers/agent-scanner.service";
import { HotReloadService } from "./reload/hot-reload.service";
import type { RuntimeConfig } from "./runtime-config";

function pathHasSkippedDir(p: string): boolean {
	const parts = p.split(sep).filter(Boolean);
	return parts.some((part) =>
		(DIRECTORIES_TO_SKIP as readonly string[]).includes(part),
	);
}

/**
 * Load simple .gitignore prefixes.
 * For robustness without extra deps, we:
 * - ignore blank and comment lines
 * - skip complex globs (* ? [])
 * - treat entries as path prefixes relative to repo root
 */
function loadGitignorePrefixes(rootDir: string): string[] {
	try {
		const igPath = resolve(rootDir, ".gitignore");
		if (!existsSync(igPath)) return [];
		const lines = readFileSync(igPath, "utf8").split("\n");
		const prefixes: string[] = [];
		for (const raw of lines) {
			const line = raw.trim();
			if (!line || line.startsWith("#")) continue;
			if (/[?*\[\]]/.test(line)) continue; // skip complex glob lines
			const normalized = line.replace(/\/+$/, "");
			const abs = resolve(rootDir, normalized);
			prefixes.push(abs + sep);
		}
		return prefixes;
	} catch {
		return [];
	}
}

function shouldIgnorePath(fullPath: string, prefixes: string[]): boolean {
	if (pathHasSkippedDir(fullPath)) return true;
	for (const pref of prefixes) {
		if (fullPath.startsWith(pref)) return true;
	}
	return false;
}

/**
 * Setup hot reload file watching with .gitignore filtering and well-known directory skips.
 * Returns watcher/timeout references and a teardown function to close resources.
 */
function setupHotReload(
	agentManager: AgentManager,
	hotReload: HotReloadService | undefined,
	config: RuntimeConfig,
): {
	watchers: FSWatcher[];
	debouncers: NodeJS.Timeout[];
	teardownHotReload: () => void;
} {
	const watchers: FSWatcher[] = [];
	const debouncers: NodeJS.Timeout[] = [];
	const shouldWatch = config.hotReload ?? process.env.NODE_ENV !== "production";

	if (!shouldWatch) {
		return { watchers, debouncers, teardownHotReload: () => {} };
	}

	const rootDir = process.cwd();
	const gitignorePrefixes = loadGitignorePrefixes(rootDir);

	const rawPaths =
		Array.isArray(config.watchPaths) && config.watchPaths.length > 0
			? config.watchPaths
			: [rootDir];

	const paths = rawPaths.filter(Boolean).map((p) => resolve(p as string));
	for (const p of paths) {
		try {
			const watcher = watch(
				p,
				// recursive is supported on macOS and Windows; best-effort on others
				{ recursive: true },
				(_event, filename) => {
					// Filter out ignored paths early
					const fullPath =
						typeof filename === "string" ? resolve(p, filename) : p;
					if (shouldIgnorePath(fullPath, gitignorePrefixes)) {
						if (!config.quiet && process.env.ADK_DEBUG_NEST === "1") {
							console.log(`[hot-reload] Ignored change in ${fullPath}`);
						}
						return;
					}

					// Simple global debounce: clear pending reloads and schedule a new one
					while (debouncers.length) {
						const t = debouncers.pop();
						if (t) clearTimeout(t);
					}
					const t = setTimeout(async () => {
						try {
							// Clear running agents so next use reloads fresh code, then rescan
							agentManager.stopAllAgents();
							agentManager.scanAgents(config.agentsDir);
							if (!config.quiet && process.env.ADK_DEBUG_NEST === "1") {
								console.log(
									`[hot-reload] Reloaded agents after change in ${filename ?? p}`,
								);
							}
							// Notify connected clients (web UI) to refresh
							try {
								hotReload?.broadcast(
									typeof filename === "string" ? filename : null,
								);
							} catch {}
						} catch (e) {
							console.error("[hot-reload] Error during reload:", e);
						}
					}, 300);
					debouncers.push(t);
				},
			);
			watchers.push(watcher);
			if (!config.quiet && process.env.ADK_DEBUG_NEST === "1") {
				console.log(`[hot-reload] Watching ${p}`);
			}
		} catch (e) {
			console.warn(
				`[hot-reload] Failed to watch ${p}: ${
					e instanceof Error ? e.message : String(e)
				}`,
			);
		}
	}

	const teardownHotReload = () => {
		for (const t of debouncers) {
			clearTimeout(t);
		}
		for (const w of watchers) {
			try {
				w.close();
			} catch {}
		}
		try {
			hotReload?.closeAll();
		} catch {}
	};

	return { watchers, debouncers, teardownHotReload };
}

export interface StartedHttpServer {
	app: NestExpressApplication;
	url: string;
	stop: () => Promise<void>;
}

/**
 * Start a Nest Express HTTP server with the ADK controllers and providers.
 * Mirrors previous Hono server endpoints:
 * - GET /health
 * - /api/agents ...
 * - /api/agents/:id/sessions ...
 */
export async function startHttpServer(
	config: RuntimeConfig,
): Promise<StartedHttpServer> {
	const app = await NestFactory.create<NestExpressApplication>(
		HttpModule.register(config),
		{
			logger:
				process.env.ADK_DEBUG_NEST === "1"
					? ["log", "error", "warn", "debug", "verbose"]
					: ["error", "warn"],
		},
	);

	// CORS parity with previous Hono app.use("/*", cors())
	app.enableCors({
		origin: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	// Configure body size limits using NestJS methods
	const bodyLimit = process.env.ADK_HTTP_BODY_LIMIT || "25mb";
	app.useBodyParser("json", { limit: bodyLimit });
	app.useBodyParser("urlencoded", { limit: bodyLimit, extended: true });

	// Initial agent scan (parity with ADKServer constructor)
	const agentManager = app.get(AgentManager, { strict: false });
	const hotReload = app.get(HotReloadService, { strict: false });
	agentManager.scanAgents(config.agentsDir);

	// Swagger / OpenAPI setup
	const enableSwagger = config.swagger ?? process.env.NODE_ENV !== "production";
	if (enableSwagger) {
		const builder = new DocumentBuilder()
			.setTitle("ADK HTTP API")
			.setDescription(
				"REST endpoints for managing and interacting with ADK agents",
			)
			.setVersion("1.0.0")
			.addTag("agents")
			.addTag("sessions")
			.addTag("events")
			.addTag("state")
			.addTag("messaging")
			.addTag("health")
			.build();
		const document = SwaggerModule.createDocument(app, builder, {
			deepScanRoutes: true,
		});
		SwaggerModule.setup("docs", app, document, {
			customSiteTitle: "ADK API Docs",
			jsonDocumentUrl: "/openapi.json",
		});
		if (!config.quiet && process.env.ADK_DEBUG_NEST === "1") {
			console.log("[openapi] Docs available at /docs (json: /openapi.json)");
		}
	}

	// Hot reloading: setup via helper for readability and testability
	const { teardownHotReload } = setupHotReload(agentManager, hotReload, config);

	await app.listen(config.port, config.host);
	const url = `http://${config.host}:${config.port}`;

	const stop = async () => {
		try {
			// Graceful shutdown: stop all agents first
			agentManager.stopAllAgents();
		} finally {
			// Tear down hot reload resources and close app
			try {
				teardownHotReload();
			} catch {}
			await app.close();
		}
	};

	return { app, url, stop };
}
