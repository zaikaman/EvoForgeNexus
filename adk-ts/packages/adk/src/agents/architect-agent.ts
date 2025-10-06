import { Logger } from "../logger";
import { Event } from "../events/event";
import { LlmAgent } from "./llm-agent";
import type { InvocationContext } from "./invocation-context";
import type { BaseLlm } from "../models/base-llm";
import type { BaseTool } from "../tools/base/base-tool";

/**
 * System architecture design
 */
export interface SystemArchitecture {
	projectName: string;
	description: string;
	requirements: string[];
	techStack: {
		frontend: string[];
		backend: string[];
		database: string[];
		deployment: string[];
	};
	fileStructure: FileNode[];
	dataModels: DataModel[];
	apiEndpoints: ApiEndpoint[];
}

/**
 * File structure node
 */
export interface FileNode {
	name: string;
	type: "file" | "directory";
	path: string;
	purpose: string;
	children?: FileNode[];
}

/**
 * Data model definition
 */
export interface DataModel {
	name: string;
	description: string;
	fields: Array<{
		name: string;
		type: string;
		required: boolean;
		description: string;
	}>;
	relations?: Array<{
		type: "hasMany" | "hasOne" | "belongsTo";
		model: string;
	}>;
}

/**
 * API endpoint specification
 */
export interface ApiEndpoint {
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	path: string;
	description: string;
	auth: boolean;
	requestBody?: Record<string, any>;
	responseBody?: Record<string, any>;
}

/**
 * ArchitectAgent - System design and architecture planning agent
 * 
 * This agent analyzes requirements and creates detailed system architecture
 * including file structure, data models, API design, and tech stack recommendations.
 */
export class ArchitectAgent extends LlmAgent {
	protected logger = new Logger({ name: "ArchitectAgent" });

	constructor({
		name = "architect",
		description = "Expert system architect that analyzes requirements and designs scalable, maintainable application architectures with detailed file structures and data models.",
		model,
		tools = [],
	}: {
		name?: string;
		description?: string;
		model: BaseLlm;
		tools?: BaseTool[];
	}) {
		const instruction = `You are an expert software architect specializing in modern web applications.

## YOUR ROLE:
- Analyze user requirements and extract key features
- Design scalable, maintainable system architectures
- Create detailed file structures following best practices
- Define data models and relationships
- Design RESTful API endpoints
- Recommend appropriate tech stack

## ARCHITECTURE PRINCIPLES:
1. **Separation of Concerns**: Clear boundaries between layers
2. **Scalability**: Design for growth from day one
3. **Maintainability**: Easy to understand and modify
4. **Best Practices**: Follow industry standards (Next.js App Router, etc.)
5. **Security**: Auth, validation, and error handling built-in

## TECH STACK PREFERENCES:
- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: Prisma (PostgreSQL), MongoDB, or Supabase
- **Auth**: NextAuth.js, Clerk, or Supabase Auth
- **Deployment**: Vercel, Docker

## OUTPUT STRUCTURE:
When designing a system, provide:
{
  "projectName": "kebab-case-name",
  "description": "Clear one-line description",
  "requirements": ["Extracted feature 1", "Feature 2"],
  "techStack": {
    "frontend": ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS"],
    "backend": ["Next.js API Routes", "Prisma"],
    "database": ["PostgreSQL"],
    "deployment": ["Vercel"]
  },
  "fileStructure": [
    {
      "name": "app",
      "type": "directory",
      "path": "/app",
      "purpose": "Next.js app router pages and layouts",
      "children": [...]
    }
  ],
  "dataModels": [
    {
      "name": "User",
      "description": "User account information",
      "fields": [
        { "name": "id", "type": "string", "required": true, "description": "Unique identifier" }
      ]
    }
  ],
  "apiEndpoints": [
    {
      "method": "GET",
      "path": "/api/users",
      "description": "Fetch all users",
      "auth": true
    }
  ]
}

Focus on creating COMPLETE, PRODUCTION-READY architectures that developers can implement immediately.`;

		super({
			name,
			description,
			model,
			instruction,
			tools,
		});
	}

