"""Codex PostToolUse(apply_patch): prettier and added-text checks on every patched file."""

from __future__ import annotations

import sys

from scripts.agents.codex_common import patch_files, patch_text
from scripts.agents.common import additional_context, emit, read_payload, repo_relative, run_safely
from scripts.agents.lint_ledger import CODEX_STATE as LINT_STATE, is_lint_input, note_lint_input_edit
from scripts.agents.post_edit import check_edit, report


def main() -> int:
    problems, notes = [], []
    payload = read_payload()
    paths = patch_files(patch_text(payload))
    for path, added in paths.items():
        p, n = check_edit(path, "", "\n".join(added))
        problems += p
        notes += n
    if any(is_lint_input(repo_relative(path)) for path in paths):
        note_lint_input_edit(payload.get("session_id") or "unknown", LINT_STATE)
    if problems:
        sys.stderr.write(report(list(dict.fromkeys(problems))))
        return 2
    if notes:
        emit(additional_context("PostToolUse", "\n".join(dict.fromkeys(notes))))
    return 0


if __name__ == "__main__":
    run_safely(main)
