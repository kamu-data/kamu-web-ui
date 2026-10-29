/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// The kamu API server behind a capture: a local binary over a workspace, or a published image,
// and the check that it serves the GraphQL schema the app's documents were written against.
import { execFileSync, spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  buildClientSchema,
  getIntrospectionQuery,
  NoUnusedFragmentsRule,
  parse,
  specifiedRules,
  validate,
} from "graphql";

import { sleep } from "./cdp.mjs";

// Where a developer's own kamu server listens
const RESERVED_API_PORT = 8080;

export function kamuBinary() {
  return process.env.KAMU_BIN ?? "kamu";
}

function resolveBinary(bin) {
  if (bin.includes("/")) return fs.realpathSync(bin);
  for (const dir of (process.env.PATH ?? "").split(path.delimiter)) {
    const candidate = path.join(dir, bin);
    if (fs.existsSync(candidate)) return fs.realpathSync(candidate);
  }
  throw new Error(`${bin} not found on PATH; set KAMU_BIN to a kamu build`);
}

/**
 * Identifies the backend build: its version line and a hash of the binary, memoised by path and
 * mtime in `cacheDir`, since a debug build is large and two builds share a version string.
 */
export function backendId(cacheDir) {
  const binary = resolveBinary(kamuBinary());
  const stat = fs.statSync(binary);
  const memoFile = path.join(cacheDir, "backend-ids.json");
  const memo = fs.existsSync(memoFile) ? JSON.parse(fs.readFileSync(memoFile, "utf8")) : {};
  const memoKey = `${binary}:${stat.mtimeMs}:${stat.size}`;
  if (!memo[memoKey]) {
    const version = execFileSync(binary, ["--version"], { encoding: "utf8" }).trim();
    const hash = crypto.createHash("sha256").update(fs.readFileSync(binary)).digest("hex").slice(0, 12);
    memo[memoKey] = `${version.replace(/\W+/g, "-")}-${hash}`;
    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(memoFile, JSON.stringify(memo, null, 2));
  }
  return memo[memoKey];
}

async function portFree(port) {
  try {
    await fetch(`http://localhost:${port}/`, { signal: AbortSignal.timeout(1000) });
    return false;
  } catch {
    return true;
  }
}

async function waitForApi(apiUrl, isAlive, logFile) {
  for (let i = 0; i < 240; i++) {
    if (!isAlive()) throw new Error(`the API server exited; see ${logFile}`);
    try {
      const response = await fetch(`${apiUrl}/graphql`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: "{ apiVersion }" }),
      });
      if ((await response.json()).data?.apiVersion) return;
    } catch {
      // not up yet
    }
    await sleep(500);
  }
  throw new Error(`the API server did not answer on ${apiUrl}; see ${logFile}`);
}

async function checkPort(port) {
  if (port === RESERVED_API_PORT) throw new Error(`API port ${port} is left to your own kamu server`);
  if (!(await portFree(port))) throw new Error(`port ${port} is already in use`);
}

/**
 * Runs `kamu system api-server` over the workspace `ws` on `port`, with the environment in
 * `<ws>/.seed/env`. Resolves to `{ apiUrl, stop }` once it answers.
 */
export async function startLocal(ws, port, logFile) {
  await checkPort(port);
  const env = { ...process.env };
  const envFile = path.join(ws, ".seed/env");
  for (const line of fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf8").split("\n") : []) {
    const m = /^(\w+)=(.*)$/.exec(line);
    if (m) env[m[1]] = m[2];
  }
  const out = fs.openSync(logFile, "w");
  const proc = spawn(kamuBinary(), ["system", "api-server", "--http-port", String(port)], {
    cwd: ws,
    env,
    stdio: ["ignore", out, out],
  });
  const apiUrl = `http://localhost:${port}`;
  await waitForApi(apiUrl, () => proc.exitCode === null && proc.signalCode === null, logFile);
  const stop = async () => {
    if (proc.exitCode !== null || proc.signalCode !== null) return;
    proc.kill("SIGTERM");
    for (let i = 0; i < 50 && proc.exitCode === null && proc.signalCode === null; i++) await sleep(100);
    if (proc.exitCode === null && proc.signalCode === null) proc.kill("SIGKILL");
  };
  return { apiUrl, stop };
}

/** docker, or podman when docker is missing. */
export function containerRuntime() {
  for (const runtime of ["docker", "podman"]) {
    try {
      execFileSync(runtime, ["version"], { stdio: "ignore" });
      return runtime;
    } catch {
      // try the next one
    }
  }
  throw new Error("the with-data-mt profile needs docker or podman");
}

