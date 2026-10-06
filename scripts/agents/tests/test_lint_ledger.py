import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.agents import lint_ledger


class StopReminderTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        patcher = mock.patch.object(lint_ledger, "STATE", Path(self.dir.name) / "lint.json")
        patcher.start()
        self.addCleanup(patcher.stop)
        self.addCleanup(self.dir.cleanup)
        self.fp = "fp-1"
        fp_patch = mock.patch.object(lint_ledger, "fingerprint", lambda: self.fp)
        fp_patch.start()
        self.addCleanup(fp_patch.stop)

    def test_sessions_that_did_not_edit_typescript_are_left_alone(self):
        self.assertIsNone(lint_ledger.stop_reminder("s"))

    def test_reminds_once_per_state(self):
        lint_ledger.note_lint_input_edit("s")
        self.assertIsNotNone(lint_ledger.stop_reminder("s"))
        self.assertIsNone(lint_ledger.stop_reminder("s"))
        self.fp = "fp-2"
        self.assertIsNotNone(lint_ledger.stop_reminder("s"))

    def test_green_lint_on_the_current_state_silences_it(self):
        lint_ledger.note_lint_input_edit("s")
        lint_ledger.record_green()
        self.assertIsNone(lint_ledger.stop_reminder("s"))

    def test_clean_tree_needs_no_reminder(self):
        lint_ledger.note_lint_input_edit("s")
        self.fp = None
        self.assertIsNone(lint_ledger.stop_reminder("s"))


class LintRunTest(unittest.TestCase):
    def test_only_a_whole_lint_run_counts_as_green(self):
        for command in ["npm run lint", "npm run lint-and-fix", "nvm use >/dev/null && npm run lint",
                        '. "$NVM_DIR/nvm.sh" && nvm use >/dev/null && npm run lint',
                        "source ~/.nvm/nvm.sh && nvm use && npm run lint-and-fix",
                        "npm run lint > /tmp/lint.log 2>&1"]:
            with self.subTest(command=command):
                self.assertTrue(lint_ledger.is_whole_lint_run(command))
        for command in ["npm run lint | grep error", "npm run lint || true", "npx eslint .",
                        "npx eslint src/app/app.component.ts", "npm run lint &", "nvm use || npm run lint", ". ./other.sh && npm run lint",
                        "npm run lint -- src/app", "npm run lint ||", "npm run stylelint"]:
            with self.subTest(command=command):
                self.assertFalse(lint_ledger.is_whole_lint_run(command))

    def test_lint_inputs(self):
        for rel in ["src/app/app.component.ts", "src/main.ts", "eslint.config.mjs", "tsconfig.spec.json", "package.json"]:
            with self.subTest(rel=rel):
                self.assertTrue(lint_ledger.is_lint_input(rel))
        for rel in ["src/app/app.component.html", "AGENTS.md", "scripts/agents/common.py", None]:
            with self.subTest(rel=rel):
                self.assertFalse(lint_ledger.is_lint_input(rel))


if __name__ == "__main__":
    unittest.main()
