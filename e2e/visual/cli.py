# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""`npm run visual -- <command>`: the entry point of the visual comparison."""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import shutil
import signal
import sys
import time
import traceback
from contextlib import redirect_stdout
from datetime import UTC, datetime
from pathlib import Path

from e2e.fixtures.inventory import InventoryError, check_inventory, check_scenario_datasets, load_inventory
from e2e.fixtures.profiles import PROFILES
from e2e.fixtures.seed import ADMIN
from e2e.visual.backend import FLAVORS, BackendChoice, schema_mismatches
from e2e.visual.cache import (
    REPO,
    Lock,
    build,
    cache_dir,
    chrome_major,
    git,
    kit_hash,
    list_baselines,
    route_table,
    short_hash,
    source_of,
    utility_roots,
)
from e2e.visual.capture import capture
from e2e.visual.catalogue import check_scenarios, load_catalogue, select_scenarios
from e2e.visual.cdp import Chrome
from e2e.visual.compare import compare
from e2e.visual.containers import remove_leftovers
from e2e.visual.coverage import coverage_report
from e2e.visual.progress import CaptureProgress, StampedOutput, Timings
from e2e.visual.scenarios import SCENARIOS
from e2e.visual.serve import Served
from e2e.visual.session import Browser, Session, Target

UI_PORTS = {"base": 4310, "head": 4311}
CDP_PORT = 9233
CHROME = os.environ.get("CHROME_BIN", "google-chrome")


def catalogue() -> dict[str, dict]:
    entries = load_catalogue(REPO / "e2e" / "catalogue", PROFILES, route_table())
    check_scenarios(SCENARIOS, entries)
    inventory = load_inventory()
    seeded = [sc for sc in SCENARIOS if entries[sc.entry]["profile"] == "seed"]
    problems = check_inventory(inventory, entries) + check_scenario_datasets(inventory, seeded, ADMIN["login"])
    if problems:
        raise InventoryError(problems)
    return entries


def timestamp() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H-%M-%S")


class Side:
    """One side of a comparison: its source tree and its production build."""

    def __init__(self, ref: str | None, cache: Path, run_dir: Path, log=print):
        if ref is None:
            self.label = f"working tree on {git('rev-parse', '--short', 'HEAD')}"
            self.src = REPO
            self.browser = build(REPO, run_dir / "head-build", run_dir / "build-head.log", log)
        else:
            sha = git("rev-parse", f"{ref}^{{commit}}")
            self.label = sha[:12]
            self.src = source_of(sha, cache)
            self.browser = build(self.src, cache / "builds" / sha, cache / "builds" / f"{sha}.log", log)


def backend_from(args, cache: Path) -> BackendChoice:
    return BackendChoice(args.backend, cache, args.release, args.image, args.bin, args.migrations)


def new_run_dir(cache: Path, prefix: str = "") -> Path:
    """A fresh folder under runs/, named by the time; a run started in the same second gets a suffix."""
    base = cache / "runs" / f"{prefix}{timestamp()}"
    for n in range(1, 100):
        run_dir = base if n == 1 else base.with_name(f"{base.name}-{n}")
        try:
            run_dir.mkdir(parents=True)
            return run_dir
        except FileExistsError:
            continue
    raise RuntimeError(f"cannot create a run folder next to {base}")


def take_lock(cache: Path) -> Lock:
    """The capture lock; holding it, the containers an interrupted run left behind can go."""
    lock = Lock(cache)
    if left := remove_leftovers():
        print(f"removed {left} containers an interrupted run left behind", flush=True)
    return lock


async def compare_command(args) -> None:
    cache = cache_dir()
    _lock = take_lock(cache)
    entries = catalogue()
    selection = select_scenarios(SCENARIOS, entries, args.tier, args.unrated, args.only)
    if not selection:
        raise RuntimeError("no scenario selected: rate catalogue entries, or pass --unrated")
    run_dir = new_run_dir(cache)
    started = time.monotonic()
    with redirect_stdout(StampedOutput(sys.stdout, run_dir / "run.log", started)):
        await compare_run(args, cache, selection, run_dir, started)


