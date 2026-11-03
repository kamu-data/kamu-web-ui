/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// Injected into every page a session opens: the DOM helpers scenarios and commands use.
(() => {
  if (window.__e2e) return;
  window.__e2e = {
    components() {
      const tags = new Set();
      for (const el of document.querySelectorAll("*")) {
        const tag = el.tagName.toLowerCase();
        if (tag.includes("-")) tags.add(tag);
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
