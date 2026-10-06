import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from unittest import mock

from scripts.agents.common import ROOT
from scripts.agents.skill_ledger import EXPIRY_SECONDS, forget_session, governing_skills, loaded, missing_skills, record, skills_read_by

STYLE = "kamu-ui-angular-style"
GRAPHQL = "kamu-ui-graphql-api"


class GoverningSkillTest(unittest.TestCase):
    def test_first_matching_rule_wins_and_baseline_rules_apply_in_addition(self):
        tests, routing = "kamu-ui-unit-tests", "kamu-ui-routing"
        cases = {
            "src/app/api/webhooks.api.spec.ts": [tests, STYLE],
            "src/app/api/webhooks.api.ts": [GRAPHQL, STYLE],
            "src/app/api/gql/webhooks/dataset/dataset-webhook-by-id.graphql": [GRAPHQL],
            "src/app/api/mock/webhooks.mock.ts": [tests, STYLE],
            "src/app/search/mock.data.ts": [tests, STYLE],
            "src/app/common/components/time-delta-form/time-delta-form.harness.ts": [tests, STYLE],
            "src/app/common/modules/shared-test.module.ts": [tests, STYLE],
            "src/app/dataset-view/dataset-view-routing.ts": [routing, STYLE],
            "src/app/dataset-view/additional-components/metadata-component/metadata.routing.ts": [routing, STYLE],
            "src/app/project-links.ts": [routing, STYLE],
            "src/app/common/components/time-delta-form/time-delta-form.component.html": [STYLE],
            "src/app/common/components/time-delta-form/time-delta-form.component.scss": [STYLE],
            "CHANGELOG.md": ["kamu-ui-release-dependency-workflows"],
            "package.json": ["kamu-ui-release-dependency-workflows"],
            "docs/internal/agent-harness.md": ["kamu-ui-prose-and-comments"],
            ".claude/agents/ng-builder.md": ["kamu-ui-prose-and-comments"],
            "src/styles.scss": [],
            "resources/schema.graphql": [],
        }
        for path, expected in cases.items():
            with self.subTest(path=path):
                self.assertEqual(governing_skills(path), expected)


class LedgerTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.state = Path(self.dir.name) / "skills.json"
        self.path = str(ROOT / "src/app/api/gql/account/x.graphql")

    def tearDown(self):
        self.dir.cleanup()

    def test_edit_is_refused_until_the_skill_is_loaded(self):
        self.assertEqual(missing_skills([self.path], "s/main", self.state),
                         {"src/app/api/gql/account/x.graphql": [GRAPHQL]})
        record({GRAPHQL}, "s/main", self.state)
        self.assertEqual(missing_skills([self.path], "s/main", self.state), {})

    def test_a_subagent_loads_skills_for_itself_only(self):
        record({GRAPHQL}, "s/agent-1", self.state)
        self.assertTrue(missing_skills([self.path], "s/main", self.state))
        record({GRAPHQL}, "s/main", self.state)
        self.assertTrue(missing_skills([self.path], "s/agent-2", self.state))

    def test_a_compacted_session_loads_again(self):
        record({GRAPHQL}, "s/main", self.state)
        record({GRAPHQL}, "other/main", self.state)
        forget_session("s", self.state)
        self.assertTrue(missing_skills([self.path], "s/main", self.state))
        self.assertFalse(missing_skills([self.path], "other/main", self.state))

    def test_expired_records_do_not_authorize_edits(self):
        with mock.patch("scripts.agents.skill_ledger.now", return_value=1):
            record({GRAPHQL}, "s/main", self.state)
        with mock.patch("scripts.agents.skill_ledger.now", return_value=EXPIRY_SECONDS + 2):
            self.assertTrue(missing_skills([self.path], "s/main", self.state))

    def test_parallel_skill_reads_preserve_every_record(self):
        skills = {f"skill-{i}" for i in range(32)}
        with ThreadPoolExecutor(max_workers=8) as pool:
            list(pool.map(lambda skill: record({skill}, "s/main", self.state), skills))
        self.assertEqual(loaded("s/main", self.state), skills)

    def test_an_api_class_needs_both_skills(self):
        path = str(ROOT / "src/app/api/account.api.ts")
        record({GRAPHQL}, "s/main", self.state)
        self.assertEqual(missing_skills([path], "s/main", self.state), {"src/app/api/account.api.ts": [STYLE]})
        record({STYLE}, "s/main", self.state)
        self.assertEqual(missing_skills([path], "s/main", self.state), {})

    def test_shell_reads_of_skill_files_count_as_loads(self):
        self.assertEqual(skills_read_by("cat .agents/skills/kamu-ui-graphql-api/SKILL.md"), {GRAPHQL})
        self.assertEqual(skills_read_by("sed -n 1,80p .claude/skills/kamu-ui-routing/SKILL.md"), {"kamu-ui-routing"})
        self.assertEqual(skills_read_by("cat .claude/skills/kamu-ui-routing/SKILL.md > /tmp/copy"), {"kamu-ui-routing"})
        self.assertEqual(skills_read_by("cat < .claude/skills/kamu-ui-routing/SKILL.md"), {"kamu-ui-routing"})
        self.assertEqual(skills_read_by("sed -i s/a/b/ .claude/skills/kamu-ui-routing/SKILL.md"), set())
        self.assertEqual(skills_read_by("ls .claude/skills/kamu-ui-routing/SKILL.md"), set())

    def test_writing_a_skill_through_a_redirect_is_not_a_load(self):
        self.assertEqual(skills_read_by("cat > .claude/skills/kamu-ui-routing/SKILL.md <<'EOF'\n# x\nEOF"), set())
        self.assertEqual(skills_read_by("cat header.md >> .agents/skills/kamu-ui-routing/SKILL.md"), set())


if __name__ == "__main__":
    unittest.main()
