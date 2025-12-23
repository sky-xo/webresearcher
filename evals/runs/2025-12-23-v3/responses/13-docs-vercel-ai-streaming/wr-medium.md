# Query: How do I stream responses with the Vercel AI SDK?

**Tool:** webresearcher --effort medium
**Latency:** 57s

## Tokens
- Input: 41016
- Output: 3090

## Cost
$0.1150

## Response

To stream responses with the Vercel AI SDK, you typically:

1) **Stream on the server** with `streamText(...)`
2) **Return a streaming Response** (most commonly `result.toUIMessageStreamResponse()`)
3) **Consume it on the client** with `useChat()` (streams by default)

Below is the most common setup (Next.js App Router + `useChat`).

---

## 1) Install packages

```bash
npm i ai @ai-sdk/openai
```

(You can swap `@ai-sdk/openai` for another provider.)

---

## 2) Server: Next.js route that streams (recommended "UI Message Stream")

`app/api/chat/route.ts`

```ts
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30s (Vercel/Next.js route config)
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: await convertToModelMessages(messages),
  });

  // Streams tokens + supports richer parts (tools, etc.) for useChat()
  return result.toUIMessageStreamResponse();
}
```

`streamText` exposes helpers like `toUIMessageStreamResponse()` for building streaming HTTP responses. ([ai-sdk.dev](https://ai-sdk.dev/docs/ai-sdk-core/generating-text))

---

## 3) Client: `useChat()` consumes the stream and updates UI as tokens arrive

`app/page.tsx`

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop } = useChat({
    api: '/api/chat', // default is /api/chat
  });

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <strong>{message.role}:</strong>{' '}
          {message.parts.map((part, i) =>
            part.type === 'text' ? <span key={i}>{part.text}</span> : null,
          )}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage(input);
          setInput('');
        }}
      >
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit" disabled={status !== 'ready'}>
          Send
        </button>

        {status === 'streaming' && (
          <button type="button" onClick={stop}>
            Stop
          </button>
        )}
      </form>
    </div>
  );
}
```

`useChat()` is built for streaming and defaults to a transport that hits `/api/chat`. ([ai-sdk.dev](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat))

---

## Notes / common gotchas

- **Don't use old examples with `StreamingTextResponse`**: it was removed (AI SDK 4+). Use `streamText(...).toUIMessageStreamResponse()` (chat) or `toTextStreamResponse()` (plain text). ([ai-sdk.dev](https://ai-sdk.dev/docs/reference/stream-helpers/streaming-text-response?utm_source=openai))
- **On Vercel, make sure streaming is supported/enabled for your function setup**, and watch your function duration. Vercel's streaming docs recommend Node.js 20+ and mention configuring durations for longer streaming. ([vercel.com](https://vercel.com/docs/functions/streaming-functions))

---

If you tell me what stack you're using (**Next.js App Router vs Pages Router vs Express/Hono**) and whether you want **plain text** or **tool-calling/custom data streaming**, I can tailor the exact route + client code.
