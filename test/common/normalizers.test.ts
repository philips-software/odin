import { beforeEach, describe, expect, test } from 'vitest';

import { normalizeDomain, normalizeNameOrIdentifier } from '../../src/common/normalizers.js';
import { configuration } from '../../src/singletons/configuration.js';

describe('common', () => {
  describe('normalizers', () => {

    beforeEach(() => {
      configuration.setStrict(false);
    });

    describe('normalizeDomain', () => {
      testNormalizerAsIs(normalizeDomain);
      testNormalizerString(normalizeDomain);
    });

    describe('normalizeNameOrIdentifier', () => {
      testNormalizerAsIs(normalizeNameOrIdentifier);
      testNormalizerString(normalizeNameOrIdentifier);
    });

  });
});

function testNormalizerAsIs(normalize: (value: any) => any): void {
  const matrix: [string, unknown][] = [
    ['array', []],
    ['false', false],
    ['null', null],
    ['number', 123],
    ['object', {}],
    ['true', true],
    ['undefined', undefined],
  ];

  test.each(matrix)('should return the value as is: %s', (_, fixture) => {
    expect(normalize(fixture)).toBe(fixture);
  });
}

function testNormalizerString(normalize: (value: any) => any): void {
  const fixture = 'Fixture';

  test('should return the same string in strict mode', () => {
    configuration.setStrict(true);
    expect(normalize(fixture)).toBe(fixture);
  });

  test('should return a normalized string when not in strict mode', () => {
    configuration.setStrict(false);
    expect(normalize(fixture)).toBe(fixture.toLowerCase());
  });
}