async def compare_run(args, cache: Path, selection: dict, run_dir: Path, started: float) -> None:
    # Stdout is a StampedOutput here: what is printed is stamped and kept in run.log
    log = print
    log(f"run {run_dir}")
    base = Side(args.base or git("merge-base", "HEAD", "master"), cache, run_dir, log)
    head = Side(args.head, cache, run_dir, log)
    backend = backend_from(args, cache)
    log(f"base {base.label}, head {head.label}, backend {backend.kind}")
    extra_roots = utility_roots(base.src)
    chrome = chrome_major(CHROME)
    # Once per run: the kit may be edited while a long run goes on
    kit = kit_hash()
    browser = Browser(CHROME, CDP_PORT)
    timings = Timings(cache / "timings.json")

    async def compare_profile(profile_name: str, scenarios: list) -> str:
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
        ]
        baseline = cache / "baselines" / f"{base.label}-{profile_name}-{short_hash(*key_parts)}"
        profile_dir = run_dir / profile_name
        profile_dir.mkdir()
        key = {"base": base.label, "profile": profile_name, "data": data_id, "backend": backend_id}
        key |= {"kit": kit, "chrome": chrome}
        (profile_dir / "key.json").write_text(json.dumps(key, indent=2))

        log(
            f"[{profile_name}] profile {list(selection).index(profile_name) + 1}/{len(selection)}: starting the backend"
        )
        running = profile.open(backend, cache, run_dir)
        log(f"[{profile_name}] {running.describe}")
        server = running.server
        served: list[Served] = []
        try:
            mismatches = schema_mismatches(server.api_url, {"base": base.src, "head": head.src})
            if mismatches:
                raise RuntimeError(
                    f"the {profile_name} backend does not serve the schema the app's GraphQL documents need "
                    "(choose a matching build with --bin, --release or --image):\n  " + "\n  ".join(mismatches)
                )

            base_target, head_target = (
                Target(f"http://localhost:{UI_PORTS[side]}", server.api_url, profile.account, running.now, extra_roots)
                for side in ("base", "head")
            )
            served.append(Served(base.browser, UI_PORTS["base"], server.api_url))
            served.append(Served(head.browser, UI_PORTS["head"], server.api_url))

            failures = []
            if (baseline / "report.json").exists():
                log(f"[{profile_name}] base: cached baseline {baseline}")
            else:
                partial = baseline.with_name(baseline.name + ".partial")
                shutil.rmtree(partial, ignore_errors=True)
                progress = CaptureProgress(f"[{profile_name}] base", profile_name, names, timings, log)
                report = await capture(scenarios, base_target, browser, partial, progress)
                failures += [f"base {r['name']}: {r['error']}" for r in report if r.get("ok") is False]
                # A baseline with failed scenarios is not reused: the next run captures it again
                if not failures:
                    partial.rename(baseline)
            base_dir = baseline if baseline.exists() else baseline.with_name(baseline.name + ".partial")

            head_dir = profile_dir / "head"
            progress = CaptureProgress(f"[{profile_name}] head", profile_name, names, timings, log)
            report = await capture(scenarios, head_target, browser, head_dir, progress)
            failures += [f"head {r['name']}: {r['error']}" for r in report if r.get("ok") is False]

            diff_dir = profile_dir / "diff"
            summary = compare(str(base_dir), str(head_dir), str(diff_dir))

            # Pixel-only differences are rechecked: the scenarios are captured again on head alone
            pixels_only = [name for name, s in summary.items() if s["verdict"] == "pixels-only"]
            recheck = {}
            if pixels_only:
                log(f"[{profile_name}] recheck: {', '.join(pixels_only)}")
                again = profile_dir / "recheck"
                rescenarios = [sc for sc in scenarios if sc.name in pixels_only]
                recheck_names = [sc.name for sc in rescenarios]
                progress = CaptureProgress(f"[{profile_name}] recheck", profile_name, recheck_names, timings, log)
                await capture(rescenarios, head_target, browser, again, progress)
                second = compare(str(base_dir), str(again), str(profile_dir / "recheck-diff"), pixels_only)
                recheck = {name: "noise" if second[name]["verdict"] == "same" else "confirmed" for name in pixels_only}
            return profile_section(profile_name, summary, recheck, failures, diff_dir)
        finally:
            for s in served:
                s.stop()
            server.stop()

    sections, failed = [], []
    for profile_name, scenarios in selection.items():
        try:
            sections.append(await compare_profile(profile_name, scenarios))
        except Exception as e:
            # The other profiles still run and are reported; the run fails at the end
            log(f"[{profile_name}] failed: {e}")
            with open(run_dir / "run.log", "a") as f:
                f.write(traceback.format_exc())
            failed.append(profile_name)
            sections.append(failed_section(profile_name, e))

    minutes = round((time.monotonic() - started) / 60)
    report_file = run_dir / "report.md"
    header = ["# Visual comparison", "", f"- base: {base.label}", f"- head: {head.label}", f"- {minutes} min", ""]
    report_file.write_text("\n".join(header + sections))
    log(f"report: {report_file}")
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
        lines += ["Pixel-only changes, captured again on head alone:", ""]
        for name, result in recheck.items():
            verdict = "noise (same on the recheck)" if result == "noise" else "confirmed"
            lines.append(f"- {name}: {summary[name]['pixels']} px, {verdict}")
        lines.append("")
    if failures:
        lines += ["Failed scenarios:", "", *[f"- {f}" for f in failures], ""]
    lines += [f"Comparison report: {diff_dir / 'report.md'}", ""]
    return "\n".join(lines)


