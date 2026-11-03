# End-to-end kit

Tools that run the built app in a real browser against a real kamu backend. Today that is the
**visual comparison**: it builds two versions of the UI, opens the same business scenarios in both
against the same data, and reports what changed on screen — computed styles first, pixels to
confirm. Use it for style work and for Material, Bootstrap or ng-select upgrades, where lint and
unit tests see nothing.

How it works inside: [`docs/internal/visual-comparison.md`](../docs/internal/visual-comparison.md).
When to run it and how to act on a report: the
[`kamu-ui-visual-checks`](../.claude/skills/kamu-ui-visual-checks/SKILL.md) skill.

## Quick start

```sh
npm ci                                   # once; the kit builds the app with the repository's tooling
npm run visual -- compare --tier smoke   # merge-base with master against the working tree
```

Each line the run prints starts with the time since it started. A capture logs every scenario with
its position and, once a previous run has timed the scenarios, an estimate of what is left:

```text
5:55 [seed] head: capturing 86 scenarios, ~19 min
6:16 [seed] head 1/86 ok   01-dataset-create-fresh 731, ~18 min left
```

The run ends with the path of `report.md`. Nothing is written to the repository; everything goes
to `~/.cache/kamu-ui-visual/` (`KAMU_VISUAL_CACHE` to move it).

## Prerequisites

| What | Why |
|---|---|
| Google Chrome (`CHROME_BIN` to override) | runs the scenarios headless |
| [uv](https://docs.astral.sh/uv/) | installs and runs the kit's Python dependencies (`e2e/pyproject.toml`) |
| A kamu backend whose GraphQL schema matches the app | see [Backends](#backends) |
| docker or podman | kamu-api-server, any `--image`, and the `with-data-mt` profile |

## Commands

| Command | Does |
|---|---|
| `npm run visual -- compare` | builds base and head, captures both, compares; see the options below |
| `npm run visual -- probe [--profile <p>] [--build <dir>] <path>...` | logs in to a profile's backend and prints each page's text and components, with screenshots: for writing a scenario |
| `npm run visual -- coverage` | routes no catalogue entry claims, entries no scenario realises, components the last run never showed |
| `npm run visual -- check` | the catalogue, scenarios and seed inventory agree with each other and with the app's routes |
| `npm run visual -- cache list` / `cache prune --keep <n>` | the cached baselines (a full one is about 330 MB) |
| `npm run e2e-check` | the kit's unit tests and `check`; CI runs it |

`compare` options:

| Option | Default |
|---|---|
| `--base <ref>` | the merge-base of `HEAD` with `master` |
| `--head <ref>` | the working tree, uncommitted changes included |
| `--tier smoke\|full` | `full` (which includes `smoke`) |
| `--unrated` | also run catalogue entries nobody has rated yet |
| `--only <text>[,<text>…]` | only scenarios whose name contains one of the parts |
| `--all` | every scenario of the tier, not only those the change reaches (below) |
| backend options | see below; `probe` takes them too |

By default `compare` runs only the scenarios the change between base and head can alter: the
changed files lead, through the app's imports, to components, and a scenario runs when its last
capture showed one of them. Global styles, the build setup, styles that leave their component and
the kit itself select every scenario; so does a scenario never captured before. The report's header
says what was selected and why. `--all` runs everything, as before a PR.

## Backends

| Option | Picks |
|---|---|
| `--backend cli` (default) | kamu-cli: `kamu system api-server` over a workspace |
| `--backend api-server` | kamu-api-server, on Postgres and S3 (rustfs) in containers, migrated first |
| `--bin <path>` | a local build |
| `--release <version>` | a GitHub release, downloaded into the cache. kamu-api-server is released for Linux x86_64 only; elsewhere use `--bin` or `--image` |
| `--image <tag or ref>` | a published image: a tag of `ghcr.io/kamu-data/kamu-base` (cli) or `ghcr.io/kamu-data/kamu-api-server`, or a full reference |
| none of the three | the kind's binary on the shell's PATH (`kamu` or `kamu-api-server`) |
| `--migrations <dir>` | kamu-api-server only: Postgres migrations from a directory (a kamu-cli checkout's `migrations/postgres`) instead of the published ones, for a build that has no release |

The run prints which binary or image it used and its version. Before capturing, it checks every
`.graphql` document of both trees against the schema the backend serves and stops on a mismatch;
choose a newer build then.

Images run privileged, so the kamu inside can start engine containers with its own podman, as
deployments run them.

## Data profiles

Each catalogue entry names the data it runs against.

| Profile | Data |
|---|---|
| `seed` | the fixtures in [`fixtures/seed/`](fixtures/seed/), created through the API; [`inventory.yaml`](fixtures/seed/inventory.yaml) lists every account, dataset and flow run and why it exists |
| `empty` | the accounts only |
| `with-data-mt` | real datasets and organizations, from the published with-data image of the chosen backend kind; the build options do not apply to it |

Accounts: `kamu` (admin, password `kamu.dev`), `alice`, `bob`.

## What a run leaves behind

| Where (under the cache) | What |
|---|---|
| `runs/<time>/report.md` | the summary; each profile links its detailed report with style diffs and `*.diff.png` |
| `runs/<time>/run.log`, `backend-<profile>/` | the run's log and each backend's logs and generated config |
| `baselines/` | base captures, reused while base commit, data, backend build, kit, Chrome version and selection stay the same |
| `src/`, `builds/` | sources of base commits (extracted with `git archive`) and their production builds |
| `workspaces/` | seeded workspaces of a local kamu-cli build |
| `backends/` | downloaded releases |
| `timings.json` | how long each scenario took, for the estimates |
| `components.json` | the components each scenario showed at its last capture, for the selection |

## Layout

| Path | What |
|---|---|
| [`catalogue/`](catalogue/) | the business catalogue: what users rely on, one file per capability ([fields](catalogue/README.md)) |
| [`fixtures/`](fixtures/) | data profiles, the seed and its inventory |
| [`visual/`](visual/) | the kit: CLI, browser session, capture, comparison, backends |
| `visual/page-lib.js` | runs in the page: snapshots, masking of volatile values |
| `visual/helpers/` | Node helpers: the app's route table, the utility classes of `var.scss` |
| `visual/tests/` | unit tests (`npm run e2e-check`) |
| `pyproject.toml`, `uv.lock` | the kit's pinned Python dependencies |
