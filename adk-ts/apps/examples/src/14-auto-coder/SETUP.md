# AUTO-CODER Setup Guide

## Prerequisites

- Node.js ### Basic Code Generation
### Architecture Design

```typescript
import { ArchitectAgent, OpenAiLlm, InMemoryRunner } from "@iqai/adk";

const model = new OpenAiLlm("gpt-5-nano"); // Default model
const agent = new ArchitectAgent({ model });
const runner = new InMemoryRunner(agent);script
import { CodeGeneratorAgent, OpenAiLlm, InMemoryRunner } from "@iqai/adk";

const model = new OpenAiLlm("gpt-5-nano"); // Default model
const agent = new CodeGeneratorAgent({ model });
const runner = new InMemoryRunner(agent);0+
- npm or pnpm
- OpenAI API key

## Installation

### 1. Install Dependencies

```bash
# From adk-ts root
npm install

# Or with pnpm
pnpm install
```

### 2. Build ADK Package

```bash
cd packages/adk
npm run build
```

### 3. Set API Key

```bash
# For PowerShell (Windows)
$env:OPENAI_API_KEY="sk-your-api-key-here"

# For Bash/Zsh (Mac/Linux)
export OPENAI_API_KEY=sk-your-api-key-here
```

### 4. Run Examples

```bash
# Quick start demo
cd apps/examples
tsx src/14-auto-coder/quick-start.ts

# Full pipeline demo
tsx src/14-auto-coder/demo.ts
```

## Environment Variables

Create a `.env` file in `apps/examples/`:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

## Usage

### Basic Code Generation

```typescript
import { CodeGeneratorAgent, OpenAI, InMemoryRunner } from "@iqai/adk";

const model = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const agent = new CodeGeneratorAgent({ model });
const runner = new InMemoryRunner(agent);

for await (const event of runner.runAsync({
  userId: "user",
  sessionId: "session-1",
  newMessage: {
    role: "user",
    parts: [{ text: "Create a todo app" }]
  }
})) {
  console.log(event);
}
```

### Architecture Design

```typescript
import { ArchitectAgent, OpenAI, InMemoryRunner } from "@iqai/adk";

const model = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const agent = new ArchitectAgent({ model });
const runner = new InMemoryRunner(agent);

for await (const event of runner.runAsync({
  userId: "user",
  sessionId: "session-1",
  newMessage: {
    role: "user",
    parts: [{ text: "Design a chat application architecture" }]
  }
})) {
  console.log(event);
}
```

## Troubleshooting

### "Cannot find module '@iqai/adk'"

Make sure you've built the package:
```bash
cd packages/adk && npm run build
```

### "OPENAI_API_KEY is required"

Set the environment variable:
```bash
export OPENAI_API_KEY=your-key
```

### "Module not found" errors

Install dependencies:
```bash
npm install
```

## Development

### Watch Mode

```bash
cd packages/adk
npm run dev
```

### Run Tests

```bash
cd packages/adk
npm test
```

## Project Structure

```
adk-ts/
├── packages/
│   └── adk/
│       └── src/
│           ├── agents/
│           │   ├── code-generator-agent.ts  # Code generation
│           │   └── architect-agent.ts       # Architecture design
│           └── templates/                   # Code templates
│               ├── nextjs-app.ts
│               ├── react-components.ts
│               └── api-routes.ts
└── apps/
    └── examples/
        └── src/
            └── 14-auto-coder/
                ├── demo.ts          # Full demo
                ├── quick-start.ts   # Quick example
                └── README.md        # Documentation
```

## Next Steps

1. Try the quick start demo
2. Modify prompts to generate different types of apps
3. Explore the generated code structure
4. Customize templates for your needs

## Support

For issues or questions:
- Check the main README.md
- Review example code in `apps/examples/`
- Check ADK documentation

## License

MIT
