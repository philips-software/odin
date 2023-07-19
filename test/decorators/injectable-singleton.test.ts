import { describe, expect, test } from 'vitest';

import { Secrets } from '../../src/common/secrets.js';
import { Inject } from '../../src/decorators/inject.js';
import { Injectable } from '../../src/decorators/injectable.js';
import { odin } from '../../src/singletons/odin.js';

describe('decorators', () => {
  describe('@Injectable', () => {
    describe('singleton', () => {

      test('should decorate and define secrets', () => {
        @Injectable({ singleton: true })
        class InjectableButSingleton {}

        expect(Secrets.isSingleton(InjectableButSingleton)).toBe(true);
        expect(Secrets.isDiscardable(InjectableButSingleton)).toBe(false);
      });

      test('should support circular dependencies', () => {
        const domain = 'circular-singleton';

        @Injectable({ singleton: true, domain })
        class CircularInjectableButSingletonA {
          @Inject({ name: 'CircularInjectableButSingletonB' })
          // @ts-expect-error: TS7008, implicit any
          circular;
        }

        @Injectable({ singleton: true, domain })
        class CircularInjectableButSingletonB {
          @Inject({ name: 'CircularInjectableButSingletonA' })
          // @ts-expect-error: TS7008, implicit any
          circular;
        }

        const container = odin.container(domain);

        const providedA = container.provide<CircularInjectableButSingletonA>(CircularInjectableButSingletonA.name, true);
        const providedB = container.provide<CircularInjectableButSingletonB>(CircularInjectableButSingletonB.name, true);

        expect(providedA.circular).toBeInstanceOf(CircularInjectableButSingletonB);
        expect(providedB.circular).toBeInstanceOf(CircularInjectableButSingletonA);
      });

    });
  });
});
