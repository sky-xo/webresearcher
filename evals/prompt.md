# Running the Eval

## Overview

This eval compares `webresearcher` (GPT-5.2 + web search) against Claude's built-in `WebSearch` tool using blind head-to-head judging.

## CRITICAL: Write files as you go

**DO NOT batch file writes until the end.** After EACH query:
1. Write the detailed result file immediately
2. This allows humans to monitor progress during long eval runs

## Setup

Before starting, create the run directory:

```bash
mkdir -p evals/runs/YYYY-MM-DD-<model>-vs-websearch/detailed
```

Create `config.json` in the run directory:
```json
{
  "date": "YYYY-MM-DD",
  "webresearcher": {
    "model": "gpt-5.2",
    "effort": "medium"
  },
  "baseline": "claude-websearch",
  "query_set": "query-set.json"
}
```

## For EACH Query

### Step 1: Run webresearcher

```bash
time webresearcher "<query>"
```

**Capture:**
- Full response text
- Latency (from `time` output)
- Note: Future runs should capture token/cost data from API response

### Step 2: Run WebSearch

Use the WebSearch tool with the same query.

**Capture:**
- Full response text
- Approximate latency (note start/end)

### Step 3: Randomize and blind judge

1. Flip a coin (or use random): assign responses to A and B
2. Spawn a subagent with this exact prompt:

```
You are judging which response better answers a question. You don't know which tool produced which response.

**Question:** <the query>

**Response A:**
<one response>

**Response B:**
<other response>

Which response better answers the question? Reply with:
- Your pick: A, B, or Tie
- Brief reasoning (2-3 sentences)

Judge based on: accuracy, completeness, clarity, and usefulness.
```

### Step 4: IMMEDIATELY write the detailed file

**DO THIS RIGHT AFTER EACH QUERY, NOT AT THE END.**

Write to `evals/runs/<run-name>/detailed/NN-type-slug.md`:

```markdown
# Query N: <query text>

**Type:** <factual|comparison|how-it-works|best-practices|troubleshooting|trend|docs>

## Response A (<tool-name>)

<full response text>

## Response B (<tool-name>)

<full response text>

## Judgment

**Winner:** <A or B or Tie> (<tool-name>)
**Reasoning:** <judge's reasoning>

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | XXXXms | ~XXXXms |
| Cost | $X.XXX | $0 |
| Input tokens | XXX | - |
| Output tokens | XXX | - |
| Reasoning tokens | XXX | - |
```

### Step 5: Continue to next query

Repeat steps 1-4 for all queries.

## After All Queries

### Generate summary.md

Include:
- Headline win/loss/tie counts
- Results table by query
- Results by query type
- **Total cost** (sum of all webresearcher costs)
- **Total time** (sum of all latencies)
- Average latency comparison
- Observations and recommendations

### Commit results

```bash
git add evals/runs/<run-name>/
git commit -m "feat: eval run <date> - <headline result>"
```

## Capturing Cost Data

To get cost from webresearcher, the tool needs to output usage stats. Currently it doesn't - this is a future enhancement. For now, estimate:
- Input: ~$1.75/1M tokens
- Output (including reasoning): ~$14/1M tokens

## Effort Level Variations

To test different effort levels:
1. Run the eval once with `--effort medium` (default)
2. For factual queries only, re-run with `--effort low`
3. Compare results and add notes to summary

## Common Mistakes to Avoid

1. **Forgetting to write detailed files** - Write after EACH query, not at the end
2. **Not capturing metrics** - Always note latency at minimum
3. **Batching everything** - Humans want to see progress as it happens
4. **Missing cost data** - At least estimate if exact data unavailable
5. **Incomplete summary** - Must include totals for cost and time
