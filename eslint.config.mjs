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
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowTernary: true, // allow a ? b() : c()
          allowShortCircuit: true, // allow a && b()
        },
      ],
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
