import { env } from "node:process";
import {
	AgentBuilder,
	createTool,
	initializeTelemetry,
	shutdownTelemetry,
} from "@iqai/adk";
import dedent from "dedent";
import * as z from "zod";
import { ask } from "../utils";

/**
 * 09 - Observability and Telemetry
 *
 * Learn how to monitor your AI agents with Langfuse.
 *
 * Concepts covered:
 * - TelemetryService setup with Langfuse
 * - Automatic tracking of agent interactions
 * - Tool usage monitoring
 * - Dashboard visualization
 */

// Simple tool to demonstrate tool usage tracking
const getWeatherTool = createTool({
	name: "get_weather",
	description: "Get current weather for a location",
	schema: z.object({
		location: z.string().describe("The city and state/country"),
	}),
	fn: async ({ location }) => {
		// Simulate weather API call
		const weather = ["sunny", "cloudy", "rainy", "snowy"];
		const temp = Math.floor(Math.random() * 30) + 10;
		const condition = weather[Math.floor(Math.random() * weather.length)];

		return `The weather in ${location} is ${condition} with a temperature of ${temp}°C`;
	},
});

function initalizeLangfuse() {
	if (!env.LANGFUSE_PUBLIC_KEY || !env.LANGFUSE_SECRET_KEY) {
		console.log(
			"Set LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY to enable telemetry",
		);
		return null;
	}

	const langfuseHost = env.LANGFUSE_HOST || "https://cloud.langfuse.com";

	const authString = Buffer.from(
		`${env.LANGFUSE_PUBLIC_KEY}:${env.LANGFUSE_SECRET_KEY}`,
	).toString("base64");

	initializeTelemetry({
		appName: "observability-example",
		appVersion: "1.0.0",
		otlpEndpoint: `${langfuseHost}/api/public/otel/v1/traces`,
		otlpHeaders: {
			Authorization: `Basic ${authString}`,
		},
	});
}

async function main() {
	console.log("Observability Example - Langfuse Telemetry");

	// Initialize telemetry
	initalizeLangfuse();

	// Create agent with telemetry tracking
	const { runner } = await AgentBuilder.create("weather_agent")
		.withModel(env.LLM_MODEL || "gemini-2.5-flash")
		.withDescription(
			"A helpful weather assistant with automatic telemetry tracking",
		)
		.withTools(getWeatherTool)
		.withInstruction(
			dedent`
			You are a helpful weather assistant. When users ask about weather,
			use the get_weather tool to provide current conditions.
			Be friendly and conversational in your responses.
		`,
		)
		.build();

	console.log("\nAsking agent about weather:");
	await ask(
		runner,
		"What's the weather like in San Francisco? Also, can you give me some tips for what to wear in that weather?",
	);

	console.log(
		"\n 💡 Check your Langfuse dashboard to see traces, tool usage, and metrics",
	);

	shutdownTelemetry();
}

main().catch(console.error);
