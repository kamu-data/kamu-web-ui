# Business scenario catalogue

What the UI must keep doing for its users, one file per capability. The scenarios
(`e2e/scenarios.py`) realise entries; the visual comparison (`e2e/visual`) runs them. Entries name user journeys rather than pages, so
functional tests can realise the same entries.

| Field | Meaning | Set by |
|---|---|---|
| `id` | Stable key, referred to by scenarios | drafted |
| `journey` | One line in the user's words | drafted |
| `persona` | `anonymous`, `reader`, `editor`, `owner` or `admin` | drafted |
| `routes` | Route patterns as `npm run e2e -- coverage` lists them | drafted |
| `states` | What must be on screen | drafted |
| `profile` | Data it runs against: `seed`, `empty` or `with-data-mt` | drafted |
| `tier` | `smoke` (every style check), `full` (before merging style work) or `drop` | a person |
| `why` | Who relies on it, and what a break costs | a person |

An entry without a `tier` is not run (`--unrated` runs it anyway, for checking the kit itself).
