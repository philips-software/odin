/**
 * @typedef {import('ts-jest/dist/types').InitialOptionsTsJest} TSJestOptions
 */

const path = require('path');


/** @type {TSJestOptions} */
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
