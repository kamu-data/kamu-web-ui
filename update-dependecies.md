Packages that constrain each other through `peerDependencies`. The Angular framework, build tooling and CDK/Material groups are listed in [`kamu-ui-release-dependency-workflows`](.claude/skills/kamu-ui-release-dependency-workflows/SKILL.md#dependencies).

- **zone.js** stays in the range **@angular/core** and **ngx-markdown** peer on (`~0.15.0 || ~0.16.0`)
- **typescript** must satisfy **@angular/build** (`>=5.9 <6.0`), **@angular/compiler-cli** (`>=5.9 <6.1`) and **@typescript-eslint/\*** (`<6.1.0`)
- Libraries that peer on one Angular major and move with each Angular upgrade: **@ng-bootstrap/ng-bootstrap**, **@ng-select/ng-select**, **ngx-toastr**, **ngx-markdown**, **ngx-infinite-scroll**, **ngx-monaco-editor-v2** (`^21.1.4`), **@danielmoncada/angular-datetime-picker** (also **@angular/cdk**), **@danielmoncada/angular-datetime-picker-moment-adapter**
- Libraries whose **@angular/core** range spans several majors: **apollo-angular** (`<23`), **@swimlane/ngx-graph** (`<23`, also **@angular/cdk**); **ngx-highlightjs** (also **@angular/cdk**) and **ngx-trim-directive** have no upper bound, so npm accepts them on any Angular major
- **@ng-bootstrap/ng-bootstrap** also peers on **@angular/localize** and **@popperjs/core**
- **bootstrap** peers on **@popperjs/core**
- **apollo-angular** peers on **@apollo/client** (`^4.2.3`), **graphql** and **rxjs** (`^7.8.0`)
- **graphql**: **@apollo/client** and **apollo-angular** accept 17, the **@graphql-codegen/\*** packages only up to 16
- **highlight.js** stays in the range **ngx-highlightjs** peers on (`^11.11.1`); the app also imports its core, languages and a theme directly
- **marked** stays in the range **ngx-markdown** peers on (`^17.0.0 || ^18.0.0`)
- **ngx-monaco-editor-v2**: each release peers on one **monaco-editor** minor (21.1 → `^0.55.1`); move the two together
- **@danielmoncada/angular-datetime-picker-moment-adapter** peers on **moment** (`^2.30.1`), which npm installs as a peer, not from `package.json`
- **date-fns-tz** peers on **date-fns**; **siwe** peers on **ethers**
- **@typescript-eslint/\*** and **eslint-plugin-license-header** peer on **eslint**; **stylelint-scss** and **stylelint-config-standard-scss** peer on **stylelint**

- "ng2-pdf-viewer": "^9.1.5" (touch only when absolutely necessary). It brings its own **pdfjs-dist** `~2.14.305` as a dependency, so `package.json` does not declare pdfjs-dist

- **vitest**, **@vitest/browser-playwright** and **@vitest/coverage-v8** share one version; **@angular/build** 21 peers on **vitest** `^4.0.8`, so Vitest 5 waits for Angular 22
- "@vitest/eslint-plugin": "1.6.27" (pinned: 1.6.28 peers on **typescript** `>=6.0.0`, while Angular 21 requires `<6.0`)
