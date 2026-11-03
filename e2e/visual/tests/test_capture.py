# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import unittest

from e2e.harness.cache import E2E
from e2e.visual.capture import CAPTURE_FILES, OUTSIDE_CAPTURE

KIT = [
    "fixtures/*.py",
    "harness/*.py",
    "harness/*.js",
    "harness/helpers/*",
    "scenarios.py",
    "visual/*.py",
    "visual/*.js",
]
KIT += ["visual/helpers/*"]


class CaptureFilesTest(unittest.TestCase):
    def test_every_kit_file_is_in_the_baseline_key_or_left_out_on_purpose(self):
        found = {f.relative_to(E2E).as_posix() for pattern in KIT for f in E2E.glob(pattern)}
        found -= {f for f in found if f.endswith(("__init__.py", "__main__.py"))}
        self.assertEqual(sorted(found - set(CAPTURE_FILES) - set(OUTSIDE_CAPTURE)), [], "classify these files")
        self.assertEqual(sorted(set(CAPTURE_FILES) & set(OUTSIDE_CAPTURE)), [])
        self.assertEqual(
            sorted((set(CAPTURE_FILES) | set(OUTSIDE_CAPTURE)) - found), [], "listed files that do not exist"
        )
