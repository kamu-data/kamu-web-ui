# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""The browser session and the ordered scenario runner (logged-in phase, then the logged-out phase)."""

from __future__ import annotations

import asyncio
import base64
import json
import re
import signal
import time
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from e2e.harness.cdp import Cdp, Chrome
from e2e.harness.progress import status_line

PAGE_LIB = (Path(__file__).parent / "page-lib.js").read_text(encoding="utf8")
VIEWPORT = {"width": 1440, "height": 900}
# Seconds before a GraphQL request outside the page gives up
GQL_TIMEOUT = 120
ERROR_TEXT = re.compile(r"page not found|something went wrong", re.I)


def clock_shim(now: int) -> str:
    """The page clock starts at `now` (epoch ms) and restarts from it at every scenario, so a page shows
    the same minute however long the run has taken. It runs, because debounce timers need it."""
    return f"""(() => {{
    const base = {now}; let t0 = performance.now(); const RD = Date;
    window.__e2eResetClock = () => {{ t0 = performance.now(); }};
    class D extends RD {{
        constructor(...a) {{ if (a.length === 0) super(base + (performance.now() - t0)); else super(...a); }}
        static now() {{ return base + (performance.now() - t0); }}
    }}
    D.UTC = RD.UTC; D.parse = RD.parse; window.Date = D;
    // The query request timer ticks a 10 ms setInterval, so its final value depends on the run.
    // No other app code uses a 10 ms interval: drop those, so the timer reads 00:00:00.00.
    const SI = window.setInterval;
    window.setInterval = function (fn, ms, ...a) {{ return ms === 10 ? 0 : SI.call(this, fn, ms, ...a); }};
}})();"""


def gql(api_url: str, query: str, variables: dict | None = None, token: str | None = None) -> dict:
    headers = {"content-type": "application/json"}
    if token:
        headers["authorization"] = f"Bearer {token}"
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    request = urllib.request.Request(f"{api_url}/graphql", data=body, headers=headers, method="POST")
    with urllib.request.urlopen(request, timeout=GQL_TIMEOUT) as response:
        result = json.load(response)
    if result.get("errors"):
        raise RuntimeError(f"GraphQL: {json.dumps(result['errors'])[:400]}")
    return result["data"]


def login(api_url: str, account: dict) -> str:
    credentials = json.dumps({"login": account["login"], "password": account["password"]})
    data = gql(
        api_url,
        "mutation($c: String!) { auth { login(loginMethod: PASSWORD, loginCredentialsJson: $c) { accessToken } } }",
        {"c": credentials},
    )
    return data["auth"]["login"]["accessToken"]


@dataclass
class Target:
    """Where a session points: the served app, its API, who logs in, the frozen clock (epoch ms), and a
    script injected after page-lib.js, for what the run records in the page."""

    app_url: str
    api_url: str
    account: dict
    now: int
    page_script: str = ""


@dataclass
class Browser:
    binary: str
    cdp_port: int


