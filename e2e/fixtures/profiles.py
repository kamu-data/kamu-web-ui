# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""Data profiles: what a scenario runs against. Each one identifies its data (for cache keys), opens a
running API server with that data on a given backend, and says where the frozen clock stands."""

from __future__ import annotations

import hashlib
import json
import secrets
import shutil
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import yaml

from e2e.fixtures.seed import (
    ADMIN,
    DUMMY_GITHUB,
    SEED,
    api_server_config,
    build_workspace,
    fill,
    node_settings,
    workspace_env,
)
from e2e.visual.backend import (
    CONTAINER_ENGINE_NETWORK,
    Backend,
    BackendChoice,
    Server,
    start_api_server,
    start_container_server,
    start_workspace_server,
)
from e2e.visual.containers import container_runtime, ensure_image, image_created, run_in_image

HERE = Path(__file__).parent
TWO_HOURS = 2 * 3600 * 1000
WORKSPACE = "/opt/kamu/workspace"


def whole_minute(ms: int) -> int:
    """Pages show minute-precision times."""
    return ms // 60000 * 60000


def _hash_files(files: list[Path]) -> str:
    digest = hashlib.sha256()
    for file in sorted(files):
        digest.update(file.relative_to(HERE).as_posix().encode())
        digest.update(file.read_bytes())
    return digest.hexdigest()[:12]


def _frozen_clock(seeded_at: str) -> int:
    return whole_minute(int(datetime.fromisoformat(seeded_at).timestamp() * 1000) + TWO_HOURS)


@dataclass
class Running:
    """A profile's server with its data, the frozen clock (epoch ms) for its pages, and what serves it."""

    server: Server
    now: int
    describe: str


class WorkspaceProfile:
    """Content created from the fixtures. A local kamu-cli build keeps it in a cached workspace, reused
    while the fixtures and the build stay the same, so both sides of a comparison see the same ids. Any
    other backend is filled afresh in containers that are discarded afterwards; the snapshots mask the
    ids, hashes and times that differ between two fillings."""

    def __init__(self, name: str, api_port: int):
        self.name = name
        self.api_port = api_port
        self.account = ADMIN

    def data_id(self, _backend: BackendChoice) -> str:
        sources = [f for f in SEED.rglob("*") if f.is_file()] + [HERE / "seed.py", HERE / "inventory.py"]
        return _hash_files(sources)

    def backend_id(self, backend: BackendChoice) -> str:
        return backend.get().ident

    def open(self, choice: BackendChoice, cache: Path, run_dir: Path) -> Running:
        backend = choice.get()
        log_dir = run_dir / f"backend-{self.name}"
        log_dir.mkdir(parents=True, exist_ok=True)
        if backend.kind == "cli" and backend.binary:
            return self._open_workspace(backend, cache, log_dir)
        config, env = node_settings()
        if backend.kind == "cli":
            config["content"]["engine"]["networkNs"] = CONTAINER_ENGINE_NETWORK
            files = {}
            config_file = log_dir / "kamuconfig.yaml"
            config_file.write_text(yaml.safe_dump(config, sort_keys=False))
            files[config_file] = "/opt/kamu/kamuconfig.yaml"
            init = [["kamu", "init", "--multi-tenant"], ["cp", "/opt/kamu/kamuconfig.yaml", ".kamu/.kamuconfig"]]
            command = ["kamu", "system", "api-server", "--address", "0.0.0.0", "--http-port", str(self.api_port)]
            server = start_container_server(
                backend.image, command, WORKSPACE, files, env, self.api_port, log_dir / "api-server.log", init
            )
        else:
            server = start_api_server(backend, self.api_port, api_server_config(config, env), log_dir)
        try:
            info = fill(self.name, server)
        except BaseException:
            server.stop()
            raise
        return Running(server, _frozen_clock(info["seededAt"]), backend.describe())

    def _open_workspace(self, backend: Backend, cache: Path, log_dir: Path) -> Running:
        ws = cache / "workspaces" / f"{self.name}-{self.data_id(backend)}-{backend.ident}"
        if not (ws / ".seed" / "seed-info.json").exists():
            print(f"building the {self.name} workspace", flush=True)
            partial = ws.with_name(ws.name + ".partial")
            shutil.rmtree(partial, ignore_errors=True)
            build_workspace(self.name, backend.binary, partial, self.api_port)
            shutil.rmtree(ws, ignore_errors=True)
            partial.rename(ws)
        info = json.loads((ws / ".seed" / "seed-info.json").read_text())
        log_file = log_dir / "api-server.log"
        server = start_workspace_server(backend.binary, ws, self.api_port, log_file, workspace_env(ws))
        return Running(server, _frozen_clock(info["seededAt"]), f"{backend.describe()}, workspace {ws.name}")


