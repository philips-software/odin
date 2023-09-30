import { describe, expect, test } from 'vitest';

import { Injectable } from '../../src/decorators/injectable.js';
import { odin } from '../../src/singletons/odin.js';

describe('decorators', () => {
  describe('@Injectable', () => {
    describe('domain', () => {

      test('should use domain to define bundle hierarchy', () => {
        @Injectable({ domain: 'parent/child' })
        class InjectableWithValidDomain {}

        const root = odin.bundle();
        expect(root.hasChild('parent')).toBe(true);
        expect(root.hasChild('child')).toBe(false);
        expect(root.has(InjectableWithValidDomain.name)).toBe(false);

        const parent = odin.bundle('parent');
        expect(parent.hasChild('child')).toBe(true);
        expect(parent.has(InjectableWithValidDomain.name)).toBe(false);

        const child = odin.bundle('parent/child');
        expect(child.has(InjectableWithValidDomain.name)).toBe(true);
      });

      test('should throw error when the domain has empty spaces', () => {
        expect(() => {

          @Injectable({ domain: 'parent /child' })
          // @ts-expect-error: TS6196, unused class
          class InjectableWithInvalidDomainWithEmptySpaces {}

        }).toThrow(`[odin]: Invalid validator options. Invalid domain 'parent /child'. It cannot have empty spaces in 'parent '.`);

        expect(() => {

          @Injectable({ domain: 'parent/ child' })
          // @ts-expect-error: TS6196, unused class
          class InjectableWithInvalidDomainWithEmptySpaces {}

        }).toThrow(`[odin]: Invalid validator options. Invalid domain 'parent/ child'. It cannot have empty spaces in ' child'.`);
      });

      test('should throw error when the domain has empty chunks', () => {
        expect(() => {

          @Injectable({ domain: 'parent//child' })
          // @ts-expect-error: TS6196, unused class
          class InjectableWithInvalidDomainWithEmptyChunks {}

        }).toThrow(`[odin]: Invalid validator options. Invalid domain 'parent//child'. It cannot have empty chunks.`);
      });

    });
  });
});
