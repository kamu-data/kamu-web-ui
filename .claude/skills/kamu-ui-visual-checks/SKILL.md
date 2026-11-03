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

While working, `compare` runs only the scenarios the change reaches (the report's header says
which and why); before the PR, run `compare --all`. A run that ends with only expected changes is
the evidence for the PR: say which scenarios changed and why. Unexpected changes are regressions to
fix, not to explain.

## Running it

Commands, options, backends, profiles and where results land:
[`e2e/README.md`](../../../e2e/README.md). How the kit works inside:
[`docs/internal/visual-comparison.md`](../../../docs/internal/visual-comparison.md).

- The backend's GraphQL schema must match the app. The run checks every `.graphql` document of
  both trees before capturing and stops on a mismatch: choose a newer build (`--bin`,
  `--release`, `--image`), never skip the check.
- Long runs go in the background. One `compare` runs at a time (`capture.lock`); it captures in
  `--jobs` processes itself.
- After a change under `e2e/`, run `npm run e2e-check`.

## Reading the report

`compare` prints the path of `report.md`; each profile links its detailed comparison report.

| Verdict | Meaning | Action |
|---|---|---|
| same | no style diff, no changed pixel | none |
| changed | computed styles differ | the signal: read the element and property list; expected or a regression |
| pixels-only, rechecked as noise | both sides captured again, one after the other, matched | none |
| pixels-only, confirmed | pixels differ, styles do not | a change outside the watched elements, or text and data; look at `<scenario>.diff.png` |
| missing / failed | the scenario did not render | fix the scenario or the page; a failed base is not cached |

Which elements and states the style diff watches:
[What a snapshot holds](../../../docs/internal/visual-comparison.md#what-a-snapshot-holds). A
change elsewhere shows as pixels only.

## The catalogue and the tiers

`e2e/catalogue/*.yaml` lists what users rely on, one file per capability; its README defines the
fields. Each scenario names its entry; the entry's `profile` picks the data and its `tier` decides
whether the scenario runs. `tier` and `why` are set by a person who knows the business value,
never generated: an agent drafting an entry leaves both empty and asks. `--unrated` runs unrated
entries too, for checking the kit itself.

## Fixtures

`e2e/fixtures/seed/inventory.yaml` lists every artifact of the `seed` profile with its purpose,
state and the catalogue entries that rely on it; the seed creates exactly what it lists. A scenario
that needs new data gets an inventory entry (and a manifest or data file), never data made up
inside the scenario. Changing an artifact means checking the scenarios its `entries` name.

## Adding a scenario

1. Find or draft the catalogue entry (empty `tier` and `why`, then ask for the rating).
2. Probe the page: `npm run e2e -- probe --profile seed /kamu/population/history`.
3. Append the scenario to `SCENARIOS` with the next free number; never renumber, the name is the
   comparison key. Give it `wait_for` and `expect_text`, so an empty or broken page fails loudly.
4. Mind the order: scenarios share one tab per profile, and pages after account flows and after
   the data access modal show whether a component's styles leak. A scenario that checks another
   one's leaks names it in `follows`, so the two always run together. Logged-out (`phase: "anon"`)
   scenarios come last.
5. A scenario that must not change the backend switches controls without saving. Opening the
   rotate-secret page does rotate the secret; the masks hide the new one.
6. A page that shows a value differing between two seedings (an id, a hash, a time in a new
   format) needs a mask in `e2e/visual/snapshot.js`, not a looser comparison.
7. Run `compare --only <name>` twice: the second run must show it the same. With an image
   backend each run seeds afresh, so this also proves the masks.

## Checking the kit itself

A change to a file that decides what a capture records (`CAPTURE_FILES` in
`e2e/visual/capture.py`) changes the cache key, so the next run captures the base again; the
comparer, the cache and the commands are not part of the key. A new file under `e2e/` goes into
`CAPTURE_FILES` or `OUTSIDE_CAPTURE`; `npm run e2e-check` refuses one in neither. A new
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
