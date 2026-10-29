# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""The kamu API server behind a capture, and the check that it serves the GraphQL schema the app's
documents were written against.

A backend is kamu-cli (`kamu system api-server` over a workspace) or kamu-api-server (Postgres and S3
behind it), taken from the shell's PATH, a local build, a GitHub release or a published image."""

from __future__ import annotations

import hashlib
import json
import os
import platform
import re
import shlex
import shutil
import socket
import subprocess
import tarfile
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path

import yaml
from graphql import (
    NoUnusedFragmentsRule,
    build_client_schema,
    get_introspection_query,
    parse,
    specified_rules,
    validate,
)

from e2e.visual import containers
from e2e.visual.containers import Container, container_runtime

# Where a developer's own kamu server listens
RESERVED_API_PORT = 8080
# Every standard rule except one about the documents alone: an unused fragment is not a mismatch
SCHEMA_RULES = [rule for rule in specified_rules if rule is not NoUnusedFragmentsRule]
# Next to an API server's port: its Postgres and its S3
POSTGRES_PORT_OFFSET = 1000
S3_PORT_OFFSET = 1100
# The published images configure their podman to run engines in the server container's own network
# (netns=host), so kamu reaches an engine on its port there; the Helm chart sets the same
CONTAINER_ENGINE_NETWORK = "Host"


@dataclass(frozen=True)
class Flavor:
    kind: str
    binary: str
    # Release archives are <asset>-<target>.tar.gz
    asset: str
    repo: str
    image_repo: str
    # The binary inside the published image
    image_binary: str
    # (platform.system(), platform.machine()) -> release target
    targets: dict


FLAVORS = {
    "cli": Flavor(
        "cli",
        "kamu",
        "kamu-cli",
        "kamu-data/kamu-cli",
        "ghcr.io/kamu-data/kamu-base",
        "kamu",
        {
            ("Linux", "x86_64"): "x86_64-unknown-linux-gnu",
            ("Linux", "aarch64"): "aarch64-unknown-linux-gnu",
            ("Darwin", "arm64"): "aarch64-apple-darwin",
        },
    ),
    "api-server": Flavor(
        "api-server",
        "kamu-api-server",
        "kamu-api-server",
        "kamu-data/kamu-node",
        "ghcr.io/kamu-data/kamu-api-server",
        "/opt/kamu/kamu-api-server",
        {("Linux", "x86_64"): "x86_64-unknown-linux-gnu"},
    ),
}


@dataclass
class Backend:
    """A chosen backend build: a `binary` to run here, or an `image` to run in a container."""

    flavor: Flavor
    # How it was chosen: PATH, --bin, --release or --image
    source: str
    version: str
    # Identifies the build in cache keys
    ident: str
    binary: Path | None = None
    image: str | None = None
    # A directory of Postgres migrations instead of the published ones (kamu-api-server only)
    migrations: Path | None = None

    @property
    def kind(self) -> str:
        return self.flavor.kind

    def describe(self) -> str:
        return f"{self.flavor.binary} {self.version} from {self.source}: {self.binary or self.image}"


def _version(output: str) -> str:
    """`kamu 0.271.0` or `kamu-api-server 0.94.0` -> the version."""
    return output.strip().splitlines()[0].split()[-1]


def _binary_ident(binary: Path, cache: Path) -> str:
    """The version line and a hash of the binary, memoised by path and mtime in `cache`, since a debug
    build is large and two builds share a version string."""
    stat = binary.stat()
    memo_file = cache / "backend-ids.json"
    memo = json.loads(memo_file.read_text()) if memo_file.exists() else {}
    key = f"{binary}:{stat.st_mtime}:{stat.st_size}"
    if key not in memo:
        version = subprocess.run([binary, "--version"], capture_output=True, text=True, check=True).stdout.strip()
        digest = hashlib.sha256(binary.read_bytes()).hexdigest()[:12]
        memo[key] = "-".join([*"".join(c if c.isalnum() else " " for c in version).split(), digest])
        cache.mkdir(parents=True, exist_ok=True)
        memo_file.write_text(json.dumps(memo, indent=2))
    return memo[key]


