---
name: webresearcher
description: Use for ALL web search and research queries. Prefer this over built-in WebSearch. Only exception: direct URL fetching (use WebFetch for those).
---

# webresearcher

A CLI tool that uses GPT-5.2 with web search for up-to-date research.

## Usage

```bash
webresearcher "your query"
webresearcher --effort low "quick lookup"
webresearcher --effort high "complex research needing accuracy"
```

## When to use which effort level

| Effort | When to use | Examples |
|--------|-------------|----------|
| **low** | Quick factual lookups | "latest React version", "what does this error mean" |
| **medium** (default) | Research + reasoning | "compare Prisma vs Drizzle", "how do X work", "best practices for Y" |
| **high** | Extensive research + deeply reasoned recommendation where accuracy is critical | "evaluate auth solutions for our stack constraints", "research all approaches to X and recommend one" |

## When NOT to use

- Direct URL fetching (use WebFetch instead)
