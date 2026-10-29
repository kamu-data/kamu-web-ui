/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// `npm run visual -- <command>`: see USAGE.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

import { PROFILES } from "../fixtures/profiles.mjs";
import { backendId, schemaMismatches } from "./backend.mjs";
import {
  build,
  cacheDir,
  chromeMajor,
  git,
  kitHash,
  listBaselines,
  REPO,
  shortHash,
  sourceOf,
  takeLock,
  utilityRoots,
} from "./cache.mjs";
import { capture } from "./capture.mjs";
import { checkScenarios, loadCatalogue, selectScenarios } from "./catalogue.mjs";
import { killChrome, launchChrome, openPage, sleep } from "./cdp.mjs";
import { coverageReport } from "./coverage.mjs";
import { routeTable } from "./routes.mjs";
import { SCENARIOS } from "./scenarios.mjs";
import { serve } from "./serve.mjs";
import { login, Session } from "./session.mjs";

const USAGE = `usage: npm run visual -- <command> [options]

  compare   Capture the base (cached) and the head, then compare them
            --base <ref>   base commit (default: the merge-base with master)
            --head <ref>   head commit (default: the working tree)
            --tier <t>     smoke | full (default: full, which includes smoke)
            --unrated      also run catalogue entries without a tier
            --only <text>  only scenarios whose name contains <text>
  coverage  Routes, catalogue entries and components that no scenario covers
  probe <path>...   Log in to a profile's backend, load each path, print its text and save a PNG
            --profile <p>  seed | empty | with-data-mt (default: seed)
            --build <dir>  an existing build's browser folder (default: build the working tree)
  cache     list | prune [--keep <n>]   cached baselines

Env: KAMU_BIN (kamu build, default: kamu on PATH), KAMU_VISUAL_CACHE (default ~/.cache/kamu-ui-visual),
     CHROME_BIN (default google-chrome)`;

const UI_PORTS = { base: 4310, head: 4311 };
const CDP_PORT = 9233;
const CHROME = process.env.CHROME_BIN ?? "google-chrome";

function catalogue() {
  const entries = loadCatalogue(path.join(REPO, "e2e/catalogue"), { profiles: PROFILES, routes: routeTable(REPO) });
  checkScenarios(SCENARIOS, entries);
  return entries;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

function python(args) {
  return execFileSync("python3", ["-I", path.join(REPO, "e2e/visual/compare.py"), ...args], { encoding: "utf8" });
}

function readSummary(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, "summary.json"), "utf8"));
}

// A side of the comparison: its source tree and its production build
function side(ref, cache, runDir) {
  if (!ref) {
    const label = `working tree on ${git("rev-parse", "--short", "HEAD")}`;
    return {
      label,
      src: REPO,
      browser: build(REPO, path.join(runDir, "head-build"), path.join(runDir, "build-head.log")),
    };
  }
  const sha = git("rev-parse", `${ref}^{commit}`);
  const src = sourceOf(sha, cache);
  const browser = build(src, path.join(cache, "builds", sha), path.join(cache, "builds", `${sha}.log`));
  return { label: sha.slice(0, 12), sha, src, browser };
}

