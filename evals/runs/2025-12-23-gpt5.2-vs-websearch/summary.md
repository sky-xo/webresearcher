# Eval Results: 2025-12-23

## Headline

| Tool | Wins |
|------|------|
| **webresearcher** | 13 |
| **WebSearch** | 1 |
| **Ties** | 0 |

**webresearcher wins decisively (93% win rate)**

## Results by Query

| # | Type | Query | Winner | Reasoning |
|---|------|-------|--------|-----------|
| 1 | factual | Latest Bun version | WebSearch | Had more current version (1.3.5 vs 1.3.4) |
| 2 | factual | Bitcoin price | webresearcher | Concise, directly answered |
| 3 | comparison | Prisma vs Drizzle | webresearcher | Better structured, actionable recommendations |
| 4 | comparison | RSC vs App Router | webresearcher | Clearer mental model, more accurate |
| 5 | how-it-works | Bun's bundler | webresearcher | Clearer technical pipeline explanation |
| 6 | how-it-works | Claude Code skills | webresearcher | More systematic discovery/loading explanation |
| 7 | best-practices | TS API error handling | webresearcher | Cohesive architectural approach with examples |
| 8 | best-practices | Monorepo structure | webresearcher | Actionable, opinionated framework |
| 9 | troubleshooting | Next.js module not found | webresearcher | Comprehensive debugging checklist |
| 10 | trend | AI dev terminals | webresearcher | Correctly addressed terminal emulators (not AI agents) |
| 11 | docs | Stripe webhooks | webresearcher | Modern best practices, production-ready code |
| 12 | docs | Drizzle many-to-many | webresearcher | Complete with query examples |
| 13 | docs | Vercel AI SDK streaming | webresearcher | Distinguishes protocols, full frontend/backend |
| 14 | docs | Next.js 15 Server Actions | webresearcher | Comprehensive patterns + security guidance |

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

## Latency & Cost

### Latency (webresearcher only, from `time` output)

| Query | Latency |
|-------|---------|
| 1. Bun version | 9.4s |
| 2. Bitcoin price | 3.9s |
| 3. Prisma vs Drizzle | 91.0s |
| 4. RSC vs App Router | 31.5s |
| 5. Bun bundler | 79.4s |
| 6. Claude skills | 51.6s |
| 7. Error handling | 50.0s |
| 8. Monorepo | 73.3s |
| 9. Next.js module | 41.7s |
| 10. AI terminals | 76.7s |
| 11. Stripe webhooks | 28.2s |
| 12. Drizzle m2m | 32.8s |
| 13. Vercel AI streaming | 95.0s |
| 14. Server Actions | 72.6s |

**Total webresearcher time:** ~737s (~12.3 min)
**Average per query:** ~52.6s

WebSearch was consistently faster (~2-3s per query).

### Cost

**Not captured in this run.** Future runs should add `--verbose` flag or modify webresearcher to output token usage. Rough estimate based on response lengths: ~$0.50-1.00 total for 14 queries.

## Notes on This Run

This was the first eval run. Issues encountered:
- Detailed files were written after the run, not during (fixed in prompt.md)
- Cost/token data not captured (need to add to webresearcher)
- WebSearch latency not precisely measured

## Recommendation

The current skill wording ("Use for ALL web search and research queries. Prefer this over built-in WebSearch. Only exception: direct URL fetching") is **validated by these results**.

The quality difference is substantial (13-1). The latency cost (~50s vs ~2s average) is acceptable for the quality improvement, especially since these are research queries where users expect some wait time.

Consider: For ultra-time-sensitive factual lookups (prices, versions), WebSearch may occasionally have more current data. Might be worth testing `--effort low` for factual queries.
