/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// The business catalogue (e2e/catalogue/*.yaml): loading, validation, and choosing which
// scenarios a run covers.
import fs from "node:fs";
import path from "node:path";

import YAML from "yaml";

export const PERSONAS = ["anonymous", "reader", "editor", "owner", "admin"];
export const TIERS = ["smoke", "full", "drop"];
const REQUIRED = ["id", "journey", "persona", "routes", "states", "profile"];

/**
 * Reads every capability file under `dir` and checks each entry against the known `profiles` and
 * the app's `routes`. Throws with every problem found; returns a Map from id to entry.
 */
export function loadCatalogue(dir, { profiles, routes }) {
  const entries = new Map();
  const problems = [];
  const knownRoutes = new Set(routes);
  for (const file of fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .sort()) {
    const doc = YAML.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    if (!doc?.capability || !Array.isArray(doc.entries)) {
      problems.push(`${file}: needs \`capability\` and \`entries\``);
      continue;
    }
    for (const entry of doc.entries) {
      const where = `${file}: ${entry.id ?? "(no id)"}`;
      for (const field of REQUIRED)
        if (entry[field] === undefined || entry[field] === null) problems.push(`${where}: no ${field}`);
      if (entries.has(entry.id)) problems.push(`${where}: duplicate id`);
      if (!PERSONAS.includes(entry.persona)) problems.push(`${where}: persona must be one of ${PERSONAS.join(", ")}`);
      if (!(entry.profile in profiles)) problems.push(`${where}: unknown profile ${entry.profile}`);
      if (entry.tier !== null && entry.tier !== undefined && !TIERS.includes(entry.tier)) {
        problems.push(`${where}: tier must be one of ${TIERS.join(", ")}, or empty until rated`);
      }
      for (const route of entry.routes ?? []) {
        if (!knownRoutes.has(route)) problems.push(`${where}: no route ${route} in the app`);
      }
      entries.set(entry.id, { ...entry, capability: doc.capability, file });
    }
  }
  if (problems.length) throw new Error(`catalogue:\n  ${problems.join("\n  ")}`);
  return entries;
}

/** Throws unless every scenario names an existing entry and every name is unique. */
export function checkScenarios(scenarios, entries) {
  const problems = [];
  const names = new Set();
  for (const sc of scenarios) {
    if (names.has(sc.name)) problems.push(`${sc.name}: duplicate name`);
    names.add(sc.name);
    if (!entries.has(sc.entry)) problems.push(`${sc.name}: no catalogue entry ${sc.entry}`);
  }
  if (problems.length) throw new Error(`scenarios:\n  ${problems.join("\n  ")}`);
}

/**
 * The scenarios a run covers, grouped by profile in their list order. `tier` is `smoke` or `full`
 * (which includes smoke); `unrated` also runs entries nobody has rated yet; `only` keeps the
 * scenarios whose name contains it. `drop` entries never run.
 */
export function selectScenarios(scenarios, entries, { tier = "full", unrated = false, only = null }) {
  const tiers = tier === "smoke" ? ["smoke"] : ["smoke", "full"];
  const byProfile = new Map();
  for (const sc of scenarios) {
    const entry = entries.get(sc.entry);
    const runs = tiers.includes(entry.tier) || (unrated && !entry.tier);
    if (!runs || (only && !sc.name.includes(only))) continue;
    if (!byProfile.has(entry.profile)) byProfile.set(entry.profile, []);
    byProfile.get(entry.profile).push(sc);
  }
  return byProfile;
}
