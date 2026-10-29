# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""The local cache outside the repository: builds by commit, workspaces by data and backend, baselines
by everything a capture depends on, and the lock that keeps captures one at a time."""

from __future__ import annotations

import fcntl
import hashlib
import json
import os
import re
import shutil
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
HELPERS = Path(__file__).parent / "helpers"
# Files whose content decides what a capture records
KIT_FILES = ["*.py", "page-lib.js", "helpers/*.mjs"]


def cache_dir() -> Path:
    return Path(os.environ.get("KAMU_VISUAL_CACHE", Path.home() / ".cache" / "kamu-ui-visual")).resolve()


def short_hash(*parts: str) -> str:
    return hashlib.sha256("\0".join(parts).encode()).hexdigest()[:12]


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=REPO, capture_output=True, text=True, check=True).stdout.strip()


def kit_hash() -> str:
    """The capture code under e2e/visual; the comparer is left out, since it does not change a capture."""
    digest = hashlib.sha256()
    visual = Path(__file__).parent
    files = sorted({f for pattern in KIT_FILES for f in visual.glob(pattern)} - {visual / "compare.py"})
    for file in files:
        digest.update(file.relative_to(visual).as_posix().encode())
        digest.update(file.read_bytes())
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


def source_of(sha: str, directory: Path) -> Path:
    """The source of commit `sha` in `<cache>/src/<sha>`, extracted with `git archive` (no worktree, no
    branch). Its node_modules is the working tree's when the lock files match, else `npm ci`."""
    src = directory / "src" / sha
    if (src / ".extracted").exists():
        return src
    shutil.rmtree(src, ignore_errors=True)
    src.mkdir(parents=True)
    log_file = directory / "src" / f"{sha}.log"
    archive = subprocess.Popen(["git", "archive", sha], cwd=REPO, stdout=subprocess.PIPE)
    subprocess.run(["tar", "-x", "-C", str(src)], stdin=archive.stdout, check=True)
    if archive.wait():
        raise RuntimeError(f"git archive {sha} failed")
    if (src / "package-lock.json").read_bytes() == (REPO / "package-lock.json").read_bytes():
        (src / "node_modules").symlink_to(REPO / "node_modules")
    else:
        _run(["npm", "ci"], src, log_file)
    _run(["node", "scripts/set-monaco-version.js"], src, log_file)
    (src / ".extracted").touch()
    return src


def build(src: Path, out: Path, log_file: Path) -> Path:
    """A production build of `src` in `out`; returns its `browser` folder."""
    browser = out / "browser"
    if (browser / "index.html").exists():
        return browser
    shutil.rmtree(out, ignore_errors=True)
    print(f"building {'the working tree' if src == REPO else src} (production)")
    _run(["npx", "ng", "build", "--configuration", "production", "--output-path", str(out)], src, log_file)
    return browser


def node_json(helper: str, *args: str) -> object:
    result = subprocess.run(["node", str(HELPERS / helper), *args], capture_output=True, text=True, check=True)
    return json.loads(result.stdout)


def route_table(root: Path = REPO) -> list[str]:
    return node_json("routes.mjs", str(root))


def utility_roots(src: Path) -> list[str]:
    """The class selectors the tree's global utility stylesheet compiles to, as snapshot roots."""
    return node_json("utility-roots.mjs", str(src), str(REPO / "node_modules"))


def chrome_major(binary: str) -> str:
    version = subprocess.run([binary, "--version"], capture_output=True, text=True, check=True).stdout
    return re.search(r"(\d+)\.", version).group(1)


def list_baselines(directory: Path) -> list[dict]:
    """Cached baselines, newest first, with their size in MB."""
    base = directory / "baselines"
    if not base.exists():
        return []
    out = []
    for d in base.iterdir():
        size = sum(f.stat().st_size for f in d.rglob("*") if f.is_file())
        out.append({"name": d.name, "dir": d, "mtime": d.stat().st_mtime, "mb": round(size / 1e6)})
    return sorted(out, key=lambda b: b["mtime"], reverse=True)
