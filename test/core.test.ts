import { beforeEach, describe, expect, test } from 'vitest';

import Bundle from '../src/registry/bundle.js';
import Container from '../src/container/container.js';
import CustomProvider from '../src/container/custom-provider.js';
import OdinCore from '../src/odin-core.js';

describe('core', function() {
  const VALID_SIMPLE_DOMAIN = 'test';
  const VALID_COMPLEX_PARENT = 'parent';
  const VALID_COMPLEX_CHILD = 'child';
  const VALID_COMPLEX_DOMAIN = [VALID_COMPLEX_PARENT, VALID_COMPLEX_CHILD].join('/');
  const INVALID_SIMPLE_DOMAIN = ' test ';
  const INVALID_COMPLEX_PARENT = 'parent ';
  const INVALID_COMPLEX_CHILD = ' child';
  const INVALID_COMPLEX_DOMAIN = [INVALID_COMPLEX_PARENT, INVALID_COMPLEX_CHILD].join('/');

  const VALID_DOMAINS = [
    ['simple', INVALID_SIMPLE_DOMAIN],
    ['complex', INVALID_COMPLEX_DOMAIN],
  ];

  let odin = null;

  beforeEach(() => {
    odin = new OdinCore();
  });

  describe('bundle', function() {

    for (const [type, domain] of VALID_DOMAINS) {
      describe(`valid ${type} domain`, () => {

        test(`should create bundle for an unused domain when create is not defined`, () => {
          const bundle = odin.bundle(VALID_SIMPLE_DOMAIN);
          expect(bundle).toBeInstanceOf(Bundle);
        });

        test(`should create bundle for an unused domain when create is true`, () => {
          const bundle = odin.bundle(VALID_SIMPLE_DOMAIN, true);
          expect(bundle).toBeInstanceOf(Bundle);
        });

        test(`should not create bundle for an unused domain when create is false`, () => {
          const bundle = odin.bundle(VALID_SIMPLE_DOMAIN, false);
          expect(bundle).toBeUndefined();
        });

        test(`should get bundle of a known domain`, () => {
          const createBundle = odin.bundle(VALID_SIMPLE_DOMAIN, true);
          const getBundle = odin.bundle(VALID_SIMPLE_DOMAIN, false);

          expect(getBundle).toBe(createBundle);
        });

      });
    }

    describe('invalid simple domain', () => {

      test('should throw when creating a bundle for an invalid domain', () => {
        expect(() => {
          odin.bundle(INVALID_SIMPLE_DOMAIN);
        }).toThrow(`[ODIN] Invalid domain '${INVALID_SIMPLE_DOMAIN}'.`);
      });

    });

    describe('invalid complex domain', () => {

      test('should throw when creating a bundle for an invalid domain', () => {
        expect(() => {
          odin.bundle(INVALID_COMPLEX_DOMAIN);
        }).toThrow(`[ODIN] Invalid sub domain '${INVALID_COMPLEX_PARENT}' on domain '${INVALID_COMPLEX_DOMAIN}'.`);
      });

    });
  });

  describe('container', function() {

    test('should create container for a known domain', () => {
      const bundle = odin.bundle(VALID_SIMPLE_DOMAIN);
      const container = odin.container(VALID_SIMPLE_DOMAIN);

      expect(container).toBeInstanceOf(Container);
      expect(container.bundle).toBe(bundle);
    });

    test('should create container with provider for a known domain', () => {
      const bundle = odin.bundle(VALID_SIMPLE_DOMAIN);
      const provider = new CustomProvider();
      const container = odin.container(VALID_SIMPLE_DOMAIN, provider);

      expect(container).toBeInstanceOf(Container);
      expect(container.bundle).toBe(bundle);
      expect(container.resolver).toBe(provider);
    });

    test('should throw when creating a container for an unused domain', () => {
      expect(() => {
        odin.container(VALID_SIMPLE_DOMAIN);
      }).toThrow(`[ODIN] There is no bundle to domain '${VALID_SIMPLE_DOMAIN}'.`);
    });

    describe('invalid simple domain', () => {

      test('should throw when creating a container for an invalid domain', () => {
        expect(() => {
          odin.container(INVALID_SIMPLE_DOMAIN);
        }).toThrow(`[ODIN] Invalid domain '${INVALID_SIMPLE_DOMAIN}'.`);
      });

    });

    describe('invalid complex domain', () => {

      test('should throw when creating a container for an invalid domain', () => {
        expect(() => {
          odin.container(INVALID_COMPLEX_DOMAIN);
        }).toThrow(`[ODIN] Invalid sub domain '${INVALID_COMPLEX_PARENT}' on domain '${INVALID_COMPLEX_DOMAIN}'.`);
      });

    });
  });
});
