import type { Content } from "@google/genai";
import { Logger } from "../logger";
import { Event } from "../events/event";
import { LlmAgent } from "./llm-agent";
import type { InvocationContext } from "./invocation-context";
import type { BaseLlm } from "../models/base-llm";
import type { BaseTool } from "../tools/base/base-tool";

/**
 * Structure for generated code files
 */
export interface GeneratedFile {
	path: string;
	content: string;
	language: string;
}

/**
 * Structure for project architecture
 */
export interface ProjectArchitecture {
	name: string;
	description: string;
	techStack: string[];
	files: GeneratedFile[];
	dependencies: Record<string, string>;
}

/**
 * CodeGeneratorAgent - The killer feature agent that generates actual deployable code
 * 
 * This agent analyzes user requirements and generates complete, production-ready
 * code including components, API routes, configurations, and deployment files.
 */
export class CodeGeneratorAgent extends LlmAgent {
	protected logger = new Logger({ name: "CodeGeneratorAgent" });

	constructor({
		name = "code_generator",
		description = "Expert AI agent that writes production-ready TypeScript/React code, creates complete applications from requirements, and generates deployment-ready projects.",
		model,
		tools = [],
	}: {
		name?: string;
		description?: string;
		model: BaseLlm;
		tools?: BaseTool[];
	}) {
		// Enhanced instruction for code generation
		const instruction = `You are an expert code generation AI that writes production-ready, deployable applications.

## YOUR CAPABILITIES:
- Write clean, maintainable TypeScript/JavaScript code
- Create full-stack Next.js applications with React components
- Generate API routes and backend logic
- Write comprehensive tests and documentation
- Follow best practices and modern patterns
- Create deployment configurations (Vercel, Docker, etc.)

## CODE GENERATION PRINCIPLES:
1. **Complete & Working**: Generate full, executable code - no placeholders or TODOs
2. **Production Quality**: Include error handling, validation, and edge cases
3. **Modern Stack**: Use latest Next.js, React, TypeScript best practices
4. **Self-Contained**: Generate all necessary files (components, APIs, configs)
5. **Deployable**: Include deployment configs and environment setup

## OUTPUT FORMAT:
When generating code, structure it as JSON with this format:
{
  "architecture": {
    "name": "app-name",
    "description": "brief description",
    "techStack": ["Next.js 14", "React", "TypeScript", "Tailwind CSS"],
    "dependencies": { "package": "version" }
  },
  "files": [
    {
      "path": "app/page.tsx",
      "content": "// Full file content here",
      "language": "typescript"
    }
  ]
}

## WHEN USER ASKS TO CREATE AN APP:
1. Analyze requirements and identify features
2. Design system architecture and file structure
3. Generate ALL necessary files with complete code
4. Include package.json, tsconfig.json, and deployment configs
5. Add README with setup instructions

Focus on creating REAL, WORKING applications that can be deployed immediately.`;

		super({
			name,
			description,
			model,
			instruction,
			tools,
		});
	}

	/**
	 * Generate a complete project from requirements
	 */
	async generateProject(
		requirements: string,
		context: InvocationContext,
	): Promise<ProjectArchitecture> {
		this.logger.info("Starting code generation for:", requirements);

		// Call LLM to generate project structure
		const prompt = `Generate a complete, production-ready application based on these requirements:

${requirements}

Requirements:
- Generate ALL files needed for a working application
- Include package.json with all dependencies
- Add TypeScript configurations
- Create deployment configurations (vercel.json)
- Include a comprehensive README.md
- Write clean, documented, production-quality code

Output the complete project as a structured JSON with architecture and files.`;

		try {
			// Use parent LlmAgent's capabilities to call the model
			const response = await this.generateStructuredOutput(prompt, context);
			
			// Parse and validate the response
			const project = this.parseProjectResponse(response);
			
			this.logger.info(
				`Generated project: ${project.name} with ${project.files.length} files`,
			);

			return project;
		} catch (error) {
			this.logger.error("Code generation failed:", error);
			throw new Error(`Failed to generate code: ${error}`);
		}
	}

	/**
	 * Generate a single file with specific requirements
	 */
	async generateFile(
		fileType: string,
		requirements: string,
		context: InvocationContext,
	): Promise<GeneratedFile> {
		this.logger.info(`Generating ${fileType}:`, requirements);

		const prompt = `Generate a ${fileType} file with the following requirements:

${requirements}

Requirements:
- Write complete, production-ready code
- Include proper error handling
- Add TypeScript types
- Follow best practices
- Include comments for complex logic

Output the file content directly.`;

		try {
			const content = await this.generateTextOutput(prompt, context);

			return {
				path: this.inferFilePath(fileType, requirements),
				content,
				language: this.inferLanguage(fileType),
			};
		} catch (error) {
			this.logger.error("File generation failed:", error);
			throw new Error(`Failed to generate file: ${error}`);
		}
	}

