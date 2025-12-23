# Judgment: Query 5

**Query:** How does Bun's bundler work?
**Type:** how-it-works

## Scores

| Tool | Score | Latency | Reasoning |
|------|-------|---------|-----------|
| wr-medium | 5/5 | 41s | Comprehensive step-by-step explanation covering entrypoints, resolution, transpilation, bundling features, loaders, and executable compilation. Well-structured with cited sources. |
| wr-low | 5/5 | 19s | Equally thorough with clear pipeline explanation, plugin architecture details, and target differences. Slightly better organization than wr-medium with same depth. |
| WebSearch | 2/5 | 2.5s | Superficial overview focused on marketing points (performance comparisons) rather than technical mechanics. Doesn't explain HOW it works, just that it's fast. |

## Final Call

**Winner:** wr-low
**Reasoning:** For "how-it-works" technical queries, deep understanding is critical. wr-low delivers the same comprehensive explanation as wr-medium but in 19s vs 41s (2x faster), making it the clear winner. WebSearch's 2.5s response lacks the technical depth needed to truly understand the bundler's mechanics, making the 8x latency cost justified for this query type.
