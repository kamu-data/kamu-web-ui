# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""Serves a built app as an SPA, with its runtime config pointed at a given API server."""

from __future__ import annotations

import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

RUNTIME_CONFIG = "/assets/runtime-config.json"
# Fixed rather than from the machine's mime database: a module script served as anything else fails
TYPES = {
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
}


class Served:
    """`browser_dir` (an `ng build` output's `browser` folder) on `port`, answering the runtime config
    with the API at `api_url`. Stop it with `stop()`."""

    def __init__(self, browser_dir: Path, port: int, api_url: str):
        root = browser_dir.resolve()
        config = json.loads((root / RUNTIME_CONFIG.lstrip("/")).read_text())
        config["apiServerGqlUrl"] = f"{api_url}/graphql"
        config["apiServerHttpUrl"] = api_url
        config_body = json.dumps(config).encode()

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):  # noqa: N802 (the http.server API)
                path = unquote(urlparse(self.path).path)
                if path == RUNTIME_CONFIG:
                    body, kind = config_body, "application/json"
                else:
                    file = (root / path.lstrip("/")).resolve()
                    if not file.is_relative_to(root) or not file.is_file():
                        file = root / "index.html"
                    body = file.read_bytes()
                    kind = TYPES.get(file.suffix, "application/octet-stream")
                self.send_response(200)
                self.send_header("content-type", kind)
                self.send_header("cache-control", "no-store")
                self.send_header("content-length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)

            def log_message(self, *_):
                pass

        self.server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
        threading.Thread(target=self.server.serve_forever, daemon=True).start()

    def stop(self) -> None:
        self.server.shutdown()
        self.server.server_close()
