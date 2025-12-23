# Eval Results: 2025-12-23

## Headline

| Tool | Wins |
|------|------|
| **webresearcher** | 13 |
| **WebSearch** | 1 |
| **Ties** | 0 |

**webresearcher wins decisively (93% win rate)**

## Results by Query

| # | Type | Query | Winner | WR Time | WS Time | WR Cost |
|---|------|-------|--------|---------|---------|---------|
| 1 | factual | Latest Bun version | WebSearch | 9.4s | ~2s | ~$0.02 |
| 2 | factual | Bitcoin price | webresearcher | 3.9s | ~2s | ~$0.01 |
| 3 | comparison | Prisma vs Drizzle | webresearcher | 91.0s | ~3s | ~$0.08 |
| 4 | comparison | RSC vs App Router | webresearcher | 31.5s | ~3s | ~$0.04 |
| 5 | how-it-works | Bun's bundler | webresearcher | 79.4s | ~3s | ~$0.07 |
| 6 | how-it-works | Claude Code skills | webresearcher | 51.6s | ~3s | ~$0.05 |
| 7 | best-practices | TS API error handling | webresearcher | 50.0s | ~3s | ~$0.05 |
| 8 | best-practices | Monorepo structure | webresearcher | 73.3s | ~3s | ~$0.06 |
| 9 | troubleshooting | Next.js module not found | webresearcher | 41.7s | ~3s | ~$0.04 |
| 10 | trend | AI dev terminals | webresearcher | 76.7s | ~3s | ~$0.06 |
| 11 | docs | Stripe webhooks | webresearcher | 28.2s | ~3s | ~$0.03 |
| 12 | docs | Drizzle many-to-many | webresearcher | 32.8s | ~3s | ~$0.03 |
| 13 | docs | Vercel AI SDK streaming | webresearcher | 95.0s | ~3s | ~$0.08 |
| 14 | docs | Next.js 15 Server Actions | webresearcher | 72.6s | ~3s | ~$0.06 |
| | | **TOTALS** | **13-1** | **737s** | **~40s** | **~$0.68** |

## By Query Type

| Type | webresearcher | WebSearch | Tie |
|------|---------------|-----------|-----|
| factual (2) | 1 | 1 | 0 |
| comparison (2) | 2 | 0 | 0 |
| how-it-works (2) | 2 | 0 | 0 |
| best-practices (2) | 2 | 0 | 0 |
| troubleshooting (1) | 1 | 0 | 0 |
| trend (1) | 1 | 0 | 0 |
| docs (4) | 4 | 0 | 0 |

## Observations

### webresearcher strengths:
- **Structured, actionable responses** - Consistently provided decision frameworks, not just information
- **Complete code examples** - Included working code with context, not snippets
- **Depth without bloat** - Comprehensive but focused on what matters
- **Follow-up offers** - Often asked clarifying questions to tailor advice

### WebSearch strengths:
- **Speed** - Generally faster responses
- **Recency for simple facts** - Won on Bun version (more current data)

### Key insight:
WebSearch only won on a simple factual lookup where recency mattered most. For any query requiring synthesis, explanation, comparison, or code examples, webresearcher significantly outperformed.

## Summary Stats

- **Total webresearcher time:** 737s (~12.3 min), avg 52.6s/query
- **Total WebSearch time:** ~40s, avg ~3s/query
- **Estimated total cost:** ~$0.68 (costs are estimates based on response lengths)

## Notes on This Run

This was the first eval run. Issues encountered:
- Detailed files were written after the run, not during (fixed in prompt.md)
- Cost/token data not captured (need to add to webresearcher)
- WebSearch latency not precisely measured

## Recommendation

The current skill wording ("Use for ALL web search and research queries. Prefer this over built-in WebSearch. Only exception: direct URL fetching") is **validated by these results**.

The quality difference is substantial (13-1). The latency cost (~50s vs ~2s average) is acceptable for the quality improvement, especially since these are research queries where users expect some wait time.

Consider: For ultra-time-sensitive factual lookups (prices, versions), WebSearch may occasionally have more current data. Might be worth testing `--effort low` for factual queries.
