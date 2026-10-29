import unittest

from scripts.styles.check_styles import Sources, check, strip_comments

HEADER = "/**\n * Licensed.\n */"


def sources(scss: str, templates: str = "", code: str = "", library_code: str = "", library_styles: str = "") -> Sources:
    return Sources(
        stylesheets={"a.component.scss": f"{HEADER}\n\n{scss}"},
        templates=templates,
        code=code,
        library_code=library_code,
        library_styles=library_styles,
    )


def messages(src: Sources) -> list[str]:
    return [finding.message for finding in check(src, HEADER)]


class LicenseTest(unittest.TestCase):
    def test_a_stylesheet_without_the_header_is_reported(self):
        src = Sources({"a.scss": ".a {}"}, "", "", "", "")
        self.assertEqual(len(messages(src)), 1)
        self.assertIn("license header", messages(src)[0])

    def test_a_stylesheet_with_the_header_passes(self):
        self.assertEqual(messages(sources(".a {}")), [])


class LibraryClassTest(unittest.TestCase):
    def test_a_class_material_no_longer_sets_is_reported(self):
        self.assertEqual(
            messages(sources(".x .mat-checkbox-label { color: red; }", library_code='"mat-mdc-checkbox"')),
            ["`.mat-checkbox-label` is set by neither Material, the CDK nor the app"],
        )

    def test_a_class_material_sets_in_a_host_binding_passes(self):
        library = 'host: { "class": "mat-mdc-checkbox mat-mdc-checkbox-checked" }'
        self.assertEqual(messages(sources(".mat-mdc-checkbox-checked { color: red; }", library_code=library)), [])

    def test_a_class_material_names_in_its_own_styles_passes(self):
        self.assertEqual(messages(sources(".mdc-form-field {}", library_code=".mdc-form-field{display:flex}")), [])

    def test_a_class_the_template_sets_passes(self):
        self.assertEqual(messages(sources(".mat-row {}", templates='<tr class="mat-row" *matNoDataRow>')), [])

    def test_a_class_bound_in_the_template_passes(self):
        self.assertEqual(messages(sources(".cdk-x {}", templates='<div [class.cdk-x]="on">')), [])

    def test_a_class_from_an_ng_class_object_passes(self):
        self.assertEqual(messages(sources(".cdk-custom {}", templates="<div [ngClass]=\"{'cdk-custom': enabled}\">")), [])

    def test_a_class_from_an_ng_class_array_passes(self):
        self.assertEqual(messages(sources(".cdk-custom {}", templates="<div [ngClass]=\"['row', 'cdk-custom']\">")), [])

    def test_a_class_from_a_class_binding_expression_passes(self):
        self.assertEqual(messages(sources(".mat-x {}", templates="<div [class]=\"on ? 'mat-x big' : ''\">")), [])

    def test_a_class_set_from_code_passes(self):
        self.assertEqual(messages(sources(".mat-foo {}", code="panelClass: 'menu mat-foo'")), [])

    def test_an_attribute_named_like_the_class_does_not_count(self):
        found = messages(sources(".mat-header-cell {}", templates="<th mat-header-cell>Name</th>"))
        self.assertEqual(found, ["`.mat-header-cell` is set by neither Material, the CDK nor the app"])

    def test_a_longer_class_does_not_count_for_its_prefix(self):
        found = messages(sources(".mat-chip {}", library_code='"mat-chip-set"'))
        self.assertEqual(found, ["`.mat-chip` is set by neither Material, the CDK nor the app"])

    def test_column_classes_are_skipped(self):
        self.assertEqual(messages(sources(".mat-column-name {}")), [])

    def test_a_class_named_only_in_a_comment_is_ignored(self):
        self.assertEqual(messages(sources("// .mat-gone was removed\n/* .mat-gone */\n.a {}")), [])


class CustomPropertyReadTest(unittest.TestCase):
    def test_a_property_nothing_defines_is_reported(self):
        self.assertEqual(
            messages(sources(".a { color: var(--color-fg-default); }")),
            ["`var(--color-fg-default)` reads a custom property that nothing defines"],
        )

    def test_a_property_another_stylesheet_defines_passes(self):
        src = Sources(
            {"a.scss": f"{HEADER}\n.a {{ color: var(--accent); }}", "b.scss": f"{HEADER}\n:root {{ --accent: red; }}"},
            "", "", "", "",
        )
        self.assertEqual(messages(src), [])

    def test_a_property_the_theme_defines_passes(self):
        theme = ".mat-mdc-radio-button{--mat-radio-disabled-label-color:#0006}"
        self.assertEqual(messages(sources(".a { color: var(--mat-radio-disabled-label-color); }", library_styles=theme)), [])

    def test_a_property_a_template_binds_passes(self):
        self.assertEqual(messages(sources(".a { width: var(--w); }", templates='<div [style.--w]="w">')), [])

    def test_a_fallback_does_not_make_a_property_defined(self):
        found = messages(sources(".a { color: var(--nowhere, red); }"))
        self.assertEqual(found, ["`var(--nowhere)` reads a custom property that nothing defines"])


class TokenOverrideTest(unittest.TestCase):
    def test_a_token_material_no_longer_reads_is_reported(self):
        self.assertEqual(
            messages(sources(":host { --mat-checkbox-old-size: 4px; }", library_code="var(--mat-checkbox-state-layer-size)")),
            ["`--mat-checkbox-old-size` sets a token that Material no longer reads"],
        )

    def test_a_token_material_reads_passes(self):
        library = "var(--mat-checkbox-state-layer-size, 40px)"
        self.assertEqual(messages(sources(":host { --mat-checkbox-state-layer-size: 32px; }", library_code=library)), [])

    def test_app_properties_are_not_tokens(self):
        self.assertEqual(messages(sources(":root { --row-height: 4px; } .a { height: var(--row-height); }")), [])


class StripCommentsTest(unittest.TestCase):
    def test_urls_keep_their_double_slash(self):
        self.assertEqual(strip_comments('a { background: url("http://x/y.png"); }'), 'a { background: url("http://x/y.png"); }')

    def test_protocol_relative_urls_keep_their_double_slash(self):
        self.assertEqual(strip_comments("a { background: url(//cdn/x.png); }"), "a { background: url(//cdn/x.png); }")

    def test_line_and_block_comments_go(self):
        self.assertEqual(strip_comments("a {} // note\n/* block\n */b {}"), "a {} \nb {}")


if __name__ == "__main__":
    unittest.main()
