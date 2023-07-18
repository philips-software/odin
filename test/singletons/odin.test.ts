import { beforeEach, describe, expect, test } from 'vitest';

import { Bundle } from '../../src/stores/bundle.js';
import { Container } from '../../src/stores/container.js';
import { CustomProvider } from '../../src/providers/custom-provider.js';
import { Odin } from '../../src/stores/odin.js';

describe('core', () => {
  const VALID_SIMPLE_DOMAIN = 'test';
  const VALID_COMPLEX_PARENT = 'parent';
  const VALID_COMPLEX_CHILD = 'child';
  const VALID_COMPLEX_DOMAIN = [VALID_COMPLEX_PARENT, VALID_COMPLEX_CHILD].join('/');
  const INVALID_SIMPLE_DOMAIN = ' test ';
  const INVALID_COMPLEX_PARENT = 'parent ';
  const INVALID_COMPLEX_CHILD = ' child';
  const INVALID_COMPLEX_DOMAIN = [INVALID_COMPLEX_PARENT, INVALID_COMPLEX_CHILD].join('/');

  const VALID_DOMAINS = [
    ['simple', VALID_SIMPLE_DOMAIN],
    ['complex', VALID_COMPLEX_DOMAIN],
  ];

  let odin: Odin;

  beforeEach(() => {
    odin = new Odin();
  });

  describe('bundle', () => {
    for (const [type, domain] of VALID_DOMAINS) {
      describe(`valid ${type} domain`, () => {

        test(`should create bundle for an unused domain when create is not defined`, () => {
          const bundle = odin.bundle(domain);

          expect(bundle).toBeInstanceOf(Bundle);
        });

        test(`should create bundle for an unused domain when create is true`, () => {
          const bundle = odin.bundle(domain, true);

          expect(bundle).toBeInstanceOf(Bundle);
        });

        test(`should not create bundle for an unused domain when create is false`, () => {
          const bundle = odin.bundle(domain, false);

          expect(bundle).toBeUndefined();
        });

        test(`should get bundle of a known domain`, () => {
          const createBundle = odin.bundle(domain, true);
          const getBundle = odin.bundle(domain, false);

          expect(getBundle).toBe(createBundle);
        });

      });
    }

    describe('invalid simple domain', () => {
      test('should throw when creating a bundle for an invalid domain', () => {
        expect(() => {
          odin.bundle(INVALID_SIMPLE_DOMAIN);
        }).toThrow(`[odin]: Invalid domain '${INVALID_SIMPLE_DOMAIN}'. It cannot have empty spaces in '${INVALID_SIMPLE_DOMAIN}'.`);
      });
    });

    describe('invalid complex domain', () => {
      test('should throw when creating a bundle for an invalid domain', () => {
        expect(() => {
          odin.bundle(INVALID_COMPLEX_DOMAIN);
        }).toThrow(`[odin]: Invalid domain '${INVALID_COMPLEX_DOMAIN}'. It cannot have empty spaces in '${INVALID_COMPLEX_PARENT}'.`);
      });
    });
  });

  describe('container', () => {

    test('should create container for a known domain', () => {
      const bundle = odin.bundle(VALID_SIMPLE_DOMAIN);
      const container = odin.container(VALID_SIMPLE_DOMAIN);

      expect(container).toBeInstanceOf(Container);

      // @ts-expect-error: private readonly field
      expect(container.bundle).toBe(bundle);
    });

    test('should create container with provider for a known domain', () => {
      const bundle = odin.bundle(VALID_SIMPLE_DOMAIN);
      const provider = new CustomProvider();
      const container = odin.container(VALID_SIMPLE_DOMAIN, provider);

      expect(container).toBeInstanceOf(Container);

      // @ts-expect-error: private readonly field
      expect(container.bundle).toBe(bundle);

      // @ts-expect-error: private readonly field
      expect(container.provider).toBe(provider);
    });

    test('should throw when creating a container for an unused domain', () => {
      expect(() => {
        odin.container(VALID_SIMPLE_DOMAIN);
      }).toThrow(`[odin]: No bundle found for domain '${VALID_SIMPLE_DOMAIN}'.`);
    });

    describe('invalid simple domain', () => {
      test('should throw when creating a container for an invalid domain', () => {
        expect(() => {
          odin.container(INVALID_SIMPLE_DOMAIN);
        }).toThrow(`[odin]: Invalid domain '${INVALID_SIMPLE_DOMAIN}'. It cannot have empty spaces in '${INVALID_SIMPLE_DOMAIN}'.`);
      });
    });

    describe('invalid complex domain', () => {
      test('should throw when creating a container for an invalid domain', () => {
        expect(() => {
          odin.container(INVALID_COMPLEX_DOMAIN);
        }).toThrow(`[odin]: Invalid domain '${INVALID_COMPLEX_DOMAIN}'. It cannot have empty spaces in '${INVALID_COMPLEX_PARENT}'.`);
      });
    });
  });
});