@dataclass(frozen=True)
class PublishedImage:
    """An image with data, published by a kamu release workflow, and where its server reads its config."""

    image: str
    workdir: str
    config: str
    command: list[str]


class WithDataProfile:
    """Real datasets and organizations, as published in the with-data image of the chosen backend kind,
    run with a config that adds what a node operator sets for the query pages: a signing key, without
    which `/query` answers "Response signing is not enabled", and one DataFusion partition, so rows come
    back in the same order. The image carries its own backend build: only the backend kind applies."""

    name = "with-data-mt"
    api_port = 8092
    account = {"login": "kamu", "password": "kamu.dev"}
    # The release workflows only tag `latest-with-data-mt`: each digest pins one build of it
    IMAGES = {
        "cli": PublishedImage(
            "ghcr.io/kamu-data/kamu-base@sha256:1dde7d0ff65dca505172eb2b9283dd68b74a2e2f22ed5fc544febc79cd7725dc",
            WORKSPACE,
            f"{WORKSPACE}/.kamu/.kamuconfig",
            ["kamu", "system", "api-server", "--address", "0.0.0.0", "--http-port"],
        ),
        "api-server": PublishedImage(
            "ghcr.io/kamu-data/kamu-api-server@sha256:a47bde35dfb734b85e33e6707c412c0102dc710fe897d4a6d4d432f72015e890",
            "/opt/kamu",
            "/opt/kamu/config.yaml",
            ["/opt/kamu/kamu-api-server", "--multi-tenant", "run", "--address", "0.0.0.0", "--http-port"],
        ),
    }

    def data_id(self, backend: BackendChoice) -> str:
        return self.IMAGES[backend.kind].image.split(":")[-1][:12]

    def backend_id(self, backend: BackendChoice) -> str:
        return f"{backend.kind}-image"

    def open(self, backend: BackendChoice, _cache: Path, run_dir: Path) -> Running:
        published = self.IMAGES[backend.kind]
        if backend.named():
            print(f"{self.name} runs its published image; the build options do not apply to it", flush=True)
        runtime = container_runtime()
        ensure_image(runtime, published.image)
        log_dir = run_dir / f"backend-{self.name}"
        log_dir.mkdir(parents=True, exist_ok=True)
        config = yaml.safe_load(run_in_image(runtime, published.image, "cat", published.config))
        content = config["content"] if backend.kind == "cli" else config
        content["identity"] = {"privateKey": "f" + secrets.token_hex(32)}
        content["engine"] = {"datafusionEmbedded": {"batchQuery": {"datafusion.execution.target_partitions": "1"}}}
        # The published kamu-api-server config still names the secrets encryption by its former key, which
        # the server in the same image rejects
        if "datasetEnvVars" in content and "secretsEncryption" not in content:
            content["secretsEncryption"] = content.pop("datasetEnvVars")
        # A deployment supplies the GitHub OAuth settings the published config leaves out
        for provider in content.get("auth", {}).get("providers", []):
            if provider.get("kind") == "github":
                provider.update(DUMMY_GITHUB)
        config_file = log_dir / "config.yaml"
        config_file.write_text(yaml.safe_dump(config, sort_keys=False))
        env = {"KAMU_AUTH_GITHUB_CLIENT_ID": "dummy", "KAMU_AUTH_GITHUB_CLIENT_SECRET": "dummy"}
        server = start_container_server(
            published.image,
            [*published.command, str(self.api_port)],
            published.workdir,
            {config_file: published.config},
            env,
            self.api_port,
            log_dir / "api-server.log",
        )
        now = whole_minute(image_created(runtime, published.image) + TWO_HOURS)
        return Running(server, now, f"published image {published.image}")


PROFILES = {
    "seed": WorkspaceProfile("seed", 8090),
    "empty": WorkspaceProfile("empty", 8091),
    "with-data-mt": WithDataProfile(),
}
