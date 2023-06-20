/* eslint-env node */

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: true,
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  root: true,
  rules: commonRules(),
  overrides: [
    overrideForTestFiles(),
    overrideForTypescriptFiles(),
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.js',
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
      js: 'never',
      json: 'always',
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
    'no-use-before-define': 'off',
    'nonblock-statement-body-position': ['error', 'beside'],
    'object-curly-spacing': ['error', 'always'],
    'prefer-object-spread': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'quotes': ['error', 'single', {
      allowTemplateLiterals: true,
    }],
    'rest-spread-spacing': ['error', 'never'],
    'semi': 'off',
    'sort-imports': ['error', {
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
    }],
  };
}

function overrideForTestFiles() {
  return {
    files: [
      '*spec.js',
      '*spec.ts',
      '*test.js',
      '*test.ts',
    ],
    env: {
      'jest/globals': true,
    },
    extends: [
      'plugin:jest/all',
      'plugin:jest-formatting/strict',
    ],
    plugins: [
      'jest',
      'jest-formatting',
    ],
    rules: {
      'jest/expect-expect': ['error', {
        assertFunctionNames: ['assert*', 'expect*'],
      }],
      'jest-formatting/padding-around-all': 'off',
      'jest-formatting/padding-around-expect-groups': 'off',
      'jest/max-expects': 'off',
      'jest/no-hooks': 'off',
      'jest/prefer-expect-assertions': 'off',
      'jest/require-hook': 'off',
      'jest/unbound-method': 'off',
    },
  }
}

function overrideForTypescriptFiles() {
  return {
    files: [
      '*.ts',
    ],
    excludedFiles: [
      '*.js',
    ],
    extends: [
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:import/typescript',
    ],
    rules: {
      '@typescript-eslint/ban-ts-comment': ['off', {
        minimumDescriptionLength: 20,
        'ts-check': 'allow-with-description',
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
      }],
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowConciseArrowFunctionExpressionsStartingWithVoid: false,
        allowDirectConstAssertionInArrowFunctions: true,
        allowExpressions: true,
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
      }],
      '@typescript-eslint/explicit-member-accessibility': 'off',

      // switching this off because it doesn't really understand type guards
      // and it's less strict than @typescript-eslint/explicit-function-return-type anyway
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      '@typescript-eslint/indent': ['error', 2],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-extra-semi': 'error',
      '@typescript-eslint/no-floating-promises': ['error', {
        ignoreIIFE: true,
        ignoreVoid: true,
      }],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-object-literal-type-assertion': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-regexp-exec': 'off',
      '@typescript-eslint/semi': ['error', 'always', {
        omitLastInOneLineBlock: false,
      }],
      '@typescript-eslint/unbound-method': 'off',
    },
  };
}
