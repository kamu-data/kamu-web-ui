# AGENTS.md

Project guidance for coding agents working in this repository. This file is canonical: every
rule about how this codebase is written, built, tested and documented lives here or in a skill
it routes to. Claude-specific notes are in [`CLAUDE.md`](CLAUDE.md); the human guide is
[`DEVELOPER.md`](DEVELOPER.md).

Kamu Web UI is the Angular front end of the Kamu platform. It talks to the GraphQL API served by
the sibling backend project, kamu-cli, whose harness this one mirrors.

## Hard rules

These hold without exception unless the user lifts one for a named case. Hooks in
`scripts/agents/` check common violations when enabled and trusted; agents must follow the rules
on every tool path. A blocked command or refused edit is the rule speaking — fix the command or
load the skill, never route around it through another tool. Hook setup and limitations are in
[`docs/internal/agent-harness.md`](docs/internal/agent-harness.md).

- **Never commit without explicit approval.** Do not run `git commit`, `git push`, `git merge`,
  `git rebase`, `npm version` / `npm run release-*` (which commit and tag), or any other
  history-altering command unless the user asks for it in that specific instance. Approval to
  commit once is not standing approval; commit steps in a plan are checkpoints, not permission.
  Leave finished work in the working tree, report, and stop.
- **Never discard uncommitted work.** `git checkout <path>`, `git restore <path>`,
  `git reset --hard`, `git stash` and `git clean` destroy working-tree changes irreversibly. Do not
  run them on a file with uncommitted changes unless the user explicitly asked to throw those
  changes away — and say which changes will be lost before you do. The guard cannot tell a branch
  from a path, so `git checkout <path>` may pass it and is still forbidden.
  - A bad edit is fixed forward (`Edit`, or rewrite with `Write`), never by resetting the file: a
    reset also reverts every unrelated edit already made to it.
  - To compare against the committed version, read it without touching the working tree:
    `git show HEAD:<path> > <scratch>/orig`.
  - In scripted multi-edit passes, anchor on exact strings and assert every anchor matches before
    writing. Line numbers go stale as soon as an earlier edit lands — re-read the file to
    recompute them.
- **Dependency changes need approval.** `npm install <package>`, `npm uninstall`, `npm update`
  and hand edits to versions in `package.json` change what ships; do them only when the user asks
  for that change. `npm ci` and a bare `npm install` of the existing lock file are fine.
