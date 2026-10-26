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
