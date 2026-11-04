# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""Which scenarios a change can alter: the files changed between base and head, through the components
they reach, matched against the components each scenario showed when it was last captured. The
records update with every capture, so the selection follows the app without upkeep."""

from __future__ import annotations

import json
from pathlib import Path

from e2e.harness.cache import HELPERS, git, node_json


def changed_files(base_sha: str, head_ref: str | None) -> list[str]:
    """Files that differ between the base commit and head: a commit, or the working tree with its
    uncommitted and untracked files."""
    if head_ref:
        return git("diff", "--name-only", base_sha, head_ref).split()
    tracked = git("diff", "--name-only", base_sha).split()
    return tracked + git("ls-files", "--others", "--exclude-standard").split()


class Records:
    """The components each scenario showed at its latest capture of either side, by
    `<side>:<profile>/<scenario>`, in one file of the cache."""

    def __init__(self, file: Path):
        self.file = file
        try:
            self.shown: dict[str, list[str]] = json.loads(file.read_text())
        except (FileNotFoundError, ValueError):
            self.shown = {}

    def update(self, side: str, profile: str, report: list[dict]) -> None:
        for entry in report:
            if entry.get("ok") and "components" in entry:
                self.shown[f"{side}:{profile}/{entry['name']}"] = entry["components"]
        self.file.write_text(json.dumps(self.shown, indent=1, sort_keys=True))

    def of(self, profile: str, name: str) -> set[str] | None:
        """Both sides' components, or None when the scenario was never captured."""
        found = [self.shown[k] for k in (f"base:{profile}/{name}", f"head:{profile}/{name}") if k in self.shown]
        return set().union(*found) if found else None


def chains(scenarios) -> list[set[str]]:
    """Scenarios that run together: one that `follows` another checks whether that one leaks styles."""
    groups: dict[str, set[str]] = {sc.name: {sc.name} for sc in scenarios}
    for sc in scenarios:
        if sc.follows and sc.follows in groups:
            merged = groups[sc.name] | groups[sc.follows]
            for name in merged:
                groups[name] = merged
    return list({id(g): g for g in groups.values()}.values())


def affected(selection: dict[str, list], changed: list[str], head_src: Path, records: Records, kit: tuple[str, ...]):
    """The part of `selection` the change can alter, and a sentence saying why. A changed file under one
    of the `kit` prefixes (the run's own code and data) selects everything."""
    if not changed:
        return {}, "base and head do not differ"
    kit_changes = [f for f in changed if f.startswith(kit)]
    if kit_changes:
        return selection, f"the capture code or fixtures changed ({kit_changes[0]})"
    impact = node_json(HELPERS / "impact.mjs", str(head_src), *changed)
    if impact["all"]:
        return selection, impact["all"]
    selectors = set(impact["selectors"])
    picked: dict[str, list] = {}
    shown_anywhere: set[str] = set()
    for profile, scenarios in selection.items():
        names = set()
        for sc in scenarios:
            components = records.of(profile, sc.name)
            shown_anywhere |= components or set()
            if components is None or components & selectors:
                names.add(sc.name)
        for group in chains(scenarios):
            if group & names:
                names |= group
        if names:
            picked[profile] = [sc for sc in scenarios if sc.name in names]
    reason = f"the change reaches {', '.join(sorted(selectors)) or 'no component'}"
    if unseen := sorted(selectors - shown_anywhere):
        reason += f"; no captured page shows {', '.join(unseen)}"
    return picked, reason