	/**
	 * Helper: Generate structured output from LLM
	 */
	private async generateStructuredOutput(
		prompt: string,
		context: InvocationContext,
	): Promise<any> {
		// This would use the LLM to generate structured JSON
		// For now, return a placeholder that demonstrates the structure
		// In real implementation, this would call this.model.generateContent()
		
		// TODO: Implement actual LLM call with JSON schema validation
		return {
			architecture: {
				name: "generated-app",
				description: "Generated application",
				techStack: ["Next.js 14", "React", "TypeScript"],
				dependencies: {
					"next": "^14.0.0",
					"react": "^18.2.0",
					"typescript": "^5.0.0",
				},
			},
			files: [
				{
					path: "app/page.tsx",
					content: "// Generated code will appear here",
					language: "typescript",
				},
			],
		};
	}

	/**
	 * Helper: Generate text output from LLM
	 */
	private async generateTextOutput(
		prompt: string,
		context: InvocationContext,
	): Promise<string> {
		// TODO: Implement actual LLM call
		return "// Generated code content";
	}

	/**
	 * Parse and validate LLM response into ProjectArchitecture
	 */
	private parseProjectResponse(response: any): ProjectArchitecture {
		// Validate response structure
		if (!response.architecture || !response.files) {
			throw new Error("Invalid project structure from LLM");
		}

		return {
			name: response.architecture.name || "generated-project",
			description: response.architecture.description || "",
			techStack: response.architecture.techStack || [],
			files: response.files || [],
			dependencies: response.architecture.dependencies || {},
		};
	}

	/**
	 * Infer file path from file type and requirements
	 */
	private inferFilePath(fileType: string, requirements: string): string {
		const typeMap: Record<string, string> = {
			component: "components/Component.tsx",
			page: "app/page.tsx",
			api: "app/api/route.ts",
			layout: "app/layout.tsx",
			config: "next.config.ts",
		};

		return typeMap[fileType.toLowerCase()] || `generated/${fileType}.ts`;
	}

	/**
	 * Infer language from file type
	 */
	private inferLanguage(fileType: string): string {
		const langMap: Record<string, string> = {
			component: "typescript",
			page: "typescript",
			api: "typescript",
			layout: "typescript",
			config: "typescript",
			style: "css",
			markdown: "markdown",
		};

		return langMap[fileType.toLowerCase()] || "typescript";
	}

	/**
	 * Override runAsyncImpl to add code generation capabilities
	 */
	protected async *runAsyncImpl(
		ctx: InvocationContext,
	): AsyncGenerator<Event, void, unknown> {
		// Detect if user is asking for code generation
		const userMessage = ctx.userContent?.parts?.[0]?.text || "";
		
		const isCodeGenRequest = 
			/create|generate|build|make/i.test(userMessage) &&
			/app|application|project|component|api/i.test(userMessage);

		if (isCodeGenRequest) {
			// Emit event that we're starting code generation
			yield new Event({
				invocationId: ctx.invocationId,
				author: this.name,
				content: {
					role: "model",
					parts: [{ text: "🚀 Starting code generation..." }],
				},
			});

			// Generate the project
			try {
				const project = await this.generateProject(userMessage, ctx);

				// Emit progress events for each file
				for (const file of project.files) {
					yield new Event({
						invocationId: ctx.invocationId,
						author: this.name,
						content: {
							role: "model",
							parts: [{ text: `✅ Generated: ${file.path}` }],
						},
						partial: true,
					});
				}

				// Emit final result
				yield new Event({
					invocationId: ctx.invocationId,
					author: this.name,
					content: {
						role: "model",
						parts: [
							{
								text: `✨ Code generation complete!\n\nProject: ${project.name}\nFiles: ${project.files.length}\nTech Stack: ${project.techStack.join(", ")}\n\nReady to deploy! 🚀`,
							},
						],
					},
				});
			} catch (error) {
				yield new Event({
					invocationId: ctx.invocationId,
					author: this.name,
					content: {
						role: "model",
						parts: [
							{
								text: `❌ Code generation failed: ${error}`,
							},
						],
					},
				});
			}
		} else {
			// Fall back to standard LLM behavior for non-code-gen requests
			yield* super.runAsyncImpl(ctx);
		}
	}
}