	/**
	 * Analyze requirements and generate system architecture
	 */
	async analyzeRequirements(
		requirements: string,
		context: InvocationContext,
	): Promise<SystemArchitecture> {
		this.logger.info("Analyzing requirements:", requirements);

		const prompt = `Analyze these requirements and design a complete system architecture:

${requirements}

Create a detailed architecture with:
1. Project name and description
2. Complete tech stack recommendations
3. Full file structure with purpose for each file/folder
4. All necessary data models with fields and relationships
5. Complete API endpoint specifications

Output as structured JSON following the SystemArchitecture format.`;

		try {
			// TODO: Implement actual LLM call
			const architecture = await this.generateArchitecture(prompt, context);

			this.logger.info(
				`Architecture created: ${architecture.projectName} with ${architecture.fileStructure.length} top-level folders`,
			);

			return architecture;
		} catch (error) {
			this.logger.error("Architecture design failed:", error);
			throw new Error(`Failed to design architecture: ${error}`);
		}
	}

	/**
	 * Generate file structure from architecture
	 */
	generateFileStructure(architecture: SystemArchitecture): string {
		const lines: string[] = [];

		const traverse = (node: FileNode, indent = 0) => {
			const prefix = "  ".repeat(indent);
			const icon = node.type === "directory" ? "📁" : "📄";
			lines.push(`${prefix}${icon} ${node.name} - ${node.purpose}`);

			if (node.children) {
				for (const child of node.children) {
					traverse(child, indent + 1);
				}
			}
		};

		lines.push(`\n## 📐 File Structure for ${architecture.projectName}\n`);
		for (const node of architecture.fileStructure) {
			traverse(node);
		}

		return lines.join("\n");
	}

	/**
	 * Generate data model documentation
	 */
	generateDataModelDocs(architecture: SystemArchitecture): string {
		const lines: string[] = [];

		lines.push(`\n## 🗄️ Data Models\n`);

		for (const model of architecture.dataModels) {
			lines.push(`### ${model.name}`);
			lines.push(model.description);
			lines.push("\n**Fields:**");

			for (const field of model.fields) {
				const required = field.required ? " (required)" : "";
				lines.push(`- **${field.name}**: ${field.type}${required} - ${field.description}`);
			}

			if (model.relations && model.relations.length > 0) {
				lines.push("\n**Relations:**");
				for (const relation of model.relations) {
					lines.push(`- ${relation.type} ${relation.model}`);
				}
			}

			lines.push("");
		}

		return lines.join("\n");
	}

	/**
	 * Generate API endpoint documentation
	 */
	generateApiDocs(architecture: SystemArchitecture): string {
		const lines: string[] = [];

		lines.push(`\n## 🌐 API Endpoints\n`);

		const grouped = architecture.apiEndpoints.reduce(
			(acc, endpoint) => {
				const key = endpoint.path.split("/")[2] || "general";
				if (!acc[key]) acc[key] = [];
				acc[key].push(endpoint);
				return acc;
			},
			{} as Record<string, ApiEndpoint[]>,
		);

		for (const [group, endpoints] of Object.entries(grouped)) {
			lines.push(`### ${group.toUpperCase()}`);

			for (const endpoint of endpoints) {
				const auth = endpoint.auth ? " 🔒" : "";
				lines.push(`\n**${endpoint.method} ${endpoint.path}**${auth}`);
				lines.push(endpoint.description);

				if (endpoint.requestBody) {
					lines.push("\nRequest Body:");
					lines.push("```json");
					lines.push(JSON.stringify(endpoint.requestBody, null, 2));
					lines.push("```");
				}

				if (endpoint.responseBody) {
					lines.push("\nResponse:");
					lines.push("```json");
					lines.push(JSON.stringify(endpoint.responseBody, null, 2));
					lines.push("```");
				}
			}

			lines.push("");
		}

		return lines.join("\n");
	}

