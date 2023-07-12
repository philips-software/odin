import { describe, expect, test } from 'vitest';

import odin from '../../src/odin.js';
import Inject from '../../src/container/decorators/inject.js';
import Injectable from '../../src/container/decorators/injectable.js';
import Secrets from '../../src/container/secrets.js';

describe('decorators', function() {
  describe('@Injectable', () => {

    test('should be registered', () => {
      expect(() => {
        @Injectable
        class InjectableToRegister { }
      }).not.toThrow();
    });

    test('should not mark class as singleton, discardable or custom', () => {
      @Injectable
      class InjectableDefaults { }

      expect(Secrets.isSingleton(InjectableDefaults)).toBe(false);
      expect(Secrets.isDiscardable(InjectableDefaults)).toBe(false);
      expect(Secrets.isCustom(InjectableDefaults)).toBe(false);
    });

    test('should use domain to define the target bundle', () => {
      @Injectable({ domain: 'parent/child' })
      class InjectableWithValidDomain { }

      const direct = odin.bundle('parent/child');
      expect(direct.has(InjectableWithValidDomain.name)).toBe(true);

      const parent = odin.bundle('parent');
      expect(parent.has(InjectableWithValidDomain.name)).toBe(false);

      const child = parent.child('child');
      expect(child.has(InjectableWithValidDomain.name)).toBe(true);
    });

    test('should allow circular dependencies', () => {
      @Injectable({ domain: 'circular' })
      class CircularInjectable1 {
        @Inject({ name: 'CircularInjectable2', eager: true })
        circular;
      }

      @Injectable({ domain: 'circular' })
      class CircularInjectable2 {
        @Inject({ name: 'CircularInjectable1' })
        circular;
      }

      const container = odin.container('circular');

      const provided1 = container.provide('CircularInjectable1', true);
      const provided2 = container.provide('CircularInjectable2', true);

      expect(provided1.circular instanceof CircularInjectable2).toBe(true);
      expect(provided2.circular instanceof CircularInjectable1).toBe(true);
    });

    describe('errors', () => {

      test('should throw error when called without parameters', () => {
        expect(() => {
          @Injectable()
          class InjectableCalledWithoutParameters { }
        }).toThrow(`[ODIN] Injectable: If there are no params, remove the ().`);
      });

      test('should throw error when called with unknown parameters', () => {
        expect(() => {
          @Injectable({ potato: 'test' })
          class InjectableCalledWithUnknownParameters { }
        }).toThrow(`[ODIN] InjectableCalledWithUnknownParameters[Injectable]: unknow property 'potato'.`);
      });

      test('should throw error when the domain has empty spaces', () => {
        expect(() => {
          @Injectable({ domain: 'parent / child' })
          class InjectableWithInvalidDomainWithEmptySpaces { }
        }).toThrow(`[ODIN] Invalid domain 'parent / child', should not has empty spaces in 'parent '.`);
      });

      test('should throw error when the domain has empty chunks', () => {
        expect(() => {
          @Injectable({ domain: 'parent//child' })
          class InjectableWithInvalidDomainWithEmptyChunks { }
        }).toThrow(`[ODIN] Invalid domain 'parent//child', remove empty chunks.`);
      });
    });
  });
});
