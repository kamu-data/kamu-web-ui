# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import copy
import shutil
import tempfile
import unittest
from pathlib import Path

import yaml

from e2e.fixtures.inventory import SEED, check_inventory, check_scenario_datasets, load_inventory
from e2e.visual.scenarios import Scenario, dataset_info

CATALOGUE = SEED.parent.parent / "catalogue"
ENTRIES = {e["id"] for file in CATALOGUE.glob("*.yaml") for e in yaml.safe_load(file.read_text())["entries"]}


class InventoryTest(unittest.TestCase):
    def setUp(self):
        self.inventory = load_inventory()
        self.dir = Path(tempfile.mkdtemp())
        self.seed = self.dir / "seed"
        shutil.copytree(SEED, self.seed)

    def tearDown(self):
        shutil.rmtree(self.dir)

    def problems(self, inventory=None):
        return check_inventory(inventory or self.inventory, ENTRIES, self.seed)

    def dataset(self, inventory, name):
        return next(d for d in inventory["datasets"] if d["name"] == name)

    def test_the_inventory_is_consistent(self):
        self.assertEqual(self.problems(), [])

    def test_an_unknown_catalogue_entry(self):
        inventory = copy.deepcopy(self.inventory)
        self.dataset(inventory, "population")["entries"].append("no-such-entry")
        self.assertEqual(self.problems(inventory), ["population: no catalogue entry no-such-entry"])

    def test_a_file_nobody_lists(self):
        (self.seed / "data" / "stray.csv").write_text("a\n")
        self.assertEqual(self.problems(), ["data/stray.csv: not listed in the inventory"])

    def test_a_listed_file_that_is_missing(self):
        (self.seed / "data" / "population-2020-06.csv").unlink()
        self.assertEqual(self.problems(), ["population: no file data/population-2020-06.csv"])

    def test_a_manifest_named_after_another_dataset(self):
        inventory = copy.deepcopy(self.inventory)
        self.dataset(inventory, "never-run")["manifest"] = "failed-ingest.yaml"
        self.assertEqual(
            self.problems(inventory),
            [
                "never-run: the manifest must be never-run.yaml",
                "never-run: the snapshot names failed-ingest",
                "never-run.yaml: not listed in the inventory",
            ],
        )

    def test_references_to_unlisted_artifacts(self):
        inventory = copy.deepcopy(self.inventory)
        self.dataset(inventory, "population")["collaborators"].append({"account": "carol", "role": "READER"})
        self.dataset(inventory, "city-reports")["contents"].append({"path": "/gone", "dataset": "gone"})
        inventory["flowRuns"].append({"dataset": "gone", "flow": "ingest", "outcome": "success"})
        self.assertEqual(len(self.problems(inventory)), 3)

    def test_a_missing_purpose(self):
        inventory = copy.deepcopy(self.inventory)
        del self.dataset(inventory, "private-notes")["purpose"]
        self.assertEqual(self.problems(inventory), ["private-notes: no purpose"])


class ScenarioDatasetsTest(unittest.TestCase):
    def setUp(self):
        self.inventory = load_inventory()

    def problems(self, *scenarios):
        return check_scenario_datasets(self.inventory, scenarios, "kamu")

    def test_listed_datasets_and_account_pages_pass(self):
        self.assertEqual(
            self.problems(
                Scenario("a", "x", url="/kamu/population/history"),
                Scenario("b", "x", url="/kamu/~select/datasets?page=2"),
                Scenario("c", "x", url="/kamu"),
                Scenario("d", "x", url="/v/search"),
            ),
            [],
        )

    def test_a_dataset_in_the_url(self):
        self.assertEqual(
            self.problems(Scenario("a", "x", url="/kamu/population-big/lineage")),
            ["a: dataset population-big is not in the inventory"],
        )

    def test_a_dataset_a_computed_url_looks_up(self):
        def url(s):
            return f"/kamu/population/block/{dataset_info(s, 'idle-feed')['metadata']}"

        self.assertEqual(self.problems(Scenario("a", "x", url=url)), ["a: dataset idle-feed is not in the inventory"])


if __name__ == "__main__":
    unittest.main()
