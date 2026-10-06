import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.agents import codex_stop
from scripts.agents.codex_common import codex_decision, patch_files
from scripts.agents.command_policy import decide
from scripts.agents.common import ROOT
from scripts.agents.tests.scratch_repo import PRETTIER_AVAILABLE, license_header, make_scratch_repo

PATCH = """*** Begin Patch
*** Update File: src/app/api/gql/account/account-by-name.graphql
@@ query
 context
-removed
+added one
*** Add File: docs/internal/new.md
+# New
*** Delete File: old.ts
*** End Patch"""


class CodexTest(unittest.TestCase):
    def test_patch_paths_and_added_lines(self):
        self.assertEqual(patch_files(PATCH), {
            "src/app/api/gql/account/account-by-name.graphql": ["added one"],
            "docs/internal/new.md": ["# New"],
            "old.ts": [],
        })

    def test_codex_denies_mechanical_policy_violations_only(self):
        self.assertEqual(codex_decision(decide("git reset --hard"))[0], "deny")
        self.assertIsNone(codex_decision(decide("npm install lodash")))
        self.assertIsNone(codex_decision(decide("npm run release-patch")))
        self.assertIsNone(codex_decision(decide("git commit -m x")))
        self.assertIsNone(codex_decision(decide("git status")))

    def test_move_checks_both_paths_and_attributes_added_lines_to_destination(self):
        self.assertEqual(patch_files("*** Begin Patch\n*** Update File: old.ts\n"
                                     "*** Move to: new.ts\n@@\n+added\n*** End Patch"),
                         {"old.ts": [], "new.ts": ["added"]})


class CodexHookTest(unittest.TestCase):
    def setUp(self):
        self.harness = CodexHookHarness()
        self.addCleanup(self.harness.close)

    def test_shell_guard_denies_destructive_commands_and_passes_reads(self):
        self.assertEqual(self.harness.decision("Bash", "git reset --hard"), "deny")
        self.assertIsNone(self.harness.decision(
            "Bash", '. "$NVM_DIR/nvm.sh" && nvm use >/dev/null && npm install lodash'))
        self.assertEqual(self.harness.decision("Bash", "npm test | tail"), "deny")
        self.assertIsNone(self.harness.decision("Bash", "git status"))

    def test_generated_files_cannot_be_added_deleted_or_moved(self):
        for patch in ["*** Add File: resources/schema.graphql\n+text",
                      "*** Delete File: src/app/api/kamu.graphql.interface.ts",
                      "*** Update File: ordinary.txt\n*** Move to: package-lock.json"]:
            with self.subTest(patch=patch):
                self.assertEqual(self.harness.patch_decision(patch), "deny")

    def test_guarded_patch_requires_a_successful_skill_read_in_the_same_session(self):
        patch = "*** Update File: AGENTS.md\n@@\n+text"
        self.assertEqual(self.harness.patch_decision(patch), "deny")
        self.harness.read_skill(exit_code=1)
        self.assertEqual(self.harness.patch_decision(patch), "deny")
        self.harness.read_skill()
        self.assertIsNone(self.harness.patch_decision(patch))
        self.assertEqual(self.harness.patch_decision(patch, session="other"), "deny")

    def test_compaction_requires_skill_reload_and_uses_codex_instructions(self):
        self.harness.read_skill()
        output = self.harness.run("SessionStart", source="compact")
        context = output["hookSpecificOutput"]["additionalContext"]
        self.assertIn("cat .agents/skills/", context)
        self.assertNotIn("the Skill tool", context)
        self.assertEqual(self.harness.patch_decision("*** Update File: AGENTS.md"), "deny")

    def test_subagent_start_receives_the_codex_contract(self):
        output = self.harness.run("SubagentStart")
        context = output["hookSpecificOutput"]
        self.assertEqual(context["hookEventName"], "SubagentStart")
        self.assertIn("cat .agents/skills/", context["additionalContext"])

    @unittest.skipUnless(PRETTIER_AVAILABLE, "node_modules not installed")
    def test_post_patch_formats_and_reports_added_line_violations(self):
        self.harness.write_ts("example.spec.ts", 'fit("x",()=>{})')
        result = self.harness.invoke("PostToolUse", "apply_patch", command=self.harness.patch(
            '*** Add File: example.spec.ts\n+fit("x",()=>{})'))
        self.assertEqual(result.returncode, 2)
        self.assertIn("focused or disabled tests", result.stderr)
        self.assertIn('fit("x", () => {})', (self.harness.root / "example.spec.ts").read_text())

    def test_post_patch_provides_regeneration_context(self):
        output = self.harness.run("PostToolUse", "apply_patch", command=self.harness.patch(
            "*** Update File: src/app/api/gql/account/account-by-name.graphql\n@@\n+text"))
        self.assertIn("npm run gql-codegen", output["hookSpecificOutput"]["additionalContext"])

    def test_stop_continues_with_a_lint_reminder(self):
        with mock.patch.object(codex_stop, "read_payload", return_value={"session_id": "test"}), \
                mock.patch.object(codex_stop, "stop_reminder", return_value="run npm run lint") as reminder, \
                mock.patch.object(codex_stop, "emit") as emit:
            self.assertEqual(codex_stop.main(), 0)
        reminder.assert_called_once()
        emit.assert_called_once_with({"decision": "block", "reason": "run npm run lint"})


class CodexHookHarness:
    def __init__(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.cwd = self.root / "nested"
        self.cwd.mkdir()
        make_scratch_repo(self.root)
        self.config = json.loads((ROOT / ".codex" / "hooks.json").read_text())["hooks"]

    def close(self):
        self.temp.cleanup()

    def invoke(self, event, tool=None, session="test", source=None, response=None, **tool_input):
        groups = self.config[event]
        group = next(g for g in groups if tool is None or g["matcher"] == tool)
        payload = {"session_id": session, "cwd": str(self.cwd), "hook_event_name": event,
                   "tool_name": tool, "tool_input": tool_input, "tool_response": response,
                   "source": source}
        return subprocess.run(group["hooks"][0]["command"], shell=True, cwd=self.cwd,
                              input=json.dumps(payload), text=True, capture_output=True, timeout=10)

    def run(self, event, tool=None, **kwargs):
        result = self.invoke(event, tool, **kwargs)
        if result.returncode or result.stderr:
            raise AssertionError(f"hook failed: {result.returncode}: {result.stderr}")
        return json.loads(result.stdout) if result.stdout else {}

    def decision(self, tool, command, **kwargs):
        output = self.run("PreToolUse", tool, command=command, **kwargs)
        return output.get("hookSpecificOutput", {}).get("permissionDecision")

    def patch(self, body):
        return f"*** Begin Patch\n{body}\n*** End Patch"

    def patch_decision(self, body, **kwargs):
        return self.decision("apply_patch", self.patch(body), **kwargs)

    def read_skill(self, exit_code=0):
        self.run("PostToolUse", "Bash", command="cat .agents/skills/kamu-ui-prose-and-comments/SKILL.md",
                 response=f"Chunk ID: example\nProcess exited with code {exit_code}\nFinal output:\n")

    def write_ts(self, name, content):
        (self.root / name).write_text(f"{license_header()}\n{content}\n")


if __name__ == "__main__":
    unittest.main()
