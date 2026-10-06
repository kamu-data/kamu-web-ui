"""Codex SubagentStart: inject the repository contract for each delegated agent."""

from scripts.agents.common import additional_context, emit, run_safely
from scripts.agents.session_contract import contract


def main() -> int:
    emit(additional_context("SubagentStart", contract(
        "a shell read of its SKILL.md (for example `cat .agents/skills/<skill>/SKILL.md`)",
        "require explicit user authorization in AGENTS.md",
    )))
    return 0


if __name__ == "__main__":
    run_safely(main)
