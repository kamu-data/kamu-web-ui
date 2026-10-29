---
name: kamu-ui-visual-checks
description: Visual comparison of Kamu Web UI builds — `npm run visual` captures screenshots and computed styles of business scenarios on a base commit and on the working tree against a seeded kamu backend, then compares them. Covers when to run it (style work, Material/Bootstrap/ng-select upgrades), smoke vs full tiers, the kamu build and schema check, reading the report, the business catalogue in e2e/catalogue, data profiles, adding a scenario, and the baseline cache. Use before style or dependency work that can change what users see, and before editing anything under e2e/.
---

# Visual Checks

Lint and unit tests do not see what a user sees. A style refactoring, a Material upgrade or a
moved rule can pass every check and still change a page. `npm run visual -- compare` catches
that: it builds the base commit and the working tree (production configuration), runs each
selected scenario on both in headless Chrome against the same backend data, and compares the
computed styles of the elements it watches and the screenshots.

## When to run it

| Change | Run |
|---|---|
| Any `.scss` change that is not local to one new component | `compare --tier smoke` while working, `compare` (full) before the PR |
| Material, CDK, Bootstrap, ng-select or angular2-multiselect upgrade | `compare` (full) |
| Moving, merging or deleting global styles | `compare` (full) |
| Template restructuring of a shared component | `compare --tier smoke` |
| A new page or tab | add its scenario and catalogue entry (below), then `compare --only <name>` |

A run that ends with only expected changes is the evidence for the PR: say which scenarios
changed and why. Unexpected changes are regressions to fix, not to explain.

## Prerequisites

- Google Chrome (`CHROME_BIN` to override), [uv](https://docs.astral.sh/uv/) (it installs the kit's
  Python dependencies from `e2e/pyproject.toml`), and docker or podman for the `with-data-mt` profile.
- A backend whose GraphQL schema matches the app. `--backend cli` (default) or `--backend
  api-server` picks kamu-cli or kamu-api-server; `--bin <path>`, `--release <version>` or
  `--image <tag or ref>` picks the build, otherwise the binary on the shell's PATH is used.
  kamu-api-server runs on Postgres and S3 (rustfs) in containers; its releases exist for Linux
  x86_64 only. Before capturing, the run validates every `.graphql` document of both trees against
  the schema the backend serves and stops on a mismatch; an older build makes pages hang on
  "Loading…" instead. Fix it by choosing a newer build, never by skipping the check.

## Commands

| Command | Does |
|---|---|
| `npm run visual -- compare [--tier smoke\|full] [--base <ref>] [--head <ref>] [--only <text>] [--unrated]` | the comparison; base defaults to the merge-base with master, head to the working tree |
| `npm run visual -- probe --profile <p> [--build <dir>] <path>...` | log in to a profile's backend, print each page's text and components, save screenshots: for writing a scenario |
| `npm run visual -- coverage` | routes no entry claims, entries no scenario realises, components the last run never showed |
| `npm run visual -- cache list` / `cache prune --keep <n>` | cached baselines (a full one is about 330 MB) |
| `npm run visual-test` | the comparer's unit tests (CI runs them) |

Everything lands in `~/.cache/kamu-ui-visual/` (`KAMU_VISUAL_CACHE`), never in the repository.
The base capture is cached by base commit, data, backend build, kit, Chrome major version and the
scenario selection, so a second run against the same base only captures the head.

## Reading the report

`compare` prints the path of `report.md`; each profile links its detailed comparison report.

| Verdict | Meaning | Action |
|---|---|---|
| same | no style diff, no changed pixel | none |
| changed | computed styles differ | the signal: read the element and property list; expected or a regression |
| pixels-only, rechecked as noise | the head capture alone matched the base | none |
| pixels-only, confirmed | pixels differ, styles do not | a change outside the watched elements, or text and data; look at `<scenario>.diff.png` |
| missing / failed | the scenario did not render | fix the scenario or the page; a failed base is not cached |

The style diff covers the subtrees of Material, ngb, ng-select, multiselect, table, stepper and
modal roots, every element that a class from `src/assets/styles/var.scss` of the base matches,
and forced `:hover`, `:focus` and `:active` states of the `FORCE_TARGETS` in
`e2e/visual/scenarios.py`. A change elsewhere shows as pixels only.

## The catalogue and the tiers

`e2e/catalogue/*.yaml` lists what users rely on, one file per capability; its README defines the
fields. Each scenario names its entry; the entry's `profile` picks the data and its `tier` decides
whether the scenario runs. `tier` and `why` are set by a person who knows the business value,
never generated: an agent drafting an entry leaves both empty and asks. `--unrated` runs unrated
entries too, for checking the kit itself.

## Data profiles

| Profile | Data | Notes |
|---|---|---|
| `seed` | `e2e/fixtures/seed.py` builds it through the API from `e2e/fixtures/seed/` | accounts `kamu` (admin, `kamu.dev`), `alice`, `bob`; nothing is scheduled, so it never changes |
| `empty` | accounts only | empty states |
| `with-data-mt` | kamu-cli's published image of real datasets and organizations, pinned by digest in `e2e/fixtures/profiles.py` | run with a config that adds a signing key (for `/query`) and one query partition; read-only |

Workspaces are cached by their sources and the kamu build; ids and hashes differ between two
builds of a workspace, so both sides of a comparison always use the same one.

## Adding a scenario

1. Find or draft the catalogue entry (empty `tier` and `why`, then ask for the rating).
2. Probe the page: `npm run visual -- probe --profile seed /kamu/population/history`.
3. Append the scenario to `SCENARIOS` with the next free number; never renumber, the name is the
   comparison key. Give it `wait_for` and `expect_text`, so an empty or broken page fails loudly.
4. Mind the order: scenarios share one tab per profile, and pages after account flows and after
   the data access modal show whether a component's styles leak. Logged-out (`phase: "anon"`)
   scenarios come last.
5. A scenario that must not change the backend switches controls without saving. Opening the
   rotate-secret page does rotate the secret; its scenario masks the new one.
6. Run `compare --only <name>` twice: the second run must show it the same.

## Checking the kit itself

A change under `e2e/visual` changes the cache key, so the next run captures the base again. A new
check or a change to the comparer gets tests for input it must accept as well as input it must
reject, and a run against two commits with a known difference: it must report that difference and
nothing else.

## Known limits

- Fonts come from Google Fonts at run time; every other external host is blocked, so external
  avatars render as their alt text.
- Some states are not reachable with the fixtures: GitHub login, running or retrying flows,
  webhook deliveries, scheduled triggers.
- A scenario rechecked on its own runs without the scenarios before it; one that depends on them
  shows as confirmed and needs a look.
