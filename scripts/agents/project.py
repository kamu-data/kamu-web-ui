"""Facts about this repository that the shared hook modules consult.

The rest of this package tracks its kamu-cli counterpart module by module; what differs between
the two repositories (toolchain, file types, added-text rules) lives here, so a diff of the two
packages shows only real divergence.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
from functools import cache
from pathlib import Path

from scripts.agents.common import ROOT, matches

# The header eslint's `license-header/header` rule enforces; this file is its single source
LICENSE_HEADER_FILE = ROOT / "src" / "docs" / "license-header-template.js"
LICENSE_SCOPE = ["src/app/**/*.ts"]
LICENSE_EXEMPT = ["src/app/api/kamu.graphql.interface.ts", "src/app/editor/generated/**"]

# Node tools run on the version `.nvmrc` pins, resolved through nvm
NVMRC = ROOT / ".nvmrc"
NODE_TOOLS = {"npm", "npx", "ng", "node", "eslint", "prettier", "stylelint", "tsc", "karma", "graphql-codegen"}
SELECT_NODE = '. "$NVM_DIR/nvm.sh" && nvm use >/dev/null &&'

# Same file set as `npm run prettier`; `.prettierignore` still applies to explicit paths
PRETTIER = ROOT / "node_modules" / ".bin" / "prettier"
FORMATTED = ["**/*.ts", "**/*.html", "**/*.scss", "**/*.js"]

# The lint gate: a green run of one of these, alone on the command line, clears the Stop reminder
LINT_COMMAND = "npm run lint"
LINT_COMMANDS = [["npm", "run", "lint"], ["npm", "run", "lint-and-fix"]]
LINT_PATHSPEC = ["*.ts", "eslint.config.mjs", "tsconfig*.json", "package.json"]
LINT_INPUTS = ["**/*.ts", "eslint.config.mjs", "tsconfig*.json", "package.json"]

# Commands whose output is long and whose failures sit anywhere in it
OUTPUT_HEAVY_NG = {"test", "t", "build", "b", "lint", "l", "e2e", "e"}
OUTPUT_HEAVY_TOOLS = {"eslint", "stylelint", "prettier", "tsc", "karma", "graphql-codegen"}
OUTPUT_HEAVY_NPM_SCRIPT = re.compile(r"^(test.*|lint.*|stylelint.*|build.*|prettier.*|gql-codegen)$")

NPM_INSTALL = {"install", "i", "in", "add", "isntall"}
NPM_CHANGES_DEPENDENCIES = {"uninstall", "remove", "rm", "r", "un", "unlink", "update", "up", "upgrade"}
NPM_RELEASE_SCRIPT = re.compile(r"^release-")

CITATION = "comments never cite plans, tickets or issues — the referent rots (kamu-ui-prose-and-comments)"
NARRATION = "comments describe the code as it is, never its history (kamu-ui-prose-and-comments)"

# `//` comments, block-comment lines (`/*`, ` * `) and HTML comments
COMMENT = re.compile(r"(?:^|[^:\"'`/])//+\s?(.*)$|^\s*/?\*+\s?(.*)$|<!--\s?(.*?)(?:-->|$)")
IGNORED_UPPER_TOKENS = re.compile(
    r"\b(UTF|SHA|ISO|RFC|HTTP|TLS|AES|RSA|ECDSA|ED|CRC|X|BLAKE|MD|S|UUID|IPV|HMAC|PKCS|ES|ECMA)-\d+\b", re.I
)

TS = ["**/*.ts"]
SPEC = ["**/*.spec.ts"]
COMMENTED = ["**/*.ts", "**/*.html", "**/*.scss", "**/*.js", "**/*.mjs"]

RULES: list[tuple[re.Pattern[str], str, bool, list[str]]] = [
    # (pattern, message, applies to comment text only, files it applies to)
    (re.compile(r"(?<![\w.$])(fdescribe|fit|xdescribe|xit)\s*\("), "focused or disabled tests never land; use `describe`/`it` (eslint `jasmine/no-focused-tests`, `jasmine/no-disabled-tests`)", False, SPEC),
    (re.compile(r"\bconsole\.(log|debug|trace)\s*\("), "remove debugging output; report errors through the app's error handling (eslint `no-console`)", False, TS),
    (re.compile(r"eslint-disable"), "do not silence lints with `eslint-disable` — fix the cause, or ask the user first (AGENTS.md, 'Validation')", False, COMMENTED),
    (re.compile(r"\bstandalone\s*:\s*true\b"), "`standalone: true` is the Angular default; omit it (kamu-ui-angular-style)", False, TS),
    (re.compile(r"\bconstructor\s*\([^)]*\b(private|protected|public|readonly)\s+\w+\s*:"), "inject dependencies with `private foo = inject(Foo)` fields, not constructor parameters (kamu-ui-angular-style)", False, TS),
    (re.compile(r"\b(plan|slice)\s+#?\d+\b|\b(jira|ticket|issue|pr)\s*#\s*\d+|\bjira\b", re.I), CITATION, True, COMMENTED),
    (re.compile(r"\b[A-Z][A-Z0-9]+-\d{2,}\b"), CITATION, True, COMMENTED),
    (re.compile(r"\b(was|were) previously\b|\bused to (be|return|have|hold|take)\b|\bno longer (exists?|returns?|used|supported|called|present)\b|\b(has|have) been (renamed|replaced|removed|moved)\b|\brenamed from\b|\bthis (change|patch|commit|PR)\b", re.I), NARRATION, True, COMMENTED),
]

ROUTING_FILE = ["src/app/**/*routing*.ts"]
ROUTE_LOADING = re.compile(r"\b(loadChildren|loadComponent|component)\s*:")


def nudges(rel: str, added: list[str]) -> list[str]:
    """Follow-up commands an edit implies; shown as context, never blocking."""
    out = []
    if rel.startswith("src/app/api/") and rel.endswith(".graphql"):
        out.append(
            "GraphQL document changed: run `npm run gql-codegen` and keep the regenerated "
            "`src/app/api/kamu.graphql.interface.ts` in the same change (kamu-ui-graphql-api)."
        )
    if matches(rel, ROUTING_FILE) and any(ROUTE_LOADING.search(line) for line in added):
        out.append(
            "Route loading changed: run `npm run build-prod` and check the lazy chunk list it prints "
            "(kamu-ui-routing)."
        )
    if rel == "package.json":
        out.append(
            "package.json changed: run `npm install` so package-lock.json follows, and keep the pinned "
            "pairs in update-dependecies.md (kamu-ui-release-dependency-workflows)."
        )
    return out


@cache
def nvm_node_bin() -> Path | None:
    """The bin directory of the Node version `.nvmrc` pins, as nvm installed it.

    None without nvm, without `.nvmrc`, or when that version is not installed; callers then
    fall back to whatever Node is on PATH.
    """
    script = Path(os.environ.get("NVM_DIR") or Path.home() / ".nvm") / "nvm.sh"
    if not script.is_file() or not NVMRC.is_file():
        return None
    try:
        result = subprocess.run(
            ["bash", "-c", '. "$1" --no-use >/dev/null 2>&1 && nvm which', "_", str(script)],
            cwd=ROOT, capture_output=True, text=True, timeout=30,
        )
    except (OSError, subprocess.TimeoutExpired):
        return None
    lines = result.stdout.strip().splitlines()
    if result.returncode or not lines or not Path(lines[-1]).is_file():
        return None
    return Path(lines[-1]).parent


def node_selection_needed() -> bool:
    """Whether a shell that has not selected a version would run a Node other than the pinned one."""
    pinned = nvm_node_bin()
    if pinned is None:
        return False
    default = shutil.which("node")
    return default is None or Path(default).resolve().parent != pinned.resolve()


def node_env() -> dict[str, str]:
    """The environment for running Node tools: the pinned Node first on PATH."""
    env = dict(os.environ)
    if bin_dir := nvm_node_bin():
        env["PATH"] = f"{bin_dir}{os.pathsep}{env.get('PATH', '')}"
    return env
