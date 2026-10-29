# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""A throwaway git repository wired like this one, for running hooks exactly as configured."""

import os
import shutil
import subprocess
from pathlib import Path

from scripts.agents.common import ROOT
from scripts.agents.project import LICENSE_HEADER_FILE, PRETTIER

PRETTIER_AVAILABLE = PRETTIER.exists()


def make_scratch_repo(root: Path) -> None:
    for package in ("agents", "license"):
        shutil.copytree(ROOT / "scripts" / package, root / "scripts" / package,
                        ignore=shutil.ignore_patterns("__pycache__", "tests"))
    shutil.copytree(ROOT / "scripts" / "agents" / "tests", root / "scripts" / "agents" / "tests",
                    ignore=shutil.ignore_patterns("__pycache__"))
    shutil.copytree(ROOT / ".claude" / "hooks", root / ".claude" / "hooks")
    header = root / LICENSE_HEADER_FILE.relative_to(ROOT)
    header.parent.mkdir(parents=True)
    shutil.copy(LICENSE_HEADER_FILE, header)
    for name in (".nvmrc", ".prettierrc.json", ".prettierignore"):
        if (ROOT / name).exists():
            shutil.copy(ROOT / name, root / name)
    if (ROOT / "node_modules").exists():
        os.symlink(ROOT / "node_modules", root / "node_modules")
    (root / ".gitignore").write_text("node_modules\n.claude/state/\n.codex/state/\n")
    subprocess.run(["git", "init", "-q", str(root)], check=True, capture_output=True)


def license_header() -> str:
    return LICENSE_HEADER_FILE.read_text()
