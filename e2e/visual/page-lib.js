/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// Injected into the page: class-free DOM paths, computed-style snapshots and small DOM helpers.
// `window.__capExtraRoots` (a selector list, set by the session before this runs) adds snapshot roots.
(() => {
  if (window.__cap) return;
  const ROOTS = [
    "mat-checkbox",
    "mat-radio-button",
    "mat-slide-toggle",
    "mat-chip",
    "mat-chip-option",
    "mat-chip-row",
    "mat-chip-set",
    "mat-chip-listbox",
    "mat-button-toggle-group",
    ".mat-mdc-menu-panel",
    "ngb-pagination",
    "ul.pagination",
    "ng-select",
    "ng-dropdown-panel",
    "angular2-multiselect",
    ".dynamic-table",
    "mat-progress-spinner",
    "mat-spinner",
    ".mat-mdc-table",
    ".mat-stepper-horizontal",
    "app-load-more",
    ".header-link",
    "mat-progress-bar",
    "app-modal-dialog",
    ...(window.__capExtraRoots ?? []),
  ].join(",");

  // Class-free path: tag + nth-of-type, so a class added or removed shows up as a diff of the
  // "class" field instead of a different key
  function path(el) {
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.documentElement) {
      const tag = el.tagName.toLowerCase();
      let n = 1;
      for (let s = el.previousElementSibling; s; s = s.previousElementSibling) {
        if (s.tagName === el.tagName) n++;
      }
      parts.unshift(`${tag}:${n}`);
      el = el.parentElement;
    }
    return parts.join(">");
  }

  const VOLATILE_CLASS = /^(ng-tns-|cdk-(focused|mouse-focused|keyboard-focused|program-focused|touch-focused))/;

  function styleOf(el, pseudo) {
    const cs = getComputedStyle(el, pseudo);
    const out = {};
    for (let i = 0; i < cs.length; i++) {
      const p = cs[i];
      out[p] = cs.getPropertyValue(p);
    }
    return out;
  }

  // Each element's style is stored as a delta against a bare element of the same tag (and each
  // pseudo-element as a delta against its element), which keeps the snapshot small; compare.py
  // rebuilds the full style from the shared defaults
  const defaults = {};
  let refBox = null;
  function defaultsFor(tag) {
    if (!defaults[tag]) {
      if (!refBox || !refBox.isConnected) {
        refBox = document.createElement("div");
        refBox.id = "__cap_ref";
        refBox.style.display = "none";
        document.body.appendChild(refBox);
      }
      const ref = document.createElement(tag);
      refBox.appendChild(ref);
      defaults[tag] = styleOf(ref, null);
      ref.remove();
    }
    return defaults[tag];
  }

  function delta(full, base) {
    const out = {};
    for (const [k, v] of Object.entries(full)) if (base[k] !== v) out[k] = v;
    for (const k of Object.keys(base)) if (!(k in full)) out[k] = null;
    return out;
  }

  function record(el) {
    const r = el.getBoundingClientRect();
    const tag = el.tagName.toLowerCase();
    const full = styleOf(el, null);
    const rec = {
      tag,
      class: [...el.classList]
        .filter((c) => !VOLATILE_CLASS.test(c))
        .sort()
        .join(" "),
      // Document coordinates: the same layout scrolled differently gives the same rect
      rect: [r.x + scrollX, r.y + scrollY, r.width, r.height].map((v) => Math.round(v * 10) / 10).join(","),
      style: delta(full, defaultsFor(tag)),
    };
    for (const pseudo of ["::before", "::after"]) {
      const content = getComputedStyle(el, pseudo).getPropertyValue("content");
      if (content && content !== "none" && content !== "normal") rec[pseudo] = delta(styleOf(el, pseudo), full);
    }
    return rec;
  }

  function snapSubtree(root, out) {
    out[path(root)] = record(root);
    for (const el of root.querySelectorAll("*")) {
      if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") continue;
      if (el.closest("#__cap_ref")) continue;
      out[path(el)] = record(el);
    }
  }

  // Only the outermost roots: nested ones are covered by their ancestor
  function topRoots() {
    const all = [...document.querySelectorAll(ROOTS)];
    return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
  }

  // Values that differ between two seedings of the same data: ids, hashes, secrets and absolute times.
  // Each becomes a fixed value of the same format, so a cached baseline stays valid after a reseed.
  // Longer formats come first; the formats are the app's (AppValues) and ISO 8601.
  const MONTH = "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)";
  const zeroed = (text) => text.replace(/[0-9a-zA-Z]/g, "0");
  const VOLATILE = [
    // Whole, or shortened to its ends ("did:odf:fed...6b65ae4")
    [/\bdid:[a-z]+:[0-9a-zA-Z]+(?:(?:\.\.\.|…)[0-9a-zA-Z]+)?/g, (m) => m.replace(/[^:]+$/, zeroed)],
    [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/g, zeroed],
    [/\b[0-9a-f]{32,}\b/g, zeroed],
    [
      new RegExp(`\\b${MONTH} \\d{1,2}(?:st|nd|rd|th) \\d{4} \\d{1,2}:\\d{2}:\\d{2} [AP]M GMT[+-]\\d{2}:\\d{2}`, "g"),
      () => "Jan 1st 2000 1:00:00 AM GMT+00:00",
    ],
    [/\b\d{4}-\d{2}-\d{2}, \d{1,2}:\d{2}:\d{2} [AP]M/g, () => "2000-01-01, 1:00:00 AM"],
    // The date range pickers' inputs (MY_MOMENT_FORMATS)
    [/\b\d{4}-\d{2}-\d{2}, \d{1,2}:\d{2} [AP]M/g, () => "2000-01-01, 1:00 AM"],
    [/\b\d{1,2}\/\d{1,2}\/\d{2}, \d{1,2}:\d{2}:\d{2} [AP]M/g, () => "1/1/00, 1:00:00 AM"],
    [/\b\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?/g, (m) => m.replace(/\d/g, "0")],
    [new RegExp(`\\b\\d{2} ${MONTH} \\d{4}\\b`, "g"), () => "01 Jan 2000"],
    // Measured durations; times relative to the frozen clock ("2 hours ago") stay
    [/\b(?:less than )?(?:a|an|\d+) (?:second|minute)s?\b(?! ago)/g, () => "1 second"],
  ];
  // Components that show a fragment of a volatile value no pattern can recognise
  const VOLATILE_COMPONENTS = "app-display-hash";

  function masked(text) {
    return VOLATILE.reduce((t, [pattern, replace]) => t.replace(pattern, replace), text);
  }

  window.__cap = {
    path,
    // Masks volatile values in text and form fields; returns how many it changed
    mask() {
      let n = 0;
      const walker = document.createTreeWalker(document.body, window.NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const inComponent = node.parentElement?.closest(VOLATILE_COMPONENTS);
        const text = inComponent ? node.data.replace(/[0-9a-f]/g, "0") : masked(node.data);
        if (text !== node.data) {
          node.data = text;
          n++;
        }
      }
      for (const field of document.querySelectorAll("input, textarea")) {
        const value = masked(field.value);
        if (value !== field.value) {
          field.value = value;
          n++;
        }
      }
      return n;
    },
    snapAll() {
      const out = {};
      for (const root of topRoots()) snapSubtree(root, out);
      return out;
    },
    defaults() {
      return defaults;
    },
    snapFor(target) {
      const out = {};
      snapSubtree(target.closest(ROOTS) ?? target, out);
      return out;
    },
    components() {
      const tags = new Set();
      for (const el of document.querySelectorAll("*")) {
        const tag = el.tagName.toLowerCase();
        if (tag.startsWith("app-")) tags.add(tag);
      }
      return [...tags].sort();
    },
    text() {
      return document.body.innerText.replace(/\s+/g, " ").trim();
    },
    clickText(sel, text) {
      const el = [...document.querySelectorAll(sel)].find((e) => e.innerText.trim() === text);
      if (!el) return false;
      el.scrollIntoView({ block: "center" });
      el.click();
      return true;
    },
    click(sel) {
      const el = document.querySelector(sel);
      if (!el) return false;
      el.scrollIntoView({ block: "center" });
      el.click();
      return true;
    },
  };
})();
