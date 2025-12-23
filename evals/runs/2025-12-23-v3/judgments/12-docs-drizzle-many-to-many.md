# Judgment: Query 12

**Query:** How do I define a many-to-many relation in Drizzle ORM?
**Type:** docs

## Scores

| Tool | Score | Latency | Reasoning |
|------|-------|---------|-----------|
| wr-medium | 5/5 | 19s | Comprehensive coverage of both v1 and v2 Relations APIs with complete code examples, junction table setup, and query patterns. Well-cited with sources. |
| wr-low | 5/5 | 12s | Complete working example with all steps (tables, junction, relations, querying, inserting). Clear and practical. 7s faster than wr-medium. |
| WebSearch | 2/5 | 2.5s | Mentions junction table requirement but lacks complete code examples and query patterns. Too brief to be actionable. |

## Final Call

**Winner:** wr-low
**Reasoning:** For docs queries needing implementation guidance, wr-low delivers a complete, step-by-step example in 12s vs wr-medium's 19s. Both are excellent, but wr-low is more concise while remaining complete. WebSearch's 2.5s response lacks the code completeness needed to actually implement the pattern, making the 5x latency cost for wr-low justified for this docs query.
