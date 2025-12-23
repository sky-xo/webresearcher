# Running the Eval

## Overview

This eval compares `webresearcher` (GPT-5.2 + web search) against Claude's built-in `WebSearch` tool. The goal is to build a **decision matrix**: for each query type, which tool (and effort level) is the best fit?

## Methodology

**Not blind.** The judge sees which tool produced each response, plus latency data. This allows the judge to weigh quality against speed and determine appropriateness.

**Quality + final call.** The judge scores each response (1-5) with reasoning, then makes a final call on which tool is better for this query type.

**Cost excluded from judging.** We track cost separately, but don't show it to the judge to avoid bias. Humans make the cost trade-off decision.

## CRITICAL: Write files as you go

**DO NOT batch file writes until the end.** After EACH query:
1. Write the response files immediately
2. Write the judgment file immediately
3. This allows humans to monitor progress during long eval runs

## Directory Structure

```
evals/runs/YYYY-MM-DD-<run-name>/
├── config.json
├── responses/
│   ├── 01-factual-bun-version/
│   │   ├── wr-medium.md
│   │   ├── wr-low.md        # if running multiple effort levels
│   │   └── websearch.md
│   ├── 02-factual-bitcoin-price/
│   │   └── ...
│   └── ...
├── judgments/
│   ├── 01-factual-bun-version.md
│   ├── 02-factual-bitcoin-price.md
│   └── ...
└── summary.md
```

## Setup

Before starting, create the run directory:

```bash
mkdir -p evals/runs/YYYY-MM-DD-<run-name>/{responses,judgments}
```

Create `config.json` in the run directory:
```json
{
  "date": "YYYY-MM-DD",
  "webresearcher": {
    "model": "gpt-5.2",
    "effort_levels": ["medium", "low"]
  },
  "baseline": "claude-websearch",
  "query_set": "query-set.json"
}
```

## For EACH Query

### Step 1: Create the response folder

```bash
mkdir -p evals/runs/<run-name>/responses/NN-type-slug/
```

### Step 2: Run webresearcher (each effort level)

```bash
time webresearcher --effort medium "<query>"
time webresearcher --effort low "<query>"
```

**Immediately write each response to its own file:**

`responses/NN-type-slug/wr-medium.md`:
```markdown
# Query: <query text>

**Tool:** webresearcher --effort medium
**Latency:** XXs
**Cost:** $X.XX (estimated)

## Response

<full response text>
```

`responses/NN-type-slug/wr-low.md`:
```markdown
# Query: <query text>

**Tool:** webresearcher --effort low
**Latency:** XXs
**Cost:** $X.XX (estimated)

## Response

<full response text>
```

### Step 3: Run WebSearch via fresh subagent

**IMPORTANT:** Use a fresh subagent to run WebSearch. This ensures:
- No context pollution from previous queries
- WebSearch is actually used (not answered from memory)

Spawn a subagent with this prompt:

```
Use the WebSearch tool to answer this question. You MUST use the WebSearch tool - do not answer from memory.

Question: <the query>

After searching, provide your complete answer with any sources found.
```

**Immediately write to** `responses/NN-type-slug/websearch.md`:
```markdown
# Query: <query text>

**Tool:** WebSearch
**Latency:** ~Xs (estimated)
**Cost:** $0

## Response

<full response text>
```

### Step 4: Run the judge

Spawn a subagent with this prompt:

```
You are evaluating web search tool responses. Your goal: determine which tool is the better choice for this type of query.

## Query
<query text>

## Query Type
<type>

## Response A (webresearcher --effort medium)
<response text>

## Response B (webresearcher --effort low)
<response text>

## Response C (WebSearch)
<response text>

## Latency
- webresearcher --effort medium: XXs
- webresearcher --effort low: XXs
- WebSearch: ~Xs

## Your Task

**1. Score each response (1-5) with brief reasoning:**
Consider: Does it feel accurate and well-researched? Is the depth appropriate for this question? Could you act on it immediately?

**2. Make the final call:**
Given the quality scores and latency differences, which tool is the better choice for this type of query?

## Format

**Response A (wr-medium):** X/5
[1-2 sentence reasoning]

**Response B (wr-low):** X/5
[1-2 sentence reasoning]

**Response C (WebSearch):** X/5
[1-2 sentence reasoning]

**Winner for this query type:** [wr-medium / wr-low / WebSearch / Tie]
**Reasoning:** [Why this tool is the better fit, considering quality + speed trade-off]
```

### Step 5: IMMEDIATELY write the judgment file

**DO THIS RIGHT AFTER JUDGING, NOT AT THE END.**

Write to `judgments/NN-type-slug.md`:

```markdown
# Judgment: Query N

**Query:** <query text>
**Type:** <factual|comparison|how-it-works|best-practices|troubleshooting|trend|docs>

## Scores

| Tool | Score | Latency | Reasoning |
|------|-------|---------|-----------|
| wr-medium | X/5 | XXs | <reasoning> |
| wr-low | X/5 | XXs | <reasoning> |
| WebSearch | X/5 | ~Xs | <reasoning> |

## Final Call

**Winner:** <wr-medium / wr-low / WebSearch>
**Reasoning:** <why this tool is the better fit for this query type>
```

### Step 6: Continue to next query

Repeat steps 1-5 for all queries.

## After All Queries

### Generate summary.md

Include:
- Decision matrix: query type → recommended tool
- Results table with all scores, latencies, costs
- Win/loss/tie counts per tool
- Total cost and total time
- Key observations

### Example Decision Matrix

| Query Type | Recommended Tool | Why |
|------------|------------------|-----|
| factual | WebSearch or wr-low | Speed matters, depth doesn't |
| comparison | wr-medium | Needs synthesis |
| docs | wr-medium | Needs code examples |
| troubleshooting | wr-medium | Needs context |

## Capturing Cost Data

To get cost from webresearcher, the tool needs to output usage stats. Currently it doesn't - this is a future enhancement. For now, estimate:
- Input: ~$1.75/1M tokens
- Output (including reasoning): ~$14/1M tokens

## Common Mistakes to Avoid

1. **Forgetting to write files** - Write responses AND judgments after EACH query
2. **Not capturing latency** - Always note latency for all tools
3. **Batching everything** - Humans want to see progress as it happens
4. **Showing cost to judge** - Track cost separately, don't bias the judge
5. **Incomplete summary** - Must include decision matrix and totals
