/* eslint-env node */

const path = require('path');

/** @type {{import('ts-jest/dist/types').InitialOptionsTsJest}} */
module.exports = {
  automock: false,
  collectCoverage: false,
  coverageDirectory: path.resolve(__dirname, 'test/coverage/'),
  globals: {
    'ts-jest': {
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    },
  },
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
};
