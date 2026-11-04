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
    """Raises unless every scenario names an existing entry, every name is unique, a scenario follows an
    earlier one of the same profile, and each expects a text or an input value, so that an empty or
    broken page fails."""
    problems: list[str] = []
    names: set[str] = set()
    profile_of: dict[str, str] = {}
    for sc in scenarios:
        if sc.name in names:
            problems.append(f"{sc.name}: duplicate name")
        names.add(sc.name)
        if not sc.expect_text and not sc.expect_value:
            problems.append(f"{sc.name}: no expect_text or expect_value")
        if sc.entry not in entries:
            problems.append(f"{sc.name}: no catalogue entry {sc.entry}")
            continue
        profile_of[sc.name] = entries[sc.entry].get("profile")
        if sc.follows and profile_of.get(sc.follows) != profile_of[sc.name]:
            problems.append(f"{sc.name}: follows {sc.follows}, which is not an earlier scenario of its profile")
    if problems:
        raise CatalogueError("scenarios", problems)


def select_scenarios(scenarios, entries: dict[str, dict], tier: str = "full", unrated: bool = False, only=None):
    """The scenarios a run covers, grouped by profile in their list order. `tier` is `smoke` or `full`
    (which includes smoke); `unrated` also runs entries nobody has rated yet; `only`, a comma-separated
    list, keeps the scenarios whose name contains one of its parts. `drop` entries never run, except as
    the scenario a selected one `follows`: a leak check needs the page whose styles it checks."""
    tiers = ["smoke"] if tier == "smoke" else ["smoke", "full"]
    parts = only.split(",") if only else []
    by_name = {sc.name: sc for sc in scenarios}
    chosen: set[str] = set()
    for sc in scenarios:
        entry = entries[sc.entry]
        runs = entry.get("tier") in tiers or (unrated and not entry.get("tier"))
        if runs and (not parts or any(part in sc.name for part in parts)):
            while sc and sc.name not in chosen:
                chosen.add(sc.name)
                sc = by_name.get(sc.follows) if sc.follows else None
    by_profile: dict[str, list] = {}
    for sc in scenarios:
        if sc.name in chosen:
            by_profile.setdefault(entries[sc.entry]["profile"], []).append(sc)
    return by_profile
