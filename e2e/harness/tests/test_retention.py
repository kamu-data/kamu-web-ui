# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import os
import tempfile
import unittest
from pathlib import Path

from e2e.harness.retention import DAY, Entry, entries, note_image, parse_size, plan, stale_images, touch

NOW = 1_000 * DAY


def entry(kind, name, days_ago, size=1):
    return Entry(kind, name, [Path(name)], size, NOW - days_ago * DAY)


def names(doomed):
    return sorted(e.name for e in doomed)


class PlanTest(unittest.TestCase):
    def test_keeps_the_newest_runs(self):
        runs = [entry("run", f"2026-11-0{i}", 10 - i) for i in range(1, 6)]
        self.assertEqual(names(plan(runs, NOW, NOW, 3, 14, 10**9)), ["2026-11-01", "2026-11-02"])

    def test_drops_what_went_unused_and_unfinished_entries(self):
        found = [
            entry("baseline", "old", 20),
            entry("baseline", "recent", 2),
            entry("build", "abc", 15),
            entry("baseline", "x.partial", 1),
        ]
        self.assertEqual(names(plan(found, NOW, NOW, 10, 14, 10**9)), ["abc", "old", "x.partial"])

    def test_the_running_compare_keeps_what_it_uses(self):
        found = [entry("baseline", "used-now", 20), entry("run", "current", 0), entry("baseline", "y.partial", 0)]
        # Used again during the run: its last use is after the run started
        found[0].last_use = NOW
        self.assertEqual(plan(found, NOW, NOW - 60, 0, 14, 0), [])

    def test_over_the_ceiling_the_least_recently_used_go_runs_first(self):
        found = [
            entry("baseline", "b-old", 5, size=40),
            entry("run", "r-new", 1, size=30),
            entry("run", "r-old", 3, size=30),
            entry("build", "c-new", 1, size=40),
        ]
        self.assertEqual(names(plan(found, NOW, NOW, 10, 14, 80)), ["r-new", "r-old"])
        self.assertEqual(names(plan(found, NOW, NOW, 10, 14, 40)), ["b-old", "r-new", "r-old"])


class CacheTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.cache = Path(self.dir.name)

    def tearDown(self):
        self.dir.cleanup()

    def make(self, rel, size=10):
        path = self.cache / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(b"x" * size)

    def test_a_commits_sources_and_build_are_one_entry(self):
        self.make("builds/abc/browser/index.html", 100)
        self.make("builds/abc.log")
        self.make("src/abc/package.json", 50)
        self.make("baselines/abc-seed-1/report.json")
        found = {(e.kind, e.name): e for e in entries(self.cache)}
        self.assertEqual(set(found), {("build", "abc"), ("baseline", "abc-seed-1")})
        self.assertEqual(found[("build", "abc")].size, 160)
        self.assertEqual(len(found[("build", "abc")].paths), 3)

    def test_last_use_is_the_used_mark(self):
        self.make("workspaces/seed-1/data")
        old = NOW - 30 * DAY
        os.utime(self.cache / "workspaces" / "seed-1", (old, old))
        self.assertEqual(entries(self.cache)[0].last_use, old)
        touch(self.cache / "workspaces" / "seed-1")
        self.assertGreater(entries(self.cache)[0].last_use, old)

    def test_only_images_the_kit_pulled_are_ever_stale(self):
        note_image(self.cache, "theirs:1", pulled=False)
        note_image(self.cache, "ours:1", pulled=True)
        note_image(self.cache, "pinned:1", pulled=True)
        self.assertEqual(stale_images(self.cache, float("inf"), 14, {"pinned:1"}), ["ours:1"])
        self.assertEqual(stale_images(self.cache, 0, 14, set()), [])


class ParseSizeTest(unittest.TestCase):
    def test_sizes(self):
        self.assertEqual(parse_size("10G"), 10 * 1024**3)
        self.assertEqual(parse_size("500m"), 500 * 1024**2)
        self.assertEqual(parse_size("2048"), 2048)
        with self.assertRaises(ValueError):
            parse_size("lots")
