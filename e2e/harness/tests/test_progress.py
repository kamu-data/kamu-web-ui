# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import io
import json
import tempfile
import time
import unittest
from pathlib import Path

from e2e.harness.progress import CaptureProgress, StampedOutput, Timings, about, clock


class FormatTest(unittest.TestCase):
    def test_clock(self):
        self.assertEqual(clock(5), "0:05")
        self.assertEqual(clock(754.9), "12:34")
        self.assertEqual(clock(3725), "1:02:05")

    def test_about(self):
        self.assertEqual(about(None), "")
        self.assertEqual(about(59), "<1 min")
        self.assertEqual(about(61), "~2 min")


class ProgressTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.file = Path(self.dir.name) / "timings.json"
        self.lines: list[str] = []

    def tearDown(self):
        self.dir.cleanup()

    def test_no_estimate_without_any_recorded_duration(self):
        CaptureProgress("[seed] base", "seed", ["01-a", "02-b"], Timings(self.file), self.lines.append)
        self.assertEqual(self.lines, ["[seed] base: capturing 2 scenarios"])

    def test_estimates_from_the_previous_run(self):
        self.file.write_text(json.dumps({"seed/01-a": 100, "seed/02-b": 50, "seed/03-c": 40}))
        progress = CaptureProgress(
            "[seed] head", "seed", ["01-a", "02-b", "03-c"], Timings(self.file), self.lines.append
        )
        progress({"name": "01-a", "ok": True, "elements": 12, "seconds": 90})
        progress({"name": "02-b", "ok": False, "error": "missing text: X", "seconds": 30})
        progress({"name": "03-c", "ok": True, "elements": 3, "seconds": 20})
        self.assertEqual(
            self.lines,
            [
                "[seed] head: capturing 3 scenarios, ~4 min",
                "[seed] head 1/3 ok   01-a 12, ~2 min left",
                "[seed] head 2/3 FAIL 02-b missing text: X, <1 min left",
                "[seed] head 3/3 ok   03-c 3",
            ],
        )
        self.assertEqual(json.loads(self.file.read_text()), {"seed/01-a": 90, "seed/02-b": 30, "seed/03-c": 20})

    def test_an_unrecorded_scenario_counts_as_the_mean_so_far(self):
        self.file.write_text(json.dumps({"seed/01-a": 100}))
        progress = CaptureProgress(
            "[seed] base", "seed", ["01-a", "02-new", "03-new"], Timings(self.file), self.lines.append
        )
        self.assertEqual(self.lines[-1], "[seed] base: capturing 3 scenarios")
        progress({"name": "01-a", "ok": True, "elements": 1, "seconds": 120})
        self.assertEqual(self.lines[-1], "[seed] base 1/3 ok   01-a 1, ~4 min left")

    def test_scenarios_finishing_out_of_order_with_parallel_workers(self):
        self.file.write_text(json.dumps({"seed/01-a": 120, "seed/02-b": 120, "seed/03-c": 120}))
        progress = CaptureProgress(
            "[seed] head", "seed", ["01-a", "02-b", "03-c"], Timings(self.file), self.lines.append, workers=3
        )
        self.assertEqual(self.lines[-1], "[seed] head: capturing 3 scenarios, ~2 min")
        progress({"name": "03-c", "ok": True, "elements": 1, "seconds": 100})
        self.assertEqual(self.lines[-1], "[seed] head 1/3 ok   03-c 1, ~2 min left")
        self.assertEqual(json.loads(self.file.read_text())["seed/03-c"], 100)

    def test_an_unreadable_file_is_no_history(self):
        self.file.write_text("{not json")
        self.assertIsNone(Timings(self.file).estimate(["seed/01-a"]))


class StampedOutputTest(unittest.TestCase):
    def test_stamps_whole_lines_and_copies_them_to_the_log(self):
        with tempfile.TemporaryDirectory() as d:
            log_file = Path(d) / "run.log"
            screen = io.StringIO()
            out = StampedOutput(screen, log_file, time.monotonic() - 75)
            out.write("first\nsec")
            out.write("ond\n")
            self.assertEqual(screen.getvalue(), "1:15 first\n1:15 second\n")
            self.assertEqual(log_file.read_text(), screen.getvalue())
