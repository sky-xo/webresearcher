# Query: How do I stream responses with the Vercel AI SDK?

**Tool:** WebSearch
**Latency:** 3.0s

## Response

## Why Use Streaming?
Streaming enables you to show users chunks of data as they arrive.

## Core Streaming Approach
Use `streamText` in the backend. Call `toTextStreamResponse()` for streaming HTTP response.

```typescript
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages: convertToModelMessages(messages),
  });
  return result.toTextStreamResponse();
}
```

## Data Stream Protocol
Uses Server-Sent Events (SSE) format. Use `toUIMessageStreamResponse()` from streamText result.

## Frontend Hooks
React and Svelte hooks for streaming. Use `useChat` and `useCompletion`.

## Provider Flexibility
Works with OpenAI, Gemini, Anthropic, and others.
