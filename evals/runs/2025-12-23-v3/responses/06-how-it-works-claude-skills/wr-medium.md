# Query: How do Claude Code skills get discovered and loaded?

**Tool:** webresearcher --effort medium
**Latency:** 24s

## Tokens
- Input: 16844
- Output: 1464

## Cost
$0.0500

## Response

In **Claude Code**, "Agent Skills" are **model-invoked**: Claude decides when to use them based on their metadata (especially the `description`). ([docs.claude.com](https://docs.claude.com/en/docs/claude-code/skills))

## 1) Discovery (building the Skill catalog)
Claude Code automatically discovers Skills from three places: ([docs.claude.com](https://docs.claude.com/en/docs/claude-code/skills))

1. **Personal Skills**: `~/.claude/skills/`
2. **Project Skills**: `.claude/skills/` (in the current project)
3. **Plugin Skills**: Skills bundled inside installed plugins

A Skill is a **directory** containing a required `SKILL.md` file (with YAML frontmatter like `name` and `description`). ([docs.claude.com](https://docs.claude.com/en/docs/claude-code/skills))

For **plugin skills**, Claude Code discovers them by scanning the plugin's `skills/` directory and looking for subdirectories that contain `SKILL.md`. ([claude-plugins.dev](https://claude-plugins.dev/skills/%40anthropics/claude-code/skill-development))

## 2) Loading (progressive disclosure)
Claude Code uses a progressive disclosure approach:

- **Always loaded (lightweight):** Skill **metadata** (primarily **name + description**) is loaded so Claude can decide what's relevant. ([claude-plugins.dev](https://claude-plugins.dev/skills/%40anthropics/claude-code/skill-development))
- **Loaded when the Skill triggers:** the **body of `SKILL.md`** (the actual instructions) is loaded only when Claude decides to use that Skill. ([claude-plugins.dev](https://claude-plugins.dev/skills/%40anthropics/claude-code/skill-development))
- **Loaded only if needed:** additional files (e.g., `references/`, `examples/`, scripts/templates) are only read when needed. ([claude-plugins.dev](https://claude-plugins.dev/skills/%40anthropics/claude-code/skill-development))

## 3) How a Skill "triggers"
Claude matches your request against each Skill's **`description`** (so the description should include both *what it does* and *when to use it*). If it matches, Claude activates the Skill automatically—you don't have to explicitly invoke it. ([docs.claude.com](https://docs.claude.com/en/docs/claude-code/skills))

## 4) Tool permissions while a Skill is active (Claude Code–specific)
A Skill can include an `allowed-tools` frontmatter field to restrict which tools Claude can use while that Skill is active (e.g., only `Read, Grep, Glob`). ([docs.claude.com](https://docs.claude.com/en/docs/claude-code/skills))

## 5) Practical notes
- If you edit a Skill, changes take effect **the next time you start Claude Code** (restart to reload). ([docs.claude.com](https://docs.claude.com/en/docs/claude-code/skills))
- If a Skill isn't being picked up, `claude --debug` will show Skill loading errors. ([docs.claude.com](https://docs.claude.com/en/docs/claude-code/skills))

If you tell me whether you mean **personal/project Skills on disk** or **plugin Skills**, I can walk through the exact directory structure and a quick checklist for why a specific Skill isn't being discovered/triggered.
