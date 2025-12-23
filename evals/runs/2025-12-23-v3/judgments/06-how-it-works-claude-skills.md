# Judgment: Query 6

**Query:** How do Claude Code skills get discovered and loaded?
**Type:** how-it-works

## Scores

| Tool | Score | Latency | Reasoning |
|------|-------|---------|-----------|
| wr-medium | 5/5 | 24s | Clear breakdown of discovery sources, progressive loading stages, triggering mechanism, and practical debugging tips. Well-cited and comprehensive. |
| wr-low | 5/5 | 12s | Equally thorough with same key points (3 sources, progressive disclosure, debugging). Includes helpful gotchas about platform bugs. More concise delivery. |
| WebSearch | 3/5 | 2.5s | Covers the basics (sources, progressive loading, description importance) but lacks depth on how triggering works and practical debugging guidance. |

## Final Call

**Winner:** wr-low
**Reasoning:** wr-low delivers the same comprehensive technical explanation as wr-medium but in half the time (12s vs 24s). For "how-it-works" queries, this level of detail is valuable for implementation, and wr-low hits the sweet spot of depth and speed. WebSearch's 2.5s response is too superficial for someone actually building or debugging Skills, making the 5x latency cost worthwhile.
