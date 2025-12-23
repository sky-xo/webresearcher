---
name: webresearcher
description: Also called "wr". Use for most web search and research queries. Prefer over WebSearch for anything needing depth, code examples, or synthesis. Use WebSearch only for quick factual lookups.
---

# webresearcher

Also known as **wr**. If user says "use wr", they mean this tool.

A CLI tool that uses GPT-5.2 with web search for up-to-date research.

## Usage

```bash
webresearcher "your query"                    # defaults to --effort low
webresearcher --effort medium "complex troubleshooting"
webresearcher --verbose "query"               # shows token usage and cost
```

## When to use which tool

| Query Type | Use | Why |
|------------|-----|-----|
| **Simple factual** | WebSearch | Fast (~3s), good enough for "what version is X" |
| **Comparison** | webresearcher --effort low | Needs synthesis and decision frameworks |
| **How-it-works** | webresearcher --effort low | Technical accuracy matters |
| **Best practices** | webresearcher --effort low | Actionable guidance with examples |
| **Troubleshooting** | webresearcher --effort medium | Worth extra reasoning time |
| **Trends** | webresearcher --effort low | Current info + analysis |
| **Docs/code** | webresearcher --effort low | Code examples and completeness matter |

## Effort levels

| Effort | Avg Latency | Avg Cost | When to use |
|--------|-------------|----------|-------------|
| **low** (default) | ~17s | ~$0.03 | Most queries |
| **medium** | ~29s | ~$0.04 | Complex troubleshooting, debugging |
| **high** | ~60s+ | ~$0.08+ | Critical decisions needing deep research |

## Writing good queries

This tool uses GPT-5.2 (an LLM), not a search engine. Write **natural language questions**, not keyword queries.

```bash
# Bad - keyword stuffed
webresearcher "Claude Code CLI --resume flag session continuation 2024 2025"

# Good - natural language
webresearcher "Does Claude Code's --resume flag let you continue sessions after exiting? How does it work?"
```

The LLM reasons better with conversational questions that explain what you're actually trying to understand.

## When NOT to use

- **Quick factual lookups** ("latest version of X", "current price of Y") - use WebSearch instead
- **Direct URL fetching** - use WebFetch instead
