import { describe, expect, test } from 'vitest';

import odin from '../../src/odin.js';
import Inject from '../../src/container/decorators/inject.js';
import Secrets from '../../src/container/secrets.js';
import Singleton from '../../src/container/decorators/singleton.js';

describe('decorators', function() {
  describe('@Singleton', () => {

    test('should be registered', () => {
      expect(() => {
        @Singleton
        class SingletonToRegister { }
      }).not.toThrow();
    });

    test('should mark class as singleton, but not discardable or custom', () => {
      @Singleton
      class SingletonDefaults { }

      expect(Secrets.isSingleton(SingletonDefaults)).toBe(true);
      expect(Secrets.isDiscardable(SingletonDefaults)).toBe(false);
      expect(Secrets.isCustom(SingletonDefaults)).toBe(false);
    });

    test('should use domain to define the target bundle', () => {
      @Singleton({ domain: 'parent/child' })
      class SingletonWithValidDomain { }

      const direct = odin.bundle('parent/child');
      expect(direct.has(SingletonWithValidDomain.name)).toBe(true);

      const parent = odin.bundle('parent');
      expect(parent.has(SingletonWithValidDomain.name)).toBe(false);

      const child = parent.child('child');
      expect(child.has(SingletonWithValidDomain.name)).toBe(true);
    });

    test('should allow circular dependencies', () => {
      @Singleton({ domain: 'circular' })
      class CircularSingleton1 {
        @Inject({ name: 'CircularSingleton2', eager: true })
        circular;
      }

      @Singleton({ domain: 'circular' })
      class CircularSingleton2 {
        @Inject({ name: 'CircularSingleton1' })
        circular;
      }

      const container = odin.container('circular');

      const provided1 = container.provide('CircularSingleton1', true);
      const provided2 = container.provide('CircularSingleton2', true);

      expect(provided1.circular instanceof CircularSingleton2).toBe(true);
      expect(provided2.circular instanceof CircularSingleton1).toBe(true);
    });

    describe('errors', () => {

      test('should throw error when called without parameters', () => {
        expect(() => {
          @Singleton()
          class SingletonCalledWithoutParameters { }
        }).toThrow(`[ODIN] Singleton: If there are no params, remove the ().`);
      });

      test('should throw error when called with unknown parameters', () => {
        expect(() => {
          @Singleton({ potato: 'test' })
          class SingletonCalledWithUnknownParameters { }
        }).toThrow(`[ODIN] SingletonCalledWithUnknownParameters[Singleton]: unknow property 'potato'.`);
      });

      test('should throw error when the domain has empty spaces', () => {
        expect(() => {
          @Singleton({ domain: 'parent /child' })
          class SingletonWithInvalidDomainWithSpaces { }
        }).toThrow(`[ODIN] Invalid domain 'parent /child', should not has empty spaces in 'parent '.`);
      });

      test('should throw error when the domain has empty chunks', () => {
        expect(() => {
          @Singleton({ domain: 'parent//child' })
          class SingletonWithInvalidDomainWithEmptyChunks { }
        }).toThrow(`[ODIN] Invalid domain 'parent//child', remove empty chunks.`);
      });
    });
  });
});
