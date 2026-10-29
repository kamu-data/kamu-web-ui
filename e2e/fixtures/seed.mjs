/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// Builds the workspaces of the `seed` and `empty` data profiles. Everything the API server needs
// later lives inside the workspace:
//   .kamu/.kamuconfig    accounts, identity key, secrets encryption key
//   .seed/env            KAMU_JWT_SECRET and a dummy GitHub client id and secret
//   .seed/seed-info.json what was created and when (the frozen clock follows `seededAt`)
//   seed-data/           the CSVs the polling sources read (manifest paths are relative)
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { kamuBinary, startLocal } from "../visual/backend.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const SEED = path.join(HERE, "seed");
export const ADMIN = { login: "kamu", password: "kamu.dev" };
const ACCOUNT = ADMIN.login;

let API = null;
let created = null;
const log = (...m) => console.log("[seed]", ...m);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function alnum(n) {
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...crypto.randomBytes(n)].map((b) => abc[b % abc.length]).join("");
}

// A multi-tenant workspace with the accounts and secrets and no datasets
function initWorkspace(ws) {
  fs.rmSync(ws, { recursive: true, force: true });
  fs.mkdirSync(ws, { recursive: true });
  execFileSync(kamuBinary(), ["init", "--multi-tenant"], { cwd: ws, stdio: ["ignore", "pipe", "pipe"] });
  fs.mkdirSync(path.join(ws, ".seed"));
  const vars = {
    // kamu 0.271 parses it as multibase: "f" + hex
    IDENTITY_PRIVATE_KEY: "f" + crypto.randomBytes(32).toString("hex"),
    SECRETS_ENCRYPTION_KEY: alnum(32),
  };
  const template = fs.readFileSync(path.join(SEED, "kamuconfig.yaml"), "utf8");
  fs.writeFileSync(
    path.join(ws, ".kamu/.kamuconfig"),
    template.replace(/\$\{(\w+)\}/g, (_, k) => {
      if (!(k in vars)) throw new Error(`kamuconfig.yaml: unknown placeholder ${k}`);
      return vars[k];
    }),
  );
  fs.writeFileSync(
    path.join(ws, ".seed/env"),
    [
      `KAMU_JWT_SECRET=${crypto.randomBytes(32).toString("base64")}`,
      "KAMU_AUTH_GITHUB_CLIENT_ID=dummy",
      "KAMU_AUTH_GITHUB_CLIENT_SECRET=dummy",
      "",
    ].join("\n"),
  );
}

/** The `empty` profile: accounts only. */
export function buildEmptyWorkspace(ws) {
  initWorkspace(ws);
  fs.writeFileSync(
    path.join(ws, ".seed/seed-info.json"),
    JSON.stringify({ seededAt: new Date().toISOString() }, null, 2),
  );
}

let token = null;
async function gql(query, variables = {}, auth = true) {
  const headers = { "content-type": "application/json" };
  if (auth && token) headers.authorization = `Bearer ${token}`;
  const r = await fetch(`${API}/graphql`, { method: "POST", headers, body: JSON.stringify({ query, variables }) });
  const j = await r.json();
  if (j.errors) throw new Error(`GraphQL: ${JSON.stringify(j.errors).slice(0, 600)}\n${query.slice(0, 200)}`);
  return j.data;
}

function expectType(res, typename, what) {
  if (res.__typename !== typename) throw new Error(`${what}: ${res.__typename}: ${res.message ?? JSON.stringify(res)}`);
  return res;
}

async function login() {
  const creds = JSON.stringify({ login: ACCOUNT, password: ADMIN.password });
  const d = await gql(
    `mutation($c: String!) { auth { login(loginMethod: PASSWORD, loginCredentialsJson: $c) { accessToken account { id } } } }`,
    { c: creds },
    false,
  );
  token = d.auth.login.accessToken;
  created.accountId = d.auth.login.account.id;
}

async function accountId(name) {
  const d = await gql(`query($n: AccountName!) { accounts { byName(name: $n) { id } } }`, { n: name });
  return d.accounts.byName.id;
}

// ---------------------------------------------------------------------------------------------
// Datasets

