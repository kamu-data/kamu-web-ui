// eslint.config.js
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jasminePlugin from "eslint-plugin-jasmine";
import licenseHeaderPlugin from "eslint-plugin-license-header";
import globals from "globals";

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
  // Main configuration for TypeScript files with Jasmine
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
        ...globals.jasmine, // Add Jasmine globals
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      jasmine: jasminePlugin, // Register Jasmine plugin here
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

      // Jasmine custom overrides
      "jasmine/new-line-before-expect": 0,
      "jasmine/no-unsafe-spy": "off",
      "jasmine/no-focused-tests": "error",
      "jasmine/no-disabled-tests": "error",
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
        {
          selector: "CallExpression[callee.property.name='setInput']",
          message:
            'Use setComponentInput(fixture, "field", value) from @common/helpers/base-test.helpers.spec: it type-checks the input name and value.',
        },
        {
          selector: "CallExpression[callee.property.name='ngOnChanges']",
          message:
            "Set the input with setComponentInput() and run fixture.detectChanges(): a hand-built SimpleChanges is a change Angular never produces.",
        },
        {
          selector:
            "CallExpression[callee.property.name=/^ng(OnInit|DoCheck|AfterContentInit|AfterContentChecked|AfterViewInit|AfterViewChecked)$/]",
          message:
            "Arrange the state, then let the first fixture.detectChanges() run the hook: calling it again runs it twice, in a state the app never reaches.",
        },
        {
          selector: "CallExpression[callee.property.name='ngOnDestroy']",
          message: "Destroy the component with fixture.destroy(), which runs ngOnDestroy as the app does.",
        },
      ],
    },
  },
  // Test data is declared with its type, never asserted into shape: an assertion hides missing,
  // misspelled and stale fields. base-test.helpers fakes the one router object with no constructor.
  {
    files: ["src/app/**/*.spec.ts", "src/app/**/*mock*.ts", "src/app/**/mock.data.ts"],
    ignores: ["src/app/common/helpers/base-test.helpers.spec.ts"],
    rules: {
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "as", objectLiteralTypeAssertions: "never" },
      ],
    },
  },
  // License header plugin for specific files
  {
    files: ["src/app/**/*.ts"],
    plugins: {
      "license-header": licenseHeaderPlugin,
      jasmine: jasminePlugin, // Also register Jasmine here if these files use Jasmine
    },
    rules: {
      "license-header/header": ["error", "src/docs/license-header-template.js"],
    },
  },
];
