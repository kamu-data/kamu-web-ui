/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// Data profiles: what a scenario runs against. Each one knows how to identify its data (for cache
// keys), build or fetch it, start an API server over it, and where the frozen clock stands.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import YAML from "yaml";

import {
  containerRuntime,
  ensureImage,
  imageCreated,
  kamuBinary,
  readFromImage,
  startContainer,
  startLocal,
} from "../visual/backend.mjs";
import { ADMIN, buildEmptyWorkspace, buildSeedWorkspace } from "./seed.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const TWO_HOURS = 2 * 3600 * 1000;

// Published by kamu-cli's release-images-with-data workflow, which only tags `latest-with-data-mt`:
// the digest pins one build of it
const WITH_DATA_MT_IMAGE =
  "ghcr.io/kamu-data/kamu-base@sha256:1dde7d0ff65dca505172eb2b9283dd68b74a2e2f22ed5fc544febc79cd7725dc";
const IMAGE_CONFIG = "/opt/kamu/workspace/.kamu/.kamuconfig";

/**
 * The image's own config plus what a node operator sets for the query pages: a signing key, without
 * which `/query` answers "Response signing is not enabled", and one DataFusion partition, so rows
 * come back in the same order every time. Written once per image into `dir`.
 */
function withDataConfig(runtime, dir) {
  const file = path.join(dir, "kamuconfig.yaml");
  if (fs.existsSync(file)) return file;
  const config = YAML.parse(readFromImage(runtime, WITH_DATA_MT_IMAGE, IMAGE_CONFIG));
  config.content.identity = { privateKey: "f" + crypto.randomBytes(32).toString("hex") };
  config.content.engine = { datafusionEmbedded: { batchQuery: { "datafusion.execution.target_partitions": "1" } } };
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, YAML.stringify(config));
  return file;
}

function hashFiles(files) {
  const hash = crypto.createHash("sha256");
  for (const file of files.sort()) {
    hash.update(path.relative(HERE, file));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest("hex").slice(0, 12);
}

function seedSources() {
  const dir = path.join(HERE, "seed");
  const data = fs.readdirSync(dir, { recursive: true }).map((f) => path.join(dir, f));
  return [...data.filter((f) => fs.statSync(f).isFile()), path.join(HERE, "seed.mjs")];
}

// Whole minute: pages show minute-precision times
const wholeMinute = (ms) => Math.floor(ms / 60000) * 60000;

function seededAt(ws) {
  return Date.parse(JSON.parse(fs.readFileSync(path.join(ws, ".seed/seed-info.json"), "utf8")).seededAt);
}

/**
 * A profile built locally with the kamu binary into a workspace, which is cached by its sources
 * and the backend build: both sides of a comparison run against the same workspace.
 */
function workspaceProfile(name, apiPort, build) {
  return {
    name,
    apiPort,
    account: ADMIN,
    dataId: () => hashFiles(seedSources()),
    async prepare(workspaceDir, logDir) {
      const ready = path.join(workspaceDir, ".seed/seed-info.json");
      if (!fs.existsSync(ready)) {
        console.log(`building the ${name} workspace with ${kamuBinary()}`);
        const partial = `${workspaceDir}.partial`;
        await build(partial, apiPort);
        fs.rmSync(workspaceDir, { recursive: true, force: true });
        fs.renameSync(partial, workspaceDir);
      }
      return {
        now: wholeMinute(seededAt(workspaceDir) + TWO_HOURS),
        start: () => startLocal(workspaceDir, apiPort, path.join(logDir, `api-${name}.log`)),
      };
    },
  };
}

export const PROFILES = {
  seed: workspaceProfile("seed", 8090, (ws, port) => buildSeedWorkspace(ws, port)),
  empty: workspaceProfile("empty", 8091, (ws) => buildEmptyWorkspace(ws)),
  "with-data-mt": {
    name: "with-data-mt",
    apiPort: 8092,
    account: { login: "kamu", password: "kamu.dev" },
    // The image carries its own backend build
    usesLocalBackend: false,
    dataId: () => WITH_DATA_MT_IMAGE.split(":").pop().slice(0, 12),
    async prepare(workspaceDir, logDir) {
      const runtime = containerRuntime();
      ensureImage(runtime, WITH_DATA_MT_IMAGE);
      const config = withDataConfig(runtime, workspaceDir);
      return {
        now: wholeMinute(imageCreated(runtime, WITH_DATA_MT_IMAGE) + TWO_HOURS),
        start: () =>
          startContainer(runtime, WITH_DATA_MT_IMAGE, 8092, path.join(logDir, "api-with-data-mt.log"), [
            { host: config, container: IMAGE_CONFIG },
          ]),
      };
    },
  },
};
