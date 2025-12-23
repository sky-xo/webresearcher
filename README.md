# webresearcher

A CLI tool that uses GPT-5.2 with web search for up-to-date research queries.

## Why?

Claude code's built-in web search is great for quick fact-lookups, but bad at detailed research.

Evaluated against Claude's built-in WebSearch tool across 14 query types. webresearcher won 13/14 on quality while remaining cost-effective (~$0.03/query).

## Installation

Set your OpenAI API key in your path:

```bash
export OPENAI_API_KEY="your-key-here"
```

Requires [Bun](https://bun.sh) runtime.

```bash
# Clone the repo
git clone https://github.com/sky-xo/webresearcher.git
cd webresearcher

# Install dependencies
bun install

# Link globally
bun link
```

## Usage

```bash
# Basic query (uses --effort low by default)
webresearcher "how do I stream responses with Vercel AI SDK?"

# Complex troubleshooting (use medium effort)
webresearcher --effort medium "why might Next.js build fail with module not found for an installed package?"

# See token usage and cost
webresearcher --verbose "current Bitcoin price"
```

## Effort Levels

| Effort | Avg Latency | Avg Cost | Best For |
|--------|-------------|----------|----------|
| **low** (default) | ~17s | ~$0.03 | Most queries |
| **medium** | ~29s | ~$0.04 | Complex troubleshooting |
| **high** | ~60s+ | ~$0.08+ | Critical decisions |

## Claude Code Integration

This tool was built to be used as a Claude Code skill. Install the skill:

```bash
webresearcher --install-skill
```

This copies the skill definition to `~/.claude/skills/webresearcher/SKILL.md`. Claude will then know when to use webresearcher vs the built-in WebSearch tool.

**Quick trigger:** Tell Claude to "use wr" and it will use this tool.

## When to Use What

| Query Type | Recommended Tool |
|------------|------------------|
| Simple factual ("latest version of X") | WebSearch |
| Comparisons | webresearcher |
| How-it-works explanations | webresearcher |
| Best practices | webresearcher |
| Troubleshooting | webresearcher --effort medium |
| Documentation/code examples | webresearcher |

## Flags

| Flag | Description |
|------|-------------|
| `--effort low\|medium\|high` | Reasoning effort (default: low) |
| `--verbose` | Show token usage and cost |
| `--install-skill` | Install Claude Code skill |

## License

MIT
