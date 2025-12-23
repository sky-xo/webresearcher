# Query: How do I stream responses with the Vercel AI SDK?

**Tool:** webresearcher --effort low
**Latency:** 15s

## Tokens
- Input: 8563
- Output: 878

## Cost
$0.0273

## Response

To stream responses with the Vercel AI SDK, you typically do two things:

1) **Return a streaming `Response` from your server route** (Route Handler / Serverless / Edge).
2) **Consume the stream on the client** (most commonly with `useChat()`).

Below are the most common patterns in Next.js (App Router).

---

## 1) Stream from a Next.js Route Handler (recommended)

### `app/api/chat/route.ts`
```ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
  });

  // Stream in the "data stream" format that the AI SDK client utilities expect:
  return result.toDataStreamResponse();
}
```

This uses `streamText()` to produce tokens incrementally and returns them as a streaming HTTP response. ([vercel.com](https://vercel.com/docs/functions/streaming/quickstart?utm_source=openai))

**Alternative:** if you just want plain text streaming (not the AI SDK "data stream" protocol), you can use `toTextStreamResponse()` instead. ([vercel.com](https://vercel.com/docs/functions/streaming/quickstart?utm_source=openai))

---

## 2) Consume the stream on the client with `useChat()`

### `app/page.tsx`
```tsx
'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          <b>{m.role}:</b> {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```

`useChat()` handles posting messages to your route and updating the UI as chunks arrive. ([blog.logrocket.com](https://blog.logrocket.com/nextjs-vercel-ai-sdk-streaming/?utm_source=openai))

---

## 3) Stream *custom events/data* alongside the model (advanced)

If you want to stream additional server-side info (RAG citations, tool progress, metadata, etc.) while the LLM streams, the AI SDK supports building your own streaming response using `createDataStreamResponse`. ([vercel.com](https://vercel.com/blog/ai-sdk-4-1?utm_source=openai))

---

## Common gotchas

- **Use `toDataStreamResponse()` with `useChat()`:** they're designed to work together (data stream protocol). ([vercel.com](https://vercel.com/kb/guide/streaming-from-llm?utm_source=openai))
- **Make sure your deployment supports streaming:** Vercel Functions support streaming; Vercel recommends the AI SDK for this use case. ([vercel.com](https://vercel.com/docs/functions/streaming-functions?utm_source=openai))

---

If you tell me your stack (Next.js App Router vs Pages Router, Edge vs Node runtime, and whether you're using `useChat` or a custom fetch), I can tailor the exact code to your setup.
