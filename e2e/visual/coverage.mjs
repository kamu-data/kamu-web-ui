/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// The coverage report: routes no catalogue entry claims, entries no scenario realises, and app
// components that no scenario of the latest run showed.
import fs from "node:fs";
import path from "node:path";

import { REPO } from "./cache.mjs";

// Component selectors declared under src/app
function componentSelectors() {
  const dir = path.join(REPO, "src/app");
  const out = new Set();
  for (const file of fs.readdirSync(dir, { recursive: true })) {
    if (!file.endsWith(".component.ts")) continue;
    const m = /selector:\s*["'`](app-[\w-]+)["'`]/.exec(fs.readFileSync(path.join(dir, file), "utf8"));
    if (m) out.add(m[1]);
  }
  return [...out].sort();
}

// The components each profile's head capture showed in the run directory `run`
function shownComponents(run) {
  const shown = new Set();
  if (!run) return shown;
  for (const profile of fs.readdirSync(run)) {
    const report = path.join(run, profile, "head", "report.json");
    if (!fs.existsSync(report)) continue;
    for (const entry of JSON.parse(fs.readFileSync(report, "utf8")))
      for (const tag of entry.components ?? []) shown.add(tag);
  }
  return shown;
}

export function coverageReport({ entries, scenarios, routes, run }) {
  const claimed = new Set([...entries.values()].flatMap((e) => e.routes));
  const realised = new Set(scenarios.map((s) => s.entry));
  const lines = ["# Visual coverage", ""];

  const unclaimed = routes.filter((r) => !claimed.has(r));
  lines.push(`## Routes with no catalogue entry (${unclaimed.length} of ${routes.length})`, "");
  lines.push(...(unclaimed.length ? unclaimed.map((r) => `- \`${r}\``) : ["None."]), "");

  const unrealised = [...entries.values()].filter((e) => !realised.has(e.id));
  lines.push(`## Catalogue entries with no scenario (${unrealised.length} of ${entries.size})`, "");
  lines.push("| entry | capability | profile | tier |", "|---|---|---|---|");
  for (const e of unrealised) lines.push(`| ${e.id} | ${e.capability} | ${e.profile} | ${e.tier ?? "unrated"} |`);
  lines.push("");

  const byTier = {};
  for (const e of entries.values()) byTier[e.tier ?? "unrated"] = (byTier[e.tier ?? "unrated"] ?? 0) + 1;
  lines.push("## Entries by tier", "", ...Object.entries(byTier).map(([t, n]) => `- ${t}: ${n}`), "");

  const components = componentSelectors();
  if (run) {
    const shown = shownComponents(run);
    const unseen = components.filter((c) => !shown.has(c));
    lines.push(`## Components no scenario showed (${unseen.length} of ${components.length}), in ${run}`, "");
    lines.push(...(unseen.length ? unseen.map((c) => `- \`${c}\``) : ["None."]), "");
  } else {
    lines.push(
      "## Components",
      "",
      "No run yet: `npm run visual -- compare` records which components each scenario shows.",
      "",
    );
  }
  return lines.join("\n");
}
