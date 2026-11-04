# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""Compares two captures: computed styles exactly, screenshots pixel by pixel.

Usage: python3 compare.py <beforeDir> <afterDir> <outDir> [--names a,b,...]

Writes <outDir>/report.md (style diffs per scenario, element and property, and pixel counts),
<outDir>/summary.json (per scenario: style diffs, changed pixels, verdict) and
<outDir>/<scenario>.diff.png (changed pixels in red over a faded "after"). Pillow is needed for
the screenshots only.
"""

from __future__ import annotations

import gzip
import json
import os
import sys

# A channel difference at or below this is antialiasing, not a change
PIXEL_THRESHOLD = 16
# Lines per element in the report before the rest is summarised
MAX_PROPERTIES = 40


def rebuild(data: dict) -> dict:
    """Full styles from a snapshot whose elements are deltas against per-tag defaults."""
    defaults = data["defaults"]
    full = {}
    for key, rec in data["elements"].items():
        style = apply(defaults.get(rec["tag"], {}), rec["style"])
        entry = {"class": rec["class"], "rect": rec["rect"], "style": style}
        for pseudo in ("::before", "::after"):
            if pseudo in rec:
                entry[pseudo] = apply(style, rec[pseudo])
        full[key] = entry
    return full


def apply(base: dict, delta: dict) -> dict:
    out = dict(base)
    for prop, value in delta.items():
        if value is None:
            out.pop(prop, None)
        else:
            out[prop] = value
    return out


def load(path: str) -> dict:
    with gzip.open(path) as f:
        return rebuild(json.load(f))


def diff_styles(a: dict, b: dict):
    """Yields (element key, field, before, after) for every difference."""
    for key in sorted(set(a) | set(b)):
        if key not in a:
            yield key, "(element)", "absent", "present"
            continue
        if key not in b:
            yield key, "(element)", "present", "absent"
            continue
        ea, eb = a[key], b[key]
        for field in ("class", "rect"):
            if ea[field] != eb[field]:
                yield key, field, ea[field], eb[field]
        for part in ("style", "::before", "::after"):
            sa, sb = ea.get(part), eb.get(part)
            if sa is None and sb is None:
                continue
            if sa is None or sb is None:
                yield key, part, "absent" if sa is None else "present", "absent" if sb is None else "present"
                continue
            for prop in sorted(set(sa) | set(sb)):
                if sa.get(prop) != sb.get(prop):
                    yield key, prop if part == "style" else f"{part} {prop}", sa.get(prop), sb.get(prop)


def short(key: str) -> str:
    """A readable element key: forced-state keys keep their state, paths their last four steps."""
    state = ""
    if "|" in key:
        prefix, key = key.split("|", 1)
        state = prefix.split("@", 1)[0] + " "
    parts = key.split(">")
    return state + ("…>" if len(parts) > 4 else "") + ">".join(parts[-4:])


def verdict(style_diffs: int, pixels: int | None) -> str:
    """`same`, `changed` (styles differ), `pixels-only` (to recheck: possibly noise) or `missing`."""
    if pixels is None:
        return "missing"
    if style_diffs:
        return "changed"
    return "pixels-only" if pixels else "same"


def image_diff(before: str, after: str, out_png: str) -> tuple[int | None, str]:
    """Changed pixels and a note on size changes; writes the diff image when anything changed."""
    from PIL import Image, ImageChops

    if not (os.path.exists(before) and os.path.exists(after)):
        return None, "missing screenshot"
    a = Image.open(before).convert("RGB")
    b = Image.open(after).convert("RGB")
    note = ""
    if a.size != b.size:
        note = f" (size {a.size} -> {b.size})"
        w, h = max(a.width, b.width), max(a.height, b.height)
        a, b = pad(a, w, h, Image), pad(b, w, h, Image)
    # The largest channel difference: luminance would weigh a change in blue at a tenth
    channels = ImageChops.difference(a, b).split()
    largest = ImageChops.lighter(ImageChops.lighter(channels[0], channels[1]), channels[2])
    mask = largest.point(lambda v: 255 if v > PIXEL_THRESHOLD else 0)
    changed = mask.histogram()[255]
    if changed:
        faded = Image.blend(b, Image.new("RGB", b.size, (255, 255, 255)), 0.6)
        Image.composite(Image.new("RGB", b.size, (255, 0, 0)), faded, mask).save(out_png)
    return changed, note


def pad(im, w: int, h: int, Image):
    canvas = Image.new("RGB", (w, h), (255, 0, 255))
    canvas.paste(im, (0, 0))
    return canvas


def scenario_names(directory: str) -> set[str]:
    styles = os.path.join(directory, "styles")
    if not os.path.isdir(styles):
        return set()
    return {f[: -len(".json.gz")] for f in os.listdir(styles) if f.endswith(".json.gz")}


def report_lines(name: str, diffs: list) -> list[str]:
    lines = [f"## {name}", ""]
    by_element: dict[str, list] = {}
    for key, prop, va, vb in diffs:
        by_element.setdefault(key, []).append((prop, va, vb))
    for key, props in by_element.items():
        lines.append(f"- `{short(key)}`")
        for prop, va, vb in props[:MAX_PROPERTIES]:
            lines.append(f"  - `{prop}`: `{va}` → `{vb}`")
        if len(props) > MAX_PROPERTIES:
            lines.append(f"  - … {len(props) - MAX_PROPERTIES} more")
    return lines + [""]


def compare(before_dir: str, after_dir: str, out_dir: str, names: list[str] | None = None) -> dict:
    os.makedirs(out_dir, exist_ok=True)
    before, after = scenario_names(before_dir), scenario_names(after_dir)
    selected = sorted(names if names is not None else before | after)
    summary, details, rows = {}, [], []
    for name in selected:
        if name not in before or name not in after:
            side = "both" if name not in before and name not in after else "before" if name not in before else "after"
            summary[name] = {"styleDiffs": None, "pixels": None, "verdict": "missing", "note": f"missing in {side}"}
            rows.append(f"| {name} | missing in {side} | | missing |")
            continue
        diffs = list(
            diff_styles(
                load(os.path.join(before_dir, "styles", f"{name}.json.gz")),
                load(os.path.join(after_dir, "styles", f"{name}.json.gz")),
            )
        )
        pixels, note = image_diff(
            os.path.join(before_dir, f"{name}.png"),
            os.path.join(after_dir, f"{name}.png"),
            os.path.join(out_dir, f"{name}.diff.png"),
        )
        result = verdict(len(diffs), pixels)
        summary[name] = {"styleDiffs": len(diffs), "pixels": pixels, "verdict": result, "note": note}
        rows.append(f"| {name} | {len(diffs)} | {'—' if pixels is None else pixels}{note} | {result} |")
        if diffs:
            details += report_lines(name, diffs)
    head = [
        "# Style and screenshot comparison",
        "",
        f"- before: `{before_dir}`",
        f"- after: `{after_dir}`",
        "",
        "| scenario | style diffs | changed px | verdict |",
        "|---|---|---|---|",
        *rows,
        "",
    ]
    with open(os.path.join(out_dir, "report.md"), "w") as f:
        f.write("\n".join(head + details))
    with open(os.path.join(out_dir, "summary.json"), "w") as f:
        json.dump(summary, f, indent=2)
    return summary


def main(argv: list[str]) -> int:
    if len(argv) not in (3, 5) or (len(argv) == 5 and argv[3] != "--names"):
        print(__doc__.strip().splitlines()[2], file=sys.stderr)
        return 2
    names = argv[4].split(",") if len(argv) == 5 else None
    summary = compare(argv[0], argv[1], argv[2], names)
    counts: dict[str, int] = {}
    for result in summary.values():
        counts[result["verdict"]] = counts.get(result["verdict"], 0) + 1
    print(", ".join(f"{n} {v}" for v, n in sorted(counts.items())))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
