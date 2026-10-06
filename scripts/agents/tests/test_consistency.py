"""Keeps the agent harness consistent: skills, their Codex symlinks, the AGENTS.md routing table,
the hooks' policy file, and links between docs. Port of kamu-cli's `agent_harness.rs` repo lints."""

import os
import re
import unittest
from pathlib import Path

from scripts.agents.common import ROOT, policy

SKILLS_DIR = ".claude/skills"
CODEX_SKILLS_DIR = ".agents/skills"
ROUTED_DOCS_DIR = "docs/internal"

LINK = re.compile(r"\[[^\]]*\]\(([^)\s]+)\)")
LINE_ANCHOR = re.compile(r"^L\d+")
HEADING = re.compile(r"^#{1,6}\s+(.+?)\s*#*\s*$")
HTML_COMMENT = re.compile(r"<!--.*?-->")
MD_LINK_TEXT = re.compile(r"\[([^\]]*)\]\([^)]*\)")
HTML_ANCHOR = re.compile(r'<a\s+(?:id|name)="([^"]+)"')
CODE_SPAN = re.compile(r"`([^`]+)`")


class HarnessConsistencyTest(unittest.TestCase):
    def test_skills_are_declared_routed_and_mirrored_for_codex(self):
        skills = skill_names()
        errors = []
        for name in sorted(skills):
            front = front_matter((ROOT / SKILLS_DIR / name / "SKILL.md").read_text())
            if front.get("name") != name:
                errors.append(f"{SKILLS_DIR}/{name}/SKILL.md: front matter `name` must be `{name}`")
            if not front.get("description"):
                errors.append(f"{SKILLS_DIR}/{name}/SKILL.md: front matter needs a `description`")

        codex = set()
        for entry in sorted((ROOT / CODEX_SKILLS_DIR).iterdir()):
            expected = f"../../{SKILLS_DIR}/{entry.name}"
            if not entry.is_symlink():
                errors.append(f"{CODEX_SKILLS_DIR}/{entry.name}: must be a relative symlink to `{expected}`, not a real file")
            elif os.readlink(entry) != expected:
                errors.append(f"{CODEX_SKILLS_DIR}/{entry.name}: must link to `{expected}`, links to `{os.readlink(entry)}`")
            codex.add(entry.name)
        for name in sorted(skills - codex):
            errors.append(f"{CODEX_SKILLS_DIR}/{name}: missing symlink (`ln -s ../../{SKILLS_DIR}/{name} {CODEX_SKILLS_DIR}/{name}`)")

        routed = {skill for skill, _ in routing_table()}
        for name in sorted(skills - routed):
            errors.append(f"AGENTS.md: skill `{name}` has no row in 'What to load for which task'")
        for name in sorted(routed - skills):
            errors.append(f"AGENTS.md: routes skill `{name}`, which does not exist in {SKILLS_DIR}")
        assert_no_errors(self, "Skill registry is inconsistent", errors)

    def test_routing_table_guarded_paths_match_hook_policy(self):
        table = [(skill, paths) for skill, paths in routing_table() if paths]
        rules = [(rule["skill"], rule["paths"]) for rule in policy()["skills"]]
        self.assertEqual(table, rules, "The 'Guarded paths' column in AGENTS.md must list the same rules, in the "
                                       "same order, as .claude/hooks/governed_paths.json")

    def test_doc_links_resolve(self):
        errors = []
        for file in linted_docs():
            rel = file.relative_to(ROOT).as_posix()
            for line_no, line in outside_code_fences(file.read_text()):
                for link in LINK.findall(line):
                    if "://" in link or link.startswith("mailto:"):
                        continue
                    if problem := check_link(file, link):
                        errors.append(f"./{rel}:{line_no}: `{link}` {problem}")
        assert_no_errors(self, "Broken documentation links", errors)

    def test_every_design_doc_is_routed_from_agents_md(self):
        agents = (ROOT / "AGENTS.md").read_text()
        errors = [
            f"{rel}: not routed from AGENTS.md 'What to load for which task' — no session will find it"
            for rel in (f.relative_to(ROOT).as_posix() for f in markdown_files(ROOT / ROUTED_DOCS_DIR))
            if rel not in agents
        ]
        assert_no_errors(self, "Unrouted design documents", errors)

    def test_slugs_follow_github(self):
        self.assertEqual(slug("Build scope (`-p`)"), "build-scope--p")
        self.assertEqual(slug("Developer Guide <!-- omit in toc -->"), "developer-guide")
        self.assertEqual(slug("17. Extension points & gotchas"), "17-extension-points--gotchas")
        self.assertEqual(slug("See [the doc](x.md) now"), "see-the-doc-now")
        self.assertEqual(slug("Running with local GQL server"), "running-with-local-gql-server")


