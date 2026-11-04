# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""`npm run e2e -- <command>`: the commands every kind of run shares, and the pieces their entry points
reuse."""

from __future__ import annotations

import argparse
import asyncio
import os
import shutil
import signal
import sys
import time
from datetime import UTC, datetime
from pathlib import Path

from e2e.fixtures.inventory import InventoryError, check_inventory, check_scenario_datasets, load_inventory
from e2e.fixtures.profiles import PROFILES, WithDataProfile
from e2e.fixtures.seed import ADMIN
from e2e.harness.backend import FLAVORS, BackendChoice
from e2e.harness.cache import REPO, Lock, build, cache_dir, drop_modules, git, route_table, source_of
from e2e.harness.catalogue import check_scenarios, load_catalogue
from e2e.harness.cdp import Chrome
from e2e.harness.containers import POSTGRES_IMAGE, RUSTFS_IMAGE, container_runtime, remove_leftovers
from e2e.harness.coverage import coverage_report, shown_components
from e2e.harness.impact import Records
from e2e.harness.retention import (
    DEFAULT_MAX,
    KEEP_RUNS,
    MAX_AGE_DAYS,
    entries,
    max_bytes,
    parse_size,
    plan,
    remove,
    remove_image,
    stale_images,
)
from e2e.harness.serve import Served
from e2e.harness.session import Session, Target
from e2e.scenarios import SCENARIOS

# Base and head of the first profile; each further profile takes the next two
UI_PORT = 4310
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
            self.sha = None
            self.label = f"working tree on {git('rev-parse', '--short', 'HEAD')}"
            self.src = REPO
            self.browser = build(REPO, run_dir / "head-build", run_dir / "build-head.log", log)
        else:
            sha = self.sha = git("rev-parse", f"{ref}^{{commit}}")
            self.label = sha[:12]
            out = cache / "builds" / sha
            self.src = source_of(sha, cache, with_modules=not (out / "browser" / "index.html").exists())
            self.browser = build(self.src, out, cache / "builds" / f"{sha}.log", log)
            drop_modules(self.src)


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
        served = Served(browser_dir, UI_PORT, server.api_url)
        chrome = await Chrome.launch(run_dir / ".chrome-profile", CDP_PORT, CHROME)
        cdp = await chrome.open_page()
        target = Target(f"http://localhost:{UI_PORT}", server.api_url, profile.account, running.now)
        s = Session(cdp, target)
        await s.init()
        await s.log_in()
        for i, url in enumerate(args.paths, 1):
            await s.goto_full(url)
            await asyncio.sleep(1.5)
            await s.idle()
            await s.lib()
            print(f"== {url} -> {await s.eval('location.pathname + location.search')}")
            print((await s.eval("window.__e2e.text()"))[:700])
            print(f"components: {' '.join(await s.eval('window.__e2e.components()'))}")
            await s.screenshot(run_dir / f"probe-{i:02d}.png")
        await cdp.close()
    finally:
        if chrome:
            await chrome.close()
        if served:
            served.stop()
        server.stop()
        shutil.rmtree(run_dir / "build", ignore_errors=True)
    print(f"screenshots: {run_dir}")


def check_command(_args) -> None:
    """What CI runs: the catalogue, the scenarios and the seed inventory agree with each other and with
    the app's routes. Needs no browser and no backend."""
    entries = catalogue()
    inventory = load_inventory()
    fixtures = len(inventory["accounts"]) + len(inventory["datasets"])
    print(f"e2e consistent: {len(entries)} catalogue entries, {len(SCENARIOS)} scenarios, {fixtures} seed fixtures")


def coverage_command(_args) -> None:
    cache = cache_dir()
    report_file = cache / "coverage.md"
    report_file.parent.mkdir(parents=True, exist_ok=True)
    shown = shown_components(Records(cache / "components.json"), SCENARIOS)
    report_file.write_text(coverage_report(catalogue(), SCENARIOS, route_table(), shown))
    print(f"coverage: {report_file}")


def pinned_images() -> set[str]:
    """Images a run may need without pulling them again: the profiles' pins and the services'."""
    return {i.image for i in WithDataProfile.IMAGES.values()} | {POSTGRES_IMAGE, RUSTFS_IMAGE}


