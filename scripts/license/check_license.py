# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""Checks that every source file starts with the license header from
`src/docs/license-header-template.js`.

Run from the repository root: `npm run check-license`. Exit status 1 lists every file without it.

eslint's `license-header/header` rule owns TypeScript under `src/app`; this check owns every other
kind: stylesheets, scripts and config files. Files that take `#` comments (Python, shell) carry the
same text as `#` lines. A `#!` line may come first in any file. Empty files (package markers) are
exempt.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[2]
LICENSE_HEADER_FILE = ROOT / "src" / "docs" / "license-header-template.js"

BLOCK_COMMENT = {".ts", ".js", ".mjs", ".cjs", ".scss"}
HASH_COMMENT = {".py", ".sh"}
# TypeScript eslint checks for the header
ESLINT_CHECKED_TS = "src/app/"
# Rewritten by its generator
GENERATED = "src/app/editor/generated/"


def hash_form(block: str) -> str:
    """The `/** ... */` header as `#` comment lines."""
    lines = block.strip().splitlines()[1:-1]
    return "\n".join("#" + line.lstrip()[1:].rstrip() for line in lines)


def in_scope(rel: str) -> bool:
    suffix = PurePosixPath(rel).suffix
    if suffix not in BLOCK_COMMENT | HASH_COMMENT:
        return False
    if suffix == ".ts" and rel.startswith(ESLINT_CHECKED_TS):
        return False
    return not rel.startswith(GENERATED)


def has_header(rel: str, text: str, block: str) -> bool:
    if not text.strip():
        return True
    if text.startswith("#!"):
        text = text.split("\n", 1)[1] if "\n" in text else ""
    if PurePosixPath(rel).suffix in HASH_COMMENT:
        return text.startswith(hash_form(block))
    return text.startswith(block.strip())


def source_files(root: Path) -> list[str]:
    """Tracked files and new ones git does not ignore."""
    out = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard"],
        cwd=root,
        capture_output=True,
        text=True,
        check=True,
    ).stdout
    return sorted(rel for rel in out.splitlines() if (root / rel).is_file())


def missing(root: Path, block: str) -> list[str]:
    return [
        rel
        for rel in source_files(root)
        if in_scope(rel) and not has_header(rel, (root / rel).read_text(encoding="utf8"), block)
    ]


def main() -> int:
    block = LICENSE_HEADER_FILE.read_text(encoding="utf8")
    files = missing(ROOT, block)
    for rel in files:
        print(f"{rel}: does not start with the license header from src/docs/license-header-template.js")
    print(f"check-license: {len(files)} files without the header")
    return 1 if files else 0


if __name__ == "__main__":
    sys.exit(main())
