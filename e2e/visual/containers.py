# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""Containers behind a backend: the runtime, published images pulled anonymously, and the Postgres,
S3 (rustfs) and database migrations that kamu-api-server runs on.

The containers of one server share a network of their own and reach each other by name, as separate
services do in a deployment; only the ports the browser or a local server needs are published, on
127.0.0.1. Never the host network: kamu's own podman inside a privileged container would then set up
engine networking on the host itself."""

from __future__ import annotations

import datetime as dt
import hashlib
import hmac
import json
import os
import re
import shutil
import subprocess
import tempfile
import time
import urllib.request
from pathlib import Path

POSTGRES_IMAGE = "docker.io/library/postgres:17.6"
RUSTFS_IMAGE = "docker.io/rustfs/rustfs:1.0.0-alpha.90"
MIGRATIONS_IMAGE = "ghcr.io/kamu-data/sqlx-cli-with-migrations"
# Where the migrations image keeps the migrations of its kamu core version
IMAGE_MIGRATIONS = "/migrations/postgres"
DB = {"user": "kamu", "password": "kamu", "name": "kamu"}
# Inside the network
POSTGRES_PORT = 5432
S3_PORT = 9000
S3_KEYS = {"access": "kamu-visual", "secret": "kamu-visual-secret"}
S3_REGION = "us-east-1"


def container_runtime() -> str:
    """docker, or podman when docker is missing."""
    for runtime in ("docker", "podman"):
        if shutil.which(runtime) and subprocess.run([runtime, "version"], capture_output=True).returncode == 0:
            return runtime
    raise RuntimeError("this backend needs docker or podman")


def _run(runtime: str, *args: str) -> str:
    result = subprocess.run([runtime, *args], capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"{runtime} {' '.join(args[:3])}…: {result.stderr.strip()[-600:]}")
    return result.stdout.strip()


def ensure_image(runtime: str, image: str) -> None:
    """Pulls a public image anonymously when it is not present: stored registry credentials, even stale
    ones, would otherwise be sent and refused."""
    if subprocess.run([runtime, "image", "inspect", image], capture_output=True).returncode == 0:
        return
    with tempfile.TemporaryDirectory(prefix="kamu-visual-registry-") as config:
        auth_file = Path(config) / "auth.json"
        auth_file.write_text("{}")
        env = {**os.environ, "DOCKER_CONFIG": config, "REGISTRY_AUTH_FILE": str(auth_file)}
        print(f"pulling {image}", flush=True)
        subprocess.run([runtime, "pull", "-q", image], env=env, check=True, stdout=subprocess.DEVNULL)


def image_created(runtime: str, image: str) -> int:
    """The image's creation time, epoch ms."""
    created = _run(runtime, "image", "inspect", image, "--format", "{{.Created}}")
    # docker prints nanoseconds, which fromisoformat does not take; the clock needs whole minutes only
    seconds = re.match(r"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d", created).group(0)
    return int(dt.datetime.fromisoformat(seconds).replace(tzinfo=dt.UTC).timestamp() * 1000)


def image_id(runtime: str, image: str) -> str:
    return _run(runtime, "image", "inspect", image, "--format", "{{.Id}}").split(":")[-1]


def run_in_image(runtime: str, image: str, *command: str) -> str:
    return _run(runtime, "run", "--rm", "--entrypoint", command[0], image, *command[1:])


