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
import sys
import time
from datetime import UTC, datetime
from pathlib import Path

from e2e.fixtures.profiles import PROFILES
from e2e.visual.backend import backend_id, schema_mismatches
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
from e2e.visual.coverage import coverage_report
from e2e.visual.scenarios import SCENARIOS
from e2e.visual.serve import Served
from e2e.visual.session import Browser, Session, Target

UI_PORTS = {"base": 4310, "head": 4311}
CDP_PORT = 9233
CHROME = os.environ.get("CHROME_BIN", "google-chrome")


def catalogue() -> dict[str, dict]:
    entries = load_catalogue(REPO / "e2e" / "catalogue", PROFILES, route_table())
    check_scenarios(SCENARIOS, entries)
    return entries


def timestamp() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H-%M-%S")


class Side:
    """One side of a comparison: its source tree and its production build."""

    def __init__(self, ref: str | None, cache: Path, run_dir: Path):
        if ref is None:
            self.label = f"working tree on {git('rev-parse', '--short', 'HEAD')}"
            self.src = REPO
            self.browser = build(REPO, run_dir / "head-build", run_dir / "build-head.log")
        else:
            sha = git("rev-parse", f"{ref}^{{commit}}")
            self.label = sha[:12]
            self.src = source_of(sha, cache)
            self.browser = build(self.src, cache / "builds" / sha, cache / "builds" / f"{sha}.log")


def workspace_for(profile, cache: Path) -> tuple[Path, str]:
    backend = backend_id(cache) if profile.uses_local_backend else "image"
    return cache / "workspaces" / f"{profile.name}-{profile.data_id()}-{backend}", backend


async def compare_command(args) -> None:
    cache = cache_dir()
    _lock = Lock(cache)
    entries = catalogue()
    selection = select_scenarios(SCENARIOS, entries, args.tier, args.unrated, args.only)
    if not selection:
        raise RuntimeError("no scenario selected: rate catalogue entries, or pass --unrated")
    run_dir = cache / "runs" / timestamp()
    run_dir.mkdir(parents=True)
    started = time.monotonic()

    def log(line: str) -> None:
        print(line, flush=True)
        with open(run_dir / "run.log", "a") as f:
            f.write(line + "\n")

    base = Side(args.base or git("merge-base", "HEAD", "master"), cache, run_dir)
    head = Side(args.head, cache, run_dir)
    log(f"base {base.label}, head {head.label}, run {run_dir}")
    extra_roots = utility_roots(base.src)
    chrome = chrome_major(CHROME)
    browser = Browser(CHROME, CDP_PORT)
    sections = []

    for profile_name, scenarios in selection.items():
        profile = PROFILES[profile_name]
        workspace, backend = workspace_for(profile, cache)
        prepared = profile.prepare(workspace, run_dir)
        names = [sc.name for sc in scenarios]
        key_parts = [
            profile.data_id(),
            backend,
            kit_hash(),
            chrome,
            "production",
            ",".join(names),
            ",".join(extra_roots),
        ]
        baseline = cache / "baselines" / f"{base.label}-{profile_name}-{short_hash(*key_parts)}"
        profile_dir = run_dir / profile_name
        profile_dir.mkdir()
        key = {"base": base.label, "profile": profile_name, "data": profile.data_id(), "backend": backend}
        key |= {"kit": kit_hash(), "chrome": chrome}
        (profile_dir / "key.json").write_text(json.dumps(key, indent=2))

        server = prepared.start()
        served: list[Served] = []
        try:
            mismatches = schema_mismatches(server.api_url, {"base": base.src, "head": head.src})
            if mismatches:
                raise RuntimeError(
                    f"the {profile_name} backend does not serve the schema the app's GraphQL documents need "
                    "(set KAMU_BIN to a matching kamu build):\n  " + "\n  ".join(mismatches)
                )

            base_target, head_target = (
                Target(f"http://localhost:{UI_PORTS[side]}", server.api_url, profile.account, prepared.now, extra_roots)
                for side in ("base", "head")
            )
            served.append(Served(base.browser, UI_PORTS["base"], server.api_url))
            served.append(Served(head.browser, UI_PORTS["head"], server.api_url))

            failures = []
            if (baseline / "report.json").exists():
                log(f"[{profile_name}] base: cached baseline {baseline}")
            else:
                log(f"[{profile_name}] base: capturing {len(names)} scenarios")
                partial = baseline.with_name(baseline.name + ".partial")
                shutil.rmtree(partial, ignore_errors=True)
                report = await capture(scenarios, base_target, browser, partial, log)
                failures += [f"base {r['name']}: {r['error']}" for r in report if r.get("ok") is False]
                # A baseline with failed scenarios is not reused: the next run captures it again
                if not failures:
                    partial.rename(baseline)
            base_dir = baseline if baseline.exists() else baseline.with_name(baseline.name + ".partial")

            log(f"[{profile_name}] head: capturing {len(names)} scenarios")
            head_dir = profile_dir / "head"
            report = await capture(scenarios, head_target, browser, head_dir, log)
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
                await capture(rescenarios, head_target, browser, again, log)
                second = compare(str(base_dir), str(again), str(profile_dir / "recheck-diff"), pixels_only)
                recheck = {name: "noise" if second[name]["verdict"] == "same" else "confirmed" for name in pixels_only}
            sections.append(profile_section(profile_name, summary, recheck, failures, diff_dir))
        finally:
            for s in served:
                s.stop()
            server.stop()

    minutes = round((time.monotonic() - started) / 60)
    report_file = run_dir / "report.md"
    header = ["# Visual comparison", "", f"- base: {base.label}", f"- head: {head.label}", f"- {minutes} min", ""]
    report_file.write_text("\n".join(header + sections))
    log(f"report: {report_file}")


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
    _lock = Lock(cache)
    profile = PROFILES[args.profile]
    run_dir = cache / "runs" / f"probe-{timestamp()}"
    run_dir.mkdir(parents=True)
    browser_dir = Path(args.build).resolve() if args.build else build(REPO, run_dir / "build", run_dir / "build.log")
    workspace, _ = workspace_for(profile, cache)
    prepared = profile.prepare(workspace, run_dir)
    server = prepared.start()
    served = Served(browser_dir, UI_PORTS["head"], server.api_url)
    chrome = await Chrome.launch(run_dir / ".chrome-profile", CDP_PORT, CHROME)
    try:
        cdp = await chrome.open_page()
        target = Target(f"http://localhost:{UI_PORTS['head']}", server.api_url, profile.account, prepared.now)
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
        await chrome.close()
        served.stop()
        server.stop()
    print(f"screenshots: {run_dir}")


