import json
import os
import subprocess
import tempfile
import time
import unittest
from pathlib import Path
from unittest import mock

from scripts.agents import bash_edits
from scripts.agents.bash_edits import changed_paths, moves_working_tree, save_pending, snapshot, take_pending
from scripts.agents.common import ROOT
from scripts.agents.tests.scratch_repo import PRETTIER_AVAILABLE, license_header, make_scratch_repo

CLIENTS = {
    "claude": (ROOT / ".claude" / "settings.json", "claude_pre_bash", "claude_post_bash"),
    "codex": (ROOT / ".codex" / "hooks.json", "codex_pre_bash", "codex_post_bash"),
}


class BashEditsTest(unittest.TestCase):
    def test_changed_paths_are_written_or_created_files(self):
        before = {"a.ts": [1, 10], "b.ts": [1, 10], "gone.ts": [1, 10]}
        after = {"a.ts": [1, 10], "b.ts": [2, 12], "new.ts": [3, 5]}
        self.assertEqual(changed_paths(before, after), ["b.ts", "new.ts"])

    def test_git_commands_that_rewrite_the_tree_are_recognised(self):
        for command in ["git switch master", "git -C sub pull", "cd x && git stash pop",
                        "FOO=1 git checkout main", "git rebase origin/master", "git reset --soft HEAD~1"]:
            with self.subTest(command=command):
                self.assertTrue(moves_working_tree(command))
        for command in ["git status", "git diff HEAD", "npm run prettier", "sed -i 's/a/b/' x.ts",
                        "echo 'git switch' > notes.txt"]:
            with self.subTest(command=command):
                self.assertFalse(moves_working_tree(command))

    def test_a_reading_is_collected_once_and_stale_ones_expire(self):
        with tempfile.TemporaryDirectory() as temp:
            state = Path(temp)
            save_pending(state, "call-1", {"a.ts": [1, 2]})
            self.assertEqual(take_pending(state, "call-1"), {"a.ts": [1, 2]})
            self.assertIsNone(take_pending(state, "call-1"))

            save_pending(state, "abandoned", {})
            later = time.time() + bash_edits.PENDING_LIFETIME_SECONDS + 1
            with mock.patch.object(bash_edits, "now", return_value=later):
                save_pending(state, "call-2", {})
            self.assertIsNone(take_pending(state, "abandoned"))
            self.assertEqual(take_pending(state, "call-2"), {})

    def test_snapshot_covers_tracked_and_untracked_files_but_not_ignored_ones(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            subprocess.run(["git", "init", "-q", str(root)], check=True, capture_output=True)
            (root / ".gitignore").write_text("dist/\n")
            (root / "tracked.ts").write_text("a")
            subprocess.run(["git", "add", "."], cwd=root, check=True, capture_output=True)
            (root / "untracked.ts").write_text("b")
            (root / "dist").mkdir()
            (root / "dist" / "built.js").write_text("c")
            self.assertEqual(sorted(snapshot(root)), [".gitignore", "tracked.ts", "untracked.ts"])


class BashEditHookTest(unittest.TestCase):
    """Runs each client's real hook configuration against a scratch repository."""

    def setUp(self):
        self.harness = BashHookHarness()
        self.addCleanup(self.harness.close)

    @unittest.skipUnless(PRETTIER_AVAILABLE, "node_modules not installed")
    def test_typescript_written_through_the_shell_is_formatted_and_checked(self):
        for client in CLIENTS:
            with self.subTest(client=client):
                result = self.harness.shell_write(client, "printf ... > example.spec.ts",
                                                  {"example.spec.ts": self.harness.ts('fit("x",()=>{expect(1).toBe(1)})')})
                self.assertEqual(result.returncode, 2)
                self.assertIn("focused or disabled tests", result.stderr)
                self.assertIn('fit("x", () => {', (self.harness.root / "example.spec.ts").read_text())

    def test_a_command_that_changes_nothing_is_silent(self):
        for client in CLIENTS:
            with self.subTest(client=client):
                result = self.harness.shell_write(client, "ls", {})
                self.assertEqual((result.returncode, result.stdout, result.stderr), (0, "", ""))

    def test_files_brought_in_by_git_are_not_judged(self):
        for client in CLIENTS:
            with self.subTest(client=client):
                result = self.harness.shell_write(client, "git switch other",
                                                  {"example.spec.ts": self.harness.ts('fit("x", () => {});')})
                self.assertEqual((result.returncode, result.stderr), (0, ""))

    def test_a_guarded_path_written_without_its_skill_gets_a_reminder(self):
        for client in CLIENTS:
            with self.subTest(client=client):
                result = self.harness.shell_write(client, "cat > AGENTS.md", {"AGENTS.md": f"# {client}\n"})
                self.assertEqual(result.returncode, 0)
                context = json.loads(result.stdout)["hookSpecificOutput"]["additionalContext"]
                self.assertIn("kamu-ui-prose-and-comments", context)

    def test_regenerated_files_are_not_judged(self):
        for client in CLIENTS:
            with self.subTest(client=client):
                rel = "src/app/api/kamu.graphql.interface.ts"
                (self.harness.root / rel).parent.mkdir(parents=True, exist_ok=True)
                result = self.harness.shell_write(client, "npm run gql-codegen",
                                                  {rel: f"/** Offset that was previously incorporated ({client}) */\n"})
                self.assertEqual((result.returncode, result.stderr), (0, ""))

    def test_subagent_node_commands_must_select_the_pinned_version(self):
        self.harness.fake_nvm()
        main = self.harness.invoke("claude", "PreToolUse", "npm run lint")
        self.assertNotIn("node-version", main.stdout + main.stderr)
        self.assertNotIn('"deny"', main.stdout)
        sub = self.harness.invoke("claude", "PreToolUse", "npm run lint", agent_id="agent-1")
        self.assertIn('"deny"', sub.stdout)
        self.assertIn("nvm use", sub.stdout)
        selected = self.harness.invoke("claude", "PreToolUse", '. "$NVM_DIR/nvm.sh" && nvm use && npm run lint',
                                       agent_id="agent-1")
        self.assertNotIn('"deny"', selected.stdout)
        codex = self.harness.invoke("codex", "PreToolUse", "npm run lint")
        self.assertIn('"deny"', codex.stdout)

    def test_without_nvm_node_commands_pass(self):
        self.harness.env["NVM_DIR"] = str(self.harness.root / "no-nvm")
        for client in CLIENTS:
            with self.subTest(client=client):
                result = self.harness.invoke(client, "PreToolUse", "npm run lint", agent_id="agent-1")
                self.assertNotIn('"deny"', result.stdout)

    def test_a_denied_command_takes_no_reading(self):
        for client in CLIENTS:
            with self.subTest(client=client):
                pre = self.harness.invoke(client, "PreToolUse", "git reset --hard")
                self.assertIn('"deny"', pre.stdout)
                (self.harness.root / "example.spec.ts").write_text(self.harness.ts('fit("x", () => {});'))
                post = self.harness.invoke(client, "PostToolUse", "git reset --hard")
                self.assertEqual((post.returncode, post.stderr), (0, ""))


class BashHookHarness:
    def __init__(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        make_scratch_repo(self.root)
        self.calls = 0
        self.env = dict(os.environ)

    def close(self):
        self.temp.cleanup()

    def ts(self, body):
        return f"{license_header()}\n{body}\n"

    def fake_nvm(self):
        """An nvm whose pinned Node is a binary nothing else has on PATH."""
        nvm, node = self.root / "fake-nvm", self.root / "fake-node" / "bin" / "node"
        nvm.mkdir()
        node.parent.mkdir(parents=True)
        node.write_text("")
        (nvm / "nvm.sh").write_text(f"nvm() {{ echo {node}; }}\n")
        self.env["NVM_DIR"] = str(nvm)

    def invoke(self, client, event, command, agent_id=None):
        config, pre, post = CLIENTS[client]
        module = pre if event == "PreToolUse" else post
        hook = next(h for group in json.loads(config.read_text())["hooks"][event]
                    for h in group["hooks"] if module in h["command"])
        payload = {"session_id": "test", "tool_use_id": f"call-{self.calls}", "hook_event_name": event,
                   "tool_name": "Bash", "tool_input": {"command": command}, "tool_response": None}
        if agent_id:
            payload["agent_id"] = agent_id
        return subprocess.run(hook["command"], shell=True, cwd=self.root, input=json.dumps(payload),
                              text=True, capture_output=True, timeout=60, env=self.env)

    def shell_write(self, client, command, files):
        """Bracket a simulated command that writes `files` with the client's two Bash hooks."""
        self.calls += 1
        pre = self.invoke(client, "PreToolUse", command)
        if pre.returncode:
            raise AssertionError(f"pre hook failed: {pre.stderr}")
        for rel, content in files.items():
            (self.root / rel).write_text(content)
        return self.invoke(client, "PostToolUse", command)


if __name__ == "__main__":
    unittest.main()