async function compareCommand(opts) {
  const cache = cacheDir();
  takeLock(cache);
  const entries = catalogue();
  const selection = selectScenarios(SCENARIOS, entries, { tier: opts.tier, unrated: opts.unrated, only: opts.only });
  if (!selection.size) throw new Error("no scenario selected: rate catalogue entries, or pass --unrated");
  const runDir = path.join(cache, "runs", timestamp());
  fs.mkdirSync(runDir, { recursive: true });
  const started = Date.now();
  const log = (line) => {
    console.log(line);
    fs.appendFileSync(path.join(runDir, "run.log"), `${line}\n`);
  };

  const baseRef = opts.base ?? git("merge-base", "HEAD", "master");
  const base = side(baseRef, cache, runDir);
  const head = side(opts.head, cache, runDir);
  log(`base ${base.label}, head ${head.label}, run ${runDir}`);
  const extraRoots = await utilityRoots(base.src);
  const chrome = chromeMajor(CHROME);
  const browser = { binary: CHROME, cdpPort: CDP_PORT };
  const sections = [];

  for (const [profileName, scenarios] of selection) {
    const profile = PROFILES[profileName];
    const backend = profile.usesLocalBackend === false ? "image" : backendId(cache);
    const workspace = path.join(cache, "workspaces", `${profileName}-${profile.dataId()}-${backend}`);
    const prepared = await profile.prepare(workspace, runDir);
    const names = scenarios.map((s) => s.name);
    const key = [
      base.label,
      profileName,
      shortHash(profile.dataId(), backend, kitHash(), chrome, "production", names.join(","), extraRoots.join(",")),
    ].join("-");
    const baseline = path.join(cache, "baselines", key);
    const profileDir = path.join(runDir, profileName);
    fs.mkdirSync(profileDir, { recursive: true });
    fs.writeFileSync(
      path.join(profileDir, "key.json"),
      JSON.stringify(
        { base: base.label, profile: profileName, data: profile.dataId(), backend, kit: kitHash(), chrome },
        null,
        2,
      ),
    );

    const server = await prepared.start();
    const stops = [];
    try {
      const mismatches = await schemaMismatches(server.apiUrl, { base: base.src, head: head.src });
      if (mismatches.length) {
        throw new Error(
          `the ${profileName} backend does not serve the schema the app's GraphQL documents need ` +
            `(set KAMU_BIN to a matching kamu build):\n  ${mismatches.join("\n  ")}`,
        );
      }
      const target = (port) => ({
        appUrl: `http://localhost:${port}`,
        apiUrl: server.apiUrl,
        account: profile.account,
        now: prepared.now,
        extraRoots,
      });
      stops.push(await serve(base.browser, UI_PORTS.base, server.apiUrl));
      stops.push(await serve(head.browser, UI_PORTS.head, server.apiUrl));

      const failures = [];
      if (fs.existsSync(path.join(baseline, "report.json"))) {
        log(`[${profileName}] base: cached baseline ${baseline}`);
      } else {
        log(`[${profileName}] base: capturing ${names.length} scenarios`);
        const partial = `${baseline}.partial`;
        fs.rmSync(partial, { recursive: true, force: true });
        const report = await capture({ scenarios, target: target(UI_PORTS.base), browser, outDir: partial, log });
        failures.push(...report.filter((r) => r.ok === false).map((r) => `base ${r.name}: ${r.error}`));
        // A baseline with failed scenarios is not reused: the next run captures it again
        if (!failures.length) fs.renameSync(partial, baseline);
      }
      const baseDir = fs.existsSync(baseline) ? baseline : `${baseline}.partial`;

      log(`[${profileName}] head: capturing ${names.length} scenarios`);
      const headDir = path.join(profileDir, "head");
      const report = await capture({ scenarios, target: target(UI_PORTS.head), browser, outDir: headDir, log });
      failures.push(...report.filter((r) => r.ok === false).map((r) => `head ${r.name}: ${r.error}`));

      const diffDir = path.join(profileDir, "diff");
      python([baseDir, headDir, diffDir]);
      const summary = readSummary(diffDir);

      // Pixel-only differences are rechecked: the scenarios are captured again on head alone
      const pixelsOnly = Object.keys(summary).filter((name) => summary[name].verdict === "pixels-only");
      const recheck = {};
      if (pixelsOnly.length) {
        log(`[${profileName}] recheck: ${pixelsOnly.join(", ")}`);
        const again = path.join(profileDir, "recheck");
        const rescenarios = scenarios.filter((s) => pixelsOnly.includes(s.name));
        await capture({ scenarios: rescenarios, target: target(UI_PORTS.head), browser, outDir: again, log });
        python([baseDir, again, path.join(profileDir, "recheck-diff"), "--names", pixelsOnly.join(",")]);
        const second = readSummary(path.join(profileDir, "recheck-diff"));
        for (const name of pixelsOnly) {
          recheck[name] = second[name].verdict === "same" ? "noise" : "confirmed";
        }
      }
      sections.push(profileSection(profileName, summary, recheck, failures, diffDir));
    } finally {
      for (const stop of stops) await stop();
      await server.stop();
    }
  }

  const minutes = Math.round((Date.now() - started) / 60000);
  const reportFile = path.join(runDir, "report.md");
  fs.writeFileSync(
    reportFile,
    [
      `# Visual comparison`,
      "",
      `- base: ${base.label}`,
      `- head: ${head.label}`,
      `- ${minutes} min`,
      "",
      ...sections,
    ].join("\n"),
  );
  log(`report: ${reportFile}`);
}

function profileSection(profile, summary, recheck, failures, diffDir) {
  const count = (v) => Object.values(summary).filter((s) => s.verdict === v).length;
  const lines = [
    `## ${profile}`,
    "",
    `${Object.keys(summary).length} scenarios: ${count("same")} same, ${count("changed")} with style changes, ` +
      `${count("pixels-only")} with pixel-only changes, ${count("missing")} missing.`,
    "",
  ];
  const changed = Object.entries(summary).filter(([, s]) => s.verdict === "changed");
  if (changed.length) {
    lines.push("Style changes (details in the comparison report):", "");
    for (const [name, s] of changed) lines.push(`- ${name}: ${s.styleDiffs} style diffs, ${s.pixels} px`);
    lines.push("");
  }
  const rechecked = Object.entries(recheck);
  if (rechecked.length) {
    lines.push("Pixel-only changes, captured again on head alone:", "");
    for (const [name, result] of rechecked) {
      lines.push(
        `- ${name}: ${summary[name].pixels} px, ${result === "noise" ? "noise (same on the recheck)" : "confirmed"}`,
      );
    }
    lines.push("");
  }
  if (failures.length) lines.push("Failed scenarios:", "", ...failures.map((f) => `- ${f}`), "");
  lines.push(`Comparison report: ${path.join(diffDir, "report.md")}`, "");
  return lines.join("\n");
}

