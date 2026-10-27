// Runs before every spec file (the `setupFiles` option in angular.json), once Vitest has set up its globals.

// Runs each `describe` in a sync zone and each test and hook in a ProxyZone, which `fakeAsync` needs.
// The builder loads `zone.js/testing`, which does not include the Vitest plugin.
import "zone.js/plugins/vitest-patch";
// The app loads Prism and ClipboardJS as global `scripts` (angular.json), which the unit-test build
// leaves out; ngx-markdown looks both up as globals.
import "prismjs";
import "prismjs/components/prism-sql.min.js";
import "prismjs/components/prism-css.min.js";
import "prismjs/components/prism-json.min.js";
import "prismjs/components/prism-yaml.min.js";

import ClipboardJS from "clipboard";

declare global {
    interface Window {
        ClipboardJS: typeof ClipboardJS;
    }
}

window.ClipboardJS = ClipboardJS;

// Angular reports some dev-mode problems (NG0956, a whole @for list rebuilt) only through the
// console, and Vitest drops console output when its own output is not a terminal. Such a message
// fails the test that caused it, so a piped or CI run sees it too.
const ANGULAR_RUNTIME_CODE = /\bNG0\d{3}\b/;
const angularMessages: string[] = [];
for (const level of ["warn", "error"] as const) {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
        const text = args.map(String).join(" ");
        if (ANGULAR_RUNTIME_CODE.test(text)) {
            angularMessages.push(`console.${level}: ${text}`);
        }
        original(...args);
    };
}

afterEach(() => {
    const messages = angularMessages.splice(0);
    if (messages.length) {
        throw new Error(`Angular reported runtime problems during this test:\n${messages.join("\n")}`);
    }
});
