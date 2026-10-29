/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// Serves a built app as an SPA, with its runtime config pointed at a given API server.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".map": "application/json",
  ".wasm": "application/wasm",
};

/**
 * Serves `browserDir` (an `ng build` output's `browser` folder) on `port`, answering
 * `assets/runtime-config.json` with the API at `apiUrl`. Resolves to a function that stops it.
 */
export function serve(browserDir, port, apiUrl) {
  const root = path.resolve(browserDir);
  const runtimeConfig = JSON.parse(fs.readFileSync(path.join(root, "assets/runtime-config.json"), "utf8"));
  runtimeConfig.apiServerGqlUrl = `${apiUrl}/graphql`;
  runtimeConfig.apiServerHttpUrl = apiUrl;
  const configBody = JSON.stringify(runtimeConfig);

  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (url === "/assets/runtime-config.json") {
      res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(configBody);
      return;
    }
    let file = path.join(root, url);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(root, "index.html");
    }
    res.writeHead(200, {
      "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(() => new Promise((done) => server.close(done))));
  });
}
