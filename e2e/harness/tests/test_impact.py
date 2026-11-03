# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from e2e.harness.cache import HELPERS, node_json
from e2e.harness.impact import Records, affected, chains
from e2e.scenarios import Scenario

SCENARIOS = [
    Scenario("01-list", "a"),
    Scenario("02-modal", "a"),
    Scenario("03-after-modal", "a", follows="02-modal"),
    Scenario("04-settings", "a"),
]


def names(selection):
    return {profile: [sc.name for sc in scenarios] for profile, scenarios in selection.items()}


class AffectedTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.records = Records(Path(self.dir.name) / "components.json")
        self.records.update("base", "seed", [{"name": "01-list", "ok": True, "components": ["app-list"]}])
        self.records.update("head", "seed", [{"name": "02-modal", "ok": True, "components": ["modal-dialog"]}])
        self.records.update("head", "seed", [{"name": "03-after-modal", "ok": True, "components": ["app-search"]}])
        self.records.update("base", "seed", [{"name": "04-settings", "ok": True, "components": ["app-settings"]}])
        self.selection = {"seed": SCENARIOS}

    def tearDown(self):
        self.dir.cleanup()

    def pick(self, changed, impact):
        with patch("e2e.harness.impact.node_json", return_value=impact):
            return affected(
                self.selection, changed, Path("."), self.records, ("e2e/harness/session.py", "e2e/fixtures/")
            )

    def test_a_component_selects_the_scenarios_that_showed_it(self):
        picked, reason = self.pick(["src/app/x.scss"], {"all": None, "selectors": ["app-settings"]})
        self.assertEqual(names(picked), {"seed": ["04-settings"]})
        self.assertIn("app-settings", reason)

    def test_a_scenario_runs_with_the_one_it_follows(self):
        picked, _ = self.pick(["src/app/x.html"], {"all": None, "selectors": ["modal-dialog"]})
        self.assertEqual(names(picked), {"seed": ["02-modal", "03-after-modal"]})

    def test_a_scenario_never_captured_always_runs(self):
        self.selection = {"seed": [*SCENARIOS, Scenario("05-new", "a")]}
        picked, _ = self.pick(["src/app/x.ts"], {"all": None, "selectors": ["app-settings"]})
        self.assertEqual(names(picked), {"seed": ["04-settings", "05-new"]})

    def test_a_component_no_page_shows_selects_nothing_and_says_so(self):
        picked, reason = self.pick(["src/app/x.ts"], {"all": None, "selectors": ["app-org-settings"]})
        self.assertEqual(picked, {})
        self.assertIn("no captured page shows app-org-settings", reason)

    def test_global_changes_and_the_kit_select_everything(self):
        picked, reason = self.pick(
            ["src/styles.scss"], {"all": "src/styles.scss applies to every page", "selectors": []}
        )
        self.assertEqual(picked, self.selection)
        self.assertIn("every page", reason)
        picked, reason = self.pick(["e2e/harness/session.py"], {})
        self.assertEqual(picked, self.selection)
        self.assertIn("capture code", reason)

    def test_no_change_selects_nothing(self):
        self.assertEqual(self.pick([], {})[0], {})

    def test_failed_captures_do_not_overwrite_a_record(self):
        self.records.update("base", "seed", [{"name": "04-settings", "ok": False, "error": "x"}])
        self.assertEqual(self.records.of("seed", "04-settings"), {"app-settings"})
        reread = Records(self.records.file)
        self.assertEqual(reread.of("seed", "01-list"), {"app-list"})
        self.assertIsNone(reread.of("seed", "99-none"))

    def test_chains(self):
        self.assertIn({"02-modal", "03-after-modal"}, chains(SCENARIOS))


APP = {
    "tsconfig.json": json.dumps({"compilerOptions": {"paths": {"@common/*": ["./src/app/common/*"]}}}),
    "src/styles.scss": "",
    "src/app/common/format.ts": "export const format = (x: string) => x;",
    "src/app/common/clock.service.ts": 'import { format } from "./format";\nexport class Clock {}',
    "src/app/list/list.component.ts": (
        'import { Clock } from "@common/clock.service";\n'
        '@Component({ selector: "app-list", templateUrl: "./list.component.html", styleUrl: "./list.component.scss" })'
        "\nexport class ListComponent {}"
    ),
    "src/app/list/list.component.html": "<p></p>",
    "src/app/list/list.component.scss": "p {}",
    "src/app/page/page.component.ts": (
        'import { ListComponent } from "../list/list.component";\n'
        '@Component({ selector: "app-page", template: "<app-list />" })\nexport class PageComponent {}'
    ),
    "src/app/leaky/leaky.component.scss": "::ng-deep p {}",
    "src/app/leaky/leaky.component.ts": '@Component({ selector: "app-leaky", styleUrl: "./leaky.component.scss" })',
}


class ImpactHelperTest(unittest.TestCase):
    """impact.mjs on a small app: what each kind of change reaches."""

    @classmethod
    def setUpClass(cls):
        cls.dir = tempfile.TemporaryDirectory()
        for rel, text in APP.items():
            file = Path(cls.dir.name) / rel
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text(text)

    @classmethod
    def tearDownClass(cls):
        cls.dir.cleanup()

    def impact(self, *changed):
        return node_json(HELPERS / "impact.mjs", self.dir.name, *changed)

    def test_a_template_or_stylesheet_reaches_its_component_only(self):
        for rel in ("src/app/list/list.component.html", "src/app/list/list.component.scss"):
            self.assertEqual(self.impact(rel), {"all": None, "selectors": ["app-list"]})

    def test_a_service_reaches_the_components_importing_it_through_other_files(self):
        self.assertEqual(self.impact("src/app/common/format.ts"), {"all": None, "selectors": ["app-list"]})

    def test_global_styles_reach_everything(self):
        self.assertIn("every page", self.impact("src/styles.scss")["all"])
        self.assertIn("every page", self.impact("package.json")["all"])

    def test_styles_leaving_their_component_reach_everything(self):
        self.assertIn("::ng-deep", self.impact("src/app/leaky/leaky.component.scss")["all"])

    def test_deleted_and_unowned_files_reach_everything(self):
        self.assertIn("deleted", self.impact("src/app/gone.ts")["all"])

    def test_tests_and_docs_reach_nothing(self):
        self.assertEqual(
            self.impact("src/app/list/list.component.spec.ts", "README.md"), {"all": None, "selectors": []}
        )
