// Vitest settings the Angular unit-test builder merges into its own (the `runnerConfig` option in
// angular.json). The browser itself comes from the builder's `browsers` option.

import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// A fixed zone keeps date formatting assertions independent of the machine running them. Chromium
// takes it from the environment of the process that launches it, which loads this file first.
process.env.TZ = "UTC";

export default defineConfig({
  // Vite pre-bundles the dependencies here, outside the Angular build.
  optimizeDeps: {
    esbuildOptions: {
      // The Angular build downlevels async/await for zone.js; a native `await` in a package such as
      // @angular/router would escape fakeAsync, so a navigation would never settle under tick().
      supported: { "async-await": false },
      // Spec files share one page, where Monaco's AMD loader leaves a global `define`. A UMD
      // package imported after it (file-saver) would register with that loader, which rejects it.
      define: { define: "undefined" },
    },
  },
  resolve: {
    alias: {
      // The pre-bundling resolves yaml through its `node` export, whose parser reads `process.env`;
      // the app build takes the browser entry, as this alias does.
      yaml: fileURLToPath(new URL("./node_modules/yaml/browser/index.js", import.meta.url)),
    },
  },
  test: {
    browser: {
      screenshotFailures: false,
    },
    // Random order exposes specs that depend on state an earlier spec left behind.
    sequence: { shuffle: true },
    // Puts every `vi.spyOn` target back after each test. Spec files share one browser context, so a
    // spy left on a root service or a prototype would otherwise reach later files.
    restoreMocks: true,
  },
});
