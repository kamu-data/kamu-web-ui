import tempfile
import unittest
from pathlib import Path

from scripts.agents.post_edit import LICENSE_HEADER, added_lines, check_edit, check_license, check_lines, nudges


def flagged(line, rel="src/app/x.component.ts"):
    return bool(check_lines(rel, [line]))


class AddedTextTest(unittest.TestCase):
    def test_only_added_lines_are_judged(self):
        old = "a\n// eslint-disable-next-line\nb"
        new = "a\n// eslint-disable-next-line\nb\nc"
        self.assertEqual(added_lines(old, new), ["c"])

    def test_banned_constructs_are_flagged(self):
        for line in ["    console.log(x);", "    // eslint-disable-next-line @typescript-eslint/no-explicit-any",
                     "/* eslint-disable */", "    standalone: true,",
                     "    constructor(private http: HttpClient) {}",
                     "    public constructor(private readonly api: DatasetApi, x: number) {}"]:
            with self.subTest(line=line):
                self.assertTrue(flagged(line))

    def test_focused_and_disabled_specs_are_flagged_in_specs_only(self):
        for line in ['fdescribe("X", () => {', '    fit("works", () => {', '    xit("later", () => {', 'xdescribe("X", () => {']:
            with self.subTest(line=line):
                self.assertTrue(flagged(line, "src/app/x.component.spec.ts"))
                self.assertFalse(flagged(line, "src/app/x.component.ts"))
        for line in ['    it("works", () => {', "    this.fit(1);", "    profit(1);"]:
            with self.subTest(line=line):
                self.assertFalse(flagged(line, "src/app/x.component.spec.ts"))

    def test_comments_must_not_cite_plans_or_narrate_history(self):
        for line in ["// see plan 7 item 3", "// fixes KAMU-123", "    // per issue #860",
                     " * This used to be a Subject", "// renamed from DatasetsComponent", "// this change adds retries",
                     "<!-- was previously a table -->", "    /* no longer used by flows */"]:
            with self.subTest(line=line):
                self.assertTrue(flagged(line))
        self.assertTrue(flagged("<!-- see JIRA-12 -->", "src/app/x.component.html"))
        self.assertTrue(flagged("// renamed from foo", "src/app/x.component.scss"))

    def test_legitimate_text_passes(self):
        for line in ["        //-----//", "// UTF-8 bytes, SHA-256 digest, ISO-8601 dates", "// Step 1: load the plan",
                     'const url = "http://host/plan 7";', "    console.error(e);", "    standalone: false,",
                     "    private api = inject(DatasetApi);", "    constructor() {", "const plan = new Plan(7);",
                     "// it's a large, but default tab, so don't load it lazily"]:
            with self.subTest(line=line):
                self.assertFalse(flagged(line))

    def test_rules_do_not_apply_to_other_files(self):
        self.assertEqual(check_lines("scripts/agents/x.py", ["console.log(1)  # renamed from y"]), [])
        self.assertEqual(check_lines("docs/internal/x.md", ["standalone: true"]), [])

    def test_nudges_name_the_follow_up_command(self):
        self.assertIn("gql-codegen", nudges("src/app/api/gql/account/account-by-name.graphql", ["x"])[0])
        self.assertIn("build-prod", nudges("src/app/dataset-view/dataset-view-routing.ts", ["        loadChildren: () =>"])[0])
        self.assertEqual(nudges("src/app/dataset-view/dataset-view-routing.ts", ["        path: x,"]), [])
        self.assertIn("npm install", nudges("package.json", ['"x": "1"'])[0])
        self.assertEqual(nudges("src/app/app.component.ts", ["x"]), [])


class LicenseTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.dir.cleanup)
        self.file = Path(self.dir.name) / "x.ts"

    def test_new_source_files_need_the_header(self):
        self.file.write_text("export const x = 1;\n")
        self.assertTrue(check_license("src/app/new-thing.ts", self.file))
        self.file.write_text(LICENSE_HEADER + "\n\nexport const x = 1;\n")
        self.assertEqual(check_license("src/app/new-thing.ts", self.file), [])

    def test_committed_generated_and_out_of_scope_files_are_exempt(self):
        self.file.write_text("export const x = 1;\n")
        for rel in ["src/app/app.component.ts", "src/app/api/kamu.graphql.interface.ts",
                    "src/app/editor/generated/monaco-version.ts", "src/main.ts", "scripts/x.js"]:
            with self.subTest(rel=rel):
                self.assertEqual(check_license(rel, self.file), [])


class FileTest(unittest.TestCase):
    def test_paths_outside_the_repository_are_ignored(self):
        self.assertEqual(check_edit("/tmp/elsewhere.ts", None, "console.log(x);"), ([], []))


if __name__ == "__main__":
    unittest.main()