class Container:
    """A container created from `image` and started once its files are in place. It runs privileged
    when kamu inside starts engine containers with its own podman, as deployments run it."""

    def __init__(
        self,
        runtime: str,
        image: str,
        command: list[str],
        env: dict,
        network: str,
        name: str | None = None,
        publish: dict[int, int] | None = None,
        workdir: str | None = None,
        privileged: bool = False,
        entrypoint: str | None = None,
    ):
        """`publish` maps host ports, bound on 127.0.0.1, to the container's ports."""
        ensure_image(runtime, image)
        self.runtime = runtime
        args = ["create", "--network", network]
        args += ["--name", name] if name else []
        args += [arg for host, inside in (publish or {}).items() for arg in ("-p", f"127.0.0.1:{host}:{inside}")]
        args += [arg for name, value in env.items() for arg in ("-e", f"{name}={value}")]
        args += ["-w", workdir] if workdir else []
        args += ["--privileged"] if privileged else []
        args += ["--entrypoint", entrypoint] if entrypoint else []
        self.id = _run(runtime, *args, image, *command)

    def copy_in(self, source: Path, target: str) -> None:
        """Into the container's own file system, which is discarded with it."""
        _run(self.runtime, "cp", str(source), f"{self.id}:{target}")

    def exec(self, *command: str) -> str:
        return _run(self.runtime, "exec", self.id, *command)

    def start(self) -> None:
        _run(self.runtime, "start", self.id)

    def running(self) -> bool:
        state = subprocess.run(
            [self.runtime, "inspect", "-f", "{{.State.Running}}", self.id], capture_output=True, text=True
        )
        return state.stdout.strip() == "true"

    def remove(self, log_file: Path | None = None) -> None:
        if log_file:
            logs = subprocess.run([self.runtime, "logs", self.id], capture_output=True, text=True)
            log_file.write_text(logs.stdout + logs.stderr)
        subprocess.run([self.runtime, "rm", "-f", self.id], capture_output=True)


def _wait(what: str, ready, container: Container, seconds: float = 60) -> None:
    """Waits until `ready()`; removes the container when it never is."""
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        if not container.running():
            container.remove()
            raise RuntimeError(f"{what} exited")
        if ready():
            return
        time.sleep(0.5)
    container.remove()
    raise RuntimeError(f"{what} did not become ready in {seconds:.0f} s")


def create_network(runtime: str, name: str) -> str:
    subprocess.run([runtime, "network", "rm", "-f", name], capture_output=True)
    _run(runtime, "network", "create", name)
    return name


def remove_network(runtime: str, name: str) -> None:
    subprocess.run([runtime, "network", "rm", "-f", name], capture_output=True)


def start_postgres(runtime: str, network: str, name: str, host_port: int) -> Container:
    env = {"POSTGRES_USER": DB["user"], "POSTGRES_PASSWORD": DB["password"], "POSTGRES_DB": DB["name"]}
    pg = Container(runtime, POSTGRES_IMAGE, [], env, network, name, {host_port: POSTGRES_PORT})
    pg.start()

    # TCP only: the server that initdb runs first listens on the socket alone
    def ready() -> bool:
        check = ["pg_isready", "-h", "127.0.0.1", "-p", str(POSTGRES_PORT), "-U", DB["user"]]
        return subprocess.run([runtime, "exec", pg.id, *check], capture_output=True).returncode == 0

    _wait("Postgres", ready, pg)
    return pg


def run_migrations(runtime: str, network: str, postgres: str, tag: str, override: Path | None, log_file: Path) -> None:
    """The kamu core migrations of the image `tag`, or those in the directory `override`, as the
    deployments' init container runs them."""
    image = f"{MIGRATIONS_IMAGE}:{tag}"
    ensure_image(runtime, image)
    mounts = ["-v", f"{override.resolve()}:/override:ro"] if override else []
    source = "/override" if override else IMAGE_MIGRATIONS
    url = f"postgres://{DB['user']}:{DB['password']}@{postgres}:{POSTGRES_PORT}/{DB['name']}"
    command = [runtime, "run", "--rm", "--network", network, "-e", f"DB_CONNECTION_STRING={url}"]
    result = subprocess.run(
        [*command, *mounts, "--entrypoint", "/scripts/run-db-migrations.sh", image, source],
        capture_output=True,
        text=True,
    )
    log_file.write_text(result.stdout + result.stderr)
    if result.returncode != 0:
        raise RuntimeError(f"database migrations failed; see {log_file}")


