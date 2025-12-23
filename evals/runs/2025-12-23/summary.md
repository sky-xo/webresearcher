# Eval Results: 2025-12-23

## Decision Matrix

| Query Type | Recommended Tool | Why |
|------------|------------------|-----|
| factual | WebSearch | 5-6x faster (2s vs 11-12s) with correct answers. Use wr-medium/wr-low when precision matters (e.g., exact timestamps, detailed context). |
| comparison | wr-low | Delivers comprehensive decision frameworks and nuanced analysis that WebSearch can't match. 6-7x latency cost justified for complex decisions. |
| how-it-works | wr-low | Technical depth critical for understanding; wr-low hits sweet spot of comprehensive explanation at 2x faster than wr-medium. |
| best-practices | wr-low | Requires actionable guidance with examples; wr-low delivers production-ready patterns 7-9x slower than WebSearch but worth it. |
| troubleshooting | wr-medium | Comprehensive diagnostics needed for reliable problem-solving; wr-medium slightly faster than wr-low with same quality. |
| trend | wr-low | Accuracy and context matter for current tool preferences; WebSearch can contain fundamental errors on trend queries. |
| docs | wr-low | Modern, complete code examples justify 4-5x latency cost; WebSearch acceptable for simple lookups but may use deprecated patterns. |

## Results by Query

| # | Type | Query | Winner | wr-med Score | wr-low Score | WS Score | wr-med Latency | wr-low Latency | wr-med Cost | wr-low Cost |
|---|------|-------|--------|--------------|--------------|----------|----------------|----------------|-------------|-------------|
| 1 | factual | What is the latest stable version of Bun? | WebSearch | 5/5 | 5/5 | 4/5 | 11s | 12s | $0.0452 | $0.0435 |
| 2 | factual | What is the current price of Bitcoin? | Tie (wr-med/wr-low) | 5/5 | 5/5 | 4/5 | 2s | 2s | $0.0095 | $0.0093 |
| 3 | comparison | Compare Prisma vs Drizzle ORM | wr-medium/wr-low | 5/5 | 5/5 | 3/5 | 20s | 21s | $0.0241 | $0.0332 |
| 4 | comparison | React Server Components vs Next.js App Router | wr-low | 5/5 | 5/5 | 2/5 | 22s | 17s | $0.0236 | $0.0187 |
| 5 | how-it-works | How does Bun's bundler work? | wr-low | 5/5 | 5/5 | 2/5 | 41s | 19s | $0.0717 | $0.0309 |
| 6 | how-it-works | How do Claude Code skills get discovered? | wr-low | 5/5 | 5/5 | 3/5 | 24s | 12s | $0.0500 | $0.0252 |
| 7 | best-practices | Error handling in TypeScript APIs | wr-low | 5/5 | 5/5 | 2/5 | 27s | 21s | $0.0292 | $0.0260 |
| 8 | best-practices | How to structure a monorepo in 2025? | wr-low | 5/5 | 5/5 | 2/5 | 28s | 27s | $0.0270 | $0.0371 |
| 9 | troubleshooting | Next.js 'Module not found' error | wr-medium | 5/5 | 5/5 | 3/5 | 18s | 20s | $0.0208 | $0.0199 |
| 10 | trend | What terminals are AI developers using? | wr-low | 5/5 | 5/5 | 2/5 | 50s | 42s | $0.0769 | $0.0574 |
| 11 | docs | Verify Stripe webhook signatures | wr-low | 5/5 | 5/5 | 4/5 | 13s | 10s | $0.0257 | $0.0217 |
| 12 | docs | Drizzle many-to-many relations | wr-low | 5/5 | 5/5 | 2/5 | 19s | 12s | $0.0309 | $0.0184 |
| 13 | docs | Stream with Vercel AI SDK | wr-low | 5/5 | 5/5 | 3/5 | 57s | 15s | $0.1150 | $0.0273 |
| 14 | docs | Next.js 15 Server Actions with forms | wr-low | 5/5 | 5/5 | 3/5 | 66s | 25s | $0.0976 | $0.0340 |

## Win Counts

| Tool | Wins |
|------|------|
| wr-low | 10 |
| wr-medium | 2 |
| WebSearch | 1 |
| Tie | 1 |

## Totals

| Metric | wr-medium | wr-low |
|--------|-----------|--------|
| Total Cost | $0.5476 | $0.4027 |
| Total Time | 404s | 242s |
| Avg Latency | 28.9s | 17.3s |

## Observations

### Key Findings

1. **wr-low emerges as the clear winner**: Wins 10/14 queries, delivering the same quality as wr-medium but 1.7x faster on average (17.3s vs 28.9s) and 27% cheaper ($0.40 vs $0.55).

2. **WebSearch has a narrow but important niche**: Excellent for simple factual lookups where speed matters (2-3s response time). However, it struggles with depth - scored 2-3/5 on most complex queries and even contained fundamental errors (e.g., confusing terminal emulators with AI agents in query #10).

3. **Quality is consistently high across webresearcher tools**: Both wr-medium and wr-low scored 5/5 on all 14 queries. The difference is purely performance - wr-low delivers the same comprehensive, well-cited answers faster and cheaper.

4. **Query complexity determines tool choice**:
   - **Simple factual** (version numbers, prices): WebSearch wins on speed
   - **Everything else**: wr-low is optimal - comparison, how-it-works, best-practices, troubleshooting, trend, and docs queries all benefit from its depth

5. **Cost is reasonable**: Even the most expensive wr-medium query (#13: Vercel AI streaming) cost only $0.115. Average cost per query: wr-medium $0.039, wr-low $0.029.

### Performance Patterns

- **wr-low is most efficient on docs queries**: Queries #11-14 show wr-low delivering complete, modern code examples 2-4x faster than wr-medium
- **Both tools struggled with latency on complex queries**: Query #13 (57s wr-medium, 15s wr-low) and #14 (66s wr-medium, 25s wr-low) suggest room for optimization on documentation-heavy queries
- **WebSearch's speed advantage disappears when quality matters**: 2-3s responses are attractive, but the shallow depth means users would likely need follow-up queries

## Recommendation - when to use webresearcher

Use webresearcher for:
- Technical comparisons requiring decision frameworks
- "How it works" explanations needing implementation details
- Best practices requiring code examples and architecture guidance
- Troubleshooting requiring comprehensive diagnostics
- Current trends and tool preferences
- Documentation queries needing complete, modern code examples

**Default effort level: `--effort low`**
- Delivers comprehensive, well-cited answers
- Faster and cheaper than medium effort
- Consistently high quality (5/5 across all query types)

**Use `--effort medium` only when:**
- You need the absolute most thorough response possible
- The query is mission-critical
- You have 1.7x latency budget available

## When to use WebSearch instead

Use WebSearch for simple factual lookups:
- Version numbers, release dates
- Current prices, scores, rankings
- Single data points requiring no context

WebSearch delivers 5-6x faster responses (2-3s) but lacks depth for complex queries.
```
