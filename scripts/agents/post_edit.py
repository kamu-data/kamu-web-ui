"""Checks run after an agent edits files: format with prettier, then judge only the text it added.

Only added lines are judged, so existing code that predates a rule never blocks an
unrelated edit. A failed check exits 2: the edit already landed, and the message tells the
agent which rule it broke and how to fix it forward.
"""

from __future__ import annotations

import subprocess
from pathlib import Path

from scripts.agents import project
from scripts.agents.common import ROOT, matches, repo_relative

LICENSE_HEADER = project.LICENSE_HEADER_FILE.read_text().strip()


def added_lines(old: str, new: str) -> list[str]:
    """Lines present in `new` but not in `old` — a cheap, order-insensitive diff."""
    before = set(old.splitlines())
    return [line for line in new.splitlines() if line not in before]


def head_version(rel: str) -> str | None:
    try:
        return subprocess.run(["git", "show", f"HEAD:{rel}"], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    except (subprocess.CalledProcessError, OSError):
        return None


def comment_text(line: str) -> str:
    m = project.COMMENT.search(line)
    if not m:
        return ""
    text = next((g for g in m.groups() if g is not None), "")
    return project.IGNORED_UPPER_TOKENS.sub("", text)


def check_lines(rel: str, lines: list[str]) -> list[str]:
    rules = [(p, msg, comment_only) for p, msg, comment_only, files in project.RULES if matches(rel, files)]
    if not rules:
        return []
    problems = []
    for line in lines:
        comment = comment_text(line)
        for pattern, message, comment_only in rules:
            subject = comment if comment_only else line
            if subject and pattern.search(subject):
                problems.append(f"{rel}: {message}\n    > {line.strip()}")
    return problems


def check_license(rel: str, path: Path) -> list[str]:
    if not matches(rel, project.LICENSE_SCOPE) or matches(rel, project.LICENSE_EXEMPT) or head_version(rel) is not None:
        return []
    try:
        content = path.read_text()
    except OSError:
        return []
    if content.startswith(LICENSE_HEADER):
        return []
    return [f"{rel}: new files start with the license header from src/docs/license-header-template.js (eslint `license-header/header`)"]


def prettier(path: Path) -> str | None:
    """Format one file; return an error description, or None when it formatted cleanly."""
    if not project.PRETTIER.exists():
        return "node_modules/.bin/prettier not found (run `npm ci`)"
    try:
        result = subprocess.run(
            [str(project.PRETTIER), "--write", "--log-level", "warn", str(path)],
            cwd=ROOT, capture_output=True, text=True, timeout=60, env=project.node_env(),
        )
    except (OSError, subprocess.TimeoutExpired) as e:
        return str(e)
    return None if result.returncode == 0 else (result.stderr or result.stdout).strip()[:600]


def nudges(rel: str, added: list[str]) -> list[str]:
    return project.nudges(rel, added)


def check_edit(path_str: str, old: str | None, new: str) -> tuple[list[str], list[str]]:
    """Return (problems that block, context notes) for one edited file.

    `old` is the replaced text for an in-place edit; None means the whole file was written,
    so its added lines are judged against the committed version.
    """
    rel = repo_relative(path_str)
    if not rel:
        return [], []
    path = ROOT / rel
    if old is None:
        old = head_version(rel) or ""
    added = added_lines(old, new)
    problems, notes = [], nudges(rel, added)
    if matches(rel, project.FORMATTED) and path.exists():
        if err := prettier(path):
            notes.append(f"prettier could not format {rel}: {err}")
    problems += check_lines(rel, added)
    if path.exists():
        problems += check_license(rel, path)
    return problems, notes


def report(problems: list[str]) -> str:
    return "Edit landed but breaks repository rules — fix it forward:\n" + "\n".join(f"- {p}" for p in problems) + "\n"