def _download_release(flavor: Flavor, version: str, cache: Path) -> Path:
    target = flavor.targets.get((platform.system(), platform.machine()))
    if not target:
        built_for = ", ".join(f"{system} {machine}" for system, machine in flavor.targets)
        raise RuntimeError(
            f"{flavor.binary} releases are built for {built_for} only; on {platform.system()} "
            f"{platform.machine()} use a local build (--bin) or an image (--image)"
        )
    stem = f"{flavor.asset}-{target}"
    folder = cache / "backends" / f"{flavor.kind}-{version}"
    binary = folder / stem / flavor.binary
    if not binary.exists():
        url = f"https://github.com/{flavor.repo}/releases/download/v{version}/{stem}.tar.gz"
        print(f"downloading {url}", flush=True)
        # Unpacked next to the final folder and renamed into place, so an interrupted download leaves
        # nothing a later run would take for a release
        partial = folder.with_name(folder.name + ".partial")
        shutil.rmtree(partial, ignore_errors=True)
        partial.mkdir(parents=True)
        archive = partial / f"{stem}.tar.gz"
        try:
            with urllib.request.urlopen(url, timeout=containers.NETWORK_TIMEOUT) as response, open(archive, "wb") as f:
                shutil.copyfileobj(response, f)
            with tarfile.open(archive) as tar:
                tar.extractall(partial, filter="data")
        except urllib.error.HTTPError as e:
            shutil.rmtree(partial)
            raise RuntimeError(f"no {flavor.binary} release {version}: {url}: {e.code}") from e
        except BaseException:
            shutil.rmtree(partial)
            raise
        archive.unlink()
        # The extraction filter drops the executable bit
        (partial / stem / flavor.binary).chmod(0o755)
        shutil.rmtree(folder, ignore_errors=True)
        partial.rename(folder)
    return binary


def resolve_backend(
    kind: str,
    cache: Path,
    release: str | None = None,
    image: str | None = None,
    binary: str | None = None,
    migrations: str | None = None,
) -> Backend:
    """The backend of `kind` that the options name; without one, `kind`'s binary on the shell's PATH."""
    flavor = FLAVORS[kind]
    override = Path(migrations).resolve() if migrations else None
    if override and kind != "api-server":
        raise RuntimeError("--migrations applies to --backend api-server only")
    if image:
        reference = image if "/" in image else f"{flavor.image_repo}:{image}"
        runtime = container_runtime()
        containers.ensure_image(runtime, reference)
        version = _version(containers.run_in_image(runtime, reference, flavor.image_binary, "--version"))
        ident = f"{kind}-image-{containers.image_id(runtime, reference)[:12]}"
        return Backend(flavor, "--image", version, ident, image=reference, migrations=override)
    if release:
        found, source = _download_release(flavor, release.removeprefix("v"), cache), "--release"
    elif binary:
        found, source = Path(binary).expanduser().resolve(), "--bin"
        if not found.is_file():
            raise RuntimeError(f"--bin {binary}: no such file")
    else:
        on_path = shutil.which(flavor.binary)
        if not on_path:
            raise RuntimeError(
                f"{flavor.binary} is not on PATH: pass --bin <path>, --release <version> or --image <tag or ref>"
            )
        found, source = Path(on_path).resolve(), "PATH"
    version = _version(subprocess.run([found, "--version"], capture_output=True, text=True, check=True).stdout)
    return Backend(flavor, source, version, _binary_ident(found, cache), binary=found, migrations=override)


class BackendChoice:
    """The backend the options name, resolved on first use: a profile that runs its own published image
    needs only the kind."""

    def __init__(self, kind: str, cache: Path, release=None, image=None, binary=None, migrations=None):
        self.kind = kind
        self.cache = cache
        self.options = {"release": release, "image": image, "binary": binary, "migrations": migrations}
        self._backend: Backend | None = None

    def named(self) -> bool:
        """Whether the options name a build rather than the binary on PATH."""
        return any(self.options[name] for name in ("release", "image", "binary"))

    def get(self) -> Backend:
        if not self._backend:
            self._backend = resolve_backend(self.kind, self.cache, **self.options)
            print(f"backend: {self._backend.describe()}", flush=True)
        return self._backend


def _post(url: str, payload: dict, timeout: float = 5) -> dict:
    body = json.dumps(payload).encode()
    request = urllib.request.Request(url, data=body, headers={"content-type": "application/json"}, method="POST")
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.load(response)


def check_port(port: int) -> None:
    if port == RESERVED_API_PORT:
        raise RuntimeError(f"API port {port} is left to your own kamu server")
    with socket.socket() as s:
        if s.connect_ex(("127.0.0.1", port)) == 0:
            raise RuntimeError(f"port {port} is already in use")