// The newest comparison run with a head capture in it
function latestRun(cache) {
  const runs = path.join(cache, "runs");
  const all = fs.existsSync(runs) ? fs.readdirSync(runs).sort().reverse() : [];
  const captured = (run) =>
    fs.readdirSync(path.join(runs, run)).some((d) => fs.existsSync(path.join(runs, run, d, "head", "report.json")));
  const run = all.find(captured);
  return run ? path.join(runs, run) : null;
}

async function probeCommand(paths, opts) {
  const cache = cacheDir();
  takeLock(cache);
  const profile = PROFILES[opts.profile ?? "seed"];
  if (!profile) throw new Error(`unknown profile ${opts.profile}`);
  const runDir = path.join(cache, "runs", `probe-${timestamp()}`);
  fs.mkdirSync(runDir, { recursive: true });
  const browserDir = opts.build
    ? path.resolve(opts.build)
    : build(REPO, path.join(runDir, "build"), path.join(runDir, "build.log"));
  const backend = profile.usesLocalBackend === false ? "image" : backendId(cache);
  const prepared = await profile.prepare(
    path.join(cache, "workspaces", `${profile.name}-${profile.dataId()}-${backend}`),
    runDir,
  );
  const server = await prepared.start();
  const stop = await serve(browserDir, UI_PORTS.head, server.apiUrl);
  const profileDir = path.join(runDir, ".chrome-profile");
  const chrome = await launchChrome(profileDir, CDP_PORT, CHROME);
  try {
    const s = new Session(await openPage(chrome.port), {
      appUrl: `http://localhost:${UI_PORTS.head}`,
      apiUrl: server.apiUrl,
      account: profile.account,
      now: prepared.now,
    });
    await s.init();
    s.token = await login(server.apiUrl, profile.account);
    await s.gotoFull("/v/page-not-found");
    await s.eval(`localStorage.setItem("access_token", ${JSON.stringify(s.token)})`);
    for (const [i, url] of paths.entries()) {
      await s.gotoFull(url);
      await sleep(1500);
      await s.idle();
      await s.lib();
      console.log(`== ${url} -> ${await s.eval("location.pathname + location.search")}`);
      console.log((await s.eval("window.__cap.text()")).slice(0, 700));
      console.log(`components: ${(await s.eval("window.__cap.components()")).join(" ")}`);
      await s.screenshot(path.join(runDir, `probe-${String(i + 1).padStart(2, "0")}.png`));
    }
    s.cdp.close();
  } finally {
    await killChrome(chrome.proc, profileDir);
    await stop();
    await server.stop();
  }
  console.log(`screenshots: ${runDir}`);
}

function coverageCommand() {
  const cache = cacheDir();
  const run = latestRun(cache);
  const reportFile = path.join(run ?? cache, "coverage.md");
  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(
    reportFile,
    coverageReport({ entries: catalogue(), scenarios: SCENARIOS, routes: routeTable(REPO), run }),
  );
  console.log(`coverage: ${reportFile}`);
}

function cacheCommand(action, opts) {
  const baselines = listBaselines(cacheDir());
  if (action === "list") {
    for (const b of baselines) console.log(`${b.mb} MB\t${new Date(b.mtime).toISOString().slice(0, 16)}\t${b.name}`);
    return;
  }
  if (action === "prune") {
    const keep = Number(opts.keep ?? 3);
    for (const b of baselines.slice(keep)) {
      fs.rmSync(b.dir, { recursive: true, force: true });
      console.log(`removed ${b.name} (${b.mb} MB)`);
    }
    return;
  }
  throw new Error(USAGE);
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      base: { type: "string" },
      head: { type: "string" },
      tier: { type: "string" },
      unrated: { type: "boolean" },
      only: { type: "string" },
      keep: { type: "string" },
      profile: { type: "string" },
      build: { type: "string" },
    },
  });
  if (values.tier && !["smoke", "full"].includes(values.tier)) throw new Error("--tier is smoke or full");
  const [command, action] = positionals;
  if (command === "compare") await compareCommand(values);
  else if (command === "coverage") coverageCommand();
  else if (command === "probe") await probeCommand(positionals.slice(1), values);
  else if (command === "cache") cacheCommand(action, values);
  else {
    console.error(USAGE);
    process.exitCode = 2;
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
