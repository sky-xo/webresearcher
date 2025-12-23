# TODO

## Completed
- [x] `--install-skill` flag to copy skill to `~/.claude/skills/webresearcher/`
- [x] Create SKILL.md with usage guidelines
- [x] First eval run: webresearcher vs WebSearch (13-1 win)
- [x] Rethink eval scoring methodology - updated prompt.md with quality + final call approach
- [x] Add `--verbose` flag to output token usage/cost data
- [x] Run full eval with new methodology (wr-medium, wr-low, WebSearch) - v3 run complete
- [x] Update SKILL.md with eval findings (decision matrix by query type)
- [x] Add "wr" alias to SKILL.md description for easier triggering

## Next Up
- [ ] Push to GitHub as `sky-xo/webresearcher`

## Someday/Maybe
- [ ] `--verbosity` flag (low/medium/high) - currently self-calibrates well, may not be needed
- [ ] Automate eval runner (currently manual)
