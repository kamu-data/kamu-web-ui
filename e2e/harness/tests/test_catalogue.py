# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import unittest

from e2e.harness.catalogue import select_scenarios
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


if __name__ == "__main__":
    unittest.main()
