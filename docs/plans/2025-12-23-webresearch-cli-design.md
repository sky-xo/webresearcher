# webresearcher CLI Design

## Purpose

A single-shot CLI that pipes queries to GPT-5.2 with web search enabled, returning up-to-date research answers with citations.

Designed for agent use - clarity over brevity.

## Usage

```bash
webresearcher "what terminals are AI devs preferring currently?"
webresearcher --effort high "comprehensive analysis of React vs Vue in 2025"
webresearcher --effort low "current bitcoin price"
```

## Tech Stack

- **Runtime:** Bun (fast startup, native TypeScript)
- **Language:** TypeScript
- **API:** OpenAI Responses API (`/v1/responses`)
- **Model:** `gpt-5.2`
- **Tool:** `web_search` (agentic search with reasoning)

## Configuration

- `OPENAI_API_KEY` environment variable (required)
- `--effort low|medium|high` flag (default: `medium`)

## API Call Structure

```typescript
const response = await client.responses.create({
  model: "gpt-5.2",
  reasoning: { effort: "medium" },
  tools: [{ type: "web_search" }],
  input: query,
});
```

## File Structure

```
webresearcher/
├── package.json          # name: "webresearcher", bin config
├── src/
│   └── index.ts          # Main CLI entry point
└── tsconfig.json         # TypeScript config
```

## Output

- Plain markdown streamed to stdout
- Citations included inline (as provided by the API)

## Installation

```bash
bun link
```

Makes `webresearcher` available globally.

## Design Decisions

1. **Single-shot over conversational** - Web research queries are typically self-contained. Conversation mode can be added later if needed.

2. **Bun over Node** - Faster startup time (~10-20ms vs ~30-50ms+ for Python with OpenAI SDK imports).

3. **Default medium reasoning** - Good balance of depth and speed. `--effort` flag for control when needed.

4. **No config file** - Environment variable for API key is sufficient. Most developers already have `OPENAI_API_KEY` set.

5. **Minimal structure** - Three files total. No build step needed with Bun's native TypeScript support.
