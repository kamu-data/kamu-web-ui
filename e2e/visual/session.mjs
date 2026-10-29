/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// The browser session and the ordered scenario runner (logged-in phase, then the logged-out phase).
import fs from "node:fs";
import path from "node:path";

import { killChrome, launchChrome, openPage, sleep } from "./cdp.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const PAGE_LIB = fs.readFileSync(path.join(HERE, "page-lib.js"), "utf8");
export const VIEWPORT = { width: 1440, height: 900 };
const ERROR_TEXT = /page not found|something went wrong/i;

// The page clock starts at `now` and restarts from it at every scenario, so a page shows the same
// minute however long the run has taken. It runs, because debounce timers need it.
function clockShim(now) {
  return `(() => {
    const base = ${now}; let t0 = performance.now(); const RD = Date;
    window.__capResetClock = () => { t0 = performance.now(); };
    class D extends RD {
        constructor(...a) { if (a.length === 0) super(base + (performance.now() - t0)); else super(...a); }
        static now() { return base + (performance.now() - t0); }
    }
    D.UTC = RD.UTC; D.parse = RD.parse; window.Date = D;
    // The query request timer ticks a 10 ms setInterval, so its final value depends on the run.
    // No other app code uses a 10 ms interval: drop those, so the timer reads 00:00:00.00.
    const SI = window.setInterval;
    window.setInterval = function (fn, ms, ...a) { return ms === 10 ? 0 : SI.call(this, fn, ms, ...a); };
})();`;
}

