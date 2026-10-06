"""Claude SessionStart: inject the harness contract; a compacted or cleared session reloads skills.

Also puts the Node version `.nvmrc` pins first on PATH for every later Bash command, through
the environment file Claude Code sources before each one.
"""

from __future__ import annotations

import os

from scripts.agents import project
from scripts.agents.common import additional_context, emit, read_payload, run_safely
from scripts.agents.session_contract import contract
from scripts.agents.skill_ledger import CLAUDE_STATE, forget_session


def main() -> int:
    payload = read_payload()
    if payload.get("source") in {"clear", "compact"} and payload.get("session_id"):
        forget_session(payload["session_id"], CLAUDE_STATE)
    env_file = os.environ.get("CLAUDE_ENV_FILE")
    if env_file and (bin_dir := project.nvm_node_bin()):
        with open(env_file, "a") as f:
            f.write(f'export PATH="{bin_dir}:$PATH"\n')
    emit(additional_context("SessionStart", contract()))
    return 0


if __name__ == "__main__":
    run_safely(main)