async function createFromSnapshot(file, visibility = "PUBLIC") {
  const yaml = fs.readFileSync(path.join(SEED, file), "utf8");
  const d = await gql(
    `mutation($s: String!, $v: DatasetVisibility!) { datasets { createFromSnapshot(snapshot: $s, snapshotFormat: YAML, datasetVisibility: $v) {
            __typename message ... on CreateDatasetResultSuccess { dataset { id name } } } } }`,
    { s: yaml, v: visibility },
  );
  const res = expectType(d.datasets.createFromSnapshot, "CreateDatasetResultSuccess", `create ${file}`);
  created.datasets[res.dataset.name] = res.dataset.id;
  return res.dataset.id;
}

async function createArchetype(kind, name) {
  const field = kind === "collection" ? "createCollection" : "createVersionedFile";
  const d = await gql(
    `mutation($a: DatasetAlias!) { datasets { ${field}(datasetAlias: $a, datasetVisibility: PUBLIC) {
            __typename message ... on CreateDatasetResultSuccess { dataset { id name } } } } }`,
    { a: `${ACCOUNT}/${name}` },
  );
  const res = expectType(d.datasets[field], "CreateDatasetResultSuccess", `${field} ${name}`);
  created.datasets[name] = res.dataset.id;
  return res.dataset.id;
}

async function pushIngest(name, records) {
  for (const rec of records) {
    const r = await fetch(`${API}/${ACCOUNT}/${name}/ingest`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/x-ndjson" },
      body: JSON.stringify(rec) + "\n",
    });
    if (!r.ok) throw new Error(`ingest ${name}: ${r.status} ${await r.text()}`);
  }
}

// ---------------------------------------------------------------------------------------------
// Flows

async function trigger(datasetName, kind) {
  const id = created.datasets[datasetName];
  const field = kind === "ingest" ? "triggerIngestFlow" : "triggerTransformFlow";
  const d = await gql(
    `mutation($id: DatasetID!) { datasets { byId(datasetId: $id) { flows { runs { ${field} {
            __typename message ... on TriggerFlowSuccess { flow { flowId } } } } } } } }`,
    { id },
  );
  const res = expectType(d.datasets.byId.flows.runs[field], "TriggerFlowSuccess", `${field} ${datasetName}`);
  return res.flow.flowId;
}

async function flowsOf(datasetName) {
  const d = await gql(
    `query($id: DatasetID!) { datasets { byId(datasetId: $id) { flows { runs { listFlows(perPage: 100) { nodes {
            flowId status outcome { __typename } } } } } } } }`,
    { id: created.datasets[datasetName] },
  );
  return d.datasets.byId.flows.runs.listFlows.nodes;
}

async function waitFlow(datasetName, flowId, expectOutcome) {
  for (let i = 0; i < 240; i++) {
    const f = (await flowsOf(datasetName)).find((x) => x.flowId === flowId);
    if (f && f.status === "FINISHED") {
      const outcome = f.outcome?.__typename;
      created.flows.push({ dataset: datasetName, flowId, outcome });
      if (expectOutcome && outcome !== expectOutcome)
        throw new Error(`flow ${flowId} of ${datasetName}: ${outcome}, expected ${expectOutcome}`);
      log(`flow ${flowId} ${datasetName}: ${outcome}`);
      return outcome;
    }
    await sleep(500);
  }
  throw new Error(`flow ${flowId} of ${datasetName} did not finish`);
}

async function runFlow(datasetName, kind, expectOutcome) {
  return waitFlow(datasetName, await trigger(datasetName, kind), expectOutcome);
}

// ---------------------------------------------------------------------------------------------

/**
 * The `seed` profile: creates every dataset, flow run, env var, token, collection entry and
 * webhook through the API as the admin, on a temporary server on `port`, and waits until no flow
 * is waiting or running. Nothing is scheduled, so the workspace stays as it is afterwards.
 */