/**
 * Pulls a public image anonymously when it is not present: stored registry credentials, even
 * stale ones, would otherwise be sent and refused.
 */
export function ensureImage(runtime, image) {
  try {
    execFileSync(runtime, ["image", "inspect", image], { stdio: "ignore" });
    return;
  } catch {
    // not pulled yet
  }
  const config = fs.mkdtempSync(path.join(os.tmpdir(), "kamu-visual-registry-"));
  try {
    const authFile = path.join(config, "auth.json");
    fs.writeFileSync(authFile, "{}");
    const env = { ...process.env, DOCKER_CONFIG: config, REGISTRY_AUTH_FILE: authFile };
    console.log(`pulling ${image}`);
    execFileSync(runtime, ["pull", image], { env, stdio: "inherit" });
  } finally {
    fs.rmSync(config, { recursive: true, force: true });
  }
}

/** The image's creation time, epoch ms. */
export function imageCreated(runtime, image) {
  return Date.parse(
    execFileSync(runtime, ["image", "inspect", image, "--format", "{{.Created}}"], { encoding: "utf8" }),
  );
}

/** A file inside `image`, as text. */
export function readFromImage(runtime, image, file) {
  return execFileSync(runtime, ["run", "--rm", "--entrypoint", "cat", image, file], { encoding: "utf8" });
}

/**
 * Runs the API server inside `image` with the container's port 8080 on `port`, and each of
 * `mounts` (`{ host, container }`) read-only. The server refuses to start without GitHub OAuth
 * settings, so it gets dummy ones, as a local workspace does.
 */
export async function startContainer(runtime, image, port, logFile, mounts = []) {
  await checkPort(port);
  const env = ["KAMU_AUTH_GITHUB_CLIENT_ID=dummy", "KAMU_AUTH_GITHUB_CLIENT_SECRET=dummy"].flatMap((e) => ["-e", e]);
  const volumes = mounts.flatMap((m) => ["-v", `${m.host}:${m.container}:ro`]);
  const id = execFileSync(
    runtime,
    [
      ...["run", "-d", ...env, ...volumes, "-p", `127.0.0.1:${port}:8080`, image],
      ...["kamu", "system", "api-server", "--http-port", "8080", "--address", "0.0.0.0"],
    ],
    { encoding: "utf8" },
  ).trim();
  const running = () => {
    try {
      return execFileSync(runtime, ["inspect", "-f", "{{.State.Running}}", id], { encoding: "utf8" }).trim() === "true";
    } catch {
      return false;
    }
  };
  const apiUrl = `http://localhost:${port}`;
  const stop = async () => {
    const logs = spawnSync(runtime, ["logs", id], { encoding: "utf8" });
    fs.writeFileSync(logFile, `${logs.stdout ?? ""}${logs.stderr ?? ""}`);
    try {
      execFileSync(runtime, ["rm", "-f", id], { stdio: "ignore" });
    } catch {
      // already removed
    }
  };
  try {
    await waitForApi(apiUrl, running, logFile);
  } catch (e) {
    await stop();
    throw e;
  }
  return { apiUrl, stop };
}

// Every standard rule except one about the documents alone: an unused fragment is not a mismatch
const SCHEMA_RULES = specifiedRules.filter((rule) => rule !== NoUnusedFragmentsRule);

function graphqlDocuments(tree) {
  const dir = path.join(tree, "src/app/api/gql");
  return fs
    .readdirSync(dir, { recursive: true })
    .filter((file) => file.endsWith(".graphql"))
    .sort()
    .map((file) => fs.readFileSync(path.join(dir, file), "utf8"))
    .join("\n");
}

/**
 * Validates every operation and fragment of each source tree against the schema the API server
 * at `apiUrl` serves. Returns one message per invalid document; an empty list means the server
 * can answer everything the app asks.
 */
export async function schemaMismatches(apiUrl, trees) {
  const response = await fetch(`${apiUrl}/graphql`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });
  const schema = buildClientSchema((await response.json()).data);
  const problems = [];
  for (const [label, tree] of Object.entries(trees)) {
    for (const error of validate(schema, parse(graphqlDocuments(tree)), SCHEMA_RULES)) {
      problems.push(`${label}: ${error.message}`);
    }
  }
  return [...new Set(problems)];
}
