# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""The business catalogue (e2e/catalogue/*.yaml): loading, validation, and choosing which scenarios a
run covers."""

from __future__ import annotations

from pathlib import Path

import yaml

PERSONAS = ["anonymous", "reader", "editor", "owner", "admin"]
TIERS = ["smoke", "full", "drop"]
REQUIRED = ["id", "journey", "persona", "routes", "states", "profile"]


class CatalogueError(Exception):
    def __init__(self, what: str, problems: list[str]):
        super().__init__(f"{what}:\n  " + "\n  ".join(problems))
        self.problems = problems


def load_catalogue(directory: Path, profiles, routes: list[str]) -> dict[str, dict]:
    """Every capability file under `directory`, each entry checked against the known `profiles` and the
    app's `routes`. Raises with every problem found; returns entries by id."""
    entries: dict[str, dict] = {}
    problems: list[str] = []
    known_routes = set(routes)
    for file in sorted(directory.glob("*.yaml")):
        doc = yaml.safe_load(file.read_text())
        if not isinstance(doc, dict) or not doc.get("capability") or not isinstance(doc.get("entries"), list):
            problems.append(f"{file.name}: needs `capability` and `entries`")
            continue
        for entry in doc["entries"]:
            where = f"{file.name}: {entry.get('id', '(no id)')}"
            problems += [f"{where}: no {field}" for field in REQUIRED if entry.get(field) is None]
            if entry.get("id") in entries:
                problems.append(f"{where}: duplicate id")
            if entry.get("persona") not in PERSONAS:
                problems.append(f"{where}: persona must be one of {', '.join(PERSONAS)}")
            if entry.get("profile") not in profiles:
                problems.append(f"{where}: unknown profile {entry.get('profile')}")
            if entry.get("tier") is not None and entry["tier"] not in TIERS:
                problems.append(f"{where}: tier must be one of {', '.join(TIERS)}, or empty until rated")
            problems += [
                f"{where}: no route {r} in the app" for r in entry.get("routes") or [] if r not in known_routes
            ]
            entries[entry.get("id")] = {**entry, "capability": doc["capability"], "file": file.name}
    if problems:
        raise CatalogueError("catalogue", problems)
    return entries


def check_scenarios(scenarios, entries: dict[str, dict]) -> None:
    """Raises unless every scenario names an existing entry and every name is unique."""
    problems: list[str] = []
    names: set[str] = set()
    for sc in scenarios:
        if sc.name in names:
            problems.append(f"{sc.name}: duplicate name")
        names.add(sc.name)
        if sc.entry not in entries:
            problems.append(f"{sc.name}: no catalogue entry {sc.entry}")
    if problems:
        raise CatalogueError("scenarios", problems)


def select_scenarios(scenarios, entries: dict[str, dict], tier: str = "full", unrated: bool = False, only=None):
    """The scenarios a run covers, grouped by profile in their list order. `tier` is `smoke` or `full`
    (which includes smoke); `unrated` also runs entries nobody has rated yet; `only` keeps the scenarios
    whose name contains it. `drop` entries never run."""
    tiers = ["smoke"] if tier == "smoke" else ["smoke", "full"]
    by_profile: dict[str, list] = {}
    for sc in scenarios:
        entry = entries[sc.entry]
        runs = entry.get("tier") in tiers or (unrated and not entry.get("tier"))
        if runs and (not only or only in sc.name):
            by_profile.setdefault(entry["profile"], []).append(sc)
    return by_profile
