# Judgment: Query 11

**Query:** What's the code to verify Stripe webhook signatures in Node.js?
**Type:** docs

## Scores

| Tool | Score | Latency | Reasoning |
|------|-------|---------|-----------|
| wr-medium | 5/5 | 13s | Complete working code with clear comments, key gotchas highlighted, and proper raw body handling. Includes switch statement for event handling and cited sources. |
| wr-low | 5/5 | 10s | Clean, working code with all essentials, clear gotcha warning, and good structure. Uses modern import syntax. 3s faster than wr-medium. |
| WebSearch | 4/5 | 2.5s | Working code example but uses deprecated bodyParser package instead of express.raw(). Pattern is more complex than needed with middleware conditionals. |

## Final Call

**Winner:** wr-low
**Reasoning:** For docs queries seeking code examples, wr-low delivers a modern, clean implementation in 10s vs wr-medium's 13s. WebSearch's 2.5s response works but uses deprecated patterns (bodyParser) and more complex middleware logic. The 4x latency cost for wr-low is justified when code quality and modern patterns matter, but WebSearch is acceptable for this straightforward docs query.
