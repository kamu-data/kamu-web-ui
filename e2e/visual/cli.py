# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""`npm run visual -- compare`: the visual comparison of two builds."""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import shutil
import sys
import time
import traceback
from contextlib import redirect_stdout
from pathlib import Path

from e2e.fixtures.profiles import PROFILES
from e2e.harness.backend import schema_mismatches
from e2e.harness.cache import cache_dir, chrome_major, git, short_hash
from e2e.harness.catalogue import select_scenarios
from e2e.harness.cli import (
    CHROME,
    UI_PORT,
    Side,
    backend_from,
    backend_options,
    catalogue,
    new_run_dir,
    prune_cache,
    run,
    take_lock,
)
from e2e.harness.impact import Records, affected, changed_files
from e2e.harness.parallel import SHARDS, Pool, default_jobs
from e2e.harness.progress import CaptureProgress, StampedOutput, Timings
from e2e.harness.retention import touch
from e2e.harness.serve import Served
from e2e.harness.session import Target
from e2e.scenarios import SCENARIOS
from e2e.visual.capture import CAPTURE_FILES, capture, capture_hash, page_script, utility_roots
from e2e.visual.compare import compare


async def compare_command(args) -> None:
    cache = cache_dir()
    _lock = take_lock(cache)
    entries = catalogue()
    selection = select_scenarios(SCENARIOS, entries, args.tier, args.unrated, args.only)
    if not selection:
        raise RuntimeError("no scenario selected: rate catalogue entries, or pass --unrated")
    run_dir = new_run_dir(cache)
    started, since = time.monotonic(), time.time()
    with redirect_stdout(StampedOutput(sys.stdout, run_dir / "run.log", started)):
        await compare_run(args, cache, selection, run_dir, started, since)


