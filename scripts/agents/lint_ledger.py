"""Remember the last green `npm run lint`, and whether its inputs changed since.

The fingerprint covers HEAD plus every changed or untracked lint input (TypeScript, the eslint
and TypeScript configs, package.json), so it moves exactly when eslint's verdict could.
"""

from __future__ import annotations

import hashlib
import subprocess

from scripts.agents import project
from scripts.agents.common import ROOT, locked_state, matches, now, runtime_state_dir
from scripts.agents.command_policy import drop_redirects, lex, segments, selects_node

STATE = ROOT / ".claude" / "state" / "lint.json"
CODEX_STATE = runtime_state_dir("codex") / "lint.json"


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, check=True).stdout


def fingerprint() -> str | None:
    """None when no lint input differs from HEAD."""
    diff = git("diff", "HEAD", "--", *project.LINT_PATHSPEC)
    untracked = git("ls-files", "--others", "--exclude-standard", "--", *project.LINT_PATHSPEC).split()
    if not diff and not untracked:
        return None
    h = hashlib.sha256(git("rev-parse", "HEAD").encode() + diff.encode())
    for rel in sorted(untracked):
        try:
            h.update(rel.encode() + (ROOT / rel).read_bytes())
        except OSError:
            pass
    return h.hexdigest()


def is_lint_input(rel: str | None) -> bool:
    return bool(rel) and matches(rel, project.LINT_INPUTS)


def is_whole_lint_run(command: str) -> bool:
    """The lint script alone on the line, so a success really is the linter's."""
    try:
        parts = segments(lex(command))
    except ValueError:
        return False
    # Selecting the pinned Node first (`. "$NVM_DIR/nvm.sh" && nvm use &&`) does not change the verdict
    while len(parts) > 1 and parts[0][1] == "&&" and selects_node(drop_redirects(parts[0][0])):
        parts = parts[1:]
    if len(parts) != 1 or parts[0][1]:
        return False
    # Output saved to a file is still the whole run
    return drop_redirects(parts[0][0]) in project.LINT_COMMANDS


def record_green(state_file=None) -> None:
    state_file = state_file or STATE
    with locked_state(state_file) as state:
        state["green"] = fingerprint() or "clean"
        state["at"] = now()


def note_lint_input_edit(session_id: str, state_file=None) -> None:
    state_file = state_file or STATE
    with locked_state(state_file) as state:
        sessions = state.setdefault("edited_sessions", {})
        sessions[session_id] = now()
        cutoff = now() - 14 * 24 * 3600
        state["edited_sessions"] = {k: v for k, v in sessions.items() if v >= cutoff}


def stop_reminder(session_id: str, state_file=None) -> str | None:
    """A reminder once per lint-input state, only for sessions that edited lint inputs themselves."""
    state_file = state_file or STATE
    with locked_state(state_file) as state:
        if session_id not in state.get("edited_sessions", {}):
            return None
        current = fingerprint()
        if current is None or current == state.get("green"):
            return None
        reminded = state.setdefault("reminded", {})
        if reminded.get(session_id) == current:
            return None
        reminded[session_id] = current
    return (
        f"Lint inputs (TypeScript, eslint or tsconfig config, package.json) changed since the last green "
        f"`{project.LINT_COMMAND}` (AGENTS.md, 'Validation'). "
        f"Run `{project.LINT_COMMAND}` (or delegate to the ng-builder subagent) and fix what it reports "
        "before handing back — or say explicitly why it is not needed for this change."
    )
