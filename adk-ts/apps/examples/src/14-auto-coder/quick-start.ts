/**
 * AUTO-CODER Quick Start
 * Simple example demonstrating code generation
 */

import { CodeGeneratorAgent } from "@iqai/adk";
import { OpenAiLlm } from "@iqai/adk";
import { InMemoryRunner } from "@iqai/adk";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function quickStart() {
	console.log("🚀 AUTO-CODER Quick Start\n");

	// Create Code Generator Agent
	const model = new OpenAiLlm("gpt-5-nano");
	const agent = new CodeGeneratorAgent({ model });
	const runner = new InMemoryRunner(agent);

	// Generate a simple app
	const requirement = "Create a todo list with add, complete, and delete features";

	console.log("📝 Request:", requirement);
	console.log("\n⚡ Generating code...\n");

	for await (const event of runner.runAsync({
		userId: "user",
		sessionId: "quick-start",
		newMessage: {
			role: "user",
			parts: [{ text: requirement }],
		},
	})) {
		if (event.content?.parts) {
			for (const part of event.content.parts) {
				if (part.text) {
					console.log(part.text);
				}
			}
		}
	}

	console.log("\n✅ Complete!");
}

quickStart();
