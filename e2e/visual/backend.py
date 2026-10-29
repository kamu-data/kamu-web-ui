# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""The kamu API server behind a capture: a local binary over a workspace, or a published image, and the
check that it serves the GraphQL schema the app's documents were written against."""

from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile
import time
import urllib.request
from datetime import UTC, datetime
from pathlib import Path

from graphql import (
    NoUnusedFragmentsRule,
    build_client_schema,
    get_introspection_query,
    parse,
    specified_rules,
    validate,
)

# Where a developer's own kamu server listens
RESERVED_API_PORT = 8080
# Every standard rule except one about the documents alone: an unused fragment is not a mismatch
SCHEMA_RULES = [rule for rule in specified_rules if rule is not NoUnusedFragmentsRule]


def kamu_binary() -> str:
    return os.environ.get("KAMU_BIN", "kamu")


def _resolve(binary: str) -> Path:
    found = binary if "/" in binary else shutil.which(binary)
    if not found:
        raise RuntimeError(f"{binary} not found on PATH; set KAMU_BIN to a kamu build")
    return Path(found).resolve()


def backend_id(cache: Path) -> str:
    """The backend build: its version line and a hash of the binary, memoised by path and mtime in
    `cache`, since a debug build is large and two builds share a version string."""
    binary = _resolve(kamu_binary())
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


def _post(url: str, payload: dict, timeout: float = 5) -> dict:
    body = json.dumps(payload).encode()
    request = urllib.request.Request(url, data=body, headers={"content-type": "application/json"}, method="POST")
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.load(response)


def _port_free(port: int) -> bool:
    try:
        urllib.request.urlopen(f"http://localhost:{port}/", timeout=1)
    except urllib.error.HTTPError:
        return False
    except OSError:
        return True
    return False


def check_port(port: int) -> None:
    if port == RESERVED_API_PORT:
        raise RuntimeError(f"API port {port} is left to your own kamu server")
    if not _port_free(port):
        raise RuntimeError(f"port {port} is already in use")


def wait_for_api(api_url: str, alive, log_file: Path) -> None:
    for _ in range(240):
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
    """A running API server: `api_url`, and `stop()`."""

    def __init__(self, api_url: str, stop):
        self.api_url = api_url
        self.stop = stop


def start_local(ws: Path, port: int, log_file: Path) -> Server:
    """`kamu system api-server` over the workspace `ws` on `port`, with the environment in
    `<ws>/.seed/env`."""
    check_port(port)
    env = dict(os.environ)
    env_file = ws / ".seed" / "env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if "=" in line:
                name, value = line.split("=", 1)
                env[name] = value
    log = open(log_file, "w")  # noqa: SIM115 (open while the server runs)
    proc = subprocess.Popen(
        [kamu_binary(), "system", "api-server", "--http-port", str(port)], cwd=ws, env=env, stdout=log, stderr=log
    )
    api_url = f"http://localhost:{port}"

    def stop() -> None:
        if proc.poll() is None:
            proc.terminate()
            try:
                proc.wait(5)
            except subprocess.TimeoutExpired:
                proc.kill()
        log.close()

    try:
        wait_for_api(api_url, lambda: proc.poll() is None, log_file)
    except Exception:
        stop()
        raise
    return Server(api_url, stop)


def container_runtime() -> str:
    """docker, or podman when docker is missing."""
    for runtime in ("docker", "podman"):
        if shutil.which(runtime) and subprocess.run([runtime, "version"], capture_output=True).returncode == 0:
            return runtime
    raise RuntimeError("this profile needs docker or podman")


def ensure_image(runtime: str, image: str) -> None:
    """Pulls a public image anonymously when it is not present: stored registry credentials, even stale
    ones, would otherwise be sent and refused."""
    if subprocess.run([runtime, "image", "inspect", image], capture_output=True).returncode == 0:
        return
    with tempfile.TemporaryDirectory(prefix="kamu-visual-registry-") as config:
        auth_file = Path(config) / "auth.json"
        auth_file.write_text("{}")
        env = {**os.environ, "DOCKER_CONFIG": config, "REGISTRY_AUTH_FILE": str(auth_file)}
        print(f"pulling {image}")
        subprocess.run([runtime, "pull", image], env=env, check=True)


def image_created(runtime: str, image: str) -> int:
    """The image's creation time, epoch ms."""
    created = subprocess.run(
        [runtime, "image", "inspect", image, "--format", "{{.Created}}"], capture_output=True, text=True, check=True
    ).stdout.strip()
    # docker prints nanoseconds, which fromisoformat does not take; the clock needs whole minutes only
    seconds = re.match(r"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d", created).group(0)
    return int(datetime.fromisoformat(seconds).replace(tzinfo=UTC).timestamp() * 1000)


def read_from_image(runtime: str, image: str, file: str) -> str:
    return subprocess.run(
        [runtime, "run", "--rm", "--entrypoint", "cat", image, file], capture_output=True, text=True, check=True
    ).stdout


def start_container(runtime: str, image: str, port: int, log_file: Path, mounts: list[tuple[Path, str]]) -> Server:
    """The API server inside `image`, its port 8080 on `port`, and each `(host, container)` mount
    read-only. The server refuses to start without GitHub OAuth settings, so it gets dummy ones, as a
    local workspace does."""
    check_port(port)
    env = ["-e", "KAMU_AUTH_GITHUB_CLIENT_ID=dummy", "-e", "KAMU_AUTH_GITHUB_CLIENT_SECRET=dummy"]
    volumes = [arg for host, inside in mounts for arg in ("-v", f"{host}:{inside}:ro")]
    command = ["kamu", "system", "api-server", "--http-port", "8080", "--address", "0.0.0.0"]
    container = subprocess.run(
        [runtime, "run", "-d", *env, *volumes, "-p", f"127.0.0.1:{port}:8080", image, *command],
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()

    def running() -> bool:
        state = subprocess.run(
            [runtime, "inspect", "-f", "{{.State.Running}}", container], capture_output=True, text=True
        )
        return state.stdout.strip() == "true"

    def stop() -> None:
        logs = subprocess.run([runtime, "logs", container], capture_output=True, text=True)
        log_file.write_text(logs.stdout + logs.stderr)
        subprocess.run([runtime, "rm", "-f", container], capture_output=True)

    api_url = f"http://localhost:{port}"
    try:
        wait_for_api(api_url, running, log_file)
    except Exception:
        stop()
        raise
    return Server(api_url, stop)


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