- **Generated files are never edited by hand.** See [Documentation classes](#documentation-classes)
  for each file and the command that regenerates it.
- **Two instructions that cannot both be followed are a bug in one of them.** Name both and ask;
  do not silently pick one. When you break a rule, say which one, what it says, and what it cost.

## Node version

Every Node tool (`npm`, `ng`, `eslint`, `prettier`, `karma`) runs on the version
[`.nvmrc`](.nvmrc) pins, selected through nvm. The machine's default Node may be older and fail
in confusing ways (stylelint, for one, refuses to start below Node 20).

- **Claude's main session** gets the pinned Node on `PATH` from the session-start hook.
- **Sub-agents and Codex** select it on every command line that runs a Node tool:
  `. "$NVM_DIR/nvm.sh" && nvm use >/dev/null && npm run lint` (`nvm` is a shell function, so a
  non-interactive shell has to source it first). When the machine's default Node differs from
  `.nvmrc`, the command guard denies Node tools on a line that does not do this.
- Anywhere else, if `node --version` does not match `.nvmrc`, use the same prefix.

The hooks resolve the pinned version for their own formatting runs.

## Validation

| You touched | Run before handing back |
|---|---|
| Any `.ts`, `.html`, `.scss` under `src/` | Formatting is automatic (a hook runs prettier on each edited file); then `npm run lint`, `npm run stylelint`, and the specs of what changed (`npm test -- --include <path>`) |
| Routes, lazy `import()` targets, `angular.json`, dependencies | Also `npm run build-prod`, and read its chunk tables (`kamu-ui-routing`) |
| `.graphql` documents | `npm run gql-codegen`; keep the regenerated `src/app/api/kamu.graphql.interface.ts` |
| The backend schema moved | `npm run gql-update-schema`, then `npm run gql-codegen`; review both diffs |
| `package.json` | `npm install`, then `npm run lint`, `npm test`, `npm run build-prod` |
| `scripts/agents/`, `.claude/`, `.codex/`, skills, `AGENTS.md`, `CLAUDE.md`, `docs/internal/` | `npm run lint-harness` |

- CI (`.github/workflows/build.yaml`) runs `prettier-check`, `lint`, `stylelint`, `test`,
  `build` and `build-prod`; the full set before a PR is the same list.
- Treat lint errors as errors to fix. Do not silence them with `eslint-disable` or
  `stylelint-disable` comments: a pragma hides the problem instead of resolving it. If a rule
  seems genuinely wrong for a case, ask before suppressing it.
- Keep build, test and lint output available in full. Do not pipe it into `head` or `tail`;
  save long output to a file and read the relevant sections after checking the exit status, or
  delegate the run to a [sub-agent](#sub-agents).

### Changelog review context

Features may add one consolidated, user-facing `CHANGELOG.md` entry during development.

- Do not request or review a changelog entry during an ordinary feature review. Check it only
  when the user asks for PR finalization, release preparation, or changelog work.

### Schema review context

`resources/schema.graphql` and `src/app/api/kamu.graphql.interface.ts` are generated and change
in bulk. Review the `.graphql` documents and the code using the generated types; do not review
the generated files line by line or flag their size.

## Branches

Name a branch `<type>/<issue>-<slug>`: `type` is `feature`, `fix` or `chore`, `issue` is the
GitHub issue number the work closes, and `slug` is a few kebab-case words
(`feature/874-storage-quota-panel`). This matches kamu-cli. Leave out the number only when no
issue exists. When a request has no issue yet, file one first.

## Code style and tests

Angular and TypeScript style lives in the `kamu-ui-angular-style` skill and test conventions in
`kamu-ui-unit-tests`; the edit hook requires them before the first edit they govern (see the
table below).

## What to load for which task

### Skills

Skills live in [`.claude/skills/`](.claude/skills); `.agents/skills/` holds relative symlinks to
the same directories for Codex. Load a skill (Claude: the `Skill` tool; Codex: read its
`SKILL.md`) before the first edit its task needs. Edits under a *guarded path* are refused until
the session has loaded the skill — the column below mirrors
[`.claude/hooks/governed_paths.json`](.claude/hooks/governed_paths.json) and a harness lint keeps
the two equal. Rows are matched top to bottom and the first match wins; a *baseline* row applies
in addition to that match (an api class needs both `kamu-ui-graphql-api` and
`kamu-ui-angular-style`).

| Task | Skill | Guarded paths |
|---|---|---|
| Specs, CDK component harnesses, mocks and fixtures, Apollo testing, running a narrowed test set | `kamu-ui-unit-tests` | `src/**/*.spec.ts`, `src/**/*.harness.ts`, `src/**/*mock*.ts`, `src/app/common/modules/*-test.module.ts` |
| GraphQL documents and fragments, codegen, `*.api.ts` classes, fetch policies, Apollo cache, schema refresh | `kamu-ui-graphql-api` | `src/app/api/**/*.graphql`, `src/app/api/*.api.ts` |
| Routes and the lazy bundle split, guards and resolvers wiring, `ProjectLinks`, `RoutingResolvers` | `kamu-ui-routing` | `src/app/**/*routing*.ts`, `src/app/project-links.ts`, `src/app/common/resolvers/routing-resolvers.ts` |
| Changelog, release, npm dependency updates | `kamu-ui-release-dependency-workflows` | `CHANGELOG.md`, `package.json`, `update-dependecies.md` |
| Comments and any prose in docs, skills or sub-agent prompts | `kamu-ui-prose-and-comments` | `AGENTS.md`, `CLAUDE.md`, `DEVELOPER.md`, `docs/**/*.md`, `.claude/skills/**`, `.claude/agents/**` |
| Adding a new routed page, tab or settings section end to end | `kamu-ui-adding-a-page` | |
| Writing any component, service, template or style: DI, change detection, subscriptions, base classes, naming, constants (baseline) | `kamu-ui-angular-style` | `src/app/**/*.ts`, `src/app/**/*.html`, `src/app/**/*.scss` |

### Documents

Read the relevant document before changing that area, and amend it in the same change when the
change invalidates what it says.

| Task | Document |
|---|---|
| Local setup, running against a local GraphQL server, authentication variables | [`DEVELOPER.md`](DEVELOPER.md#running-with-local-gql-server) |
| GraphQL schema refresh and code generation | [`DEVELOPER.md`](DEVELOPER.md#graphql-schema-and-code-generation) |
| Cutting a release | [`DEVELOPER.md`](DEVELOPER.md#release-procedure) |
| Packages that must be upgraded together | [`update-dependecies.md`](update-dependecies.md) |
| How the agent harness works: hooks, skills, harness lints, adding a skill or guarded path | [`docs/internal/agent-harness.md`](docs/internal/agent-harness.md) |

## Documentation classes

| Class | Contract |
|---|---|
| `AGENTS.md` | Canonical agent rules. Always loaded. One owner per rule: other files link here instead of restating. |
| `CLAUDE.md` | Claude Code specifics only. |
| `.claude/skills/` | Canonical task procedures. Each skill's `name` equals its directory and has a row in the table above. |
| `.agents/skills/` | Relative symlinks to `.claude/skills/` only — never real files. |
| `.claude/agents/` | Sub-agent role prompts; they restate rules from this file and defer to it. |
| `docs/internal/` | Living design docs. Changing behaviour a document describes means amending it in the same change. |
| `DEVELOPER.md` | The human developer guide and owner of human procedures. Skills link to its sections rather than copying them. |
| `CHANGELOG.md` | User-visible changes under `Unreleased`; see [Changelog review context](#changelog-review-context). |
| `resources/schema.graphql` | Generated — `npm run gql-update-schema`. |
| `src/app/api/kamu.graphql.interface.ts` | Generated — `npm run gql-codegen`. |
| `src/app/editor/generated/` | Generated (gitignored) — `node scripts/set-monaco-version.js`, run as `prebuild`. |
| `package-lock.json` | Generated — `npm install`. |
| `.spec/` | Gitignored local working material (plans, audits); nothing else tracked links to or cites it. |

## Memory

Agent memory (e.g. Claude's per-project memory directory) is for external context only: facts
about environments, people, and systems outside this repository. A rule about how this codebase is
written, tested, documented or verified belongs in this file or a skill, committed to git — a rule
in private memory is invisible to other agents and to the team. Writes to the memory directory
prompt for approval.

## Sub-agents

Reusable role prompts for build and test delegation live in
[`.claude/agents/ng-builder.md`](.claude/agents/ng-builder.md) (lint, stylelint, dev and
production builds, chunk tables) and [`.claude/agents/ng-tester.md`](.claude/agents/ng-tester.md)
(Karma runs and failure triage); treat them as canonical instead of duplicating them.

## Scope

- Keep this file repo-specific. Task procedures go into skills; human procedures into
  `DEVELOPER.md`.
- Do not move agent guidance into `DEVELOPER.md`; it is written for humans and mentions the
  harness only briefly. How the harness itself is built and changed lives in
  [`docs/internal/agent-harness.md`](docs/internal/agent-harness.md).