class Session:
    """One tab driven over CDP."""

    def __init__(self, cdp: Cdp, target: Target):
        self.cdp = cdp
        self.target = target
        self.lib_source = f"{PAGE_LIB}\n{target.page_script}"
        self.inflight: set[str] = set()
        self.last_net = time.monotonic()
        self.console_errors: list[str] = []
        self.token: str | None = None
        self.viewport = VIEWPORT

        def started(p):
            # blob:/data: loads (Monaco workers) can stay pending forever
            if re.match(r"^(blob|data):", p["request"]["url"]):
                return
            self.inflight.add(p["requestId"])
            self.last_net = time.monotonic()

        def done(p):
            self.inflight.discard(p["requestId"])
            self.last_net = time.monotonic()

        def exception(p):
            details = p.get("exceptionDetails", {})
            description = details.get("exception", {}).get("description")
            self.console_errors.append(description.split("\n")[0] if description else details.get("text"))

        cdp.on("Network.requestWillBeSent", started)
        cdp.on("Network.loadingFinished", done)
        cdp.on("Network.loadingFailed", done)
        cdp.on("Runtime.exceptionThrown", exception)

    async def init(self) -> None:
        for domain in ("Page", "Runtime", "Network", "DOM", "CSS"):
            await self.cdp.send(f"{domain}.enable")
        await self.set_viewport(VIEWPORT)
        await self.cdp.send("Emulation.setTimezoneOverride", {"timezoneId": "UTC"})
        await self.cdp.send("Emulation.setLocaleOverride", {"locale": "en-US"})
        await self.cdp.send(
            "Emulation.setEmulatedMedia", {"features": [{"name": "prefers-reduced-motion", "value": "reduce"}]}
        )
        await self.cdp.send("Page.addScriptToEvaluateOnNewDocument", {"source": clock_shim(self.target.now)})

    async def set_viewport(self, viewport: dict) -> None:
        self.viewport = viewport
        await self.cdp.send(
            "Emulation.setDeviceMetricsOverride",
            {"width": viewport["width"], "height": viewport["height"], "deviceScaleFactor": 1, "mobile": False},
        )

    async def idle(self, quiet: float = 0.6, limit: float = 20) -> None:
        start = time.monotonic()
        while time.monotonic() - start < limit:
            if not self.inflight and time.monotonic() - self.last_net > quiet:
                return
            await asyncio.sleep(0.1)

    async def eval(self, expression: str) -> Any:
        r = await self.cdp.send(
            "Runtime.evaluate", {"expression": expression, "awaitPromise": True, "returnByValue": True}
        )
        if "exceptionDetails" in r:
            details = r["exceptionDetails"]
            why = details.get("exception", {}).get("description") or details.get("text")
            raise RuntimeError(f"eval failed: {expression[:80]}: {why}")
        return r["result"].get("value")

    async def lib(self) -> None:
        await self.eval(self.lib_source)

    async def goto_full(self, url: str) -> None:
        self.inflight.clear()
        await self.cdp.send("Page.navigate", {"url": self.target.app_url + url})
        await asyncio.sleep(0.3)
        await self.idle()
        await self.lib()

    async def goto_app(self, url: str) -> None:
        """In-app navigation keeps the SPA session, and any styles a component left behind, alive."""
        await self.eval(
            f'history.pushState(null, "", {json.dumps(url)}); '
            'dispatchEvent(new PopStateEvent("popstate", { state: null }));'
        )
        await asyncio.sleep(0.3)
        await self.idle()
        await self.lib()

    async def exists(self, selector: str) -> bool:
        return await self.eval(f"!!document.querySelector({json.dumps(selector)})")

    async def wait_for(self, selector: str, limit: float = 15) -> bool:
        start = time.monotonic()
        while time.monotonic() - start < limit:
            if await self.exists(selector):
                return True
            await asyncio.sleep(0.15)
        return False

    async def must_wait_for(self, selector: str, limit: float = 15) -> None:
        if not await self.wait_for(selector, limit):
            raise RuntimeError(f"waitFor timed out: {selector}")

    async def click(self, selector: str) -> None:
        if not await self.eval(f"window.__e2e.click({json.dumps(selector)})"):
            raise RuntimeError(f"click: no element {selector}")
        await asyncio.sleep(0.2)
        await self.idle()

    async def click_text(self, selector: str, text: str) -> None:
        """Clicks the first element matching `selector` whose trimmed innerText equals `text`."""
        if not await self.eval(f"window.__e2e.clickText({json.dumps(selector)}, {json.dumps(text)})"):
            raise RuntimeError(f'clickText: no {selector} with text "{text}"')
        await asyncio.sleep(0.2)
        await self.idle()

    async def key(self, key: str, code: str | None = None, key_code: int = 27) -> None:
        for kind in ("keyDown", "keyUp"):
            await self.cdp.send(
                "Input.dispatchKeyEvent",
                {"type": kind, "key": key, "code": code or key, "windowsVirtualKeyCode": key_code},
            )
        await asyncio.sleep(0.3)

    async def hover(self, selector: str) -> None:
        """A real mouse hover over the centre of the first match, scrolled into view first."""
        point = await self.eval(
            f"""(() => {{ const el = document.querySelector({json.dumps(selector)}); if (!el) return null;
            el.scrollIntoView({{ block: "center" }}); const r = el.getBoundingClientRect();
            return {{ x: r.x + r.width / 2, y: r.y + r.height / 2 }}; }})()"""
        )
        if not point:
            raise RuntimeError(f"hover: no element {selector}")
        await self.cdp.send("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": point["x"], "y": point["y"]})
        await self.transitions_done()

    async def transitions_done(self, limit: float = 5) -> None:
        """Waits until no CSS transition or finite animation runs, so a snapshot never catches a fade
        halfway, however loaded the machine is. Endless animations (spinners) do not count."""
        await asyncio.sleep(0.05)
        deadline = time.monotonic() + limit
        while time.monotonic() < deadline:
            running = await self.eval(
                'document.getAnimations().some((a) => a.playState === "running"'
                " && a.effect?.getComputedTiming().endTime !== Infinity)"
            )
            if not running:
                return
            await asyncio.sleep(0.1)

    async def settle(self, seconds: float = 1.2, park_mouse: bool = True) -> None:
        await self.eval("document.activeElement && document.activeElement.blur && document.activeElement.blur()")
        if park_mouse:
            x, y = self.viewport["width"] - 1, self.viewport["height"] - 1
            await self.cdp.send("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": x, "y": y})
        await asyncio.sleep(seconds)
        await self.idle()

    async def screenshot(self, file: Path) -> None:
        metrics = await self.cdp.send("Page.getLayoutMetrics")
        height = min(int(-(-metrics["cssContentSize"]["height"] // 1)), 5000)
        shot = await self.cdp.send(
            "Page.captureScreenshot",
            {
                "format": "png",
                # Capturing beyond the viewport resizes it and reflows the page under a hovering mouse:
                # only for pages taller than the viewport
                "captureBeyondViewport": height > self.viewport["height"],
                "clip": {
                    "x": 0,
                    "y": 0,
                    "width": self.viewport["width"],
                    "height": max(height, self.viewport["height"]),
                    "scale": 1,
                },
            },
        )
        file.write_bytes(base64.b64decode(shot["data"]))

    def gql(self, query: str, variables: dict | None = None) -> dict:
        """For scenario URL functions: GraphQL as the logged-in user."""
        return gql(self.target.api_url, query, variables, self.token)

    async def logout(self) -> None:
        await self.eval("localStorage.clear(); sessionStorage.clear()")
        self.token = None
        await self.goto_full("/v/search")

    async def log_in(self) -> None:
        self.token = login(self.target.api_url, self.target.account)
        await self.goto_full("/v/page-not-found")
        await self.eval(f'localStorage.setItem("access_token", {json.dumps(self.token)})')
        await self.goto_full("/v/search")


async def run_scenarios(scenarios, target: Target, browser: Browser, out_dir: Path, capture, done=None) -> list[dict]:
    """Runs `scenarios` in order in one tab. `capture(session, scenario, entry)` does the per-scenario work,
    and `done(entry)` hears of each finished scenario (default: prints its status line).
    Logged-out scenarios (`phase="anon"`) come last: the first one clears the session. Returns one report
    entry per scenario, then `{"consoleErrors": [...]}`."""
    chrome = await Chrome.launch(out_dir / ".chrome-profile", browser.cdp_port, browser.binary)
    # Leave no headless Chrome behind when the run is interrupted
    previous = signal.signal(signal.SIGTERM, lambda *_: (chrome.proc.kill(), exit(130)))
    cdp = None
    report: list[dict] = []
    try:
        cdp = await chrome.open_page()
        s = Session(cdp, target)
        await s.init()
        await s.log_in()
        anon = False
        for sc in scenarios:
            entry = {"name": sc.name, "ok": True}
            started = time.monotonic()
            try:
                if sc.phase == "anon" and not anon:
                    await s.logout()
                    anon = True
                if sc.phase != "anon" and anon:
                    raise RuntimeError("logged-in scenario after the logged-out phase; move it up")
                if await s.exists("ngb-modal-window, .cdk-overlay-backdrop, .mat-mdc-menu-panel"):
                    raise RuntimeError("stale overlay from the previous scenario")
                if sc.viewport:
                    await s.set_viewport(sc.viewport)
                await s.eval("window.__e2eResetClock?.()")
                url = sc.url(s) if callable(sc.url) else sc.url
                entry["requested"] = url
                if sc.full:
                    await s.goto_full(url)
                elif url:
                    here = "location.pathname + location.search"
                    before = await s.eval(here)
                    await s.goto_app(url)
                    # A failed navigation puts the previous URL back; a redirect leads elsewhere, or to the
                    # expected path, which may be the previous one
                    stuck = f"{here} === {json.dumps(before)} && {json.dumps(url)} !== {json.dumps(before)}"
                    if sc.expect_path:
                        stuck += f" && !location.pathname.startsWith({json.dumps(sc.expect_path)})"
                    # A page busy with its own navigation can drop the popstate: try once more
                    if await s.eval(stuck):
                        entry["retried"] = True
                        await s.goto_app(url)
                    # Once Monaco's AMD loader is on the page (data tab, query page), a lazy chunk loaded
                    # by in-app navigation fails ("Can only have one anonymous define call per script
                    # file") and the router stays where it was: reload instead
                    if await s.eval(stuck):
                        amd = await s.eval('typeof window.define === "function" && !!window.define.amd')
                        entry["fullReload"] = (
                            "in-app navigation failed after Monaco's AMD loader" if amd else "in-app navigation failed"
                        )
                        await s.goto_full(url)
                if sc.wait_for:
                    await s.must_wait_for(sc.wait_for)
                if sc.steps:
                    await sc.steps(s)
                await s.settle(sc.settle, not sc.hover)
                if sc.hover:
                    await s.hover(sc.hover)
                await s.lib()
                entry["url"] = await s.eval("location.pathname + location.search")
                text = await s.eval("window.__e2e.text()")
                entry["text"] = text[:200]
                if not sc.allow_error_text and ERROR_TEXT.search(text):
                    raise RuntimeError("error page rendered")
                for expected in sc.expect_text:
                    if expected not in text:
                        raise RuntimeError(f"missing text: {expected}")
                # Form values are not in innerText: expect_value checks input and textarea values
                for value in sc.expect_value:
                    found = await s.eval(
                        '[...document.querySelectorAll("input, textarea")]'
                        f".some((i) => i.value.includes({json.dumps(value)}))"
                    )
                    if not found:
                        raise RuntimeError(f"missing input value: {value}")
                if sc.expect_path and not entry["url"].startswith(sc.expect_path):
                    raise RuntimeError(f"ended on {entry['url']}, expected {sc.expect_path}")
                entry["components"] = await s.eval("window.__e2e.components()")
                await capture(s, sc, entry)
                if sc.after:
                    await sc.after(s)
            except Exception as e:
                entry["ok"] = False
                entry["error"] = str(e)
                try:
                    await s.screenshot(out_dir / f"{sc.name}.FAILED.png")
                    # Leave no overlay behind for the next scenario
                    await s.key("Escape")
                except Exception:
                    pass
            finally:
                if sc.viewport:
                    await s.set_viewport(VIEWPORT)
            entry["seconds"] = round(time.monotonic() - started, 1)
            if done:
                done(entry)
            else:
                print(status_line(entry), flush=True)
            report.append(entry)
        report.append({"consoleErrors": s.console_errors})
        return report
    finally:
        signal.signal(signal.SIGTERM, previous)
        if cdp:
            await cdp.close()
        await chrome.close()
