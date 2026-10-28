// eslint.config.js
import angularTemplatePlugin from "@angular-eslint/eslint-plugin-template";
import angularTemplateParser from "@angular-eslint/template-parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vitestPlugin from "@vitest/eslint-plugin";
import licenseHeaderPlugin from "eslint-plugin-license-header";

// Code that needs part of a query result types it with a named sub-fragment, not a type cut out of a
// bigger generated one
// The router binds a query parameter repeated in the URL as an array, so app code reads one through
// queryParamMap.get() or an input transform, which both give its first value as a string
const urlParamRestrictions = [
  {
    selector:
      "Decorator > CallExpression[callee.name='Input'] > MemberExpression.arguments[property.name=/^URL_QUERY_PARAM_/]",
    message:
      "Bind a query parameter with @Input({ alias: ProjectLinks.URL_QUERY_PARAM_…, transform: queryParamValue }) from @common/helpers/url-params.helpers.",
  },
  {
    selector:
      "Decorator > CallExpression[callee.name='Input'] > ObjectExpression.arguments:has(Property[key.name='alias'][value.property.name=/^URL_QUERY_PARAM_/]):not(:has(Property[key.name='transform']))",
    message:
      "Give a query-parameter input transform: queryParamValue from @common/helpers/url-params.helpers, then parse the string in its setter.",
  },
  {
    selector: "MemberExpression[property.name='queryParams']",
    message:
      "Read query parameters with queryParamMap.get(), which gives a repeated parameter's first value; queryParams gives an array.",
  },
];

const fragmentSliceRestrictions = [
  {
    selector:
      "TSIndexedAccessType:matches([objectType.typeName.name=/(Fragment|Query|Mutation)$/], [objectType.typeName.right.name=/(Fragment|Query|Mutation)$/])",
    message:
      'Extract a named sub-fragment in the .graphql document and use its XxxFragment type instead of XxxFragment["field"].',
  },
  {
    selector:
      "TSTypeReference[typeName.name='Extract'] > TSTypeParameterInstantiation > TSTypeReference:first-child:matches([typeName.name=/(Fragment|Query|Mutation)$/], [typeName.right.name=/(Fragment|Query|Mutation)$/])",
    message:
      "Spread a named fragment on the union member in the .graphql document and use its XxxFragment type instead of Extract<>.",
  },
];

// Form rules live in @common/validation, where each validator has its message and its spec: a bare
// Validators.pattern carries no message of its own
const formValidationRestrictions = [
  {
    selector: "CallExpression[callee.object.name='Validators'][callee.property.name='pattern']",
    message:
      "Add the pattern with its message to @common/validation/patterns.ts and validate it with formatValidator(), or add a validator to @common/validation.",
  },
];

// A number input states the smallest value it accepts, so the browser's spinner and the validators agree
const templateFormRestrictions = [
  {
    selector:
      'Element[name="input"]:has(TextAttribute[name="type"][value="number"]):not(:has(TextAttribute[name="min"])):not(:has(BoundAttribute[name="min"]))',
    message: 'Give a number input its minimum (min="…" or [min]), matching its control\'s validators.',
  },
];

