"""The harness contract injected at session start, generated from the policy table."""

from __future__ import annotations

from scripts.agents.common import policy


def contract(load_with: str = "the Skill tool", command_approval: str = "ask every time") -> str:
    guarded = "\n".join(
        f"  - {', '.join(r['paths'])} → `{r['skill']}`" + (" (in addition to any match above)" if r.get("baseline") else "")
        for r in policy()["skills"]
    )
    generated = "\n".join(f"  - {', '.join(r['paths'])} → `{r['command']}`" for r in policy()["generated"])
    return f"""Harness contract for this session (hooks in scripts/agents/, rules in AGENTS.md):
- Edits under a guarded path are refused until this session (or this subagent) has loaded its skill with {load_with}:
{guarded}
- Generated files are refused outright; regenerate them instead:
{generated}
- Commands: destructive git forms (reset --hard, checkout --/., restore, stash, clean -f) are denied; commit/push/merge/rebase/tag, `npm version`/`npm run release-*`, and `npm install <pkg>`/`uninstall`/`update` {command_approval}; build/test/lint output piped into head/tail is denied.
- Node tools run on the version `.nvmrc` pins. Sub-agents and Codex start every line that runs npm/npx/ng/node with `. "$NVM_DIR/nvm.sh" && nvm use >/dev/null &&`; without it, the command guard denies them whenever the default Node differs.
- After an edit to .ts/.html/.scss/.js, including one made by a shell command, the hook runs prettier on that file and checks the added lines; a failure means the edit landed and must be fixed forward.
- Before handing back: `npm run lint` and `npm run stylelint` after source changes, `npm run build-prod` after routing or dependency changes, `npm run lint-harness` after changes to hooks, skills, AGENTS.md/CLAUDE.md or docs/internal.
- A refusal is the rule speaking: fix the command or load the skill — never route around it through another tool."""