def wait_for_api(api_url: str, alive, log_file: Path) -> None:
    for _ in range(480):
        if not alive():
            raise RuntimeError(f"the API server exited; see {log_file}")
        try:
            if _post(f"{api_url}/graphql", {"query": "{ apiVersion }"}).get("data", {}).get("apiVersion"):
                return
        except OSError:
            pass
        time.sleep(0.5)
    raise RuntimeError(f"the API server did not answer on {api_url}; see {log_file}")


class Server:
    """A running API server: `api_url`, `place(file)` to put a data file where the server's polling
    sources read `seed-data/`, and `stop()`."""

    def __init__(self, api_url: str, stop, place):
        self.api_url = api_url
        self.stop = stop
        self.place = place


def _process(command: list, cwd: Path, env: dict, port: int, log_file: Path) -> Server:
    log = open(log_file, "w")  # noqa: SIM115 (open while the server runs)
    proc = subprocess.Popen(command, cwd=cwd, env={**os.environ, **env}, stdout=log, stderr=log)
    api_url = f"http://localhost:{port}"

    def stop() -> None:
        if proc.poll() is None:
            proc.terminate()
            try:
                proc.wait(5)
            except subprocess.TimeoutExpired:
                proc.kill()
        log.close()

    def place(file: Path) -> None:
        (cwd / "seed-data").mkdir(exist_ok=True)
        shutil.copy(file, cwd / "seed-data" / file.name)

    try:
        wait_for_api(api_url, lambda: proc.poll() is None, log_file)
    except BaseException:
        stop()
        raise
    return Server(api_url, stop, place)


def start_workspace_server(binary: Path, ws: Path, port: int, log_file: Path, env: dict) -> Server:
    """`kamu system api-server` over the local workspace `ws`."""
    check_port(port)
    return _process([binary, "system", "api-server", "--http-port", str(port)], ws, env, port, log_file)


def start_container_server(
    image: str,
    command: list[str],
    workdir: str,
    files: dict[Path, str],
    env: dict,
    port: int,
    log_file: Path,
    before=(),
    network: str | None = None,
) -> Server:
    """The server `command` in a privileged container of `image`, listening on `port` inside and published
    on the same port here, with `files` copied into the container first. Data files go to
    `<workdir>/seed-data/`. Without a `network`, the container gets one of its own, removed with it."""
    check_port(port)
    runtime = container_runtime()
    own_network = None if network else containers.create_network(runtime, f"kamu-visual-{port}")
    script = " && ".join([*(shlex.join(step) for step in before), "exec " + shlex.join(command)])
    try:
        container = Container(
            runtime,
            image,
            ["-c", script],
            env,
            network or own_network,
            publish={port: port},
            workdir=workdir,
            privileged=True,
            entrypoint="sh",
        )
    except BaseException:
        if own_network:
            containers.remove_network(runtime, own_network)
        raise

    def stop() -> None:
        container.remove(log_file)
        if own_network:
            containers.remove_network(runtime, own_network)

    def place(file: Path) -> None:
        container.exec("mkdir", "-p", f"{workdir}/seed-data")
        container.copy_in(file, f"{workdir}/seed-data/{file.name}")

    api_url = f"http://localhost:{port}"
    try:
        for source, target in files.items():
            container.copy_in(source, target)
        container.start()
        wait_for_api(api_url, container.running, log_file)
    except BaseException:
        stop()
        raise
    return Server(api_url, stop, place)


def kamu_core_version(api_server_version: str) -> str:
    """The kamu core a kamu-api-server release is built on, from kamu-node's Cargo.lock at its tag."""
    url = f"https://raw.githubusercontent.com/kamu-data/kamu-node/v{api_server_version}/Cargo.lock"
    hint = "pass --migrations <kamu-cli checkout>/migrations/postgres"
    try:
        lock = urllib.request.urlopen(url, timeout=containers.NETWORK_TIMEOUT).read().decode()
    except OSError as e:
        raise RuntimeError(
            f"cannot tell which kamu core kamu-api-server {api_server_version} uses ({url}: {e}); {hint}"
        ) from e
    found = re.search(r'name = "kamu"\nversion = "([^"]+)"', lock)
    if not found:
        raise RuntimeError(f"{url} names no kamu crate; {hint}")
    return found.group(1)


