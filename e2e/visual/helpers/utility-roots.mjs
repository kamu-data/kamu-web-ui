/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// Prints, as a JSON array, the class selectors a source tree's global utility stylesheet compiles
// to: `node utility-roots.mjs <source tree> <node_modules>`. Compiled with the app's own sass.
import fs from "node:fs";
import path from "node:path";

const [tree, nodeModules] = process.argv.slice(2).map((p) => path.resolve(p));
const file = path.join(tree, "src/assets/styles/var.scss");
if (!fs.existsSync(file)) {
  console.log("[]");
} else {
  const sass = await import(path.join(nodeModules, "sass/sass.node.mjs"));
  const css = sass.compile(file, {
    loadPaths: [path.join(tree, "src/assets/styles"), path.join(tree, "src"), nodeModules],
  }).css;
  const selectors = css.replace(/\{[^{}]*\}/g, "{}");
  const classes = new Set([...selectors.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => `.${m[1]}`));
  console.log(JSON.stringify([...classes].sort()));
}