def prune_cache(
    cache: Path,
    since: float,
    log=print,
    keep_runs: int = KEEP_RUNS,
    max_age_days: float = MAX_AGE_DAYS,
    ceiling: int | None = None,
    images: bool = True,
    dry_run: bool = False,
) -> None:
    """Deletes what the retention rules drop; `since` protects everything used from then on."""
    now = time.time()
    doomed = plan(entries(cache), now, since, keep_runs, max_age_days, max_bytes() if ceiling is None else ceiling)
    verb = "would remove" if dry_run else "removed"
    # A built commit's node_modules, from before builds dropped their own
    for modules in (cache / "src").glob("*/node_modules") if (cache / "src").exists() else []:
        built = cache / "builds" / modules.parent.name / "browser" / "index.html"
        if built.exists() and not modules.is_symlink():
            if not dry_run:
                drop_modules(modules.parent)
            log(f"cache: {verb} node_modules of {modules.parent.name}")
    for entry in doomed:
        if not dry_run:
            remove(entry)
        log(f"cache: {verb} {entry.kind} {entry.name} ({entry.size / 2**20:.0f} MB)")
    if images:
        stale = stale_images(cache, now, max_age_days, pinned_images())
        runtime = container_runtime() if stale else None
        for image in stale:
            if dry_run or remove_image(cache, runtime, image):
                log(f"cache: {verb} image {image}")


def cache_command(args) -> None:
    cache = cache_dir()
    if args.action == "list":
        found = sorted(entries(cache), key=lambda e: (e.kind, -e.last_use))
        for e in found:
            when = datetime.fromtimestamp(e.last_use, UTC).strftime("%Y-%m-%d %H:%M")
            print(f"{e.kind:9s} {e.size / 2**20:8.0f} MB  {when}  {e.name}")
        print(f"total {sum(e.size for e in found) / 2**30:.1f} GB, ceiling {max_bytes() / 2**30:.1f} GB")
        return
    _lock = take_lock(cache)
    if args.action == "prune":
        ceiling = parse_size(args.max) if args.max else None
        prune_cache(
            cache, time.time(), print, args.keep_runs, args.older_than, ceiling, not args.no_images, args.dry_run
        )
    else:
        for entry in entries(cache):
            if args.kind in (None, entry.kind):
                remove(entry)
                print(f"removed {entry.kind} {entry.name}")
        if args.kind in (None, "image"):
            known = stale_images(cache, float("inf"), 0, set())
            runtime = container_runtime() if known else None
            for image in known:
                if remove_image(cache, runtime, image):
                    print(f"removed image {image}")


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


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="npm run e2e --",
        description="Runs of Kamu Web UI scenarios against a kamu backend. Env: KAMU_E2E_CACHE (default "
        "~/.cache/kamu-ui-e2e), CHROME_BIN (default google-chrome).",
    )

    commands = p.add_subparsers(dest="command", required=True)

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

    ca = commands.add_parser("cache", help="what the cache holds; prune it or clear it")
    ca.add_argument("action", choices=["list", "prune", "clear"])
    ca.add_argument(
        "kind",
        nargs="?",
        choices=["run", "baseline", "build", "workspace", "release", "image"],
        help="clear: only this kind",
    )
    ca.add_argument("--keep-runs", type=int, default=KEEP_RUNS, help=f"prune: newest runs kept (default {KEEP_RUNS})")
    ca.add_argument(
        "--older-than",
        type=float,
        default=MAX_AGE_DAYS,
        metavar="DAYS",
        help=f"prune: entries unused for longer (default {MAX_AGE_DAYS})",
    )
    ca.add_argument("--max", metavar="SIZE", help=f"prune: size ceiling (default KAMU_E2E_CACHE_MAX or {DEFAULT_MAX})")
    ca.add_argument("--no-images", action="store_true", help="prune: leave the Docker images the kit pulled")
    ca.add_argument("--dry-run", action="store_true", help="prune: list what would go")
    ca.set_defaults(run=cache_command)
    return p


def run(p: argparse.ArgumentParser) -> int:
    """Parses the command line with `p` and runs the chosen command."""
    args = p.parse_args()
    # A plain `kill` unwinds like Ctrl+C, so the backend's containers and processes are stopped
    signal.signal(signal.SIGTERM, lambda *_: sys.exit(143))
    try:
        args.run(args)
    except Exception as e:
        print(e, file=sys.stderr)
        return 1
    return 0


def main() -> int:
    return run(parser())