async def compare_run(args, cache: Path, selection: dict, run_dir: Path, started: float, since: float) -> None:
    # Stdout is a StampedOutput here: what is printed is stamped and kept in run.log
    log = print
    log(f"run {run_dir}")
    base = Side(args.base or git("merge-base", "HEAD", "master"), cache, run_dir, log)
    head = Side(args.head, cache, run_dir, log)
    backend = backend_from(args, cache)
    log(f"base {base.label}, head {head.label}, backend {backend.kind}")
    records = Records(cache / "components.json")
    if args.all or args.only:
        reason = "--only" if args.only else "--all"
    else:
        kit_paths = (*(f"e2e/{f}" for f in CAPTURE_FILES), "e2e/fixtures/")
        selection, reason = affected(selection, changed_files(base.sha, head.sha), head.src, records, kit_paths)
    selected = sum(len(scenarios) for scenarios in selection.values())
    log(f"{selected} scenarios selected: {reason}")
    extra_roots = utility_roots(base.src)
    script = page_script(extra_roots)
    chrome = chrome_major(CHROME)
    # Once per run: the kit may be edited while a long run goes on
    kit = capture_hash()
    timings = Timings(cache / "timings.json")
    args.jobs = args.jobs or default_jobs()
    pool = Pool(args.jobs, CHROME)
    log(f"{args.jobs} capture processes, load {os.getloadavg()[0]:.1f} on {os.cpu_count()} cores")

    async def compare_profile(index: int, profile_name: str, scenarios: list) -> str:
        profile = PROFILES[profile_name]
        names = [sc.name for sc in scenarios]
        data_id, backend_id = profile.data_id(backend), profile.backend_id(backend)
        key_parts = [
            data_id,
            backend_id,
            kit,
            chrome,
            "production",
            ",".join(names),
            ",".join(extra_roots),
            # The shards decide which scenarios share a tab, so both sides need the same split
            f"shards={SHARDS}",
        ]
        baseline = cache / "baselines" / f"{base.label}-{profile_name}-{short_hash(*key_parts)}"
        profile_dir = run_dir / profile_name
        profile_dir.mkdir()
        key = {"base": base.label, "profile": profile_name, "data": data_id, "backend": backend_id}
        key |= {"kit": kit, "chrome": chrome, "shards": SHARDS}
        (profile_dir / "key.json").write_text(json.dumps(key, indent=2))

        log(f"[{profile_name}] starting the backend")
        running = await asyncio.to_thread(profile.open, backend, cache, run_dir)
        log(f"[{profile_name}] {running.describe}")
        server = running.server
        served: list[Served] = []
        try:
            trees = {"base": base.src, "head": head.src}
            mismatches = await asyncio.to_thread(schema_mismatches, server.api_url, trees)
            if mismatches:
                raise RuntimeError(
                    f"the {profile_name} backend does not serve the schema the app's GraphQL documents need "
                    f"({profile.schema_hint}):\n  " + "\n  ".join(mismatches)
                )

            # Each profile serves both builds on ports of its own, pointed at its backend
            ports = {"base": UI_PORT + 2 * index, "head": UI_PORT + 2 * index + 1}
            base_target, head_target = (
                Target(f"http://localhost:{ports[side]}", server.api_url, profile.account, running.now, script)
                for side in ("base", "head")
            )
            served.append(Served(base.browser, ports["base"], server.api_url))
            served.append(Served(head.browser, ports["head"], server.api_url))

            def progress(side: str, side_names: list[str]) -> CaptureProgress:
                return CaptureProgress(f"[{profile_name}] {side}", profile_name, side_names, timings, log, args.jobs)

            failures = []
            partial = baseline.with_name(baseline.name + ".partial")
            head_dir = profile_dir / "head"

            async def capture_base() -> None:
                shutil.rmtree(partial, ignore_errors=True)
                report = await pool.run(capture, scenarios, base_target, partial, progress("base", names))
                records.update("base", profile_name, report)
                failures.extend(f"base {r['name']}: {r['error']}" for r in report if r.get("ok") is False)
                # A baseline with failed scenarios is not reused: the next run captures it again
                if not any(r.get("ok") is False for r in report):
                    partial.rename(baseline)

            async def capture_head() -> None:
                report = await pool.run(capture, scenarios, head_target, head_dir, progress("head", names))
                records.update("head", profile_name, report)
                failures.extend(f"head {r['name']}: {r['error']}" for r in report if r.get("ok") is False)

            if (baseline / "report.json").exists():
                log(f"[{profile_name}] base: cached baseline {baseline}")
                touch(baseline)
                await capture_head()
            else:
                await asyncio.gather(capture_base(), capture_head())
            base_dir = baseline if baseline.exists() else partial

            diff_dir = profile_dir / "diff"
            summary = await asyncio.to_thread(compare, str(base_dir), str(head_dir), str(diff_dir))

            # Pixel-only differences are rechecked: both sides captured again, one after the other in one
            # process, as either side's first capture may have run on a loaded machine
            pixels_only = [name for name, s in summary.items() if s["verdict"] == "pixels-only"]
            recheck = {}
            if pixels_only:
                log(f"[{profile_name}] recheck: {', '.join(pixels_only)}")
                rescenarios = [sc for sc in scenarios if sc.name in pixels_only]
                renames = [sc.name for sc in rescenarios]
                again_base, again_head = profile_dir / "recheck-base", profile_dir / "recheck-head"
                await pool.run(
                    capture, rescenarios, base_target, again_base, progress("recheck base", renames), shards=1
                )
                await pool.run(
                    capture, rescenarios, head_target, again_head, progress("recheck head", renames), shards=1
                )
                second = await asyncio.to_thread(
                    compare, str(again_base), str(again_head), str(profile_dir / "recheck-diff"), pixels_only
                )
                recheck = {name: "noise" if second[name]["verdict"] == "same" else "confirmed" for name in pixels_only}
            return profile_section(profile_name, summary, recheck, failures, diff_dir)
        finally:
            for s in served:
                s.stop()
            server.stop()

    async def profile_or_failure(index: int, profile_name: str, scenarios: list) -> tuple[str, bool]:
        try:
            return await compare_profile(index, profile_name, scenarios), True
        except Exception as e:
            # The other profiles still run and are reported; the run fails at the end
            log(f"[{profile_name}] failed: {e}")
            with open(run_dir / "run.log", "a") as f:
                f.write(traceback.format_exc())
            return failed_section(profile_name, e), False

    try:
        results = await asyncio.gather(
            *(profile_or_failure(i, name, scenarios) for i, (name, scenarios) in enumerate(selection.items()))
        )
    finally:
        await asyncio.to_thread(pool.close)
        # The working tree's build is served for this run only
        shutil.rmtree(run_dir / "head-build", ignore_errors=True)
    sections = [section for section, _ in results]
    failed = [name for name, (_, ok) in zip(selection, results, strict=True) if not ok]

    minutes = round((time.monotonic() - started) / 60)
    report_file = run_dir / "report.md"
    header = ["# Visual comparison", "", f"- base: {base.label}", f"- head: {head.label}"]
    header += [f"- {selected} scenarios: {reason}", f"- {minutes} min", ""]
    report_file.write_text("\n".join(header + sections))
    log(f"report: {report_file}")
    prune_cache(cache, since, log)
    if failed:
        raise RuntimeError(f"{len(failed)} of {len(selection)} profiles failed: {', '.join(failed)}")


