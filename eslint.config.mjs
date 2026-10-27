// eslint.config.js
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vitestPlugin from "@vitest/eslint-plugin";
import licenseHeaderPlugin from "eslint-plugin-license-header";

import { typeAssertionBacklog } from "./eslint.type-assertion-backlog.mjs";

// Code that needs part of a query result types it with a named sub-fragment, not a type cut out of a
// bigger generated one
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

      "no-restricted-syntax": ["error", ...fragmentSliceRestrictions],

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
  // No code asserts a type: an assertion hides missing, misspelled and stale fields, a missing null
  // check, and a wrong element or union member. Two files hold the values that cannot be typed
  // honestly: base-test.helpers for specs (the router snapshot with no public constructor) and
  // untyped-boundary.helpers for the app (values that arrive as `any`, such as parsed JSON).
  {
    files: ["src/app/**/*.ts"],
    ignores: [
      "src/app/common/helpers/base-test.helpers.spec.ts",
      "src/app/common/helpers/untyped-boundary.helpers.ts",
      ...typeAssertionBacklog,
    ],
    rules: {
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
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
