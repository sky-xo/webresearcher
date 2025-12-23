# Eval: webresearcher vs WebSearch

## Purpose

Blind head-to-head evaluation comparing webresearcher (GPT-5.2 + web search) against Claude's built-in WebSearch tool to validate the "use webresearcher for everything" approach.

## Methodology

### Blind Judging

1. Main agent runs both tools on the same query
2. Responses are shuffled and anonymized as "Response A" and "Response B"
3. A fresh subagent judges which response is better - it only sees:
   - The original query
   - Response A (full text)
   - Response B (full text)
   - Instruction: "Which response better answers the query? A, B, or tie? Explain briefly."
4. Subagent has no knowledge of what tools are being compared
5. Main agent records the judgment, reveals which tool was which, tallies results

### Metrics Captured

| Metric | Source | Notes |
|--------|--------|-------|
| **Winner** | Blind subagent | A, B, or tie |
| **Reasoning** | Blind subagent | Why it picked the winner |
| **Latency** | Wall clock | Milliseconds per query |
| **Cost** | API usage object | webresearcher only (WebSearch is bundled) |
| **Tokens** | API usage object | Input, output, reasoning breakdown |

### Query Set (v1)

12 queries across different types:

```json
[
  {"id": 1, "type": "factual", "query": "What is the latest stable version of Bun?"},
  {"id": 2, "type": "factual", "query": "What is the current price of Bitcoin?"},
  {"id": 3, "type": "comparison", "query": "Compare Prisma vs Drizzle ORM for a new TypeScript project"},
  {"id": 4, "type": "comparison", "query": "React Server Components vs Next.js App Router - what's the difference?"},
  {"id": 5, "type": "how-it-works", "query": "How does Bun's bundler work?"},
  {"id": 6, "type": "how-it-works", "query": "How do Claude Code skills get discovered and loaded?"},
  {"id": 7, "type": "best-practices", "query": "Best practices for error handling in TypeScript APIs"},
  {"id": 8, "type": "best-practices", "query": "How should I structure a monorepo in 2025?"},
  {"id": 9, "type": "troubleshooting", "query": "Why might a Next.js build fail with 'Module not found' for a package that exists?"},
  {"id": 10, "type": "trend", "query": "What terminals are AI developers preferring currently?"},
  {"id": 11, "type": "docs", "query": "How do I handle webhooks with the latest Stripe Node.js SDK?"},
  {"id": 12, "type": "docs", "query": "What is the current recommended way to do database migrations in Drizzle ORM?"}
]
```

## File Structure

```
evals/
├── README.md                           # How to run evals, interpret results
├── query-set.json                      # The queries to run
└── runs/
    └── YYYY-MM-DD-<model>-vs-websearch/
        ├── config.json                 # What was compared, settings used
        ├── summary.md                  # Win/loss tally, headline stats
        ├── results.json                # Full structured results
        └── detailed/
            ├── 01-factual-bun-version.md
            ├── 02-factual-bitcoin-price.md
            └── ...
```

### config.json

```json
{
  "date": "2025-12-23",
  "webresearcher": {
    "model": "gpt-5.2",
    "effort": "medium"
  },
  "baseline": "claude-websearch",
  "query_set": "query-set.json",
  "judge_model": "claude-subagent"
}
```

### summary.md

```markdown
# Eval Results: 2025-12-23

## Headline
- **webresearcher**: 7 wins
- **WebSearch**: 2 wins
- **Ties**: 1

## By Query Type
| Type | webresearcher | WebSearch | Tie |
|------|---------------|-----------|-----|
| factual | 1 | 1 | 0 |
| comparison | 2 | 0 | 0 |
| ... | ... | ... | ... |

## Cost & Latency
- Total webresearcher cost: $0.XX
- Avg webresearcher latency: XXXms
- Avg WebSearch latency: XXXms
```

### detailed/NN-type-slug.md

```markdown
# Query 1: What is the latest stable version of Bun?

**Type:** factual

## Response A
[Full response text]

## Response B
[Full response text]

## Judgment
**Winner:** A
**Reasoning:** Response A provided the exact version number with release date and a direct link to release notes. Response B gave the version but lacked the release date.

## Reveal
- Response A: webresearcher (gpt-5.2, medium)
- Response B: WebSearch

## Metrics
| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 2340ms | 1205ms |
| Cost | $0.003 | $0 |
| Input tokens | 45 | - |
| Output tokens | 312 | - |
| Reasoning tokens | 89 | - |
```

## Implementation Approach

### Option 1: Script-based (Recommended)

Create `evals/run-eval.ts`:
- Loads query-set.json
- For each query:
  - Runs webresearcher via Bash
  - Runs WebSearch via WebSearch tool
  - Shuffles responses
  - Spawns judge subagent
  - Records results
- Generates summary and detailed files

### Option 2: Manual orchestration

Main agent runs the eval conversationally, one query at a time.

**Recommendation:** Start with Option 2 (manual) for v1 to validate the methodology, then automate with Option 1 if we want to re-run frequently.

## Running the Eval

### v1 (Manual)

```
User: Run the eval
Claude:
1. Loads query-set.json
2. For each query, runs both tools
3. Spawns blind judge subagent
4. Records results to evals/runs/YYYY-MM-DD-.../
5. Generates summary
```

### Future (Automated)

```bash
bun evals/run-eval.ts
```

## Next Steps

After running the eval, review results and decide how to adjust the skill based on findings.
