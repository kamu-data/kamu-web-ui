# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import unittest

from e2e.harness.parallel import split
from e2e.scenarios import Scenario


def names(parts):
    return [[sc.name for sc in part] for part in parts]


SCENARIOS = [
    Scenario("01-a", "x"),
    Scenario("02-modal", "x"),
    Scenario("03-b", "x"),
    Scenario("04-after-modal", "x", follows="02-modal"),
    Scenario("05-c", "x"),
    Scenario("80-anon", "x", phase="anon"),
]


class ShardsTest(unittest.TestCase):
    def test_round_robin_in_list_order(self):
        self.assertEqual(
            names(split(SCENARIOS, 2)),
            [["01-a", "03-b", "80-anon"], ["02-modal", "04-after-modal", "05-c"]],
        )

    def test_a_scenario_stays_with_the_one_it_follows(self):
        for count in range(1, 7):
            for part in names(split(SCENARIOS, count)):
                if "04-after-modal" in part:
                    self.assertIn("02-modal", part)

    def test_never_more_shards_than_units_and_every_scenario_once(self):
        parts = names(split(SCENARIOS, 10))
        self.assertEqual(len(parts), 5)
        self.assertEqual(sorted(n for part in parts for n in part), sorted(sc.name for sc in SCENARIOS))

    def test_the_split_depends_only_on_names_and_count(self):
        self.assertEqual(names(split(SCENARIOS, 3)), names(split(list(SCENARIOS), 3)))

    def test_logged_out_scenarios_stay_last_in_their_shard(self):
        for part in split(SCENARIOS, 1):
            self.assertEqual(part[-1].phase, "anon")