export async function buildSeedWorkspace(ws, port) {
  initWorkspace(ws);
  fs.mkdirSync(path.join(ws, "seed-data"));
  for (let i = 1; i <= 5; i++)
    fs.copyFileSync(path.join(SEED, `data/part${i}.csv`), path.join(ws, `seed-data/part${i}.csv`));
  created = { datasets: {}, flows: [], envVars: [], accessTokens: [], webhooks: {}, collection: [], versionedFile: [] };
  const server = await startLocal(ws, port, path.join(ws, ".seed/api-server.seed.log"));
  API = server.apiUrl;
  try {
    await login();
    const alice = await accountId("alice");
    const bob = await accountId("bob");

    for (let i = 1; i <= 14; i++) await createFromSnapshot(`extra${i}.yaml`);
    await createFromSnapshot("push.yaml");
    await createFromSnapshot("root.yaml");
    await createFromSnapshot("deriv.yaml");
    await createFromSnapshot("broken.yaml");
    await createFromSnapshot("idle.yaml");
    await createFromSnapshot("private.yaml", "PRIVATE");
    log("datasets created:", Object.keys(created.datasets).length);

    // nested-events: 12 push commits, so the metadata commit navigator has pages.
    await pushIngest(
      "nested-events",
      Array.from({ length: 12 }, (_, k) => ({
        event_time: `2021-01-${String(k + 1).padStart(2, "0")}T00:00:00Z`,
        id: k + 1,
        payload: { name: `n${k + 1}`, score: (k + 1) * 7 },
      })),
    );
    log("nested-events: 12 push ingests");

    // Flow history. A FilesGlob ingest takes one new file per run: five runs for part1-5,
    // a transform, part6 arrives, one more ingest, a second transform, then an ingest with
    // nothing new. population ends with 11 rows, population-big with 6. broken-feed fails.
    for (let i = 1; i <= 5; i++) await runFlow("population", "ingest", "FlowSuccessResult");
    await runFlow("population-big", "transform", "FlowSuccessResult");
    fs.copyFileSync(path.join(SEED, "data/part6.csv"), path.join(ws, "seed-data/part6.csv"));
    await runFlow("population", "ingest", "FlowSuccessResult");
    await runFlow("population-big", "transform", "FlowSuccessResult");
    await runFlow("population", "ingest", "FlowSuccessResult");
    await runFlow("broken-feed", "ingest", "FlowFailedError");
    {
      const d =
        await gql(`{ data { query(query: "select count(*) as n from \\"${ACCOUNT}/population\\"", queryDialect: SQL_DATA_FUSION, dataFormat: JSON_AOS) {
                __typename ... on DataQueryResultSuccess { data { content } } } } }`);
      created.populationRows = JSON.parse(d.data.query.data.content)[0].n;
      log("population rows:", created.populationRows);
    }

    // Environment variables and a secret.
    for (const [key, value, isSecret] of [
      ["API_URL", "https://example.com/api", false],
      ["REGION", "eu-west-1", false],
      ["API_TOKEN", "s3cr3t-value", true],
    ]) {
      const d = await gql(
        `mutation($id: DatasetID!, $k: String!, $v: String!, $s: Boolean!) { datasets { byId(datasetId: $id) { envVars {
                    upsertEnvVariable(key: $k, value: $v, isSecret: $s) { __typename message } } } } }`,
        { id: created.datasets.population, k: key, v: value, s: isSecret },
      );
      const t = d.datasets.byId.envVars.upsertEnvVariable.__typename;
      if (!/Created/.test(t)) throw new Error(`env var ${key}: ${t}`);
      created.envVars.push({ key, isSecret });
    }
    log("env vars:", created.envVars.map((v) => v.key).join(", "));

    // Collaborators.
    for (const [acc, role] of [
      [alice, "READER"],
      [bob, "EDITOR"],
    ]) {
      const d = await gql(
        `mutation($id: DatasetID!, $a: AccountID!, $r: DatasetAccessRole!) { datasets { byId(datasetId: $id) { collaboration {
                    setRole(accountId: $a, role: $r) { __typename message } } } } }`,
        { id: created.datasets.population, a: acc, r: role },
      );
      log("collaborator", role, d.datasets.byId.collaboration.setRole.__typename);
    }
    created.collaborators = { alice: "READER", bob: "EDITOR" };

    // Access tokens.
    for (const name of ["ci-pipeline", "jupyter-notebook"]) {
      const d = await gql(
        `mutation($a: AccountID!, $n: String!) { accounts { byId(accountId: $a) { accessTokens { createAccessToken(tokenName: $n) {
                    __typename message ... on CreateAccessTokenResultSuccess { token { id } } } } } } }`,
        { a: created.accountId, n: name },
      );
      const res = expectType(
        d.accounts.byId.accessTokens.createAccessToken,
        "CreateAccessTokenResultSuccess",
        `token ${name}`,
      );
      created.accessTokens.push({ name, id: res.token.id });
    }
    log("access tokens:", created.accessTokens.map((t) => t.name).join(", "));

    // Collection: entries at the root and in a folder (the folder view has an "up" row).
    const coll = await createArchetype("collection", "demo-collection");
    for (const [p, ds] of [
      ["/population", "population"],
      ["/population-big", "population-big"],
      ["/nested-events", "nested-events"],
      ["/reports/broken-feed", "broken-feed"],
      ["/reports/idle-feed", "idle-feed"],
    ]) {
      const d = await gql(
        `mutation($id: DatasetID!, $e: CollectionEntryInput!) { datasets { byId(datasetId: $id) { asCollection {
                    addEntry(entry: $e) { __typename isSuccess message } } } } }`,
        { id: coll, e: { path: p, ref: created.datasets[ds] } },
      );
      const res = d.datasets.byId.asCollection.addEntry;
      if (!res.isSuccess) throw new Error(`collection entry ${p}: ${res.message}`);
      created.collection.push(p);
    }
    log("collection entries:", created.collection.join(", "));

    // Versioned file: three versions of a small text file.
    const vf = await createArchetype("versioned-file", "demo-file");
    for (let v = 1; v <= 3; v++) {
      const content = Buffer.from(`Demo file, version ${v}\n`).toString("base64url");
      const d = await gql(
        `mutation($id: DatasetID!, $c: Base64Usnp!) { datasets { byId(datasetId: $id) { asVersionedFile {
                    uploadNewVersion(content: $c, contentType: "text/plain") { __typename isSuccess message } } } } }`,
        { id: vf, c: content },
      );
      const res = d.datasets.byId.asVersionedFile.uploadNewVersion;
      if (!res.isSuccess) throw new Error(`versioned file v${v}: ${res.message}`);
      created.versionedFile.push(v);
    }
    log("versioned file versions:", created.versionedFile.length);

    // Webhooks last: no dataset changes after this point, so no delivery is ever attempted.
    for (const label of ["demo-hook", "paused-hook"]) {
      const d = await gql(
        `mutation($id: DatasetID!, $i: WebhookSubscriptionInput!) { datasets { byId(datasetId: $id) { webhooks {
                    createSubscription(input: $i) { __typename message ... on CreateWebhookSubscriptionResultSuccess { subscriptionId } } } } } }`,
        {
          id: created.datasets.population,
          i: { targetUrl: `https://example.com/${label}`, eventTypes: ["DATASET.REF.UPDATED"], label },
        },
      );
      const res = expectType(
        d.datasets.byId.webhooks.createSubscription,
        "CreateWebhookSubscriptionResultSuccess",
        `webhook ${label}`,
      );
      created.webhooks[label] = res.subscriptionId;
    }
    {
      const d = await gql(
        `mutation($id: DatasetID!, $w: WebhookSubscriptionID!) { datasets { byId(datasetId: $id) { webhooks {
                    subscription(id: $w) { pause { __typename message } } } } } }`,
        { id: created.datasets.population, w: created.webhooks["paused-hook"] },
      );
      log("pause paused-hook:", d.datasets.byId.webhooks.subscription.pause.__typename);
    }
    log("webhooks:", Object.keys(created.webhooks).join(", "));

    // Frozen check: nothing waiting, running or retrying.
    await sleep(2000);
    for (const name of Object.keys(created.datasets)) {
      const busy = (await flowsOf(name).catch(() => [])).filter((f) => f.status !== "FINISHED");
      if (busy.length) throw new Error(`${name} has unfinished flows: ${JSON.stringify(busy)}`);
    }
    log("frozen: no waiting, running or retrying flows");

    // Head block hash of population, for the block page scenario.
    const h = await gql(
      `query($id: DatasetID!) { datasets { byId(datasetId: $id) { metadata { chain { blocks(page: 0, perPage: 1) { nodes { blockHash } } } } } } }`,
      { id: created.datasets.population },
    );
    created.populationHeadBlock = h.datasets.byId.metadata.chain.blocks.nodes[0].blockHash;
    created.seededAt = new Date().toISOString();
  } finally {
    await server.stop();
  }
  fs.writeFileSync(path.join(ws, ".seed/seed-info.json"), JSON.stringify(created, null, 2));
  log(
    `${Object.keys(created.datasets).length} datasets, ${created.flows.length} flow runs, seeded at ${created.seededAt}`,
  );
}
