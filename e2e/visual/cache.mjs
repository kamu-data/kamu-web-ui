/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// The local cache outside the repository: builds by commit, workspaces by data and backend,
// baselines by everything a capture depends on, and the lock that keeps captures one at a time.
import { execFileSync, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");

export function cacheDir() {
  return path.resolve(process.env.KAMU_VISUAL_CACHE ?? path.join(os.homedir(), ".cache/kamu-ui-visual"));
}

export function shortHash(...parts) {
  return crypto.createHash("sha256").update(parts.join("\0")).digest("hex").slice(0, 12);
}

export function git(...args) {
  return execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trim();
}

/** The files a capture's output depends on: everything under e2e/visual except the comparer. */
export function kitHash() {
  const dir = path.join(REPO, "e2e/visual");
  const hash = crypto.createHash("sha256");
  for (const file of fs.readdirSync(dir).sort()) {
    if (!/\.(mjs|js)$/.test(file)) continue;
    hash.update(file);
    hash.update(fs.readFileSync(path.join(dir, file)));
  }
  return hash.digest("hex").slice(0, 12);
}

/**
 * Holds `<cache>/capture.lock` for this process. Two captures at once make Chrome render glyphs
 * slightly differently, so a second one is refused; a lock whose process is gone is taken over.
 */
export function takeLock(dir) {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "capture.lock");
  try {
    fs.writeFileSync(file, String(process.pid), { flag: "wx" });
  } catch {
    const owner = Number(fs.readFileSync(file, "utf8"));
    let alive = false;
    try {
      process.kill(owner, 0);
      alive = true;
    } catch {
      // the owner is gone
    }
    if (alive) throw new Error(`another capture is running (pid ${owner}); captures run one at a time`);
    fs.writeFileSync(file, String(process.pid));
  }
  const release = () => {
    try {
      if (fs.readFileSync(file, "utf8") === String(process.pid)) fs.rmSync(file);
    } catch {
      // already released
    }
  };
  process.once("exit", release);
  return release;
}

function run(cmd, args, cwd, logFile) {
  const out = fs.openSync(logFile, "a");
  const result = spawnSync(cmd, args, { cwd, stdio: ["ignore", out, out] });
  fs.closeSync(out);
  if (result.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed in ${cwd}; see ${logFile}`);
}

/**
 * The source of commit `sha` in `<cache>/src/<sha>`, extracted with `git archive` (no worktree, no
 * branch). Its node_modules is the working tree's when the lock files match, else `npm ci`.
 */
export function sourceOf(sha, dir) {
  const src = path.join(dir, "src", sha);
  const done = path.join(src, ".extracted");
  if (fs.existsSync(done)) return src;
  fs.rmSync(src, { recursive: true, force: true });
  fs.mkdirSync(src, { recursive: true });
  const logFile = path.join(dir, "src", `${sha}.log`);
  execFileSync("sh", ["-c", `git archive ${sha} | tar -x -C "${src}"`], { cwd: REPO });
  const lock = (root) => fs.readFileSync(path.join(root, "package-lock.json"), "utf8");
  if (lock(src) === lock(REPO)) fs.symlinkSync(path.join(REPO, "node_modules"), path.join(src, "node_modules"));
  else run("npm", ["ci"], src, logFile);
  run("node", ["scripts/set-monaco-version.js"], src, logFile);
  fs.writeFileSync(done, "");
  return src;
}

/** A production build of `srcDir` in `outDir`; returns its `browser` folder. */
export function build(srcDir, outDir, logFile) {
  const browser = path.join(outDir, "browser");
  if (fs.existsSync(path.join(browser, "index.html"))) return browser;
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  console.log(`building ${srcDir === REPO ? "the working tree" : srcDir} (production)`);
  run("npx", ["ng", "build", "--configuration", "production", "--output-path", outDir], srcDir, logFile);
  return browser;
}

/** The class selectors the tree's global utility stylesheet compiles to, as snapshot roots. */
export async function utilityRoots(srcDir) {
  const file = path.join(srcDir, "src/assets/styles/var.scss");
  if (!fs.existsSync(file)) return [];
  const sass = await import("sass");
  const css = sass.compile(file, {
    loadPaths: [path.join(srcDir, "src/assets/styles"), path.join(srcDir, "src"), path.join(REPO, "node_modules")],
  }).css;
  const selectors = css.replace(/\{[^{}]*\}/g, "{}");
  return [...new Set([...selectors.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => `.${m[1]}`))].sort();
}

export function chromeMajor(binary) {
  const version = execFileSync(binary, ["--version"], { encoding: "utf8" });
  return /(\d+)\./.exec(version)[1];
}

/** Lists cached baselines, newest first, with their size in MB. */
export function listBaselines(dir) {
  const base = path.join(dir, "baselines");
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base)
    .map((name) => {
      const full = path.join(base, name);
      const files = fs.readdirSync(full, { recursive: true }).map((f) => path.join(full, f));
      const bytes = files.reduce((sum, f) => sum + (fs.statSync(f).isFile() ? fs.statSync(f).size : 0), 0);
      return { name, dir: full, mtime: fs.statSync(full).mtimeMs, mb: Math.round(bytes / 1e6) };
    })
    .sort((a, b) => b.mtime - a.mtime);
}
