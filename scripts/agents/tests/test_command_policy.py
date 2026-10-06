import unittest

from scripts.agents.command_policy import decide, node_version_verdicts


def verdict(command):
    v = decide(command)
    return (v.decision[0], v.kind) if v else None


class DiscardTest(unittest.TestCase):
    def test_destructive_git_forms_are_denied(self):
        for command in [
            "git reset --hard",
            "git reset --hard HEAD~1",
            "git clean -fd",
            "git clean -xdf",
            "git checkout -- src/app/app.component.ts",
            "git checkout .",
            "git checkout -f main",
            "git switch --discard-changes main",
            "git restore src/app/app.component.ts",
            "git restore --staged --worktree src/app/app.component.ts",
            "git stash",
            "git stash push -m wip",
            "git stash drop",
            "git read-tree --reset -u HEAD",
            "git checkout-index -f -a",
            "git -C /repo checkout -- x",
        ]:
            with self.subTest(command=command):
                self.assertEqual(verdict(command), ("deny", "discard"))

    def test_safe_git_forms_pass(self):
        for command in [
            "git status",
            "git diff HEAD -- src",
            "git checkout main",
            "git checkout -b feature/860-x",
            "git restore --staged src/app/app.component.ts",
            "git stash list",
            "git stash pop",
            "git clean -n",
            "git log --oneline | head -5",
            "git reset HEAD src/app/app.component.ts",
            "git show HEAD:AGENTS.md > /tmp/orig",
            "git tag",
        ]:
            with self.subTest(command=command):
                self.assertIsNone(verdict(command))

    def test_wrappers_and_compound_lines_are_seen_through(self):
        for command in [
            "ls && git reset --hard",
            "timeout 60 git clean -fd",
            "env FOO=1 git stash",
            "nohup git checkout -- x &",
            "bash -c 'git reset --hard'",
            "eval git stash",
            "{ git reset --hard; }",
            "echo $(git stash)",
            "if true; then git restore x; fi",
            "cd src \\\n && git checkout .",
            "echo done\ngit stash",
        ]:
            with self.subTest(command=command):
                self.assertEqual(verdict(command), ("deny", "discard"))

    def test_quoted_and_heredoc_text_is_data(self):
        self.assertEqual(verdict('git commit -m "never git reset --hard"'), ("ask", "approval"))
        self.assertIsNone(verdict("echo 'git reset --hard'"))
        self.assertIsNone(verdict("python3 - <<'EOF'\ngit reset --hard\nEOF\necho ok"))

    def test_deny_wins_over_ask_on_one_line(self):
        self.assertEqual(verdict("git commit -m x && git reset --hard"), ("deny", "discard"))

    def test_unlexable_input_falls_back_to_refusal(self):
        self.assertEqual(verdict("git reset --hard 'unterminated"), ("deny", "discard"))


class ApprovalTest(unittest.TestCase):
    def test_history_and_publishing_commands_ask(self):
        for command in ["git commit -m x", "git push origin master", "git merge x", "git rebase master",
                        "git tag v1.0", "git cherry-pick abc", "git reset --soft HEAD~1", "git branch -D x",
                        "npm version patch", "npm run release-minor", "nvm use && npm run release-patch",
                        "npm publish"]:
            with self.subTest(command=command):
                self.assertEqual(verdict(command), ("ask", "approval"))

    def test_reading_the_version_passes(self):
        self.assertIsNone(verdict("npm version"))
        self.assertIsNone(verdict("npm version --json"))


class NpmTest(unittest.TestCase):
    def test_dependency_changes_ask(self):
        for command in ["npm install lodash", "npm i -D @types/node", "npm add rxjs@7", "npm uninstall marked",
                        "npm rm marked", "npm update", "npm update @angular/core", "npx -y npm install x",
                        "nvm use >/dev/null && npm install timekeeper"]:
            with self.subTest(command=command):
                self.assertEqual(verdict(command), ("ask", "dependency"))

    def test_installing_the_lock_file_and_running_scripts_pass(self):
        for command in ["npm install", "npm i", "npm ci", "npm install --no-audit", "npm run lint", "npm test",
                        "npm run gql-codegen", "npx ng build", "npm ls @angular/core", "npm outdated"]:
            with self.subTest(command=command):
                self.assertIsNone(verdict(command))

    def test_truncated_build_output_is_denied(self):
        for command in ["npm test 2>&1 | tail -50", "npm run lint | head", "ng build |& tail", "npx eslint . | head",
                        "npm run build-prod | tail -40", "npm run stylelint 2>&1 | head -n 20",
                        "npx ng test --include x | tail", "npm t | tail"]:
            with self.subTest(command=command):
                self.assertEqual(verdict(command), ("deny", "truncate"))

    def test_filtering_and_unrelated_truncation_pass(self):
        for command in ["npm test 2>&1 | grep FAILED", "npm ls | head", "git log | head", "npm run start | tail",
                        "ng version | head"]:
            with self.subTest(command=command):
                self.assertIsNone(verdict(command))


class NodeVersionTest(unittest.TestCase):
    def test_node_tools_without_a_selected_version_are_denied(self):
        for command in ["npm run lint", "npx ng build", "ng test", "cd src && npm test", "node scripts/x.js",
                        "npm ci && nvm use && npm test", "nvm use; npm test", "eslint src/app"]:
            with self.subTest(command=command):
                found = node_version_verdicts(command)
                self.assertTrue(found)
                self.assertTrue(all(v.kind == "node-version" and v.decision[0] == "deny" for v in found))

    def test_selecting_the_pinned_version_first_passes(self):
        for command in ['. "$NVM_DIR/nvm.sh" && nvm use >/dev/null && npm run lint',
                        "source ~/.nvm/nvm.sh && nvm use && npm test && npx ng build",
                        "git status", "ls node_modules", "python3 -m unittest", "node --version", "npm -v"]:
            with self.subTest(command=command):
                self.assertEqual(node_version_verdicts(command), [])

    def test_the_reason_gives_the_fixed_command(self):
        reason = node_version_verdicts("npm run lint")[0].decision[1]
        self.assertIn('. "$NVM_DIR/nvm.sh" && nvm use >/dev/null && npm run lint', reason)


if __name__ == "__main__":
    unittest.main()
