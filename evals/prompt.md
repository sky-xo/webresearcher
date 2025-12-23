# Running the Eval

## Overview

This eval compares `webresearcher` (GPT-5.2 + web search) against Claude's built-in `WebSearch` tool using blind head-to-head judging.

## How to Run

For each query in `query-set.json`:

### Step 1: Run both tools

```bash
# Run webresearcher
webresearcher "<query>"

# Run WebSearch (use your WebSearch tool)
```

Record both responses and their latency.

### Step 2: Blind judgment

Spawn a subagent with this prompt:

```
You are judging which response better answers a question. You don't know which tool produced which response.

**Question:** <the query>

**Response A:**
<one response - randomly assigned>

**Response B:**
<other response - randomly assigned>

Which response better answers the question? Reply with:
- Your pick: A, B, or Tie
- Brief reasoning (2-3 sentences)

Judge based on: accuracy, completeness, clarity, and usefulness of citations.
```

### Step 3: Record results

For each query, record in `results.json`:
- Query ID and text
- Response A content and source tool
- Response B content and source tool
- Judgment (A/B/Tie)
- Judge's reasoning
- Latency for each tool
- Cost/tokens for webresearcher

### Step 4: Generate summary

After all queries, create `summary.md` with:
- Win/loss/tie counts
- Breakdown by query type
- Average latency comparison
- Total cost

## Output Structure

Create a timestamped run folder:

```
evals/runs/YYYY-MM-DD-gpt5.2-vs-websearch/
├── config.json      # Settings used
├── results.json     # Full structured results
├── summary.md       # Headline stats
└── detailed/        # One .md per query with full responses
```

## Tips

- Randomize which response is "A" vs "B" for each query to avoid position bias
- Run webresearcher with default `--effort medium` unless testing effort levels
- The judge subagent should have NO context about what tools are being compared