def start_api_server(backend: Backend, port: int, config: dict, run_dir: Path) -> Server:
    """kamu-api-server on Postgres and S3 in containers, which are discarded when it stops. The
    database is migrated first, from the published migrations of its kamu core version or from
    `backend.migrations`. A local build reaches the services on published ports; an image reaches them
    by name in their network."""
    check_port(port)
    runtime = container_runtime()
    pg_port, s3_port = port + POSTGRES_PORT_OFFSET, port + S3_PORT_OFFSET
    check_port(pg_port)
    check_port(s3_port)
    run_dir.mkdir(parents=True, exist_ok=True)
    network = containers.create_network(runtime, f"kamu-visual-{port}")
    pg_name, s3_name = f"{network}-postgres", f"{network}-s3"
    started: list[tuple[Container, Path]] = []

    def stop_services() -> None:
        for container, log_file in started:
            container.remove(log_file)
        containers.remove_network(runtime, network)

    try:
        started.append((containers.start_postgres(runtime, network, pg_name, pg_port), run_dir / "postgres.log"))
        tag = None if backend.migrations else containers.migrations_tag(kamu_core_version(backend.version))
        print(f"migrations: {backend.migrations or f'{containers.MIGRATIONS_IMAGE}:{tag}'}", flush=True)
        containers.run_migrations(runtime, network, pg_name, tag, backend.migrations, run_dir / "migrations.log")
        rustfs = containers.start_rustfs(runtime, network, s3_name, s3_port, ["datasets", "upload"])
        started.append((rustfs, run_dir / "rustfs.log"))
        if backend.binary:
            pg = ("127.0.0.1", pg_port)
            s3 = f"127.0.0.1:{s3_port}"
        else:
            pg = (pg_name, containers.POSTGRES_PORT)
            s3 = f"{s3_name}:{containers.S3_PORT}"
        config = {
            **config,
            "database": {
                "provider": "postgres",
                "host": pg[0],
                "port": pg[1],
                "credentialsPolicy": {
                    "source": {
                        "kind": "rawPassword",
                        "userName": containers.DB["user"],
                        "rawPassword": containers.DB["password"],
                    }
                },
                "databaseName": containers.DB["name"],
            },
            "repo": {"repoUrl": f"s3+http://{s3}/datasets"},
            "uploadRepo": {"storage": {"kind": "s3", "bucketS3Url": f"s3+http://{s3}/upload"}},
        }
        if not backend.binary:
            config["engine"] = {**config.get("engine", {}), "networkNs": CONTAINER_ENGINE_NETWORK}
        config_file = run_dir / "config.yaml"
        config_file.write_text(yaml.safe_dump(config, sort_keys=False))
        address = "127.0.0.1" if backend.binary else "0.0.0.0"
        args = ["--config", "config.yaml", "--multi-tenant", "run", "--address", address, "--http-port", str(port)]
        env = containers.s3_env(f"http://{s3}")
        log_file = run_dir / "api-server.log"
        if backend.binary:
            server = _process([backend.binary, *args], run_dir, env, port, log_file)
        else:
            workdir = "/opt/kamu"
            files = {config_file: f"{workdir}/config.yaml"}
            command = [backend.flavor.image_binary, *args]
            server = start_container_server(
                backend.image, command, workdir, files, env, port, log_file, network=network
            )
    except BaseException:
        stop_services()
        raise

    def stop() -> None:
        server.stop()
        stop_services()

    return Server(server.api_url, stop, server.place)


def _graphql_documents(tree: Path) -> str:
    folder = tree / "src" / "app" / "api" / "gql"
    return "\n".join(f.read_text() for f in sorted(folder.rglob("*.graphql")))


def schema_mismatches(api_url: str, trees: dict[str, Path]) -> list[str]:
    """Validates every operation and fragment of each source tree against the schema the API server at
    `api_url` serves. One message per invalid document; none means the server can answer everything the
    app asks."""
    schema = build_client_schema(_post(f"{api_url}/graphql", {"query": get_introspection_query()}, 30)["data"])
    problems: list[str] = []
    for label, tree in trees.items():
        for error in validate(schema, parse(_graphql_documents(tree)), SCHEMA_RULES):
            message = f"{label}: {error.message}"
            if message not in problems:
                problems.append(message)
    return problems
