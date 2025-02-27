const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const esimport = require('eslint-plugin-import');
const prettier = require('eslint-plugin-prettier');
const stylistic = import('@stylistic/eslint-plugin');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      import: esimport,
      prettier: prettier,
      stylistic: stylistic,
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      "@angular-eslint/component-class-suffix": "error",
      "@angular-eslint/directive-class-suffix": "error",
      "@angular-eslint/no-input-rename": "error",
      "@angular-eslint/no-inputs-metadata-property": "error",
      "@angular-eslint/no-output-rename": "error",
      "@angular-eslint/no-outputs-metadata-property": "error",
      "@angular-eslint/use-lifecycle-interface": "error",
      "@angular-eslint/use-pipe-transform-interface": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-expressions": ["error", { allowTernary: true }],
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/unified-signatures": "error",
      "@typescript-eslint/no-shadow": ["error", { hoist: "all" }],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/newline-after-import": ["error", { count: 1 }],
      "import/no-unresolved": "off",
      "import/named": "off",
      "import/namespace": "warn",
      "import/no-name-as-default": "off",
      "import/export": "warn",
      "no-multiple-empty-lines": "error",
      "curly": "error",
      "eqeqeq": ["error", "smart"],
      "guard-for-in": "error",
      "max-len": ["error", { code: 256 }],
      "no-bitwise": "error",
      "no-caller": "error",
      "no-console": "error",
      "no-debugger": "error",
      "no-eval": "error",
      "no-fallthrough": "error",
      "no-new-wrappers": "error",
      "no-redeclare": "error",
      "no-restricted-imports": "error",
      "no-throw-literal": "error",
      "no-undef-init": "error",
      "no-unused-labels": "error",
      "no-var": "error",
      "prefer-const": "error",
      "radix": "error",
      "@typescript-eslint/no-require-imports": "off",
      "spaced-comment": ["error", "never", { line: { markers: ["/"] } }],
      "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    plugins: {
      import: esimport,
      prettier: prettier,
      stylistic: stylistic,
    },
    rules: {
      "max-len": ["error", { code: 140 }],
      "spaced-comment": ["off", "always", { line: { markers: ["/"] } }],
      "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/click-events-have-key-events": "off"
    },
  },
);
