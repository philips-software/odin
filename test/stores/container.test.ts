import { describe, expect, test } from 'vitest';

import { Bundle } from '../../src/stores/bundle.js';
import { Container } from '../../src/stores/container.js';

describe('container', () => {
  const bundle = new Bundle('bundle');
  const container = new Container(bundle);

  test('should return false when checking with an unknown name or identifier', () => {
    expect(container.has('unknown')).toBe(false);
  });

  test('should return false when checking with an empty name or identifier', () => {
    // @ts-expect-error: TS2345, invalid argument type
    expect(container.has(null)).toBe(false);
    expect(container.has(undefined)).toBe(false);
  });

  test('should return undefined when getting with an unknown name or identifier', () => {
    expect(container.get('unknown')).toBeUndefined();
  });

  test('should return undefined when getting with an empty name or identifier', () => {
    // @ts-expect-error: TS2345, invalid argument type
    expect(container.get(null)).toBeUndefined();
    expect(container.get(undefined)).toBeUndefined();
  });

  test('should not throw error when discarding unknown identifier', () => {
    expect(() => {
      container.discard('unknown');
    }).not.toThrow();
  });

  const matrix: [string, unknown][] = [
    ['array', []],
    ['false', false],
    ['number', 123],
    ['object', {}],
    ['string', ''],
    ['true', true],
  ];

  test.each(matrix)('should throw error when creating a new container with an unfit bundle: %s', (_, bundle) => {
    expect(() => {
      // @ts-expect-error: TS2345, invalid argument type
      new Container(bundle);
    }).toThrow(`[odin]: The bundle must be or extend Bundle.`);
  });

  test.each(matrix)('should throw error when creating a new container with an unfit provider: %s', (_, provider) => {
    const bundle = new Bundle('domain');

    expect(() => {
      // @ts-expect-error: TS2345, invalid argument type
      new Container(bundle, provider);
    }).toThrow(`[odin]: The provider must be or extend CustomProvider.`);
  });

});
