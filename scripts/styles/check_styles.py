"""Checks on the app's SCSS that stylelint cannot make, because they need the templates and the
installed Material, CDK and Bootstrap packages.

Run from the repository root after `npm ci`: `npm run check-styles`. Exit status 1 lists every
finding.

- Every stylesheet under `src/` starts with the license header from
  `src/docs/license-header-template.js`.
- Every `.mat-*`, `.mdc-*` and `.cdk-*` class a stylesheet names is still set by Material or the
  CDK, or by the app itself. A Material release that renames a class otherwise leaves our rule
  matching nothing.
- Every `var(--x)` a stylesheet reads is defined: by the app's styles or templates, or by the
  theme, Material, the CDK or Bootstrap. An undefined one makes the browser drop the declaration.
- Every `--mat-*` / `--mdc-*` token a stylesheet sets is still read by Material or its theme.
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LICENSE_HEADER_FILE = ROOT / "src" / "docs" / "license-header-template.js"

# Bundles that set classes and define or read custom properties at run time
LIBRARY_GLOBS = [
    "node_modules/@angular/material/fesm2022/*.mjs",
    "node_modules/@angular/cdk/fesm2022/*.mjs",
]
# Stylesheets the app loads from packages; they define custom properties
LIBRARY_STYLE_GLOBS = [
    "node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
    "node_modules/bootstrap/dist/css/bootstrap.css",
]

# Generated from column names (`matColumnDef`), so no bundle or template spells them out
DYNAMIC_CLASS_PREFIXES = ("mat-column-",)

COMMENT = re.compile(r"/\*.*?\*/|(?<![:\"'])//[^\n]*", re.S)
LIBRARY_CLASS = re.compile(r"\.((?:mat|mdc|cdk)-[\w-]+)")
VAR_READ = re.compile(r"var\(\s*(--[\w-]+)")
PROPERTY_SET = re.compile(r"(?<![\w-])(--[\w-]+)\s*:")
TOKEN_SET = re.compile(r"(?<![\w-])(--(?:mat|mdc)-[\w-]+)\s*:")


@dataclass(frozen=True)
class Sources:
    """Everything the checks look at, as text, so tests can build it in memory."""

    stylesheets: dict[str, str]
    templates: str
    code: str
    library_code: str
    library_styles: str


@dataclass(frozen=True)
class Finding:
    file: str
    message: str

    def __str__(self) -> str:
        return f"{self.file}: {self.message}"


def strip_comments(scss: str) -> str:
    return COMMENT.sub("", scss)


def word(name: str) -> str:
    """A pattern for `name` as a whole class or property name."""
    return r"(?<![\w-])" + re.escape(name) + r"(?![\w-])"


def check_license(sources: Sources, header: str) -> list[Finding]:
    return [
        Finding(file, "does not start with the license header from src/docs/license-header-template.js")
        for file, text in sources.stylesheets.items()
        if not text.startswith(header)
    ]


def library_sets_class(name: str, library_code: str) -> bool:
    end = r"(?![\w-])"
    escaped = re.escape(name)
    return bool(
        re.search(r"\." + escaped + end, library_code)
        or re.search(r"class[^\n]{0,200}?[\"' ]" + escaped + end, library_code)
        or re.search(r"class\." + escaped + end, library_code)
        or re.search(r"[\"']" + escaped + r"[\"']", library_code)
    )


def app_sets_class(name: str, templates: str, code: str) -> bool:
    # Only a class the app sets counts: a bare `<th mat-header-cell>` is an attribute, and the class
    # Material puts on that element is `mat-mdc-header-cell`.
    escaped = re.escape(name)
    return bool(
        re.search(r"class=\"[^\"]*" + word(name), templates)
        or re.search(r"\[class\." + escaped + r"\]", templates)
        or re.search(r"[\"'`][^\"'`\n]*" + word(name), code)
    )


def check_library_classes(sources: Sources) -> list[Finding]:
    findings = []
    for file, text in sources.stylesheets.items():
        for name in sorted(set(LIBRARY_CLASS.findall(strip_comments(text)))):
            if name.startswith(DYNAMIC_CLASS_PREFIXES):
                continue
            if library_sets_class(name, sources.library_code) or app_sets_class(name, sources.templates, sources.code):
                continue
            findings.append(Finding(file, f"`.{name}` is set by neither Material, the CDK nor the app"))
    return findings


def check_custom_property_reads(sources: Sources) -> list[Finding]:
    defined = set()
    for text in sources.stylesheets.values():
        defined.update(PROPERTY_SET.findall(strip_comments(text)))
    findings = []
    for file, text in sources.stylesheets.items():
        for name in sorted(set(VAR_READ.findall(strip_comments(text)))):
            if name in defined:
                continue
            if re.search(word(name), sources.library_styles) or re.search(word(name), sources.library_code):
                continue
            if re.search(word(name), sources.templates) or re.search(word(name), sources.code):
                continue
            findings.append(Finding(file, f"`var({name})` reads a custom property that nothing defines"))
    return findings


def check_token_overrides(sources: Sources) -> list[Finding]:
    findings = []
    for file, text in sources.stylesheets.items():
        for name in sorted(set(TOKEN_SET.findall(strip_comments(text)))):
            if re.search(word(name), sources.library_code) or re.search(word(name), sources.library_styles):
                continue
            findings.append(Finding(file, f"`{name}` sets a token that Material no longer reads"))
    return findings


def check(sources: Sources, header: str) -> list[Finding]:
    return [
        *check_license(sources, header),
        *check_library_classes(sources),
        *check_custom_property_reads(sources),
        *check_token_overrides(sources),
    ]


def read_all(paths: list[Path]) -> str:
    return "\n".join(path.read_text(encoding="utf8") for path in paths)


def load_sources(root: Path) -> Sources:
    library_code = [path for pattern in LIBRARY_GLOBS for path in sorted(root.glob(pattern))]
    library_styles = [path for pattern in LIBRARY_STYLE_GLOBS for path in sorted(root.glob(pattern))]
    if not library_code or len(library_styles) != len(LIBRARY_STYLE_GLOBS):
        raise SystemExit("check-styles: Material, CDK or Bootstrap not found in node_modules (run `npm ci`)")
    return Sources(
        stylesheets={
            path.relative_to(root).as_posix(): path.read_text(encoding="utf8")
            for path in sorted((root / "src").rglob("*.scss"))
        },
        templates=read_all(sorted((root / "src").rglob("*.html"))),
        code=read_all(sorted((root / "src").rglob("*.ts"))),
        library_code=read_all(library_code),
        library_styles=read_all(library_styles),
    )


def main() -> int:
    header = LICENSE_HEADER_FILE.read_text(encoding="utf8").strip()
    sources = load_sources(ROOT)
    findings = check(sources, header)
    for finding in findings:
        print(finding)
    print(f"check-styles: {len(sources.stylesheets)} stylesheets, {len(findings)} findings")
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main())
