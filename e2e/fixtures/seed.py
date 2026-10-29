# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""Builds the workspaces of the `seed` and `empty` data profiles.

Everything the API server needs later lives inside the workspace:
  .kamu/.kamuconfig     accounts, identity key, secrets encryption key
  .seed/env             KAMU_JWT_SECRET and a dummy GitHub client id and secret
  .seed/seed-info.json  what was created and when (the frozen clock follows `seededAt`)
  seed-data/            the CSVs the polling sources read (manifest paths are relative)
"""

from __future__ import annotations

import base64
import json
import re
import secrets
import shutil
import string
import subprocess
import time
import urllib.request
from datetime import UTC, datetime
from pathlib import Path

from e2e.fixtures.inventory import OUTCOMES, SEED, dataset_kind, load_inventory, snapshot_text
from e2e.visual.backend import kamu_binary, start_local

ADMIN = {"login": "kamu", "password": "kamu.dev"}


def log(*parts) -> None:
    print("[seed]", *parts)


def _alnum(n: int) -> str:
    return "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(n))


def _init_workspace(ws: Path) -> None:
    """A multi-tenant workspace with the accounts and secrets and no datasets."""
    shutil.rmtree(ws, ignore_errors=True)
    ws.mkdir(parents=True)
    subprocess.run([kamu_binary(), "init", "--multi-tenant"], cwd=ws, capture_output=True, check=True)
    (ws / ".seed").mkdir()
    values = {
        # kamu 0.271 parses it as multibase: "f" + hex
        "IDENTITY_PRIVATE_KEY": "f" + secrets.token_hex(32),
        "SECRETS_ENCRYPTION_KEY": _alnum(32),
    }

    def fill(match: re.Match) -> str:
        if match.group(1) not in values:
            raise RuntimeError(f"kamuconfig.yaml: unknown placeholder {match.group(1)}")
        return values[match.group(1)]

    template = (SEED / "kamuconfig.yaml").read_text()
    (ws / ".kamu" / ".kamuconfig").write_text(re.sub(r"\$\{(\w+)\}", fill, template))
    jwt_secret = base64.b64encode(secrets.token_bytes(32)).decode()
    (ws / ".seed" / "env").write_text(
        f"KAMU_JWT_SECRET={jwt_secret}\nKAMU_AUTH_GITHUB_CLIENT_ID=dummy\nKAMU_AUTH_GITHUB_CLIENT_SECRET=dummy\n"
    )


def build_empty_workspace(ws: Path) -> None:
    """The `empty` profile: accounts only."""
    _init_workspace(ws)
    info = {"seededAt": datetime.now(UTC).isoformat()}
    (ws / ".seed" / "seed-info.json").write_text(json.dumps(info, indent=2))


class Seeder:
    """Creates what the inventory lists through the API of a running server, as the admin."""

    def __init__(self, api_url: str, ws: Path, inventory: dict):
        self.api = api_url
        self.ws = ws
        self.inventory = inventory
        self.token: str | None = None
        self.created: dict = {
            "datasets": {},
            "flows": [],
            "envVars": [],
            "accessTokens": [],
            "webhooks": {},
            "collection": [],
            "versionedFile": [],
        }

    def gql(self, query: str, variables: dict | None = None, auth: bool = True) -> dict:
        headers = {"content-type": "application/json"}
        if auth and self.token:
            headers["authorization"] = f"Bearer {self.token}"
        body = json.dumps({"query": query, "variables": variables or {}}).encode()
        request = urllib.request.Request(f"{self.api}/graphql", data=body, headers=headers, method="POST")
        with urllib.request.urlopen(request) as response:
            result = json.load(response)
        if result.get("errors"):
            raise RuntimeError(f"GraphQL: {json.dumps(result['errors'])[:600]}\n{query[:200]}")
        return result["data"]

    @staticmethod
    def expect(result: dict, typename: str, what: str) -> dict:
        if result["__typename"] != typename:
            raise RuntimeError(f"{what}: {result['__typename']}: {result.get('message', result)}")
        return result

    def login(self) -> None:
        credentials = json.dumps({"login": ADMIN["login"], "password": ADMIN["password"]})
        data = self.gql(
            "mutation($c: String!) { auth { login(loginMethod: PASSWORD, loginCredentialsJson: $c) "
            "{ accessToken account { id } } } }",
            {"c": credentials},
            auth=False,
        )
        self.token = data["auth"]["login"]["accessToken"]
        self.created["accountId"] = data["auth"]["login"]["account"]["id"]

    def account_id(self, name: str) -> str:
        return self.gql("query($n: AccountName!) { accounts { byName(name: $n) { id } } }", {"n": name})["accounts"][
            "byName"
        ]["id"]

    def create_from_snapshot(self, dataset: dict) -> str:
        data = self.gql(
            """mutation($s: String!, $v: DatasetVisibility!) { datasets {
                createFromSnapshot(snapshot: $s, snapshotFormat: YAML, datasetVisibility: $v) {
                __typename message ... on CreateDatasetResultSuccess { dataset { id name } } } } }""",
            {"s": snapshot_text(dataset), "v": dataset.get("visibility", "PUBLIC")},
        )
        what = f"create {dataset['name']}"
        result = self.expect(data["datasets"]["createFromSnapshot"], "CreateDatasetResultSuccess", what)
        self.created["datasets"][result["dataset"]["name"]] = result["dataset"]["id"]
        return result["dataset"]["id"]

    def create_archetype(self, kind: str, name: str) -> str:
        field = "createCollection" if kind == "collection" else "createVersionedFile"
        data = self.gql(
            f"""mutation($a: DatasetAlias!) {{ datasets {{ {field}(datasetAlias: $a, datasetVisibility: PUBLIC) {{
                __typename message ... on CreateDatasetResultSuccess {{ dataset {{ id name }} }} }} }} }}""",
            {"a": f"{ADMIN['login']}/{name}"},
        )
        result = self.expect(data["datasets"][field], "CreateDatasetResultSuccess", f"{field} {name}")
        self.created["datasets"][name] = result["dataset"]["id"]
        return result["dataset"]["id"]

    def push_ingest(self, name: str, count: int) -> None:
        """`count` commits of one record each, so the metadata commit navigator has pages."""
        records = [
            {
                "event_time": f"2021-01-{k + 1:02d}T00:00:00Z",
                "id": k + 1,
                "payload": {"name": f"n{k + 1}", "score": (k + 1) * 7},
            }
            for k in range(count)
        ]
        for record in records:
            request = urllib.request.Request(
                f"{self.api}/{ADMIN['login']}/{name}/ingest",
                data=(json.dumps(record) + "\n").encode(),
                headers={"authorization": f"Bearer {self.token}", "content-type": "application/x-ndjson"},
                method="POST",
            )
            urllib.request.urlopen(request).close()
        log(f"{name}: {count} push ingests")

    def trigger(self, dataset: str, kind: str) -> str:
        field = "triggerIngestFlow" if kind == "ingest" else "triggerTransformFlow"
        data = self.gql(
            f"""mutation($id: DatasetID!) {{ datasets {{ byId(datasetId: $id) {{ flows {{ runs {{ {field} {{
                __typename message ... on TriggerFlowSuccess {{ flow {{ flowId }} }} }} }} }} }} }} }}""",
            {"id": self.created["datasets"][dataset]},
        )
        result = self.expect(
            data["datasets"]["byId"]["flows"]["runs"][field], "TriggerFlowSuccess", f"{field} {dataset}"
        )
        return result["flow"]["flowId"]

    def flows_of(self, dataset: str) -> list[dict]:
        data = self.gql(
            """query($id: DatasetID!) { datasets { byId(datasetId: $id) { flows { runs { listFlows(perPage: 100) {
                nodes { flowId status outcome { __typename } } } } } } } }""",
            {"id": self.created["datasets"][dataset]},
        )
        return data["datasets"]["byId"]["flows"]["runs"]["listFlows"]["nodes"]

    def run_flow(self, dataset: str, kind: str, expected: str) -> None:
        flow_id = self.trigger(dataset, kind)
        for _ in range(240):
            flow = next((f for f in self.flows_of(dataset) if f["flowId"] == flow_id), None)
            if flow and flow["status"] == "FINISHED":
                outcome = (flow.get("outcome") or {}).get("__typename")
                self.created["flows"].append({"dataset": dataset, "flowId": flow_id, "outcome": outcome})
                if outcome != expected:
                    raise RuntimeError(f"flow {flow_id} of {dataset}: {outcome}, expected {expected}")
                log(f"flow {flow_id} {dataset}: {outcome}")
                return
            time.sleep(0.5)
        raise RuntimeError(f"flow {flow_id} of {dataset} did not finish")

    def seed(self) -> None:
        self.login()
        datasets = self.inventory["datasets"]
        for dataset in datasets:
            kind = dataset_kind(dataset)
            if kind == "snapshot":
                self.create_from_snapshot(dataset)
            else:
                self.create_archetype(kind, dataset["name"])
        log("datasets created:", len(self.created["datasets"]))

        for dataset in datasets:
            if dataset.get("pushes"):
                self.push_ingest(dataset["name"], dataset["pushes"])
        for run in self.inventory["flowRuns"]:
            if "arrive" in run:
                shutil.copy(SEED / run["arrive"], self.ws / "seed-data" / Path(run["arrive"]).name)
                continue
            for _ in range(run.get("times", 1)):
                self.run_flow(run["dataset"], run["flow"], OUTCOMES[run["outcome"]])

        for account in self.inventory["accounts"]:
            for token in account.get("accessTokens", []):
                self.create_access_token(account["name"], token)
        for dataset in datasets:
            for variable in dataset.get("variables", []):
                self.set_variable(dataset["name"], variable)
            for collaborator in dataset.get("collaborators", []):
                self.set_role(dataset["name"], collaborator)
            for item in dataset.get("contents", []):
                self.add_collection_entry(dataset["name"], item)
            for text in dataset.get("versions", []):
                self.upload_version(dataset["name"], text)
        # Webhooks last: no dataset changes after them, so no delivery is ever attempted
        for dataset in datasets:
            for webhook in dataset.get("webhooks", []):
                self.create_webhook(dataset["name"], webhook)

        # Frozen: nothing waiting, running or retrying
        time.sleep(2)
        for name in self.created["datasets"]:
            busy = [f for f in self.flows_of(name) if f["status"] != "FINISHED"]
            if busy:
                raise RuntimeError(f"{name} has unfinished flows: {busy}")
        log("frozen: no waiting, running or retrying flows")
        self.created["seededAt"] = datetime.now(UTC).isoformat()

    def dataset_id(self, name: str) -> str:
        return self.created["datasets"][name]

    def create_access_token(self, account: str, name: str) -> None:
        data = self.gql(
            """mutation($a: AccountID!, $n: String!) { accounts { byId(accountId: $a) { accessTokens {
                createAccessToken(tokenName: $n) { __typename message
                ... on CreateAccessTokenResultSuccess { token { id } } } } } } }""",
            {"a": self.account_id(account), "n": name},
        )
        result = self.expect(
            data["accounts"]["byId"]["accessTokens"]["createAccessToken"],
            "CreateAccessTokenResultSuccess",
            f"token {name}",
        )
        self.created["accessTokens"].append({"account": account, "name": name, "id": result["token"]["id"]})

    def set_variable(self, dataset: str, variable: dict) -> None:
        is_secret = variable.get("secret", False)
        data = self.gql(
            """mutation($id: DatasetID!, $k: String!, $v: String!, $s: Boolean!) { datasets {
                byId(datasetId: $id) { envVars { upsertEnvVariable(key: $k, value: $v, isSecret: $s) {
                __typename message } } } } }""",
            {"id": self.dataset_id(dataset), "k": variable["key"], "v": variable["value"], "s": is_secret},
        )
        kind = data["datasets"]["byId"]["envVars"]["upsertEnvVariable"]["__typename"]
        if "Created" not in kind:
            raise RuntimeError(f"variable {variable['key']} of {dataset}: {kind}")
        self.created["envVars"].append({"dataset": dataset, "key": variable["key"], "isSecret": is_secret})

    def set_role(self, dataset: str, collaborator: dict) -> None:
        data = self.gql(
            """mutation($id: DatasetID!, $a: AccountID!, $r: DatasetAccessRole!) { datasets {
                byId(datasetId: $id) { collaboration { setRole(accountId: $a, role: $r) {
                __typename message } } } } }""",
            {"id": self.dataset_id(dataset), "a": self.account_id(collaborator["account"]), "r": collaborator["role"]},
        )
        result = data["datasets"]["byId"]["collaboration"]["setRole"]["__typename"]
        log(f"{dataset}: {collaborator['account']} as {collaborator['role']}: {result}")

    def add_collection_entry(self, collection: str, item: dict) -> None:
        data = self.gql(
            """mutation($id: DatasetID!, $e: CollectionEntryInput!) { datasets { byId(datasetId: $id) {
                asCollection { addEntry(entry: $e) { __typename isSuccess message } } } } }""",
            {"id": self.dataset_id(collection), "e": {"path": item["path"], "ref": self.dataset_id(item["dataset"])}},
        )
        result = data["datasets"]["byId"]["asCollection"]["addEntry"]
        if not result["isSuccess"]:
            raise RuntimeError(f"{collection} entry {item['path']}: {result['message']}")
        self.created["collection"].append(item["path"])

    def upload_version(self, name: str, text: str) -> None:
        content = base64.urlsafe_b64encode(text.encode()).decode().rstrip("=")
        data = self.gql(
            """mutation($id: DatasetID!, $c: Base64Usnp!) { datasets { byId(datasetId: $id) {
                asVersionedFile { uploadNewVersion(content: $c, contentType: "text/plain") {
                __typename isSuccess message } } } } }""",
            {"id": self.dataset_id(name), "c": content},
        )
        result = data["datasets"]["byId"]["asVersionedFile"]["uploadNewVersion"]
        if not result["isSuccess"]:
            raise RuntimeError(f"{name} version: {result['message']}")
        self.created["versionedFile"].append(text)

    def create_webhook(self, dataset: str, webhook: dict) -> None:
        data = self.gql(
            """mutation($id: DatasetID!, $i: WebhookSubscriptionInput!) { datasets { byId(datasetId: $id) {
                webhooks { createSubscription(input: $i) { __typename message
                ... on CreateWebhookSubscriptionResultSuccess { subscriptionId } } } } } }""",
            {
                "id": self.dataset_id(dataset),
                "i": {
                    "targetUrl": webhook["targetUrl"],
                    "eventTypes": ["DATASET.REF.UPDATED"],
                    "label": webhook["label"],
                },
            },
        )
        result = self.expect(
            data["datasets"]["byId"]["webhooks"]["createSubscription"],
            "CreateWebhookSubscriptionResultSuccess",
            f"webhook {webhook['label']}",
        )
        self.created["webhooks"][webhook["label"]] = result["subscriptionId"]
        if webhook.get("paused"):
            data = self.gql(
                """mutation($id: DatasetID!, $w: WebhookSubscriptionID!) { datasets { byId(datasetId: $id) {
                    webhooks { subscription(id: $w) { pause { __typename message } } } } } }""",
                {"id": self.dataset_id(dataset), "w": result["subscriptionId"]},
            )
            log(
                f"pause {webhook['label']}:",
                data["datasets"]["byId"]["webhooks"]["subscription"]["pause"]["__typename"],
            )


def build_seed_workspace(ws: Path, port: int) -> None:
    """The `seed` profile: everything created through the API of a temporary server on `port`; nothing
    is scheduled, so the workspace stays as it is afterwards."""
    _init_workspace(ws)
    (ws / "seed-data").mkdir()
    inventory = load_inventory()
    arriving = {run["arrive"] for run in inventory["flowRuns"] if "arrive" in run}
    for dataset in inventory["datasets"]:
        for file in dataset.get("data", []):
            if file not in arriving:
                shutil.copy(SEED / file, ws / "seed-data" / Path(file).name)
    server = start_local(ws, port, ws / ".seed" / "api-server.seed.log")
    seeder = Seeder(server.api_url, ws, inventory)
    try:
        seeder.seed()
    finally:
        server.stop()
    (ws / ".seed" / "seed-info.json").write_text(json.dumps(seeder.created, indent=2))
    created = seeder.created
    log(f"{len(created['datasets'])} datasets, {len(created['flows'])} flow runs, seeded at {created['seededAt']}")
