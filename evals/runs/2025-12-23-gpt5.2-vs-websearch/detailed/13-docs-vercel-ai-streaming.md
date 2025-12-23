# Query 13: How do I stream responses with the Vercel AI SDK?

**Type:** docs

## Response A (WebSearch)

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

## Response B (webresearcher)

### 1) Pick the stream protocol you want

**A) UI Message / Data Stream (recommended for chat UIs)**
Use for richer streaming (tool calls, custom parts, metadata). `useChat()` uses it by default.

**B) Text Stream (simplest)**
Use for plain text chunks only.

## 2) Next.js App Router backend

### A) UI Message stream
```ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: await convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

### B) Text stream
```ts
return result.toTextStreamResponse();
```

## 3) Client: consume the stream

### A) UI Message stream client
```tsx
'use client';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, sendMessage } = useChat();
}
```

### B) Text stream client
```tsx
import { TextStreamChatTransport } from 'ai';

const { messages, sendMessage } = useChat({
  transport: new TextStreamChatTransport({ api: '/api/chat' }),
});
```

### Note for custom backends
Set header `x-vercel-ai-ui-message-stream: v1`.

## Judgment

**Winner:** B (webresearcher)
**Reasoning:** Response B distinguishes between the two streaming approaches (UI Message vs Text Stream), provides concrete implementation for both backend and frontend, and includes important details like `maxDuration` and the custom header. Response A lacks the critical distinction and omits frontend details.

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 94990ms | ~3000ms |