def failed_section(profile: str, error: Exception) -> str:
    return "\n".join([f"## {profile}", "", "The profile failed:", "", "```", str(error), "```", ""])


def profile_section(profile: str, summary: dict, recheck: dict, failures: list[str], diff_dir: Path) -> str:
    def count(verdict: str) -> int:
        return sum(1 for s in summary.values() if s["verdict"] == verdict)

    lines = [
        f"## {profile}",
        "",
        f"{len(summary)} scenarios: {count('same')} same, {count('changed')} with style changes, "
        f"{count('pixels-only')} with pixel-only changes, {count('missing')} missing.",
        "",
    ]
    changed = [(name, s) for name, s in summary.items() if s["verdict"] == "changed"]
    if changed:
        lines += ["Style changes (details in the comparison report):", ""]
        lines += [f"- {name}: {s['styleDiffs']} style diffs, {s['pixels']} px" for name, s in changed]
        lines.append("")
    if recheck:
        lines += ["Pixel-only changes, both sides captured again one after the other:", ""]
        for name, result in recheck.items():
            verdict = "noise (same on the recheck)" if result == "noise" else "confirmed"
            lines.append(f"- {name}: {summary[name]['pixels']} px, {verdict}")
        lines.append("")
    if failures:
        lines += ["Failed scenarios:", "", *[f"- {f}" for f in failures], ""]
    lines += [f"Comparison report: {diff_dir / 'report.md'}", ""]
    return "\n".join(lines)


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="npm run visual --",
        description="Visual comparison of Kamu Web UI builds; probe, check, coverage and cache are under "
        "npm run e2e. Env: KAMU_VISUAL_CACHE (default ~/.cache/kamu-ui-visual), CHROME_BIN (default google-chrome).",
    )

    commands = p.add_subparsers(dest="command", required=True)

    c = commands.add_parser("compare", help="capture the base (cached) and the head, then compare them")
    c.add_argument("--base", help="base commit (default: the merge-base with master)")
    c.add_argument("--head", help="head commit (default: the working tree)")
    c.add_argument("--tier", choices=["smoke", "full"], default="full", help="full includes smoke")
    c.add_argument("--unrated", action="store_true", help="also run catalogue entries without a tier")
    c.add_argument("--only", help="only scenarios whose name contains this text, or one of a comma-separated list")
    c.add_argument("--all", action="store_true", help="every selected scenario, not only those the change reaches")
    c.add_argument("--jobs", type=int, help="capture processes (default: a quarter of the free cores, at most 8)")
    backend_options(c)
    c.set_defaults(run=lambda a: asyncio.run(compare_command(a)))
    return p


def main() -> int:
    return run(parser())
