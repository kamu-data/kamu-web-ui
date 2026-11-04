# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""The `seed` profile's inventory (seed/inventory.yaml): loading, and its consistency with the files
under seed/, the catalogue and the scenarios."""

from __future__ import annotations

import re
from pathlib import Path

import yaml

SEED = Path(__file__).parent / "seed"
INVENTORY = SEED / "inventory.yaml"
KINDS = ["snapshot", "collection", "versioned-file"]
FLOWS = ["ingest", "transform"]
OUTCOMES = {"success": "FlowSuccessResult", "failed": "FlowFailedError"}
PLACEHOLDER = re.compile(r"\$\{(\w+)\}")


class InventoryError(Exception):
    def __init__(self, problems: list[str]):
        super().__init__("inventory:\n  " + "\n  ".join(problems))
        self.problems = problems


def load_inventory(path: Path = INVENTORY) -> dict:
    return yaml.safe_load(path.read_text())


def dataset_kind(dataset: dict) -> str:
    return dataset.get("kind", "snapshot")


def snapshot_text(dataset: dict, seed: Path = SEED) -> str:
    """The DatasetSnapshot YAML of a `snapshot` dataset: its manifest, or its template filled in."""
    if "manifest" in dataset:
        return (seed / dataset["manifest"]).read_text()
    values = {"NAME": dataset["name"], "DESCRIPTION": dataset["description"]}
    return PLACEHOLDER.sub(lambda m: values[m.group(1)], (seed / dataset["template"]).read_text())


def listed_files(inventory: dict) -> set[str]:
    files = {inventory["config"]}
    for dataset in inventory["datasets"]:
        files.update(f for f in (dataset.get("manifest"), dataset.get("template")) if f)
        files.update(dataset.get("data", []))
    return files


def check_inventory(inventory: dict, entry_ids, seed: Path = SEED) -> list[str]:
    """Problems with the inventory itself: names, references between its artifacts, catalogue entry ids,
    and the files under `seed` it does or does not list."""
    problems: list[str] = []
    accounts = [a["name"] for a in inventory["accounts"]]
    datasets = [d["name"] for d in inventory["datasets"]]
    for name in {n for n in accounts + datasets if (accounts + datasets).count(n) > 1}:
        problems.append(f"{name}: listed twice")

    for artifact in inventory["accounts"] + inventory["datasets"]:
        where = artifact["name"]
        problems += [f"{where}: no {f}" for f in ("purpose", "state", "entries") if not artifact.get(f)]
        problems += [f"{where}: no catalogue entry {e}" for e in artifact.get("entries", []) if e not in entry_ids]

    for dataset in inventory["datasets"]:
        where = dataset["name"]
        for file in dataset.get("data", []):
            if not (seed / file).is_file():
                problems.append(f"{where}: no file {file}")
        for collaborator in dataset.get("collaborators", []):
            if collaborator["account"] not in accounts:
                problems.append(f"{where}: collaborator {collaborator['account']} is not a listed account")
        kind = dataset_kind(dataset)
        if kind not in KINDS:
            problems.append(f"{where}: kind must be one of {', '.join(KINDS)}")
            continue
        if kind != "snapshot":
            continue
        if ("manifest" in dataset) == ("template" in dataset):
            problems.append(f"{where}: needs exactly one of `manifest` and `template`")
            continue
        if dataset.get("manifest") and dataset["manifest"] != f"{where}.yaml":
            problems.append(f"{where}: the manifest must be {where}.yaml")
        source = seed / (dataset.get("manifest") or dataset["template"])
        if not source.is_file():
            problems.append(f"{where}: no file {source.relative_to(seed)}")
            continue
        content = yaml.safe_load(snapshot_text(dataset, seed))["content"]
        if content["name"] != where:
            problems.append(f"{where}: the snapshot names {content['name']}")
    for dataset in inventory["datasets"]:
        for item in dataset.get("contents", []):
            if item["dataset"] not in datasets:
                problems.append(f"{dataset['name']}: {item['path']} names an unlisted dataset {item['dataset']}")

    data_files = {f for d in inventory["datasets"] for f in d.get("data", [])}
    for run in inventory["flowRuns"]:
        if "arrive" in run:
            if run["arrive"] not in data_files:
                problems.append(f"flowRuns: {run['arrive']} is not a dataset's data file")
        elif run["dataset"] not in datasets or run["flow"] not in FLOWS or run["outcome"] not in OUTCOMES:
            problems.append(f"flowRuns: {run}: needs a listed dataset, flow {'|'.join(FLOWS)}, a known outcome")

    on_disk = {p.relative_to(seed).as_posix() for p in seed.rglob("*") if p.is_file() and p.name != INVENTORY.name}
    problems += [f"{f}: not listed in the inventory" for f in sorted(on_disk - listed_files(inventory))]
    return problems


# Every metadata event kind, so a lookup of a block by its kind finds one
EVENTS = [
    "AddData",
    "AddPushSource",
    "DisablePollingSource",
    "DisablePushSource",
    "ExecuteTransform",
    "Seed",
    "SetAttachments",
    "SetDataSchema",
    "SetInfo",
    "SetLicense",
    "SetPollingSource",
    "SetTransform",
    "SetVocab",
    "SetWatermark",
]


class _Recorder:
    """Stands in for a session when a scenario's URL is computed: records the datasets the URL looks up
    and answers with ids of the right shape."""

    def __init__(self, inventory: dict):
        self.names: list[str] = []
        self.labels = [w["label"] for d in inventory["datasets"] for w in d.get("webhooks", [])]

    def gql(self, _query: str, variables: dict) -> dict:
        self.names.append(variables["n"])
        subscriptions = [{"id": "0", "label": label} for label in self.labels]
        return {
            "datasets": {
                "byOwnerAndName": {
                    "metadata": {
                        "chain": {"blocks": {"nodes": [{"blockHash": "0", "event": {"__typename": e}} for e in EVENTS]}}
                    },
                    "webhooks": {"subscriptions": subscriptions},
                    "flows": {"runs": {"listFlows": {"nodes": [{"flowId": "0"}]}}},
                }
            }
        }


def scenario_datasets(scenario, inventory: dict, owner: str) -> list[str]:
    """The datasets of `owner` a scenario opens or looks up."""
    recorder = _Recorder(inventory)
    url = scenario.url(recorder) if callable(scenario.url) else scenario.url or ""
    segments = url.split("?")[0].strip("/").split("/")
    opened = [segments[1]] if len(segments) > 1 and segments[0] == owner and not segments[1].startswith("~") else []
    return opened + recorder.names


def check_scenario_datasets(inventory: dict, scenarios, owner: str) -> list[str]:
    datasets = {d["name"] for d in inventory["datasets"]}
    return [
        f"{sc.name}: dataset {name} is not in the inventory"
        for sc in scenarios
        for name in scenario_datasets(sc, inventory, owner)
        if name not in datasets
    ]
