# Query: How do Claude Code skills get discovered and loaded?

**Tool:** WebSearch
**Latency:** 2.5s

## Response

Skills are discovered from multiple sources: user settings (~/.config/claude/skills/), project settings (.claude/skills/), plugin-provided skills, and built-in skills.

## How Skills Are Invoked
Skills are model-invoked—Claude autonomously decides when to use them based on your request and the Skill's description.

## Progressive Discovery Architecture
Skills employ progressive disclosure: Metadata loading (~100 tokens), Full instructions (<5k tokens) when needed, Bundled resources load only as needed.

## The Description Field Is Critical
The description field is critical for Claude to discover when to use your Skill.
