# Query: How do Claude Code skills get discovered and loaded?

**Tool:** webresearcher --effort low
**Latency:** 12s

## Tokens
- Input: 8412
- Output: 750

## Cost
$0.0252

## Response

Claude Code "Skills" are discovered from the filesystem (and plugins), then loaded in two stages (metadata first, full instructions on-demand).

## 1) Where Claude Code discovers Skills
Claude Code auto-discovers Skills from three sources: ([docs.claude.com](https://docs.claude.com/en/docs/claude-code/skills?utm_source=openai))

1. **Personal (user) Skills**: `~/.claude/skills/`
2. **Project Skills**: `.claude/skills/` (relative to your current project)
3. **Plugin Skills**: Skills bundled inside installed Claude Code plugins

Each Skill lives in its own folder and is defined by a **`SKILL.md`** file (e.g., `~/.claude/skills/my-skill/SKILL.md`). ([anthropic.com](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills?utm_source=openai))

## 2) What makes a folder a "Skill"
A Skill is recognized when `SKILL.md` begins with **YAML frontmatter** that includes (at least) a `name` and `description`. ([anthropic.com](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills?utm_source=openai))

If the YAML is invalid (or the frontmatter delimiters are wrong), Claude Code may skip loading it. ([anthropic.mintlify.app](https://anthropic.mintlify.app/en/docs/claude-code/skills?utm_source=openai))

## 3) How loading works (progressive disclosure)
Claude Code uses a "progressive disclosure" approach:

1. **Startup / discovery time:** it **preloads only the metadata** (`name`, `description`) for every installed Skill into the system context so the model knows what exists. ([anthropic.com](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills?utm_source=openai))
2. **When relevant:** if Claude decides a Skill applies to the current task, it then **loads the full `SKILL.md` body** (the detailed instructions) into context. ([anthropic.com](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills?utm_source=openai))

So: *metadata is always "lightly" present; full instructions are only pulled in when needed.*

## 4) How to see what was discovered
You can ask Claude Code directly (e.g., "List all available Skills"), or inspect the directories on disk. ([docs.claude.com](https://docs.claude.com/en/docs/claude-code/skills?utm_source=openai))
For debugging, Claude Code also supports a debug mode to see Skill loading errors. ([anthropic.mintlify.app](https://anthropic.mintlify.app/en/docs/claude-code/skills?utm_source=openai))

## Notes / gotchas
- There have been reported bugs where Skills weren't discovered on some platforms/versions (e.g., Windows in some releases), so if discovery seems broken, check debug output and known issues for your version. ([github.com](https://github.com/anthropics/claude-code/issues/11620?utm_source=openai))

If you tell me your OS + Claude Code version and where you placed your Skill folder, I can help you verify the exact path/structure and what logs to look for.
