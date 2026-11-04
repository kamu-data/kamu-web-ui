# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import tempfile
import unittest
from pathlib import Path

from e2e.harness.coverage import shown_components
from e2e.harness.impact import Records
from e2e.scenarios import Scenario


class ShownComponentsTest(unittest.TestCase):
    def test_the_latest_head_capture_of_each_current_scenario_counts(self):
        with tempfile.TemporaryDirectory() as tmp:
            records = Records(Path(tmp) / "components.json")
            self.assertIsNone(shown_components(records, []))
            records.update("head", "seed", [{"name": "01-list", "ok": True, "components": ["app-list"]}])
            records.update("head", "empty", [{"name": "e01-search", "ok": True, "components": ["app-search"]}])
            records.update("base", "seed", [{"name": "01-list", "ok": True, "components": ["app-old"]}])
            records.update("head", "seed", [{"name": "99-removed", "ok": True, "components": ["app-gone"]}])
            scenarios = [Scenario("01-list", "x"), Scenario("e01-search", "y")]
            self.assertEqual(shown_components(records, scenarios), {"app-list", "app-search"})
