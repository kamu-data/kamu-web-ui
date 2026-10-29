# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""Data profiles: what a scenario runs against. Each one identifies its data (for cache keys), builds or
fetches it, starts an API server over it, and says where the frozen clock stands."""

from __future__ import annotations

import hashlib
import json
import secrets
import shutil
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import yaml

from e2e.fixtures.seed import ADMIN, SEED, build_empty_workspace, build_seed_workspace
from e2e.visual.backend import (
    container_runtime,
    ensure_image,
    image_created,
    kamu_binary,
    read_from_image,
    start_container,
    start_local,
)

HERE = Path(__file__).parent
TWO_HOURS = 2 * 3600 * 1000
# Published by kamu-cli's release-images-with-data workflow, which only tags `latest-with-data-mt`: the
# digest pins one build of it
WITH_DATA_MT_IMAGE = (
    "ghcr.io/kamu-data/kamu-base@sha256:1dde7d0ff65dca505172eb2b9283dd68b74a2e2f22ed5fc544febc79cd7725dc"
)
IMAGE_CONFIG = "/opt/kamu/workspace/.kamu/.kamuconfig"


def whole_minute(ms: int) -> int:
    """Pages show minute-precision times."""
    return ms // 60000 * 60000


def _hash_files(files: list[Path]) -> str:
    digest = hashlib.sha256()
    for file in sorted(files):
        digest.update(file.relative_to(HERE).as_posix().encode())
        digest.update(file.read_bytes())
    return digest.hexdigest()[:12]


@dataclass
class Prepared:
    """A profile ready to serve: the frozen clock (epoch ms) and how to start its server."""

    now: int
    start: object


class WorkspaceProfile:
    """Built locally with the kamu binary into a workspace, cached by its sources and the backend build:
    both sides of a comparison run against the same workspace."""

    uses_local_backend = True

    def __init__(self, name: str, api_port: int, build):
        self.name = name
        self.api_port = api_port
        self.account = ADMIN
        self._build = build

    def data_id(self) -> str:
        sources = [f for f in SEED.rglob("*") if f.is_file()] + [HERE / "seed.py"]
        return _hash_files(sources)

    def prepare(self, workspace: Path, log_dir: Path) -> Prepared:
        if not (workspace / ".seed" / "seed-info.json").exists():
            print(f"building the {self.name} workspace with {kamu_binary()}")
            partial = workspace.with_name(workspace.name + ".partial")
            self._build(partial, self.api_port)
            shutil.rmtree(workspace, ignore_errors=True)
            partial.rename(workspace)
        info = json.loads((workspace / ".seed" / "seed-info.json").read_text())
        seeded = int(datetime.fromisoformat(info["seededAt"]).timestamp() * 1000)
        log_file = log_dir / f"api-{self.name}.log"
        return Prepared(whole_minute(seeded + TWO_HOURS), lambda: start_local(workspace, self.api_port, log_file))


class WithDataProfile:
    """kamu-cli's published image of real datasets and organizations, run with a config that adds what
    a node operator sets for the query pages: a signing key, without which `/query` answers "Response
    signing is not enabled", and one DataFusion partition, so rows come back in the same order."""

    name = "with-data-mt"
    api_port = 8092
    account = {"login": "kamu", "password": "kamu.dev"}
    # The image carries its own backend build
    uses_local_backend = False

    def data_id(self) -> str:
        return WITH_DATA_MT_IMAGE.split(":")[-1][:12]

    def prepare(self, workspace: Path, log_dir: Path) -> Prepared:
        runtime = container_runtime()
        ensure_image(runtime, WITH_DATA_MT_IMAGE)
        config = workspace / "kamuconfig.yaml"
        if not config.exists():
            content = yaml.safe_load(read_from_image(runtime, WITH_DATA_MT_IMAGE, IMAGE_CONFIG))
            content["content"]["identity"] = {"privateKey": "f" + secrets.token_hex(32)}
            batch_query = {"datafusion.execution.target_partitions": "1"}
            content["content"]["engine"] = {"datafusionEmbedded": {"batchQuery": batch_query}}
            workspace.mkdir(parents=True, exist_ok=True)
            config.write_text(yaml.safe_dump(content))
        log_file = log_dir / "api-with-data-mt.log"
        return Prepared(
            whole_minute(image_created(runtime, WITH_DATA_MT_IMAGE) + TWO_HOURS),
            lambda: start_container(runtime, WITH_DATA_MT_IMAGE, self.api_port, log_file, [(config, IMAGE_CONFIG)]),
        )


PROFILES = {
    "seed": WorkspaceProfile("seed", 8090, build_seed_workspace),
    "empty": WorkspaceProfile("empty", 8091, lambda ws, _port: build_empty_workspace(ws)),
    "with-data-mt": WithDataProfile(),
}
