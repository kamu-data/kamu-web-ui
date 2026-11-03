# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""The local cache outside the repository: sources and builds by commit, the lock that keeps runs one
at a time, and hashing of the files a cached result depends on."""

from __future__ import annotations

import fcntl
import hashlib
import json
import os
import re
import shutil
import subprocess
from pathlib import Path

from e2e.harness.retention import touch

REPO = Path(__file__).resolve().parents[2]
E2E = REPO / "e2e"
HELPERS = Path(__file__).parent / "helpers"


def cache_dir() -> Path:
    return Path(os.environ.get("KAMU_VISUAL_CACHE", Path.home() / ".cache" / "kamu-ui-visual")).resolve()


def short_hash(*parts: str) -> str:
    return hashlib.sha256("\0".join(parts).encode()).hexdigest()[:12]


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=REPO, capture_output=True, text=True, check=True).stdout.strip()


def files_hash(files: list[str]) -> str:
    """The names and contents of `files`, paths relative to e2e/."""
    digest = hashlib.sha256()
    for name in sorted(files):
        digest.update(name.encode())
        digest.update((E2E / name).read_bytes())
    return digest.hexdigest()[:12]


class Lock:
    """`<cache>/capture.lock`, held for the life of the process. Two captures at once make Chrome render
    glyphs slightly differently, so a second one is refused. The kernel releases the lock when the
    process ends, however it ends."""

    def __init__(self, directory: Path):
        directory.mkdir(parents=True, exist_ok=True)
        self.file = open(directory / "capture.lock", "w")  # noqa: SIM115 (held until the process ends)
        try:
            fcntl.flock(self.file, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise RuntimeError("another capture is running; captures run one at a time") from None


def _run(cmd: list[str], cwd: Path, log_file: Path) -> None:
    log_file.parent.mkdir(parents=True, exist_ok=True)
    with open(log_file, "a") as log:
        result = subprocess.run(cmd, cwd=cwd, stdout=log, stderr=subprocess.STDOUT)
    if result.returncode:
        raise RuntimeError(f"{' '.join(cmd)} failed in {cwd}; see {log_file}")


def source_of(sha: str, directory: Path, with_modules: bool = True) -> Path:
    """The source of commit `sha` in `<cache>/src/<sha>`, extracted with `git archive` (no worktree, no
    branch). `with_modules` adds its node_modules for a build: the working tree's when the lock files
    match, else `npm ci`; they are dropped again after the build."""
    src = directory / "src" / sha
    log_file = directory / "src" / f"{sha}.log"
    if not (src / ".extracted").exists():
        shutil.rmtree(src, ignore_errors=True)
        src.mkdir(parents=True)
        archive = subprocess.Popen(["git", "archive", sha], cwd=REPO, stdout=subprocess.PIPE)
        subprocess.run(["tar", "-x", "-C", str(src)], stdin=archive.stdout, check=True)
        if archive.wait():
            raise RuntimeError(f"git archive {sha} failed")
        (src / ".extracted").touch()
    touch(src)
    if with_modules and not (src / "node_modules").exists():
        if (src / "package-lock.json").read_bytes() == (REPO / "package-lock.json").read_bytes():
            (src / "node_modules").symlink_to(REPO / "node_modules")
        else:
            _run(["npm", "ci"], src, log_file)
        _run(["node", "scripts/set-monaco-version.js"], src, log_file)
    return src


def drop_modules(src: Path) -> None:
    """node_modules of a source tree whose build is done: hundreds of megabytes nothing reads again."""
    modules = src / "node_modules"
    if modules.is_symlink():
        modules.unlink()
    elif modules.exists():
        shutil.rmtree(modules)


def build(src: Path, out: Path, log_file: Path, log=print) -> Path:
    """A production build of `src` in `out`; returns its `browser` folder."""
    browser = out / "browser"
    if (browser / "index.html").exists():
        log(f"cached build {out}")
        touch(out)
        return browser
    shutil.rmtree(out, ignore_errors=True)
    log(f"building {'the working tree' if src == REPO else src} (production)")
    _run(["npx", "ng", "build", "--configuration", "production", "--output-path", str(out)], src, log_file)
    touch(out)
    return browser


def node_json(script: Path, *args: str) -> object:
    result = subprocess.run(["node", str(script), *args], capture_output=True, text=True, check=True)
    return json.loads(result.stdout)


def route_table(root: Path = REPO) -> list[str]:
    return node_json(HELPERS / "routes.mjs", str(root))


def chrome_major(binary: str) -> str:
    version = subprocess.run([binary, "--version"], capture_output=True, text=True, check=True).stdout
    return re.search(r"(\d+)\.", version).group(1)
