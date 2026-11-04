# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import gzip
import json
import os
import tempfile
import unittest

from e2e.visual.compare import compare, diff_styles, image_diff, rebuild, short, verdict

try:
    import PIL  # noqa: F401

    HAS_PIL = True
except ImportError:
    HAS_PIL = False

DEFAULTS = {"div": {"color": "black", "display": "block"}}


def element(style=None, cls="", rect="0,0,10,10", **pseudo):
    rec = {"tag": "div", "class": cls, "rect": rect, "style": style or {}}
    rec.update({f"::{k}": v for k, v in pseudo.items()})
    return rec


def snapshot(**elements):
    return rebuild({"defaults": DEFAULTS, "elements": elements})


class RebuildTest(unittest.TestCase):
    def test_a_delta_overrides_and_removes_defaults(self):
        full = snapshot(a=element({"color": "red", "display": None}))
        self.assertEqual(full["a"]["style"], {"color": "red"})

    def test_a_pseudo_element_is_a_delta_against_its_element(self):
        full = snapshot(a=element({"color": "red"}, after={"content": '"x"'}))
        self.assertEqual(full["a"]["::after"], {"color": "red", "display": "block", "content": '"x"'})


class DiffStylesTest(unittest.TestCase):
    def test_equal_snapshots_have_no_diff(self):
        self.assertEqual(list(diff_styles(snapshot(a=element()), snapshot(a=element()))), [])

    def test_a_changed_property_is_reported_with_both_values(self):
        diffs = list(diff_styles(snapshot(a=element()), snapshot(a=element({"color": "red"}))))
        self.assertEqual(diffs, [("a", "color", "black", "red")])

    def test_an_element_present_on_one_side_only(self):
        diffs = list(diff_styles(snapshot(a=element()), snapshot(a=element(), b=element())))
        self.assertEqual(diffs, [("b", "(element)", "absent", "present")])

    def test_class_and_rect_changes(self):
        diffs = list(diff_styles(snapshot(a=element(cls="x")), snapshot(a=element(cls="y", rect="1,0,10,10"))))
        self.assertEqual([d[1] for d in diffs], ["class", "rect"])

    def test_a_pseudo_element_that_appears(self):
        diffs = list(diff_styles(snapshot(a=element()), snapshot(a=element(before={"content": '"x"'}))))
        self.assertEqual(diffs, [("a", "::before", "absent", "present")])

    def test_a_pseudo_element_property(self):
        before = snapshot(a=element(before={"content": '"x"'}))
        after = snapshot(a=element(before={"content": '"y"'}))
        self.assertEqual(list(diff_styles(before, after)), [("a", "::before content", '"x"', '"y"')])


class ShortTest(unittest.TestCase):
    def test_a_long_path_keeps_its_last_four_steps(self):
        self.assertEqual(short("body:1>div:1>div:2>ul:1>li:3>a:1"), "…>div:2>ul:1>li:3>a:1")

    def test_a_forced_state_key_keeps_the_state(self):
        self.assertEqual(short("active@body:1>button:1|body:1>button:1"), "active body:1>button:1")


class VerdictTest(unittest.TestCase):
    def test_style_diffs_make_a_change_whatever_the_pixels(self):
        self.assertEqual(verdict(3, 0), "changed")
        self.assertEqual(verdict(3, 120), "changed")

    def test_pixels_without_style_diffs_need_a_recheck(self):
        self.assertEqual(verdict(0, 57), "pixels-only")

    def test_nothing_changed(self):
        self.assertEqual(verdict(0, 0), "same")

    def test_a_missing_screenshot(self):
        self.assertEqual(verdict(0, None), "missing")


def write_capture(directory, name, elements, color=(255, 255, 255)):
    os.makedirs(os.path.join(directory, "styles"), exist_ok=True)
    with gzip.open(os.path.join(directory, "styles", f"{name}.json.gz"), "wt") as f:
        json.dump({"defaults": DEFAULTS, "elements": elements}, f)
    if HAS_PIL:
        from PIL import Image

        Image.new("RGB", (20, 20), color).save(os.path.join(directory, f"{name}.png"))


@unittest.skipUnless(HAS_PIL, "Pillow is not installed")
class CompareTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.before, self.after, self.out = (os.path.join(self.tmp.name, d) for d in ("before", "after", "out"))

    def test_verdicts_per_scenario_and_the_report(self):
        write_capture(self.before, "01-same", {"a": element()})
        write_capture(self.after, "01-same", {"a": element()})
        write_capture(self.before, "02-styled", {"a": element()})
        write_capture(self.after, "02-styled", {"a": element({"color": "red"})})
        write_capture(self.before, "03-noise", {"a": element()})
        write_capture(self.after, "03-noise", {"a": element()}, color=(0, 0, 0))
        write_capture(self.before, "04-gone", {"a": element()})
        summary = compare(self.before, self.after, self.out)
        self.assertEqual(
            {k: v["verdict"] for k, v in summary.items()},
            {"01-same": "same", "02-styled": "changed", "03-noise": "pixels-only", "04-gone": "missing"},
        )
        self.assertEqual(summary["03-noise"]["pixels"], 400)
        with open(os.path.join(self.out, "report.md")) as f:
            report = f.read()
        self.assertIn("## 02-styled", report)
        self.assertIn("`color`: `black` → `red`", report)
        self.assertTrue(os.path.exists(os.path.join(self.out, "03-noise.diff.png")))

    def test_names_limit_the_comparison(self):
        for name in ("01-a", "02-b"):
            write_capture(self.before, name, {"a": element()})
            write_capture(self.after, name, {"a": element()})
        self.assertEqual(list(compare(self.before, self.after, self.out, ["02-b"])), ["02-b"])

    def test_a_requested_scenario_neither_side_captured_is_missing(self):
        write_capture(self.before, "01-a", {"a": element()})
        write_capture(self.after, "01-a", {"a": element()})
        summary = compare(self.before, self.after, self.out, ["01-a", "02-failed"])
        self.assertEqual(summary["02-failed"]["verdict"], "missing")
        self.assertEqual(summary["02-failed"]["note"], "missing in both")


@unittest.skipUnless(HAS_PIL, "Pillow is not installed")
class ImageDiffTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)

    def changed(self, before, after) -> int:
        from PIL import Image

        paths = [os.path.join(self.tmp.name, f) for f in ("a.png", "b.png", "d.png")]
        Image.new("RGB", (10, 10), before).save(paths[0])
        Image.new("RGB", (10, 10), after).save(paths[1])
        return image_diff(*paths)[0]

    def test_a_change_in_one_channel_counts_in_full(self):
        # Luminance weighs blue at about a tenth: this change would be 11, under the threshold
        self.assertEqual(self.changed((255, 255, 255), (255, 255, 155)), 100)
        self.assertEqual(self.changed((0, 0, 0), (0, 0, 17)), 100)

    def test_a_channel_difference_up_to_the_threshold_is_noise(self):
        self.assertEqual(self.changed((100, 100, 100), (116, 84, 116)), 0)


if __name__ == "__main__":
    unittest.main()
