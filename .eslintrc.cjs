/* eslint-env node */

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: true,
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  root: true,
  rules: commonRules(),
  overrides: [ // the order is important
    overrideForTypescriptFiles(),
    overrideForTypescriptTestFiles(),
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts',
      ],
    },
  },
};

function commonRules() {
  return {
    'array-bracket-spacing': ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',
    'computed-property-spacing': ['error', 'never'],
    'eol-last': ['error', 'always'],
    'import/extensions': ['error', {
      js: 'ignorePackages',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    'import/first': 'error',
    'import/namespace': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-deprecated': 'error',
    'import/no-duplicates': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    'linebreak-style': ['error', 'unix'],
    'no-multiple-empty-lines': ['error', {
      max: 1,
      maxBOF: 0,
      maxEOF: 1,
    }],
    'no-tabs': 'error',
    'nonblock-statement-body-position': ['error', 'beside'],
    'object-curly-spacing': ['error', 'always'],
    'prefer-object-spread': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'quotes': ['error', 'single', {
      allowTemplateLiterals: true,
    }],
    'rest-spread-spacing': ['error', 'never'],
    'sort-imports': ['error', {
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
    }],
  };
}

function overrideForTypescriptFiles() {
  return {
    files: [
      '*.ts',
    ],
    rules: {
      '@typescript-eslint/ban-ts-comment': ['warn', {
        minimumDescriptionLength: 10,
        'ts-check': true,
        'ts-expect-error': {
          descriptionFormat: '^: TS\\d+, .+$',
        },
        'ts-ignore': true,
        'ts-nocheck': true,
      }],
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-semi': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/semi': ['error', 'always', {
        omitLastInOneLineBlock: false,
      }],
    },
  };
}

function overrideForTypescriptTestFiles() {
  return {
    files: [
      'test/**/*.ts',
    ],
    env: {
      'jest/globals': false,
    },
    extends: [
      'plugin:jest-formatting/recommended',
      'plugin:jest/all',
    ],
    plugins: [
      'jest',
      'jest-formatting',
    ],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'jest-formatting/padding-around-expect-groups': 'off',
      'jest/no-deprecated-functions': 'off',
      'jest/require-hook': 'off',
      'jest/unbound-method': 'off',
    },
  }
}
