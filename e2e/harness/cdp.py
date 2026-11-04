# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""A minimal Chrome DevTools Protocol client and a headless Chrome launcher."""

from __future__ import annotations

import asyncio
import json
import shutil
import subprocess
import urllib.request
from pathlib import Path
from typing import Any

import websockets

# Left to other tools, such as an IDE's debugger
RESERVED_CDP_PORT = 9222
# Only the local servers and the fonts the app's index.html loads resolve: an image or script from
# anywhere else (an account's avatar URL) would make the capture depend on the network
RESOLVED_HOSTS = ["localhost", "127.0.0.1", "fonts.googleapis.com", "fonts.gstatic.com"]


def _version(port: int) -> dict | None:
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/version", timeout=1) as response:
            return json.load(response)
    except OSError:
        return None


class Chrome:
    """A headless Chrome on `port` with its own profile in `profile_dir`."""

    def __init__(self, proc: subprocess.Popen, port: int, profile_dir: Path, version: str):
        self.proc = proc
        self.port = port
        self.profile_dir = profile_dir
        self.version = version

    @classmethod
    async def launch(cls, profile_dir: Path, port: int, binary: str) -> Chrome:
        if port == RESERVED_CDP_PORT:
            raise RuntimeError(f"CDP port {RESERVED_CDP_PORT} is left to other tools; use 9233+")
        # A Chrome already listening on this port is not ours: refuse instead of driving it
        if _version(port):
            raise RuntimeError(f"port {port} already serves CDP; pick another CDP port")
        shutil.rmtree(profile_dir, ignore_errors=True)
        rules = "MAP * ~NOTFOUND, " + ", ".join(f"EXCLUDE {host}" for host in RESOLVED_HOSTS)
        proc = subprocess.Popen(
            [
                binary,
                "--headless=new",
                f"--remote-debugging-port={port}",
                f"--user-data-dir={profile_dir}",
                "--window-size=1440,900",
                "--hide-scrollbars",
                "--force-device-scale-factor=1",
                "--disable-gpu",
                "--font-render-hinting=none",
                "--disable-lcd-text",
                "--disable-features=Translate,MediaRouter,OptimizationHints",
                "--no-first-run",
                "--no-default-browser-check",
                f"--host-resolver-rules={rules}",
                "about:blank",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        for _ in range(100):
            if version := _version(port):
                return cls(proc, port, profile_dir, version["Browser"])
            await asyncio.sleep(0.1)
        proc.kill()
        raise RuntimeError(f"{binary} did not start")

    async def open_page(self) -> Cdp:
        request = urllib.request.Request(f"http://127.0.0.1:{self.port}/json/new?about:blank", method="PUT")
        with urllib.request.urlopen(request) as response:
            target = json.load(response)
        return await Cdp.connect(target["webSocketDebuggerUrl"])

    async def close(self) -> None:
        self.proc.kill()
        for _ in range(50):
            if self.proc.poll() is not None:
                break
            await asyncio.sleep(0.1)
        # Chrome's helper processes may still be writing for a moment
        for _ in range(10):
            shutil.rmtree(self.profile_dir, ignore_errors=True)
            if not self.profile_dir.exists():
                return
            await asyncio.sleep(0.3)


class Cdp:
    """One page target: `send` calls a method, `on` subscribes to an event."""

    def __init__(self, ws: websockets.ClientConnection):
        self._ws = ws
        self._last_id = 0
        self._pending: dict[int, tuple[asyncio.Future, str]] = {}
        self._listeners: dict[str, list] = {}
        self._reader = asyncio.create_task(self._read())

    @classmethod
    async def connect(cls, url: str) -> Cdp:
        # Screenshots of long pages are tens of megabytes
        return cls(await websockets.connect(url, max_size=None))

    async def send(self, method: str, params: dict | None = None) -> dict[str, Any]:
        self._last_id += 1
        future = asyncio.get_running_loop().create_future()
        self._pending[self._last_id] = (future, method)
        await self._ws.send(json.dumps({"id": self._last_id, "method": method, "params": params or {}}))
        return await future

    def on(self, event: str, fn) -> None:
        self._listeners.setdefault(event, []).append(fn)

    async def close(self) -> None:
        self._reader.cancel()
        await self._ws.close()

    async def _read(self) -> None:
        try:
            async for raw in self._ws:
                message = json.loads(raw)
                if "id" in message and message["id"] in self._pending:
                    future, method = self._pending.pop(message["id"])
                    if "error" in message:
                        future.set_exception(RuntimeError(f"{method}: {message['error']['message']}"))
                    else:
                        future.set_result(message.get("result", {}))
                elif "method" in message:
                    for fn in self._listeners.get(message["method"], []):
                        fn(message.get("params", {}))
        finally:
            # A closed connection (Chrome gone) answers nothing more: fail the calls still waiting
            for future, method in self._pending.values():
                if not future.done():
                    future.set_exception(RuntimeError(f"{method}: the browser connection closed"))
            self._pending.clear()