export async function gql(apiUrl, query, variables = {}, token = null) {
  const headers = { "content-type": "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`${apiUrl}/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors).slice(0, 400)}`);
  return json.data;
}

export async function login(apiUrl, account) {
  const credentials = JSON.stringify({ login: account.login, password: account.password });
  const data = await gql(
    apiUrl,
    `mutation($c: String!) { auth { login(loginMethod: PASSWORD, loginCredentialsJson: $c) { accessToken } } }`,
    { c: credentials },
  );
  return data.auth.login.accessToken;
}

/**
 * One tab driven over CDP. `target` holds `appUrl`, `apiUrl`, `account`, `now` (the frozen clock,
 * epoch ms) and `extraRoots` (selectors page-lib.js also snapshots).
 */
export class Session {
  constructor(cdp, target) {
    this.cdp = cdp;
    this.target = target;
    this.lib_ = `window.__capExtraRoots = ${JSON.stringify(target.extraRoots ?? [])};\n${PAGE_LIB}`;
    this.inflight = new Set();
    this.lastNet = Date.now();
    this.consoleErrors = [];
    this.token = null;
    this.viewport = VIEWPORT;
    cdp.on("Network.requestWillBeSent", (p) => {
      // blob:/data: loads (Monaco workers) can stay pending forever
      if (/^(blob|data):/.test(p.request.url)) return;
      this.inflight.add(p.requestId);
      this.lastNet = Date.now();
    });
    const done = (p) => {
      this.inflight.delete(p.requestId);
      this.lastNet = Date.now();
    };
    cdp.on("Network.loadingFinished", done);
    cdp.on("Network.loadingFailed", done);
    cdp.on("Runtime.exceptionThrown", (p) =>
      this.consoleErrors.push(p.exceptionDetails?.exception?.description?.split("\n")[0] ?? p.exceptionDetails?.text),
    );
  }

  async init() {
    const c = this.cdp;
    await c.send("Page.enable");
    await c.send("Runtime.enable");
    await c.send("Network.enable");
    await c.send("DOM.enable");
    await c.send("CSS.enable");
    await this.setViewport(VIEWPORT);
    await c.send("Emulation.setTimezoneOverride", { timezoneId: "UTC" });
    await c.send("Emulation.setLocaleOverride", { locale: "en-US" });
    await c.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    await c.send("Page.addScriptToEvaluateOnNewDocument", { source: clockShim(this.target.now) });
  }

  async setViewport(viewport) {
    this.viewport = viewport;
    await this.cdp.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
  }

  async idle(quietMs = 600, maxMs = 20000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      if (this.inflight.size === 0 && Date.now() - this.lastNet > quietMs) return;
      await sleep(100);
    }
  }

  async eval(expression) {
    const r = await this.cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) {
      const why = r.exceptionDetails.exception?.description ?? r.exceptionDetails.text;
      throw new Error(`eval failed: ${expression.slice(0, 80)}: ${why}`);
    }
    return r.result.value;
  }

  async lib() {
    await this.eval(this.lib_);
  }

  async gotoFull(url) {
    this.inflight.clear();
    await this.cdp.send("Page.navigate", { url: this.target.appUrl + url });
    await sleep(300);
    await this.idle();
    await this.lib();
  }

  // In-app navigation keeps the SPA session, and any styles a component left behind, alive
  async gotoApp(url) {
    await this.eval(
      `history.pushState(null, "", ${JSON.stringify(url)}); dispatchEvent(new PopStateEvent("popstate", { state: null }));`,
    );
    await sleep(300);
    await this.idle();
    await this.lib();
  }

  async waitFor(sel, maxMs = 15000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      if (await this.eval(`!!document.querySelector(${JSON.stringify(sel)})`)) return true;
      await sleep(150);
    }
    return false;
  }

  async mustWaitFor(sel, maxMs) {
    if (!(await this.waitFor(sel, maxMs))) throw new Error(`waitFor timed out: ${sel}`);
  }

  async exists(sel) {
    return this.eval(`!!document.querySelector(${JSON.stringify(sel)})`);
  }

  async click(sel) {
    if (!(await this.eval(`window.__cap.click(${JSON.stringify(sel)})`))) throw new Error(`click: no element ${sel}`);
    await sleep(200);
    await this.idle();
  }

  // Clicks the first element matching `sel` whose trimmed innerText equals `text`
  async clickText(sel, text) {
    const ok = await this.eval(`window.__cap.clickText(${JSON.stringify(sel)}, ${JSON.stringify(text)})`);
    if (!ok) throw new Error(`clickText: no ${sel} with text "${text}"`);
    await sleep(200);
    await this.idle();
  }

  async key(key, code = key, keyCode = 27) {
    for (const type of ["keyDown", "keyUp"]) {
      await this.cdp.send("Input.dispatchKeyEvent", { type, key, code, windowsVirtualKeyCode: keyCode });
    }
    await sleep(300);
  }

  // A real mouse hover over the centre of the first match, scrolled into view first
  async hover(sel) {
    const point = await this
      .eval(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return null;
            el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
    if (!point) throw new Error(`hover: no element ${sel}`);
    await this.cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: point.x, y: point.y });
    await sleep(500);
  }

  async settle(ms = 1200, parkMouse = true) {
    await this.eval(`document.activeElement && document.activeElement.blur && document.activeElement.blur()`);
    if (parkMouse) {
      const { width, height } = this.viewport;
      await this.cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: width - 1, y: height - 1 });
    }
    await sleep(ms);
    await this.idle();
  }

  async screenshot(file) {
    const metrics = await this.cdp.send("Page.getLayoutMetrics");
    const height = Math.min(Math.ceil(metrics.cssContentSize.height), 5000);
    const shot = await this.cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: this.viewport.width, height: Math.max(height, this.viewport.height), scale: 1 },
    });
    fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
  }

  // For scenario URL functions: GraphQL as the logged-in user
  gql(query, variables) {
    return gql(this.target.apiUrl, query, variables, this.token);
  }

  async logout() {
    await this.eval(`localStorage.clear(); sessionStorage.clear()`);
    this.token = null;
    await this.gotoFull("/v/search");
  }
}

/**
 * Runs `scenarios` in order in one tab against `target` (see `Session`), with Chrome on
 * `browser.cdpPort` from `browser.binary`. `capture(s, scenario, entry)` does the per-scenario
 * work. Logged-out scenarios (`phase: "anon"`) come last: the first one clears the session.
 * Returns one report entry per scenario, then `{ consoleErrors }`.
 */
