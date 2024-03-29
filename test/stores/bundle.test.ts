import { describe, expect, test } from 'vitest';

import { Bundle } from '../../src/stores/bundle.js';

describe('bundle', () => {

  test('should set domain', () => {
    const domain = 'domain';

    const bundle = new Bundle(domain);
    expect(bundle).toBeInstanceOf(Bundle);

    // @ts-expect-error: TS2341, private readonly field
    expect(bundle.domain).toBe(domain);
  });

  test('should throw error when creating a new bundle without a domain', () => {
    expect(() => {
      // @ts-expect-error: TS2345, invalid argument type
      new Bundle();
    }).toThrow(`[odin]: Invalid domain. It should be a contentful string.`);
  });

  test('should throw error when creating a new bundle with a domain with hierarchy', () => {
    const domain = 'parent/child';

    expect(() => {
      new Bundle(domain);
    }).toThrow(`[odin]: Invalid domain '${domain}'. It cannot have multiple chunks here.`);
  });

  const matrix: [string, unknown][] = [
    ['array', []],
    ['false', false],
    ['number', 123],
    ['object', {}],
    ['string', ''],
    ['true', true],
  ];

  test.each(matrix)('should throw error when creating a new bundle with an unfit parent: %s', (_, parent) => {
    expect(() => {
      // @ts-expect-error: TS2345, invalid argument type
      new Bundle('domain', parent);
    }).toThrow(`The parent must be or extend Bundle.`);
  });

  test('should throw error when creating a child bundle without a domain', () => {
    const bundle = new Bundle('id');

    expect(() => {
      // @ts-expect-error: TS2554, too few or too many arguments
      bundle.child();
    }).toThrow(`[odin]: Invalid domain. It should be a contentful string.`);
  });

});
