# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""Scenario runs in parallel processes: the scenarios are split into shards, each shard is run by a
process of its own with its own Chrome, then the shards' output is merged into one folder. The split
depends only on the scenario names and the shard count, so two runs of the same scenarios (the base
and the head of a comparison) always run the same shards in the same order."""

from __future__ import annotations

import asyncio
import json
import multiprocessing
import os
import shutil
import threading
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from e2e.harness.impact import chains
from e2e.harness.session import Browser, Target

# Shards a side is split into, whatever the number of workers: the split is part of the baseline key,
# so a cached base stays valid however loaded the machine is
SHARDS = 8


def default_jobs() -> int:
    """One capture per four cores the machine has free now (Chrome, the page and the backend each
    want one), at most 8: an overloaded machine shades glyphs differently."""
    free = (os.cpu_count() or 4) - os.getloadavg()[0]
    return max(1, min(8, int(free) // 4))


FIRST_CDP_PORT = 9240


def split(scenarios: list, count: int) -> list[list]:
    """`scenarios` dealt round-robin into at most `count` shards, keeping each in list order. A
    scenario that `follows` another stays in its shard, right after the scenarios before it."""
    group_of = {name: min(group) for group in chains(scenarios) for name in group}
    units: dict[str, list] = {}
    for sc in scenarios:
        units.setdefault(group_of[sc.name], []).append(sc)
    parts: list[list] = [[] for _ in range(max(1, min(count, len(units))))]
    for i, unit in enumerate(units.values()):
        parts[i % len(parts)].extend(unit)
    order = {sc.name: i for i, sc in enumerate(scenarios)}
    return [sorted(part, key=lambda sc: order[sc.name]) for part in parts]


def _run_shard(work, names: list[str], target: Target, binary: str, cdp_port: int, out_dir: Path, events) -> list[dict]:
    """In a worker process: the scenarios are looked up by name, as their steps cannot be sent across."""
    from e2e.scenarios import SCENARIOS

    by_name = {sc.name: sc for sc in SCENARIOS}
    return asyncio.run(work([by_name[n] for n in names], target, Browser(binary, cdp_port), out_dir, events.put))


def _merge(parts: list[Path], out_dir: Path, reports: list[list[dict]], scenarios: list) -> list[dict]:
    """The shards' files moved into `out_dir`, their reports joined in list order."""
    (out_dir / "styles").mkdir(parents=True, exist_ok=True)
    for part in parts:
        for file in part.rglob("*"):
            if file.is_file() and file.name != "report.json" and ".chrome-profile" not in file.parts:
                target = out_dir / file.relative_to(part)
                target.parent.mkdir(parents=True, exist_ok=True)
                file.replace(target)
        shutil.rmtree(part, ignore_errors=True)
    entries = {e["name"]: e for report in reports for e in report if "name" in e}
    errors = [err for report in reports for e in report for err in e.get("consoleErrors", [])]
    report = [entries[sc.name] for sc in scenarios if sc.name in entries] + [{"consoleErrors": errors}]
    (out_dir / "report.json").write_text(json.dumps(report, indent=2))
    return report


class Pool:
    """`jobs` worker processes shared by every capture of a run, each given a CDP port of its own."""

    def __init__(self, jobs: int, chrome_binary: str):
        self.jobs = jobs
        self.binary = chrome_binary
        self.executor = ProcessPoolExecutor(jobs, mp_context=multiprocessing.get_context("spawn"))
        self.manager = multiprocessing.get_context("spawn").Manager()
        self.ports: asyncio.Queue[int] | None = None

    def close(self) -> None:
        """Stops the workers, running or not; each closes its Chrome on SIGTERM."""
        for process in list(getattr(self.executor, "_processes", {}).values()):
            process.terminate()
        self.executor.shutdown(wait=True, cancel_futures=True)
        self.manager.shutdown()

    async def run(
        self, work, scenarios: list, target: Target, out_dir: Path, done, shards: int | None = None
    ) -> list[dict]:
        """`work(scenarios, target, browser, out_dir, done)`, a module-level coroutine function that returns
        a report, run on `shards` (default `SHARDS`) by the workers; `done` hears of each scenario as its
        shard finishes it. Returns the merged report."""
        loop = asyncio.get_running_loop()
        if self.ports is None:
            self.ports = asyncio.Queue()
            for port in range(FIRST_CDP_PORT, FIRST_CDP_PORT + self.jobs):
                self.ports.put_nowait(port)
        events = self.manager.Queue()

        def forward() -> None:
            while (entry := events.get()) is not None:
                loop.call_soon_threadsafe(done, entry)

        forwarder = threading.Thread(target=forward, daemon=True)
        forwarder.start()
        parts = split(scenarios, shards or SHARDS)
        dirs = [out_dir / f"shard-{i}" for i in range(len(parts))]

        async def run_part(part: list, part_dir: Path) -> list[dict]:
            port = await self.ports.get()
            try:
                names = [sc.name for sc in part]
                return await loop.run_in_executor(
                    self.executor, _run_shard, work, names, target, self.binary, port, part_dir, events
                )
            finally:
                self.ports.put_nowait(port)

        try:
            reports = await asyncio.gather(*(run_part(part, d) for part, d in zip(parts, dirs, strict=True)))
        finally:
            events.put(None)
            await asyncio.to_thread(forwarder.join)
        return _merge(dirs, out_dir, reports, scenarios)
