# Judgment: Query 13

**Query:** How do I stream responses with the Vercel AI SDK?
**Type:** docs

## Scores

| Tool | Score | Latency | Reasoning |
|------|-------|---------|-----------|
| wr-medium | 5/5 | 57s | Extremely comprehensive with complete server and client code, installation steps, common gotchas, and deprecation warnings. Full working example with useChat and streamText. |
| wr-low | 5/5 | 15s | Complete working example with server route, client component, and key gotchas. Covers toDataStreamResponse and custom streaming. 42s faster than wr-medium. |
| WebSearch | 3/5 | 3.0s | Basic code snippet and concepts but lacks complete client-side implementation and integration details. Missing useChat example. |

## Final Call

**Winner:** wr-low
**Reasoning:** wr-low delivers a complete, production-ready example in 15s vs wr-medium's 57s. Both are excellent, but wr-low hits the sweet spot of completeness and speed. WebSearch's 3s response has the right code snippet but lacks the client-side integration needed to actually implement streaming, making the 5x latency cost for wr-low justified for this docs query.