export async function runScenarios({ scenarios, target, browser, outDir, capture, log = console.log }) {
  const profileDir = path.join(outDir, ".chrome-profile");
  const chrome = await launchChrome(profileDir, browser.cdpPort, browser.binary);
  // Leave no headless Chrome behind when the run is interrupted
  const onSignal = () => {
    chrome.proc.kill("SIGKILL");
    process.exit(130);
  };
  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);
  let cdp;
  const report = [];
  try {
    cdp = await openPage(chrome.port);
    const s = new Session(cdp, target);
    await s.init();
    s.token = await login(target.apiUrl, target.account);
    await s.gotoFull("/v/page-not-found");
    await s.eval(`localStorage.setItem("access_token", ${JSON.stringify(s.token)})`);
    await s.gotoFull("/v/search");

    let anon = false;
    for (const sc of scenarios) {
      const entry = { name: sc.name, ok: true };
      try {
        if (sc.phase === "anon" && !anon) {
          await s.logout();
          anon = true;
        }
        if (sc.phase !== "anon" && anon) throw new Error("logged-in scenario after the logged-out phase; move it up");
        if (await s.exists("ngb-modal-window, .cdk-overlay-backdrop, .mat-mdc-menu-panel")) {
          throw new Error("stale overlay from the previous scenario");
        }
        if (sc.viewport) await s.setViewport(sc.viewport);
        await s.eval(`window.__capResetClock?.()`);
        const url = typeof sc.url === "function" ? await sc.url(s) : sc.url;
        entry.requested = url;
        if (sc.full) await s.gotoFull(url);
        else if (url) {
          await s.gotoApp(url);
          // Once Monaco's AMD loader is on the page (data tab, query page), a lazy chunk loaded by
          // in-app navigation fails ("Can only have one anonymous define call per script file")
          // and the router stays where it was: reload instead
          const pathname = new URL(url, target.appUrl).pathname;
          const stuck = await s.eval(
            `!location.pathname.startsWith(${JSON.stringify(pathname)}) && typeof window.define === "function" && !!window.define.amd`,
          );
          if (stuck) {
            entry.fullReload = "in-app navigation failed after Monaco's AMD loader";
            await s.gotoFull(url);
          }
        }
        if (sc.waitFor) await s.mustWaitFor(sc.waitFor);
        if (sc.steps) await sc.steps(s);
        await s.settle(sc.settle, !sc.hover);
        if (sc.hover) await s.hover(sc.hover);
        await s.lib();
        entry.url = await s.eval("location.pathname + location.search");
        const text = await s.eval("window.__cap.text()");
        entry.text = text.slice(0, 200);
        if (!sc.allowErrorText && ERROR_TEXT.test(text)) throw new Error("error page rendered");
        for (const t of [sc.expectText ?? []].flat()) if (!text.includes(t)) throw new Error(`missing text: ${t}`);
        // Form values are not in innerText: expectValue checks input and textarea values
        for (const v of [sc.expectValue ?? []].flat()) {
          const found = await s.eval(
            `[...document.querySelectorAll("input, textarea")].some((i) => i.value.includes(${JSON.stringify(v)}))`,
          );
          if (!found) throw new Error(`missing input value: ${v}`);
        }
        if (sc.expectPath && !entry.url.startsWith(sc.expectPath)) {
          throw new Error(`ended on ${entry.url}, expected ${sc.expectPath}`);
        }
        entry.components = await s.eval("window.__cap.components()");
        await capture(s, sc, entry);
        if (sc.after) await sc.after(s);
      } catch (e) {
        entry.ok = false;
        entry.error = String(e.message ?? e);
        await s.screenshot(path.join(outDir, `${sc.name}.FAILED.png`)).catch(() => {});
        // Leave no overlay behind for the next scenario
        await s.key("Escape").catch(() => {});
      } finally {
        if (sc.viewport) await s.setViewport(VIEWPORT).catch(() => {});
      }
      log(`${entry.ok ? "ok  " : "FAIL"} ${sc.name} ${entry.elements ?? ""} ${entry.error ?? ""}`);
      report.push(entry);
    }
    report.push({ consoleErrors: s.consoleErrors });
    return report;
  } finally {
    process.off("SIGINT", onSignal);
    process.off("SIGTERM", onSignal);
    try {
      cdp?.close();
    } catch {
      // already closed
    }
    await killChrome(chrome.proc, profileDir);
  }
}
