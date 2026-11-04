# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import unittest

from e2e.harness.catalogue import CatalogueError, check_scenarios, select_scenarios
from e2e.scenarios import Scenario

ENTRIES = {
    "a": {"profile": "seed", "tier": "smoke"},
    "b": {"profile": "seed", "tier": "full"},
    "c": {"profile": "empty", "tier": None},
    "d": {"profile": "seed", "tier": "drop"},
}
SCENARIOS = [Scenario("01-a", "a"), Scenario("02-b", "b"), Scenario("03-c", "c"), Scenario("04-d", "d")]


def names(by_profile):
    return {profile: [sc.name for sc in scenarios] for profile, scenarios in by_profile.items()}


class SelectScenariosTest(unittest.TestCase):
    def test_tiers(self):
        self.assertEqual(names(select_scenarios(SCENARIOS, ENTRIES, "smoke")), {"seed": ["01-a"]})
        self.assertEqual(names(select_scenarios(SCENARIOS, ENTRIES, "full")), {"seed": ["01-a", "02-b"]})

    def test_unrated_runs_unrated_entries_but_never_dropped_ones(self):
        self.assertEqual(
            names(select_scenarios(SCENARIOS, ENTRIES, unrated=True)), {"seed": ["01-a", "02-b"], "empty": ["03-c"]}
        )

    def test_only_takes_a_comma_separated_list(self):
        self.assertEqual(names(select_scenarios(SCENARIOS, ENTRIES, unrated=True, only="b")), {"seed": ["02-b"]})
        self.assertEqual(
            names(select_scenarios(SCENARIOS, ENTRIES, unrated=True, only="01,03")),
            {"seed": ["01-a"], "empty": ["03-c"]},
        )


class CheckScenariosTest(unittest.TestCase):
    def test_accepts_a_scenario_expecting_a_text_or_an_input_value(self):
        check_scenarios([Scenario("01-a", "a", expect_text=["A"]), Scenario("02-b", "b", expect_value=["B"])], ENTRIES)

    def test_refuses_a_scenario_that_expects_nothing(self):
        with self.assertRaises(CatalogueError) as raised:
            check_scenarios([Scenario("01-a", "a", expect_text=["A"]), Scenario("02-b", "b")], ENTRIES)
        self.assertEqual(raised.exception.problems, ["02-b: no expect_text or expect_value"])


if __name__ == "__main__":
    unittest.main()