export default [
  {
    // Global ignore patterns
    ignores: [
      "node_modules/**",
      "dist/**",
      ".angular/**",
      "coverage/**",
      "**/kamu.graphql.interface.ts",
      "**/add-license.js",
      "src/app/editor/generated/monaco-version.ts",
    ],
  },
  // Main configuration for TypeScript files, specs included
  {
    files: ["src/app/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: ["./tsconfig.json"],
      },
      globals: {
        ...vitestPlugin.environments.env.globals,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      vitest: vitestPlugin,
    },
    rules: {
      // // TypeScript presets
      ...tsPlugin.configs.recommended.rules,
      ...tsPlugin.configs["recommended-requiring-type-checking"].rules,
      ...tsPlugin.configs.strict.rules,

      // Your custom ESLint rules
      "no-bitwise": 0,
      "no-console": "warn",

      // // TypeScript custom rules
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/unbound-method": [
        "error",
        {
          ignoreStatic: true,
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit",
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "classProperty",
          modifiers: ["public"],
          format: null,
          custom: {
            regex: "^(?!static readonly).*$",
            match: true,
          },
        },
      ],

      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "error",

      "no-restricted-syntax": [
        "error",
        ...fragmentSliceRestrictions,
        ...urlParamRestrictions,
        ...formValidationRestrictions,
      ],

      // Spec files share one module cache: a spec imported by another runs its tests inside that
      // file, and Vitest then finds no tests in it. Only the two helper files without tests of
      // their own, which the test target excludes, may be imported.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^(?!.*/(base-test\\.helpers|base-editor\\.component)\\.spec$).*\\.spec$",
              message: "Move what other files need into a .mock.ts file; a spec file is never imported.",
            },
          ],
        },
      ],
    },
  },
  // Specs set inputs through setComponentInput(), which type-checks the input name and value,
  // and leave lifecycle hooks to change detection, which runs them as the app does
  {
    files: ["src/app/**/*.spec.ts"],
    ignores: ["src/app/common/helpers/base-test.helpers.spec.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...fragmentSliceRestrictions,
        ...formValidationRestrictions,
        {
          selector: "CallExpression:matches([callee.property.name='setInput'], [callee.property.value='setInput'])",
          message:
            'Use setComponentInput(fixture, "field", value) from @common/helpers/base-test.helpers.spec: it type-checks the input name and value.',
        },
        {
          selector:
            "CallExpression:matches([callee.property.name='ngOnChanges'], [callee.property.value='ngOnChanges'])",
          message:
            "Set the input with setComponentInput() and run fixture.detectChanges(): a hand-built SimpleChanges is a change Angular never produces.",
        },
        {
          selector:
            "CallExpression:matches([callee.property.name=/^ng(OnInit|DoCheck|AfterContentInit|AfterContentChecked|AfterViewInit|AfterViewChecked)$/], [callee.property.value=/^ng(OnInit|DoCheck|AfterContentInit|AfterContentChecked|AfterViewInit|AfterViewChecked)$/])",
          message:
            "Arrange the state, then let the first fixture.detectChanges() run the hook: calling it again runs it twice, in a state the app never reaches.",
        },
        {
          selector:
            "CallExpression:matches([callee.property.name='ngOnDestroy'], [callee.property.value='ngOnDestroy'])",
          message: "Destroy the component with fixture.destroy(), which runs ngOnDestroy as the app does.",
        },
      ],
    },
  },
  // The spec helpers build route snapshots, so they set queryParams as the router does
  {
    files: ["src/app/common/helpers/base-test.helpers.spec.ts"],
    rules: {
      "no-restricted-syntax": ["error", ...fragmentSliceRestrictions],
    },
  },
  // No code asserts a type: an assertion hides missing, misspelled and stale fields, a missing null
  // check, and a wrong element or union member. Two files hold the values that cannot be typed
  // honestly: base-test.helpers for specs (the router snapshot with no public constructor) and
  // untyped-boundary.helpers for the app (values that arrive as `any`, such as parsed JSON).
  {
    files: ["src/app/**/*.ts"],
    ignores: ["src/app/common/helpers/base-test.helpers.spec.ts", "src/app/common/helpers/untyped-boundary.helpers.ts"],
    rules: {
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
    },
  },
  // Templates make no unchecked claims either: a non-null assertion or $any() switches off the
  // template type-check for that value
  {
    files: ["src/app/**/*.html"],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      "@angular-eslint/template": angularTemplatePlugin,
    },
    rules: {
      "no-restricted-syntax": ["error", ...templateFormRestrictions],
      "@angular-eslint/template/no-non-null-assertion": "error",
      "@angular-eslint/template/no-any": "error",
      "@angular-eslint/template/banana-in-box": "error",
      // A button without a type submits the form around it
      "@angular-eslint/template/button-has-type": "error",
      "@angular-eslint/template/eqeqeq": "error",
      // A static class or style next to its binding is merged by Angular, not overridden
      "@angular-eslint/template/no-duplicate-attributes": ["error", { allowStylePrecedenceDuplicates: true }],
      "@angular-eslint/template/no-negated-async": "error",
      "@angular-eslint/template/no-empty-control-flow": "error",
      "@angular-eslint/template/no-nested-tags": "error",
      "@angular-eslint/template/prefer-control-flow": "error",
      "@angular-eslint/template/prefer-at-else": "error",
      "@angular-eslint/template/prefer-at-empty": "error",
      "@angular-eslint/template/prefer-built-in-pipes": "error",
      "@angular-eslint/template/conditional-complexity": "error",
      "@angular-eslint/template/elements-content": "error",
      "@angular-eslint/template/valid-aria": "error",
      "@angular-eslint/template/role-has-required-aria": "error",
      "@angular-eslint/template/no-positive-tabindex": "error",
      "@angular-eslint/template/table-scope": "error",
      "@angular-eslint/template/no-distracting-elements": "error",
      "@angular-eslint/template/mouse-events-have-key-events": "error",
      "@angular-eslint/template/prefer-self-closing-tags": "error",
      "@angular-eslint/template/prefer-static-string-properties": "error",
    },
  },
  // A template with more than 10 branches renders several things that belong in components of their
  // own. The listed templates are over the limit until they are split; remove one once it is under.
  {
    files: ["src/app/**/*.html"],
    ignores: [
      "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/account-flows-processes-subtab.component.html",
      "src/app/data-access-panel/data-access-modal/data-access-modal.component.html",
      "src/app/dataset-view/additional-components/flows-component/flows.component.html",
      "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/base-step/base-step.component.html",
      "src/app/dataset-view/additional-components/metadata-component/tabs/common/source-event-common-data/source-event-common-data.component.html",
      "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-polling-source-tab/metadata-polling-source-tab.component.html",
      "src/app/dataset-view/additional-components/overview-component/components/collection-view/collection-view.component.html",
      "src/app/dataset-view/additional-components/overview-component/components/versioned-file-view/versioned-file-view.component.html",
      "src/app/dataset-view/additional-components/overview-component/overview.component.html",
      "src/app/header/app-header/app-header.component.html",
    ],
    rules: {
      "@angular-eslint/template/cyclomatic-complexity": ["error", { maxComplexity: 10 }],
    },
  },
  // License header plugin for specific files
  {
    files: ["src/app/**/*.ts"],
    plugins: {
      "license-header": licenseHeaderPlugin,
    },
    rules: {
      "license-header/header": ["error", "src/docs/license-header-template.js"],
    },
  },
];