def latest_run(cache: Path) -> Path | None:
    """The newest comparison run with a head capture in it."""
    runs = cache / "runs"
    candidates = sorted(runs.iterdir(), reverse=True) if runs.exists() else []
    return next((r for r in candidates if any(r.glob("*/head/report.json"))), None)


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
        description="Visual comparison of Kamu Web UI builds. Env: KAMU_BIN (kamu build, default: kamu on "
        "PATH), KAMU_VISUAL_CACHE (default ~/.cache/kamu-ui-visual), CHROME_BIN (default google-chrome).",
    )
    commands = p.add_subparsers(dest="command", required=True)

    c = commands.add_parser("compare", help="capture the base (cached) and the head, then compare them")
    c.add_argument("--base", help="base commit (default: the merge-base with master)")
    c.add_argument("--head", help="head commit (default: the working tree)")
    c.add_argument("--tier", choices=["smoke", "full"], default="full", help="full includes smoke")
    c.add_argument("--unrated", action="store_true", help="also run catalogue entries without a tier")
    c.add_argument("--only", help="only scenarios whose name contains this text")
    c.set_defaults(run=lambda a: asyncio.run(compare_command(a)))

    pr = commands.add_parser("probe", help="print the text and components of pages, and save screenshots")
    pr.add_argument("paths", nargs="+")
    pr.add_argument("--profile", choices=sorted(PROFILES), default="seed")
    pr.add_argument("--build", help="an existing build's browser folder (default: build the working tree)")
    pr.set_defaults(run=lambda a: asyncio.run(probe_command(a)))

    cv = commands.add_parser("coverage", help="routes, catalogue entries and components no scenario covers")
    cv.set_defaults(run=coverage_command)

    ca = commands.add_parser("cache", help="cached baselines")
    ca.add_argument("action", choices=["list", "prune"])
    ca.add_argument("--keep", type=int, default=3, help="prune: how many of the newest to keep")
    ca.set_defaults(run=cache_command)
    return p


def main() -> int:
    args = parser().parse_args()
    try:
        args.run(args)
    except Exception as e:
        print(e, file=sys.stderr)
        return 1
    return 0
