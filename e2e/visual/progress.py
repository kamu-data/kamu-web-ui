# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""How far a run has got: the elapsed time on every line it prints, and for each captured scenario its
position and an estimate of what is left, from the durations the previous runs recorded in the cache."""

from __future__ import annotations

import io
import json
import math
import time
from collections.abc import Callable
from pathlib import Path
from typing import TextIO


def clock(seconds: float) -> str:
    minutes, secs = divmod(int(seconds), 60)
    hours, minutes = divmod(minutes, 60)
    return f"{hours}:{minutes:02d}:{secs:02d}" if hours else f"{minutes}:{secs:02d}"


def about(seconds: float | None) -> str:
    if seconds is None:
        return ""
    return "<1 min" if seconds < 60 else f"~{math.ceil(seconds / 60)} min"


def status_line(entry: dict) -> str:
    status = "ok  " if entry["ok"] else "FAIL"
    details = [str(entry[k]) for k in ("elements", "error") if k in entry]
    return " ".join([status, entry["name"], *details])


class Timings:
    """Seconds per `<profile>/<scenario>`, kept from one run to the next. Base and head take about the
    same time, so they share a key."""

    def __init__(self, file: Path):
        self.file = file
        try:
            self.seconds: dict[str, float] = json.loads(file.read_text())
        except (FileNotFoundError, ValueError):
            self.seconds = {}

    def estimate(self, keys: list[str], fallback: float | None = None) -> float | None:
        """The sum of the recorded durations; a key never recorded counts as `fallback`, and without one
        there is no estimate."""
        known = [self.seconds.get(k, fallback) for k in keys]
        return None if None in known else sum(known)

    def record(self, key: str, seconds: float) -> None:
        self.seconds[key] = seconds
        self.file.write_text(json.dumps(self.seconds, indent=1, sort_keys=True))


class CaptureProgress:
    """Called with each scenario's report entry as it finishes; logs `<label> n/N <status>, ~m min left`."""

    def __init__(self, label: str, profile: str, names: list[str], timings: Timings, log: Callable[[str], None]):
        self.label, self.timings, self.log = label, timings, log
        self.keys = [f"{profile}/{name}" for name in names]
        self.taken: list[float] = []
        estimate = about(timings.estimate(self.keys))
        log(f"{label}: capturing {len(names)} scenarios" + (f", {estimate}" if estimate else ""))

    def __call__(self, entry: dict) -> None:
        n = len(self.taken)
        self.taken.append(entry["seconds"])
        self.timings.record(self.keys[n], entry["seconds"])
        rest = self.keys[n + 1 :]
        left = about(self.timings.estimate(rest, sum(self.taken) / len(self.taken))) if rest else ""
        line = f"{self.label} {n + 1}/{len(self.keys)} {status_line(entry)}"
        self.log(line + (f", {left} left" if left else ""))


class StampedOutput(io.TextIOBase):
    """Stdout for the length of a run: each line gets the time since `started` in front and is copied to
    `log_file`, whichever module printed it."""

    def __init__(self, stream: TextIO, log_file: Path, started: float):
        self.stream, self.log_file, self.started = stream, log_file, started
        self.pending = ""

    def write(self, text: str) -> int:
        *lines, self.pending = (self.pending + text).split("\n")
        if lines:
            stamped = "".join(f"{clock(time.monotonic() - self.started)} {line}\n" for line in lines)
            self.stream.write(stamped)
            self.stream.flush()
            with open(self.log_file, "a") as f:
                f.write(stamped)
        return len(text)
