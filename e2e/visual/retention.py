# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""What the cache keeps. An entry a run reuses is marked as used; a prune at the end of every compare
drops what has gone unused for a while, keeps the newest runs, and holds the whole cache under a size
ceiling. Docker images count only when the kit pulled them, and pinned ones are kept."""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path

KEEP_RUNS = 10
MAX_AGE_DAYS = 14
DEFAULT_MAX = "10G"
USED = ".used"
IMAGES = "images.json"
DAY = 86400


def touch(entry: Path) -> None:
    """Marks a cache entry as used now."""
    if entry.is_dir():
        (entry / USED).touch()


def parse_size(text: str) -> int:
    """`10G`, `500M`, `2048K` or bytes."""
    found = re.fullmatch(r"(\d+(?:\.\d+)?)([KMG]?)B?", text.strip().upper())
    if not found:
        raise ValueError(f"not a size: {text}")
    return int(float(found.group(1)) * 1024 ** " KMG".index(found.group(2) or " "))


def max_bytes() -> int:
    return parse_size(os.environ.get("KAMU_VISUAL_CACHE_MAX", DEFAULT_MAX))


def size_of(path: Path) -> int:
    if path.is_symlink() or path.is_file():
        return path.lstat().st_size
    return sum(f.lstat().st_size for f in path.rglob("*") if f.is_file() and not f.is_symlink())


@dataclass
class Entry:
    kind: str
    name: str
    paths: list[Path]
    size: int
    last_use: float


def _last_use(path: Path) -> float:
    marker = path / USED
    return (marker if marker.exists() else path).stat().st_mtime


def entries(cache: Path) -> list[Entry]:
    """Every entry of the cache, a commit's sources and build counted as one."""
    found: list[Entry] = []

    def add(kind: str, path: Path) -> None:
        found.append(Entry(kind, path.name, [path], size_of(path), _last_use(path)))

    for kind, folder in (
        ("run", "runs"),
        ("baseline", "baselines"),
        ("workspace", "workspaces"),
        ("release", "backends"),
    ):
        for path in sorted((cache / folder).glob("*")) if (cache / folder).exists() else []:
            if path.is_dir():
                add(kind, path)
    commits = {p.name for folder in ("builds", "src") for p in (cache / folder).glob("*") if p.is_dir()}
    for sha in sorted(commits):
        paths = [p for p in (cache / "builds" / sha, cache / "src" / sha) if p.exists()]
        paths += [p for p in (cache / "builds" / f"{sha}.log", cache / "src" / f"{sha}.log") if p.exists()]
        dirs = [p for p in paths if p.is_dir()]
        found.append(Entry("build", sha, paths, sum(map(size_of, paths)), max(map(_last_use, dirs))))
    return found


def plan(
    found: list[Entry], now: float, since: float, keep_runs: int, max_age_days: float, ceiling: int
) -> list[Entry]:
    """The entries to delete. Anything used at or after `since` (the running compare's start) stays;
    then unfinished entries go, runs beyond the newest `keep_runs`, entries unused for `max_age_days`,
    and, while the rest is over `ceiling`, the least recently used, runs first."""
    kept = [e for e in found if e.last_use < since]
    doomed = [e for e in kept if e.name.endswith(".partial")]
    runs = sorted((e for e in found if e.kind == "run"), key=lambda e: e.name, reverse=True)
    doomed += [e for e in runs[keep_runs:] if e in kept and e not in doomed]
    doomed += [e for e in kept if e.kind != "run" and now - e.last_use > max_age_days * DAY and e not in doomed]
    total = sum(e.size for e in found) - sum(e.size for e in doomed)
    rest = sorted((e for e in kept if e not in doomed), key=lambda e: (e.kind != "run", e.last_use))
    for entry in rest:
        if total <= ceiling:
            break
        doomed.append(entry)
        total -= entry.size
    return doomed


def remove(entry: Entry) -> None:
    for path in entry.paths:
        if path.is_dir() and not path.is_symlink():
            shutil.rmtree(path, ignore_errors=True)
        else:
            path.unlink(missing_ok=True)


def note_image(cache: Path, image: str, pulled: bool) -> None:
    """Records the use of an image; one the kit did not pull is never recorded, so never removed."""
    file = cache / IMAGES
    try:
        known = json.loads(file.read_text())
    except (FileNotFoundError, ValueError):
        known = {}
    if pulled or image in known:
        known[image] = time.time()
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(json.dumps(known, indent=1, sort_keys=True))


def stale_images(cache: Path, now: float, max_age_days: float, pinned: set[str]) -> list[str]:
    try:
        known = json.loads((cache / IMAGES).read_text())
    except (FileNotFoundError, ValueError):
        return []
    return sorted(i for i, used in known.items() if i not in pinned and now - used > max_age_days * DAY)


def remove_image(cache: Path, runtime: str, image: str) -> bool:
    """Removes an image the kit pulled, unless a container still uses it; forgets it once it is gone."""
    gone = subprocess.run([runtime, "rmi", image], capture_output=True).returncode == 0
    if gone or subprocess.run([runtime, "image", "inspect", image], capture_output=True).returncode != 0:
        known = json.loads((cache / IMAGES).read_text())
        known.pop(image, None)
        (cache / IMAGES).write_text(json.dumps(known, indent=1, sort_keys=True))
        return True
    return False
