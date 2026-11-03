# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""The coverage report: routes no catalogue entry claims, entries no scenario realises, and app
components that no scenario of the latest run showed."""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

from e2e.harness.cache import REPO

SELECTOR = re.compile(r"""selector:\s*["'`](app-[\w-]+)["'`]""")


def component_selectors() -> list[str]:
    """Component selectors declared under src/app."""
    found = set()
    for file in (REPO / "src" / "app").rglob("*.component.ts"):
        if match := SELECTOR.search(file.read_text()):
            found.add(match.group(1))
    return sorted(found)


def shown_components(run: Path) -> set[str]:
    """The components each profile's head capture showed in the run directory `run`."""
    shown: set[str] = set()
    for report in run.glob("*/head/report.json"):
        for entry in json.loads(report.read_text()):
            shown.update(entry.get("components", []))
    return shown


def coverage_report(entries: dict[str, dict], scenarios, routes: list[str], run: Path | None) -> str:
    claimed = {route for entry in entries.values() for route in entry["routes"]}
    realised = {sc.entry for sc in scenarios}
    lines = ["# Visual coverage", ""]

    unclaimed = [r for r in routes if r not in claimed]
    lines += [f"## Routes with no catalogue entry ({len(unclaimed)} of {len(routes)})", ""]
    lines += [f"- `{r}`" for r in unclaimed] or ["None."]
    lines.append("")

    unrealised = [e for e in entries.values() if e["id"] not in realised]
    lines += [f"## Catalogue entries with no scenario ({len(unrealised)} of {len(entries)})", ""]
    lines += ["| entry | capability | profile | tier |", "|---|---|---|---|"]
    lines += [f"| {e['id']} | {e['capability']} | {e['profile']} | {e.get('tier') or 'unrated'} |" for e in unrealised]
    lines.append("")

    tiers = Counter(e.get("tier") or "unrated" for e in entries.values())
    lines += ["## Entries by tier", "", *[f"- {tier}: {n}" for tier, n in tiers.items()], ""]

    components = component_selectors()
    if run:
        unseen = [c for c in components if c not in shown_components(run)]
        lines += [f"## Components no scenario showed ({len(unseen)} of {len(components)}), in {run}", ""]
        lines += [f"- `{c}`" for c in unseen] or ["None."]
    else:
        lines += ["## Components", "", "No run yet: `compare` records which components each scenario shows."]
    lines.append("")
    return "\n".join(lines)