def assert_no_errors(test, title, errors):
    test.assertFalse(errors, f"{title}:\n" + "\n".join(errors))


def skill_names() -> set[str]:
    return {p.name for p in (ROOT / SKILLS_DIR).iterdir() if p.is_dir()}


def front_matter(content: str) -> dict[str, str]:
    lines = content.splitlines()
    if not lines or lines[0] != "---":
        return {}
    out = {}
    for line in lines[1:]:
        if line == "---":
            break
        key, sep, value = line.partition(":")
        if sep:
            out[key.strip()] = value.strip()
    return out


def routing_table() -> list[tuple[str, list[str]]]:
    """Rows of the skills table in AGENTS.md: (skill, guarded paths), in order."""
    agents = (ROOT / "AGENTS.md").read_text()
    _, found, section = agents.partition("\n### Skills\n")
    assert found, "AGENTS.md must have a '### Skills' section"
    section = section.split("\n#")[0]
    rows = []
    for row in [line for line in section.splitlines() if line.startswith("|")][2:]:
        cells = [c.strip() for c in row.strip("|").split("|")]
        assert len(cells) == 3, f"AGENTS.md skills table row needs 3 cells: {row}"
        skill = CODE_SPAN.search(cells[1])
        assert skill, f"skill cell must be a code span: {row}"
        rows.append((skill.group(1), CODE_SPAN.findall(cells[2])))
    return rows


def linted_docs() -> list[Path]:
    files = [ROOT / f for f in ("AGENTS.md", "CLAUDE.md", "DEVELOPER.md")]
    files += markdown_files(ROOT / ROUTED_DOCS_DIR)
    files += [ROOT / SKILLS_DIR / s / "SKILL.md" for s in sorted(skill_names())]
    files += sorted((ROOT / ".claude" / "agents").glob("*.md"))
    return files


def markdown_files(directory: Path) -> list[Path]:
    return sorted(directory.rglob("*.md")) if directory.is_dir() else []


def outside_code_fences(content: str) -> list[tuple[int, str]]:
    """Lines with 1-based numbers, skipping fenced code blocks."""
    in_fence, lines = False, []
    for i, line in enumerate(content.splitlines()):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        elif not in_fence:
            lines.append((i + 1, line))
    return lines


def check_link(source: Path, link: str) -> str | None:
    path, _, anchor = link.partition("#")
    if not path:
        target = source
    elif path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = source.parent / path
    if not target.exists():
        return f"points to a missing file `{target}`"
    if not anchor:
        return None
    if LINE_ANCHOR.match(anchor):
        return "pins a line number, which goes stale with the next edit; link a heading"
    if target.suffix == ".md" and anchor not in heading_slugs(target.read_text()):
        return f"names a heading anchor `#{anchor}` that does not exist"
    return None


def heading_slugs(content: str) -> set[str]:
    """Heading anchors plus explicit `<a id="...">` anchors."""
    seen: dict[str, int] = {}
    slugs = set()
    for _, line in outside_code_fences(content):
        slugs.update(HTML_ANCHOR.findall(line))
        if m := HEADING.match(line):
            base = slug(m.group(1))
            count = seen.get(base, 0)
            slugs.add(base if count == 0 else f"{base}-{count}")
            seen[base] = count + 1
    return slugs


def slug(heading: str) -> str:
    """GitHub's heading anchor: lowercase, punctuation dropped, spaces to hyphens."""
    text = MD_LINK_TEXT.sub(r"\1", HTML_COMMENT.sub("", heading)).strip().lower()
    return "".join("-" if c == " " else c for c in text if c == " " or c.isalnum() or c in "-_")


if __name__ == "__main__":
    unittest.main()
