# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import unittest

from scripts.license.check_license import LICENSE_HEADER_FILE, has_header, hash_form, in_scope

BLOCK = "/**\n * Licensed.\n *\n * Second line.\n */\n"
HASH = "# Licensed.\n#\n# Second line."


class HashFormTest(unittest.TestCase):
    def test_block_lines_become_hash_lines(self):
        self.assertEqual(hash_form(BLOCK), HASH)

    def test_the_real_template_converts(self):
        form = hash_form(LICENSE_HEADER_FILE.read_text())
        self.assertTrue(form.startswith("# Copyright Kamu Data, Inc."))
        self.assertNotIn("*", form)


class HasHeaderTest(unittest.TestCase):
    def test_a_script_with_the_block_header_passes(self):
        self.assertTrue(has_header("e2e/visual/cli.mjs", BLOCK + "\nimport fs from 'node:fs';\n", BLOCK))

    def test_a_script_without_it_fails(self):
        self.assertFalse(has_header("e2e/visual/cli.mjs", "import fs from 'node:fs';\n", BLOCK))

    def test_a_python_file_takes_the_hash_form(self):
        self.assertTrue(has_header("scripts/x.py", HASH + "\n\nimport sys\n", BLOCK))
        self.assertFalse(has_header("scripts/x.py", BLOCK + "\nimport sys\n", BLOCK))

    def test_a_shebang_may_come_first(self):
        self.assertTrue(has_header("run.sh", "#!/bin/bash\n" + HASH + "\nset -e\n", BLOCK))

    def test_a_node_script_may_start_with_a_shebang(self):
        self.assertTrue(has_header("scripts/x.js", "#!/usr/bin/env node\n" + BLOCK + "\nconst a = 1;\n", BLOCK))

    def test_a_shebang_alone_is_not_a_header(self):
        self.assertFalse(has_header("run.sh", "#!/bin/bash\nset -e\n", BLOCK))

    def test_an_empty_package_marker_passes(self):
        self.assertTrue(has_header("scripts/agents/__init__.py", "", BLOCK))

    def test_a_stylesheet_takes_the_block_form(self):
        self.assertTrue(has_header("src/styles.scss", BLOCK + "\n.a {}\n", BLOCK))


class ScopeTest(unittest.TestCase):
    def test_scripts_config_and_styles_are_in_scope(self):
        for rel in ["e2e/visual/cli.mjs", "update-changelog.js", "eslint.config.mjs", "vitest-base.config.ts",
                    "scripts/agents/common.py", "e2e/run.sh", "src/styles.scss", "src/app/a/a.component.scss"]:
            with self.subTest(rel=rel):
                self.assertTrue(in_scope(rel))

    def test_typescript_eslint_checks_is_out_of_scope(self):
        self.assertFalse(in_scope("src/app/a/a.component.ts"))

    def test_generated_files_and_other_kinds_are_out_of_scope(self):
        for rel in ["src/app/editor/generated/monaco-version.js", "package.json", "README.md", "e2e/catalogue/query.yaml"]:
            with self.subTest(rel=rel):
                self.assertFalse(in_scope(rel))


if __name__ == "__main__":
    unittest.main()
