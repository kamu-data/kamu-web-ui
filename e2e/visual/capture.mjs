/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// One capture: every selected scenario of one profile against one served build, written as
// <outDir>/<scenario>.png, <outDir>/styles/<scenario>.json.gz and <outDir>/report.json.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

import { sleep } from "./cdp.mjs";
import { FORCE_TARGETS } from "./scenarios.mjs";
import { runScenarios } from "./session.mjs";

// :focus also forces :focus-visible, which is what Material's focus indicators use
const FORCED_CLASSES = { hover: ["hover"], focus: ["focus", "focus-visible"], active: ["active"] };

async function forcedSnapshots(s) {
  const out = {};
  const { root } = await s.cdp.send("DOM.getDocument", { depth: -1 });
  for (const target of FORCE_TARGETS) {
    const { nodeIds } = await s.cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: target.selector });
    for (const nodeId of nodeIds.slice(0, target.max ?? 3)) {
      for (const state of target.states) {
        await s.cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: FORCED_CLASSES[state] });
        // State layers fade in over 75-150 ms; read them once the transition is over
        await sleep(350);
        const { object } = await s.cdp.send("DOM.resolveNode", { nodeId });
        const result = await s.cdp.send("Runtime.callFunctionOn", {
          objectId: object.objectId,
          functionDeclaration:
            "function () { return JSON.stringify({ key: window.__cap.path(this), snap: window.__cap.snapFor(this) }); }",
          returnByValue: true,
        });
        await s.cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
        await sleep(350);
        const { key, snap } = JSON.parse(result.result.value);
        for (const [elementPath, record] of Object.entries(snap)) out[`${state}@${key}|${elementPath}`] = record;
      }
    }
  }
  return out;
}

/**
 * Captures `scenarios` (in order) against `target` (see `Session`) with `browser`; returns the
 * report, also written to `<outDir>/report.json`.
 */
export async function capture({ scenarios, target, browser, outDir, log }) {
  fs.mkdirSync(path.join(outDir, "styles"), { recursive: true });
  const report = await runScenarios({
    scenarios,
    target,
    browser,
    outDir,
    log,
    capture: async (s, sc, entry) => {
      await s.screenshot(path.join(outDir, `${sc.name}.png`));
      const elements = await s.eval("window.__cap.snapAll()");
      Object.assign(elements, await forcedSnapshots(s));
      entry.elements = Object.keys(elements).length;
      const defaults = await s.eval("window.__cap.defaults()");
      const file = path.join(outDir, "styles", `${sc.name}.json.gz`);
      fs.writeFileSync(file, zlib.gzipSync(JSON.stringify({ defaults, elements })));
    },
  });
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  return report;
}
