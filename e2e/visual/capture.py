# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""One capture: every selected scenario of one profile against one served build, written as
<out>/<scenario>.png, <out>/styles/<scenario>.json.gz and <out>/report.json."""

from __future__ import annotations

import gzip
import json
from pathlib import Path

from e2e.visual.scenarios import FORCE_TARGETS
from e2e.visual.session import Browser, Target, run_scenarios

# :focus also forces :focus-visible, which is what Material's focus indicators use
FORCED_CLASSES = {"hover": ["hover"], "focus": ["focus", "focus-visible"], "active": ["active"]}
SNAP_FOR = "function () { return JSON.stringify({ key: window.__cap.path(this), snap: window.__cap.snapFor(this) }); }"


async def forced_snapshots(s) -> dict:
    out = {}
    root = (await s.cdp.send("DOM.getDocument", {"depth": -1}))["root"]
    for target in FORCE_TARGETS:
        found = await s.cdp.send("DOM.querySelectorAll", {"nodeId": root["nodeId"], "selector": target.selector})
        for node_id in found["nodeIds"][: target.max]:
            for state in target.states:
                await s.cdp.send(
                    "CSS.forcePseudoState", {"nodeId": node_id, "forcedPseudoClasses": FORCED_CLASSES[state]}
                )
                # State layers fade in over 75-150 ms; read them once the transition is over
                await s.transitions_done()
                obj = (await s.cdp.send("DOM.resolveNode", {"nodeId": node_id}))["object"]
                result = await s.cdp.send(
                    "Runtime.callFunctionOn",
                    {"objectId": obj["objectId"], "functionDeclaration": SNAP_FOR, "returnByValue": True},
                )
                await s.cdp.send("CSS.forcePseudoState", {"nodeId": node_id, "forcedPseudoClasses": []})
                await s.transitions_done()
                value = json.loads(result["result"]["value"])
                for element_path, record in value["snap"].items():
                    out[f"{state}@{value['key']}|{element_path}"] = record
    return out


async def capture(scenarios, target: Target, browser: Browser, out_dir: Path, done=None) -> list[dict]:
    """Captures `scenarios` in order, telling `done` of each; returns the report, also written to `<out_dir>/report.json`."""
    (out_dir / "styles").mkdir(parents=True, exist_ok=True)

    async def snapshot(s, sc, entry) -> None:
        # Masking and the full-page screenshot reflow the page under a hovering mouse, which can start a
        # fade on another element
        await s.transitions_done()
        await s.screenshot(out_dir / f"{sc.name}.png")
        await s.transitions_done()
        elements = await s.eval("window.__cap.snapAll()")
        elements.update(await forced_snapshots(s))
        entry["elements"] = len(elements)
        defaults = await s.eval("window.__cap.defaults()")
        data = json.dumps({"defaults": defaults, "elements": elements}).encode()
        # Level 9 takes seconds on a heavy page for a few percent less
        (out_dir / "styles" / f"{sc.name}.json.gz").write_bytes(gzip.compress(data, compresslevel=6))

    report = await run_scenarios(scenarios, target, browser, out_dir, snapshot, done)
    (out_dir / "report.json").write_text(json.dumps(report, indent=2))
    return report
