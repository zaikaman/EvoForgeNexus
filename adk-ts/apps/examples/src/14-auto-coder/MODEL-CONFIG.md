# AUTO-CODER Configuration

## Default Model Settings

The AUTO-CODER system is configured to use **GPT-5-nano** as the default model across all agents.

### Model Configuration

**Default Model**: `gpt-5-nano`
- **Location**: `packages/adk/src/models/openai-llm.ts`
- **Constructor**: `constructor(model = "gpt-5-nano")`

### Usage in Agents

All AUTO-CODER agents use this default model:

```typescript
// Code Generator Agent
const model = new OpenAiLlm("gpt-5-nano");
const codeGen = new CodeGeneratorAgent({ model });

// Architect Agent
const architect = new ArchitectAgent({ model });
```

### Custom Model Override

You can override the default model:

```typescript
// Use a different model
const model = new OpenAiLlm("gpt-4o");
const agent = new CodeGeneratorAgent({ model });
```

### Supported Models

The OpenAI LLM supports:
- `gpt-3.5-*`
- `gpt-4.*`
- `gpt-4o.*`
- `gpt-5.*` (including gpt-5-nano)
- `o1-.*`
- `o3-.*`

### Environment Setup

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk-your-api-key-here

# The model is already configured in the code
# No additional model configuration needed
```

### Files Using Default Model

1. **OpenAI LLM Base**
   - `packages/adk/src/models/openai-llm.ts`
   - Default: `gpt-5-nano`

2. **Examples**
   - `apps/examples/src/14-auto-coder/quick-start.ts`
   - Explicitly uses: `gpt-5-nano`

3. **Agents**
   - `packages/adk/src/agents/code-generator-agent.ts`
   - `packages/adk/src/agents/architect-agent.ts`
   - Accept model as parameter (uses default from OpenAiLlm)

## Why GPT-5-nano?

- **Fast**: Optimized for speed
- **Efficient**: Lower cost per token
- **Capable**: Sufficient for code generation tasks
- **Available**: Part of OpenAI's latest model family

## Changing the Default

To change the default model system-wide:

1. Edit `packages/adk/src/models/openai-llm.ts`:
   ```typescript
   constructor(model = "your-preferred-model") {
   ```

2. Rebuild the package:
   ```bash
   cd packages/adk
   npm run build
   ```

3. Update examples if needed:
   ```typescript
   const model = new OpenAiLlm("your-preferred-model");
   ```

## Testing

```bash
# Test with default model
export OPENAI_API_KEY=sk-your-key
cd apps/examples
tsx src/14-auto-coder/quick-start.ts
```

The system will use `gpt-5-nano` by default unless explicitly overridden.
