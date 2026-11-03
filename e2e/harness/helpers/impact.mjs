/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// Which components a change can alter: `node impact.mjs <repo root> <changed file>...` prints
// `{"all": <reason or null>, "selectors": [...]}`. A changed component, template or stylesheet reaches
// that component; any other file reaches the components that import it, directly or through files
// that are not components.
// Global styles, the build setup and styles that leave their component (::ng-deep, no view
// encapsulation) reach everything. Tests, docs and other files outside the app reach nothing.
import fs from "node:fs";
import path from "node:path";

import ts from "typescript";

const root = path.resolve(process.argv[2]);
const changed = process.argv.slice(3);
const appDir = path.join(root, "src", "app");

// Every page depends on these
const GLOBAL = [
  /^src\/(?!app\/)(?!.*\.spec\.ts$)(?!test-setup\.ts$)/,
  /^package(-lock)?\.json$/,
  /^angular\.json$/,
  /^tsconfig.*\.json$/,
];
const IGNORED = [/\.spec\.ts$/, /\.harness\.ts$/, /mock/i, /-test\.module\.ts$/];

const tsconfig = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile).config;
const aliases = Object.entries(tsconfig.compilerOptions.paths ?? {}).map(([alias, [target]]) => [
  alias.replace(/\*$/, ""),
  path.join(root, target.replace(/\*$/, "")),
]);

function resolve(from, spec) {
  let base;
  if (spec.startsWith(".")) base = path.resolve(path.dirname(from), spec);
  else {
    const alias = aliases.find(([prefix]) => spec.startsWith(prefix));
    if (!alias) return null;
    base = path.join(alias[1], spec.slice(alias[0].length));
  }
  for (const candidate of [base, `${base}.ts`, path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const files = fs
  .readdirSync(appDir, { recursive: true })
  .filter((f) => f.endsWith(".ts") && !IGNORED.some((re) => re.test(f)))
  .map((f) => path.join(appDir, f));

const importers = new Map();
const selectorOf = new Map();
const ownerOf = new Map();
const leaking = new Set();
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const { fileName } of ts.preProcessFile(text, true, true).importedFiles) {
    const target = resolve(file, fileName);
    if (target) importers.set(target, [...(importers.get(target) ?? []), file]);
  }
  const selector = /@Component\(\{[\s\S]*?selector:\s*"([^"]+)"/.exec(text)?.[1];
  if (!selector) continue;
  selectorOf.set(file, selector);
  if (/ViewEncapsulation\.None/.test(text)) leaking.add(file);
  for (const [, url] of text.matchAll(/(?:templateUrl|styleUrls?)\s*:\s*\[?\s*"([^"]+)"/g)) {
    ownerOf.set(path.resolve(path.dirname(file), url), file);
  }
}

function result(all, selectors = []) {
  process.stdout.write(JSON.stringify({ all, selectors: [...selectors].sort() }));
  process.exit(0);
}

const reached = new Set();
for (const rel of changed) {
  if (IGNORED.some((re) => re.test(rel))) continue;
  if (GLOBAL.some((re) => re.test(rel))) result(`${rel} applies to every page`);
  if (!rel.startsWith("src/app/")) continue;
  const file = path.join(root, rel);
  if (rel.endsWith(".scss") && fs.existsSync(file) && fs.readFileSync(file, "utf8").includes("::ng-deep")) {
    result(`${rel} styles outside its component (::ng-deep)`);
  }
  if (!fs.existsSync(file)) result(`${rel} was deleted: no telling what used it`);
  const start = rel.endsWith(".ts") ? file : ownerOf.get(file);
  if (!start) result(`${rel} belongs to no component`);
  const queue = [start];
  while (queue.length) {
    const next = queue.pop();
    if (reached.has(next)) continue;
    reached.add(next);
    // A component's change shows wherever it is on the page, which the captures record; its parents
    // render as before
    if (!selectorOf.has(next)) queue.push(...(importers.get(next) ?? []));
  }
}
const leaker = [...reached].find((f) => leaking.has(f));
if (leaker) result(`${path.relative(root, leaker)} styles outside itself (ViewEncapsulation.None)`);
result(null, new Set([...reached].map((f) => selectorOf.get(f)).filter(Boolean)));