def migrations_tag(core_version: str) -> str:
    """The newest migrations image of a kamu core version: tags are `<core version>.<n>`."""
    token = json.load(urllib.request.urlopen(f"https://ghcr.io/token?scope=repository:{_ghcr_name()}:pull"))["token"]
    request = urllib.request.Request(
        f"https://ghcr.io/v2/{_ghcr_name()}/tags/list?n=10000", headers={"Authorization": f"Bearer {token}"}
    )
    tags = json.load(urllib.request.urlopen(request))["tags"]
    builds = sorted(int(t.rsplit(".", 1)[1]) for t in tags if re.fullmatch(re.escape(core_version) + r"\.\d+", t))
    if not builds:
        raise RuntimeError(f"no {MIGRATIONS_IMAGE} image for kamu core {core_version}")
    return f"{core_version}.{builds[-1]}"


def _ghcr_name() -> str:
    return MIGRATIONS_IMAGE.removeprefix("ghcr.io/")


def start_rustfs(runtime: str, network: str, name: str, port: int, buckets: list[str]) -> Container:
    """rustfs reached as `name` in the network and on `port` here, where its buckets are created."""
    env = {"RUSTFS_ACCESS_KEY": S3_KEYS["access"], "RUSTFS_SECRET_KEY": S3_KEYS["secret"]}
    command = ["server", "--address", f"0.0.0.0:{S3_PORT}", "/data"]
    s3 = Container(runtime, RUSTFS_IMAGE, command, env, network, name, {port: S3_PORT})
    s3.start()

    def ready() -> bool:
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{port}/health", timeout=1)
            return True
        except urllib.error.HTTPError as e:
            # Unavailable while it starts; any other answer means it is serving
            return e.code != 503
        except OSError:
            return False

    _wait("rustfs", ready, s3)
    try:
        for bucket in buckets:
            # Health answers before storage is ready; until then requests get 503
            for attempt in range(60):
                try:
                    _create_bucket(f"127.0.0.1:{port}", bucket)
                    break
                except urllib.error.HTTPError as e:
                    if e.code != 503 or attempt == 59:
                        raise
                    time.sleep(0.5)
    except Exception:
        s3.remove()
        raise
    return s3


def s3_env(endpoint: str) -> dict:
    """What the kamu servers read the S3 credentials and endpoint from."""
    return {
        "AWS_ACCESS_KEY_ID": S3_KEYS["access"],
        "AWS_SECRET_ACCESS_KEY": S3_KEYS["secret"],
        "AWS_REGION": S3_REGION,
        "AWS_ENDPOINT": endpoint,
    }


def _create_bucket(host: str, bucket: str) -> None:
    """`PUT /<bucket>`, signed with AWS Signature Version 4."""
    now = dt.datetime.now(dt.UTC)
    stamp, day = now.strftime("%Y%m%dT%H%M%SZ"), now.strftime("%Y%m%d")
    payload = hashlib.sha256(b"").hexdigest()
    headers = {"host": host, "x-amz-content-sha256": payload, "x-amz-date": stamp}
    signed = ";".join(sorted(headers))
    canonical = "\n".join(
        ["PUT", f"/{bucket}", "", *(f"{k}:{headers[k]}" for k in sorted(headers)), "", signed, payload]
    )
    scope = f"{day}/{S3_REGION}/s3/aws4_request"
    to_sign = "\n".join(["AWS4-HMAC-SHA256", stamp, scope, hashlib.sha256(canonical.encode()).hexdigest()])
    key = ("AWS4" + S3_KEYS["secret"]).encode()
    for part in (day, S3_REGION, "s3", "aws4_request"):
        key = hmac.new(key, part.encode(), hashlib.sha256).digest()
    signature = hmac.new(key, to_sign.encode(), hashlib.sha256).hexdigest()
    authorization = (
        f"AWS4-HMAC-SHA256 Credential={S3_KEYS['access']}/{scope}, SignedHeaders={signed}, Signature={signature}"
    )
    request = urllib.request.Request(
        f"http://{host}/{bucket}", method="PUT", headers={**headers, "authorization": authorization}
    )
    urllib.request.urlopen(request).close()
