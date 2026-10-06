# Agent Harness

How the machinery that guides coding agents (Claude Code, Codex) in this repository is built:
which file does what, what the hooks enforce, where they cannot see, and how to change them. The
rules themselves live in [`AGENTS.md`](../../AGENTS.md); this document is about the machinery.

The layout mirrors kamu-cli's harness, so the two repositories can be maintained side by side.

## Layout

| What | Where |
|---|---|
| Canonical agent rules, skill and document routing | [`AGENTS.md`](../../AGENTS.md) |
| Claude Code specifics | [`CLAUDE.md`](../../CLAUDE.md) |
| Task procedures (skills) | `.claude/skills/<name>/SKILL.md` |
| The same skills for Codex | `.agents/skills/<name>` — relative symlinks into `.claude/skills/` |
| Sub-agent prompts (Claude) | `.claude/agents/` |
| Which paths need which skill; which files are generated | [`.claude/hooks/governed_paths.json`](../../.claude/hooks/governed_paths.json) |
| Hook wiring | [`.claude/settings.json`](../../.claude/settings.json), [`.codex/hooks.json`](../../.codex/hooks.json) |
| Hook code and its tests | `scripts/agents/` (Python standard library only), `scripts/agents/tests/` |
| What differs from kamu-cli's hook code | `scripts/agents/project.py` |
| Runtime state | `.claude/state/`; Codex uses a per-checkout directory under the operating system temporary directory, because `.codex/` is protected configuration |

Shared modules (`common`, `command_policy`, `edit_policy`, `skill_ledger`, `bash_edits`,
`post_edit`, `session_contract`, the `claude_*` and `codex_*` adapters) track their kamu-cli
counterparts. Everything specific to this repository — file types, added-text rules, npm
commands, the lint gate, Node selection — is data in `project.py`, so a diff of the two
`scripts/agents/` trees shows only real divergence. `lint_ledger` plays the role of kamu-cli's
`clippy_ledger`.

## Requirements

Python 3 on a POSIX host. Formatting runs the repository's own `node_modules/.bin/prettier`
(after `npm ci`) on the Node version `.nvmrc` pins, resolved through nvm (`$NVM_DIR`, default
`~/.nvm`); without nvm, or without that version installed, the Node on `PATH` is used.

## What the hooks do

| Hook | Behaviour |
|---|---|
| Command guard | For sub-agents and Codex, when the machine's default Node differs from `.nvmrc`, denies Node tools (`npm`, `npx`, `ng`, `node`, linters) on a line that does not first select the pinned version with `nvm use`. Denies commands that discard uncommitted work (`git reset --hard`, `git checkout -- <path>`, `git restore`, `git stash`, `git clean -f`) and build/test/lint output piped into `head`/`tail`. Claude asks for approval on `git commit`/`push`/`merge`/`rebase`/`tag`, `npm version`/`npm run release-*`/`npm publish`, and `npm install <package>`/`uninstall`/`update`; Codex follows `AGENTS.md` for those semantic approvals. |
| Edit guard | Refuses hand edits to generated files (naming the regeneration command) and edits under a guarded path until the session has loaded the governing skill. Claude asks before writes to agent memory; Codex follows `AGENTS.md` for that semantic approval. |
| Post-edit | Runs prettier on an edited `.ts`/`.html`/`.scss`/`.js` file — the set `npm run prettier` covers — then checks only the added lines: focused or disabled specs, `console.log`, `eslint-disable`, `standalone: true`, constructor injection, plan/ticket citations and change narration in comments, the license header on new `src/app` files. Reminds about `npm run gql-codegen` after `.graphql` changes, `npm run build-prod` after route loading changes, and `npm install` after `package.json` changes. |
| Post-shell | The same pass over every file a shell command changed (`sed -i`, heredocs, scripts), judged against its committed version. Changed files are found by fingerprinting the working tree before and after the command; files brought in by git commands that rewrite the tree (`switch`, `pull`, `stash`, `rebase`, …) are left alone. A guarded path changed without its skill gets a reminder. |
| Session and subagent start | Injects a short contract generated from `governed_paths.json`; after compaction or `/clear`, skills must be loaded again. For Claude, the session-start hook also writes the `.nvmrc` Node's `bin` directory to `CLAUDE_ENV_FILE`, so later Bash commands find it first on `PATH`. |
| Stop | If the session edited a lint input and the tree changed since the last green foreground `npm run lint`, reminds the agent once to run it. |

A skill counts as loaded when the session ran the `Skill` tool on it, `Read` its `SKILL.md`, or
read it through the shell (`cat`, `sed -n`, …). Writing a `SKILL.md` through a shell redirect
does not count. Loads are recorded per session and per sub-agent: a sub-agent loads its own.

## Limitations

The rules in `AGENTS.md` still apply where the hooks cannot see:

- Files written through the shell are only checked after the command, and the edit guard cannot
  refuse them: a guarded path written that way gets a reminder instead of a refusal, and a
  hand-edited generated file is not told apart from a regenerated one. A command run in the
  background is compared when it is handed off, not when it finishes.
- `git checkout <path>` without `--` is indistinguishable from a branch switch and passes the
  guard.
- Commands assembled at runtime (variables, generated scripts) are not inspected; dependency
  edits made directly in `package.json` are left to `AGENTS.md`.
- Prettier skips gitignored files, so a file under a gitignored directory is checked but not
  formatted.
- Codex PreToolUse hooks cannot ask for semantic user authorization. Dependency changes, commits,
  releases and memory writes therefore remain governed by `AGENTS.md`.
- Claude's documentation does not say whether a sub-agent's shell sources the session's
  `CLAUDE_ENV_FILE`, so the main session relies on it and sub-agents are held to selecting the
  Node version per command line instead. A Node tool started indirectly (a script, a `Makefile`
  target) is not seen by the guard.

## Changing the harness

| Change | Steps |
|---|---|
| Add a skill | Create `.claude/skills/<name>/SKILL.md` with `name` and `description` front matter; `ln -s ../../.claude/skills/<name> .agents/skills/<name>`; add a row to the skills table in `AGENTS.md`. |
| Guard a path with a skill | Add the glob to the skill's rule in `governed_paths.json` **and** to the "Guarded paths" column in `AGENTS.md`, in the same order (the first matching rule wins). A rule with `"baseline": true` applies in addition to the first match — `kamu-ui-angular-style` on every `src/app` source file is one. |
| Add a design doc | Put it in `docs/internal/` and add a row to the documents table in `AGENTS.md`. |
| Change a hook rule | Repository-specific rules live in `scripts/agents/project.py`; behaviour shared with kamu-cli lives in the other modules — port a fix there to kamu-cli as well. Add a case to the matching test. |

Then run `npm run lint-harness`. It runs the hook tests — including the Claude and Codex
handlers invoked exactly as configured, with JSON on stdin — and the harness lints: skills
declared, routed and symlinked; guarded paths in sync with `AGENTS.md`; documentation links and
heading anchors resolve; every design doc routed. The handler tests exercise policy and payload
handling without a model request; they do not verify Codex trust decisions or runtime event
dispatch. CI runs the same target on every pull request, including documentation-only ones.
