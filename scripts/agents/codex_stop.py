"""Codex Stop: continue once when this session changed lint inputs after green lint."""

from __future__ import annotations

from scripts.agents.common import emit, read_payload, run_safely
from scripts.agents.lint_ledger import CODEX_STATE, stop_reminder


def main() -> int:
    payload = read_payload()
    if payload.get("stop_hook_active"):
        return 0
    if reason := stop_reminder(payload.get("session_id") or "unknown", CODEX_STATE):
        emit({"decision": "block", "reason": reason})
    return 0


if __name__ == "__main__":
    run_safely(main)
