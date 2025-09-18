// eslint.config.js — Clean & Friendly (with @ alias)

import path from "path";
import process from "node:process";
import js from "@eslint/js";
import globals from "globals";

import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import a11y from "eslint-plugin-jsx-a11y";
import promise from "eslint-plugin-promise";
import unicorn from "eslint-plugin-unicorn";

const IGNORES = ["dist", "build", "coverage", "**/*.min.js"];
const importResolverSettings = {
  "import/resolver": {
    node: { extensions: [".js", ".jsx"] },
    alias: {
      map: [["@", path.resolve(process.cwd(), "src")]],
      extensions: [".js", ".jsx"],
    },
  },
};

export default [
  // ----------------------
  // (0) Ignored files
  // ----------------------
  { ignores: IGNORES },

  // ----------------------
  // (1) Base profile — عام لكل الملفات
  // ----------------------
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: "detect" },
      ...importResolverSettings,
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-implicit-coercion": "warn",
      "object-shorthand": "warn",
      "dot-notation": "warn",
      "prefer-const": ["warn", { destructuring: "all" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // الواردات
      "import/no-unresolved": ["error", { caseSensitive: true }],
      "import/no-duplicates": "warn",
      "import/newline-after-import": ["warn", { count: 1 }],

      // React/Hooks
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/self-closing-comp": "warn",
      "react/jsx-no-useless-fragment": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off", // تم تعطيله نهائيًا

      // React Refresh للتطوير
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },

  // ----------------------
  // (2) src/** — قواعد عملية + تسمية Clean Code
  // ----------------------
  {
    files: ["src/**/*.{js,jsx}"],
    settings: { react: { version: "detect" }, ...importResolverSettings },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
      "jsx-a11y": a11y,
      promise,
      unicorn,
    },
    rules: {
      // التعقيد والحدود
      "max-depth": ["warn", 10],
      "max-lines": "off",
      "no-else-return": "warn",
      "consistent-return": "warn",
      "no-useless-return": "warn",

      // React / Hooks
      "react/no-danger": "warn",
      "react-hooks/exhaustive-deps": "off", // تم تعطيله نهائيًا
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // A11y (أساسيات فقط)
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // ترتيب وصحة الواردات
      "import/newline-after-import": ["warn", { count: 1 }],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "@/**", group: "internal" },
            { pattern: "src/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
        },
      ],

      // Promises
      "promise/catch-or-return": "warn",
      "promise/no-return-wrap": "warn",

      // Unicorn — مجموعة صغيرة مفيدة
      "unicorn/prefer-array-find": "warn",
      "unicorn/prefer-array-some": "warn",
      "unicorn/prefer-includes": "warn",
      "unicorn/no-useless-undefined": "warn",

      // Naming rules — Clean Code friendly
      "react/jsx-pascal-case": "error",
      "unicorn/filename-case": [
        "warn",
        {
          cases: { camelCase: true, pascalCase: true },
          ignore: ["^index\\.jsx?$"],
        },
      ],
      "id-match": [
        "warn",
        "^(?:[a-z][a-zA-Z0-9]*|[A-Z][a-zA-Z0-9]*|[A-Z0-9_]+|Get_[A-Za-z0-9_]+)$",
        {
          properties: false,
          onlyDeclarations: true,
          classFields: false,
          ignoreDestructuring: false,
        },
      ],
      "no-undef": "off",
      "id-denylist": ["warn", "info", "handle", "doStuff"],
      "new-cap": ["warn", { newIsCap: true, capIsNew: false }],
      camelcase: "off",
    },
  },

  // ----------------------
  // (3) ملفات الإعداد والسكريبتات Node
  // ----------------------
  {
    files: [
      "eslint.config.js",
      "vite.config.*",
      "tailwind.config.*",
      "postcss.config.*",
      "**/*.config.*",
      "scripts/**/*.{js,jsx}",
    ],
    languageOptions: { globals: globals.node, sourceType: "module" },
    plugins: { import: importPlugin },
    settings: { ...importResolverSettings },
    rules: {
      "no-console": "off",
      "import/no-unresolved": "off",
    },
  },

  // ----------------------
  // (4) اختبارات وقصص
  // ----------------------
  {
    files: ["**/*.{test,spec}.{js,jsx}", "**/*.stories.{js,jsx}"],
    rules: {
      "max-lines": "off",
      "no-magic-numbers": "off",
      "react/no-danger": "off",
    },
  },
];