	/**
	 * Helper: Generate architecture from LLM
	 */
	private async generateArchitecture(
		prompt: string,
		context: InvocationContext,
	): Promise<SystemArchitecture> {
		// TODO: Implement actual LLM call with structured output
		// For now, return a sample architecture

		return {
			projectName: "sample-app",
			description: "A sample Next.js application",
			requirements: ["User authentication", "CRUD operations", "Responsive UI"],
			techStack: {
				frontend: ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS"],
				backend: ["Next.js API Routes"],
				database: ["PostgreSQL", "Prisma"],
				deployment: ["Vercel"],
			},
			fileStructure: [
				{
					name: "app",
					type: "directory",
					path: "/app",
					purpose: "Next.js app router pages and layouts",
					children: [
						{
							name: "layout.tsx",
							type: "file",
							path: "/app/layout.tsx",
							purpose: "Root layout component",
						},
						{
							name: "page.tsx",
							type: "file",
							path: "/app/page.tsx",
							purpose: "Home page",
						},
					],
				},
			],
			dataModels: [
				{
					name: "User",
					description: "User account information",
					fields: [
						{
							name: "id",
							type: "string",
							required: true,
							description: "Unique identifier",
						},
						{
							name: "email",
							type: "string",
							required: true,
							description: "User email address",
						},
					],
				},
			],
			apiEndpoints: [
				{
					method: "GET",
					path: "/api/users",
					description: "Fetch all users",
					auth: true,
				},
			],
		};
	}

	/**
	 * Override runAsyncImpl to add architecture design capabilities
	 */
	protected async *runAsyncImpl(
		ctx: InvocationContext,
	): AsyncGenerator<Event, void, unknown> {
		const userMessage = ctx.userContent?.parts?.[0]?.text || "";

		const isArchitectureRequest =
			/design|architect|plan|structure/i.test(userMessage) ||
			/what.*files|how.*organize|system.*design/i.test(userMessage);

		if (isArchitectureRequest) {
			yield new Event({
				invocationId: ctx.invocationId,
				author: this.name,
				content: {
					role: "model",
					parts: [{ text: "🏗️ Designing system architecture..." }],
				},
			});

			try {
				const architecture = await this.analyzeRequirements(userMessage, ctx);

				// Generate documentation
				const fileStructure = this.generateFileStructure(architecture);
				const dataModels = this.generateDataModelDocs(architecture);
				const apiDocs = this.generateApiDocs(architecture);

				const fullDoc = `# 🎯 System Architecture: ${architecture.projectName}

${architecture.description}

## 📋 Requirements
${architecture.requirements.map((r) => `- ${r}`).join("\n")}

## 🛠️ Tech Stack

**Frontend**: ${architecture.techStack.frontend.join(", ")}
**Backend**: ${architecture.techStack.backend.join(", ")}
**Database**: ${architecture.techStack.database.join(", ")}
**Deployment**: ${architecture.techStack.deployment.join(", ")}

${fileStructure}
${dataModels}
${apiDocs}

## ✅ Next Steps
1. Initialize Next.js project
2. Setup database with Prisma
3. Implement authentication
4. Create data models
5. Build API routes
6. Develop UI components
7. Deploy to Vercel
`;

				yield new Event({
					invocationId: ctx.invocationId,
					author: this.name,
					content: {
						role: "model",
						parts: [{ text: fullDoc }],
					},
				});
			} catch (error) {
				yield new Event({
					invocationId: ctx.invocationId,
					author: this.name,
					content: {
						role: "model",
						parts: [{ text: `❌ Architecture design failed: ${error}` }],
					},
				});
			}
		} else {
			yield* super.runAsyncImpl(ctx);
		}
	}
}