async def probe_command(args) -> None:
    cache = cache_dir()
    _lock = take_lock(cache)
    profile = PROFILES[args.profile]
    run_dir = new_run_dir(cache, "probe-")
    browser_dir = Path(args.build).resolve() if args.build else build(REPO, run_dir / "build", run_dir / "build.log")
    running = profile.open(backend_from(args, cache), cache, run_dir)
    server = running.server
    served, chrome = None, None
    try:
        served = Served(browser_dir, UI_PORTS["head"], server.api_url)
        chrome = await Chrome.launch(run_dir / ".chrome-profile", CDP_PORT, CHROME)
        cdp = await chrome.open_page()
        target = Target(f"http://localhost:{UI_PORTS['head']}", server.api_url, profile.account, running.now)
        s = Session(cdp, target)
        await s.init()
        await s.log_in()
        for i, url in enumerate(args.paths, 1):
            await s.goto_full(url)
            await asyncio.sleep(1.5)
            await s.idle()
            await s.lib()
            print(f"== {url} -> {await s.eval('location.pathname + location.search')}")
            print((await s.eval("window.__cap.text()"))[:700])
            print(f"components: {' '.join(await s.eval('window.__cap.components()'))}")
            await s.screenshot(run_dir / f"probe-{i:02d}.png")
        await cdp.close()
    finally:
        if chrome:
            await chrome.close()
        if served:
            served.stop()
        server.stop()
    print(f"screenshots: {run_dir}")


def latest_run(cache: Path) -> Path | None:
    """The newest comparison run with a head capture in it."""
    runs = cache / "runs"
    candidates = sorted(runs.iterdir(), reverse=True) if runs.exists() else []
    return next((r for r in candidates if any(r.glob("*/head/report.json"))), None)


def check_command(_args) -> None:
    """What CI runs: the catalogue, the scenarios and the seed inventory agree with each other and with
    the app's routes. Needs no browser and no backend."""
    entries = catalogue()
    inventory = load_inventory()
    fixtures = len(inventory["accounts"]) + len(inventory["datasets"])
    print(f"e2e consistent: {len(entries)} catalogue entries, {len(SCENARIOS)} scenarios, {fixtures} seed fixtures")


