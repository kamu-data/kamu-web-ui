# CLAUDE.md

Read [`AGENTS.md`](AGENTS.md) — it is the canonical source for every rule: git safety, the Node
version, validation, tests, style, and which skill or document to load for a task. This file only
adds what is specific to Claude Code.

## Environment

The session-start hook puts the Node version [`.nvmrc`](.nvmrc) pins first on `PATH` for the
main session's Bash commands, through Claude Code's `CLAUDE_ENV_FILE`. If `node --version` still
disagrees with `.nvmrc` (nvm missing, or that version not installed), fall back to
[the prefix in AGENTS.md](AGENTS.md#node-version) and tell the user which version is missing.

Sub-agents are not covered by that file: every Node command they run carries the prefix, and the
command guard refuses one that does not. When briefing a general-purpose sub-agent that will run
`npm`/`ng`, include the prefix in its instructions; `ng-builder` and `ng-tester` already have it.

A local backend for manual checks is optional; the unit tests mock GraphQL entirely. How to run
one: [`DEVELOPER.md`](DEVELOPER.md#running-with-local-gql-server).

## Hooks

[`.claude/settings.json`](.claude/settings.json) wires the hooks in `scripts/agents/`:

- a command guard (destructive git forms denied; commit/push/merge/rebase/tag, releases and
  dependency changes ask; build/test output piped into `head`/`tail` denied);
- an edit guard (generated files denied; guarded paths refused until their skill is loaded);
- a post-edit pass on `.ts`, `.html`, `.scss` and `.js` files, whether an edit or a shell command
  wrote them (prettier on that file, then checks on the added text);
- a session-start contract and a stop-time reminder when TypeScript changed since the last green
  `npm run lint`.

A refusal names the rule and the fix. Load skills with the `Skill` tool; a subagent loads its own.
How the harness is built and tested: [`docs/internal/agent-harness.md`](docs/internal/agent-harness.md).

## Memory

Memory is for external context only (see [AGENTS.md](AGENTS.md#memory)). Before saving a memory,
check whether it is really a rule about this codebase — if so, propose an `AGENTS.md` or skill
change instead.
