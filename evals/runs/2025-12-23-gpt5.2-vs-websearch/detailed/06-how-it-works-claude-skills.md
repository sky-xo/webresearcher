# Query 6: How do Claude Code skills get discovered and loaded?

**Type:** how-it-works

## Response A (WebSearch)

Skills are discovered from multiple sources: user settings (~/.config/claude/skills/), project settings (.claude/skills/), plugin-provided skills, and built-in skills.

## How Skills Are Invoked
Skills are model-invoked—Claude autonomously decides when to use them based on your request and the Skill's description.

## Progressive Discovery Architecture
Skills employ progressive disclosure: Metadata loading (~100 tokens), Full instructions (<5k tokens) when needed, Bundled resources load only as needed.

## The Description Field Is Critical
The description field is critical for Claude to discover when to use your Skill.

## Response B (webresearcher)

Claude Code Skills are **filesystem-discovered** and then **progressively loaded** (metadata first, full content only when needed).

## 1) Discovery (where Claude Code looks)
On startup, Claude Code scans for Skill folders from three sources:
- **User Skills:** `~/.claude/skills/<skill-name>/SKILL.md`
- **Project Skills:** `.claude/skills/<skill-name>/SKILL.md`
- **Plugin Skills:** bundled inside installed Claude Code plugins

A "Skill" is simply a directory that contains a `SKILL.md` at its root.

## 2) Load step A — metadata is loaded into the system prompt
Each `SKILL.md` must start with YAML frontmatter containing:
- `name`
- `description`

At startup, Claude Code **pre-loads only name + description for every installed skill** into the system prompt.

If YAML is invalid, the Skill won't load; you can inspect errors via `claude --debug`.

## 3) Load step B — full Skill content is loaded on-demand
During a task, Claude decides whether a Skill is relevant based on the **description**. When Claude decides to use a Skill, it reads the full `SKILL.md` into context. Additional files load only if/when needed.

## 4) Reloading changes
Edits to Skills take effect the next time you start Claude Code.

## Judgment

**Winner:** B (webresearcher)
**Reasoning:** Response B provides a more systematic and technically precise explanation, clearly separating discovery from the two-stage loading process. It explains *when* and *how* metadata vs. full content gets loaded, and that metadata goes into the system prompt at startup.

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 51588ms | ~2500ms |