def coverage_command(_args) -> None:
    cache = cache_dir()
    run = latest_run(cache)
    report_file = (run or cache) / "coverage.md"
    report_file.parent.mkdir(parents=True, exist_ok=True)
    report_file.write_text(coverage_report(catalogue(), SCENARIOS, route_table(), run))
    print(f"coverage: {report_file}")


def cache_command(args) -> None:
    baselines = list_baselines(cache_dir())
    if args.action == "list":
        for b in baselines:
            when = datetime.fromtimestamp(b["mtime"], UTC).strftime("%Y-%m-%d %H:%M")
            print(f"{b['mb']} MB\t{when}\t{b['name']}")
    else:
        for b in baselines[args.keep :]:
            shutil.rmtree(b["dir"])
            print(f"removed {b['name']} ({b['mb']} MB)")


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="npm run visual --",
        description="Visual comparison of Kamu Web UI builds. Env: KAMU_VISUAL_CACHE (default "
        "~/.cache/kamu-ui-visual), CHROME_BIN (default google-chrome).",
    )

    def backend_options(command: argparse.ArgumentParser) -> None:
        group = command.add_argument_group("backend", "default: the backend kind's binary on the shell's PATH")
        group.add_argument("--backend", choices=sorted(FLAVORS), default="cli", help="kamu-cli or kamu-api-server")
        build = group.add_mutually_exclusive_group()
        build.add_argument("--release", metavar="VERSION", help="a GitHub release, downloaded into the cache")
        build.add_argument("--image", metavar="TAG|REF", help="a published image: a tag of the kind's image, or a ref")
        build.add_argument("--bin", metavar="PATH", help="a local build")
        group.add_argument(
            "--migrations", metavar="DIR", help="api-server: Postgres migrations instead of the published ones"
        )

    commands = p.add_subparsers(dest="command", required=True)

    c = commands.add_parser("compare", help="capture the base (cached) and the head, then compare them")
    c.add_argument("--base", help="base commit (default: the merge-base with master)")
    c.add_argument("--head", help="head commit (default: the working tree)")
    c.add_argument("--tier", choices=["smoke", "full"], default="full", help="full includes smoke")
    c.add_argument("--unrated", action="store_true", help="also run catalogue entries without a tier")
    c.add_argument("--only", help="only scenarios whose name contains this text, or one of a comma-separated list")
    backend_options(c)
    c.set_defaults(run=lambda a: asyncio.run(compare_command(a)))

    pr = commands.add_parser("probe", help="print the text and components of pages, and save screenshots")
    pr.add_argument("paths", nargs="+")
    pr.add_argument("--profile", choices=sorted(PROFILES), default="seed")
    pr.add_argument("--build", help="an existing build's browser folder (default: build the working tree)")
    backend_options(pr)
    pr.set_defaults(run=lambda a: asyncio.run(probe_command(a)))

    ch = commands.add_parser("check", help="the catalogue, scenarios and seed inventory agree with the app")
    ch.set_defaults(run=check_command)

    cv = commands.add_parser("coverage", help="routes, catalogue entries and components no scenario covers")
    cv.set_defaults(run=coverage_command)

    ca = commands.add_parser("cache", help="cached baselines")
    ca.add_argument("action", choices=["list", "prune"])
    ca.add_argument("--keep", type=int, default=3, help="prune: how many of the newest to keep")
    ca.set_defaults(run=cache_command)
    return p


def main() -> int:
    args = parser().parse_args()
    # A plain `kill` unwinds like Ctrl+C, so the backend's containers and processes are stopped
    signal.signal(signal.SIGTERM, lambda *_: sys.exit(143))
    try:
        args.run(args)
    except Exception as e:
        print(e, file=sys.stderr)
        return 1
    return 0
