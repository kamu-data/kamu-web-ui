"""Codex PreToolUse(Bash): deny-only command guard, then fingerprint the working tree."""

from __future__ import annotations

from scripts.agents import project
from scripts.agents.bash_edits import call_key, save_pending, snapshot
from scripts.agents.codex_common import codex_decision
from scripts.agents.command_policy import combine, node_version_verdicts, verdicts
from scripts.agents.common import emit, pre_tool_decision, read_payload, run_safely, runtime_state_dir

STATE_DIR = runtime_state_dir("codex")


def main() -> int:
    payload = read_payload()
    command = (payload.get("tool_input") or {}).get("command")
    if not isinstance(command, str):
        return 0
    found = verdicts(command)
    if project.node_selection_needed():
        found += node_version_verdicts(command)
    if decision := codex_decision(combine(found)):
        emit(pre_tool_decision(decision))
        return 0
    save_pending(STATE_DIR, call_key(payload), snapshot())
    return 0


if __name__ == "__main__":
    run_safely(main)
