/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// Minimal Chrome DevTools Protocol client over Node's built-in WebSocket, and a headless Chrome launcher.
import { spawn } from "node:child_process";
import fs from "node:fs";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function launchChrome(profileDir, port, binary) {
  if (port === 9222) throw new Error("CDP port 9222 is left to other tools; use 9233+");
  // A Chrome already listening on this port is not ours: refuse instead of driving it
  let busy = false;
  try {
    busy = (await fetch(`http://127.0.0.1:${port}/json/version`)).ok;
  } catch {
    // nothing listens there
  }
  if (busy) throw new Error(`port ${port} already serves CDP; pick another CDP port`);
  fs.rmSync(profileDir, { recursive: true, force: true });
  // Only the local servers and the fonts the app's index.html loads resolve: an image or script
  // from anywhere else (an account's avatar URL) would make the capture depend on the network
  const hosts = ["localhost", "127.0.0.1", "fonts.googleapis.com", "fonts.gstatic.com"];
  const proc = spawn(
    binary,
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      "--window-size=1440,900",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--disable-gpu",
      "--font-render-hinting=none",
      "--disable-lcd-text",
      "--disable-features=Translate,MediaRouter,OptimizationHints",
      "--no-first-run",
      "--no-default-browser-check",
      `--host-resolver-rules=MAP * ~NOTFOUND, ${hosts.map((h) => `EXCLUDE ${h}`).join(", ")}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  for (let i = 0; i < 100; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return { proc, port, version: (await response.json()).Browser };
    } catch {
      // not up yet
    }
    await sleep(100);
  }
  proc.kill("SIGKILL");
  throw new Error(`${binary} did not start`);
}

export async function killChrome(proc, profileDir) {
  proc.kill("SIGKILL");
  for (let i = 0; i < 50 && proc.exitCode === null && proc.signalCode === null; i++) await sleep(100);
  // Chrome's helper processes may still be writing for a moment
  try {
    fs.rmSync(profileDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch (e) {
    console.error(`could not remove ${profileDir}: ${e.message}`);
  }
}

export async function openPage(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  const target = await response.json();
  return connect(target.webSocketDebuggerUrl);
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let lastId = 0;
    const pending = new Map();
    const listeners = new Map();
    const client = {
      send(method, params = {}) {
        const id = ++lastId;
        ws.send(JSON.stringify({ id, method, params }));
        return new Promise((res, rej) => pending.set(id, { res, rej, method }));
      },
      on(event, fn) {
        if (!listeners.has(event)) listeners.set(event, []);
        listeners.get(event).push(fn);
      },
      close() {
        ws.close();
      },
    };
    ws.onopen = () => resolve(client);
    ws.onerror = (e) => reject(e);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        const call = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) call.rej(new Error(`${call.method}: ${message.error.message}`));
        else call.res(message.result);
      } else if (message.method) {
        for (const fn of listeners.get(message.method) ?? []) fn(message.params);
      }
    };
  });
}
