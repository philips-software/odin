import { describe, expect, test } from 'vitest';

import { Secrets } from '../../src/common/secrets.js';
import { Inject } from '../../src/decorators/inject.js';
import { Injectable } from '../../src/decorators/injectable.js';
import { odin } from '../../src/singletons/odin.js';

describe('decorators', () => {
  describe('@Injectable', () => {

    test('should decorate and define secrets', () => {
      @Injectable
      class InjectableDefaults {}

      expect(Secrets.isSingleton(InjectableDefaults)).toBe(false);
      expect(Secrets.isDiscardable(InjectableDefaults)).toBe(false);
    });

    test('should support circular dependencies', () => {
      const domain = 'circular';

      @Injectable({ domain })
      class CircularInjectableA {
        @Inject({ name: 'CircularInjectableB', eager: true })
        // @ts-expect-error: not initialized
        circular: CircularInjectableB;
      }

      @Injectable({ domain })
      class CircularInjectableB {
        @Inject({ name: 'CircularInjectableA' })
        // @ts-expect-error: not initialized
        circular: CircularInjectableA;
      }

      const container = odin.container(domain);

      const providedA = container.provide<CircularInjectableA>(CircularInjectableA.name, true);
      const providedB = container.provide<CircularInjectableB>(CircularInjectableB.name, true);

      expect(providedA.circular).toBeInstanceOf(CircularInjectableB);
      expect(providedB.circular).toBeInstanceOf(CircularInjectableA);
    });

    test('should throw error when called without any arguments', () => {
      expect(() => {

        // @ts-expect-error: called without any arguments
        @Injectable()
        // @ts-expect-error: unused class
        class InjectableCalledWithoutAnyArguments {}

      }).toThrow(`[odin]: The @Injectable decorator cannot be called without any arguments. Add an argument or remove the ().`);
    });

    test('should throw error when called with too many arguments', () => {
      expect(() => {

        // @ts-expect-error: with too many arguments
        @Injectable(1, 2)
        // @ts-expect-error: unused class
        class InjectableCalledWithTooManyArguments {}

      }).toThrow(`[odin]: The @Injectable decorator cannot be called with more than one argument.`);
    });

    test('should throw error when called with unknown options', () => {
      expect(() => {

        // @ts-expect-error: unknown option
        @Injectable({ something: 123 })
        // @ts-expect-error: unused class
        class InjectableCalledWithUnknownParameters {}

      }).toThrow(`[odin]: Invalid decorator options. The unknown options are not allowed: something.`);
    });

    test('should throw error when decorating a class field', () => {
      expect(() => {

        // @ts-expect-error: unused class
        class InjectableDecoratingClassField {
          // @ts-expect-error: cannot decorate a class field
          @Injectable({})
          field: any;
        }

      }).toThrow(`[odin]: The @Injectable decorator can only decorate a class. Check the field named 'field'.`);
    });

    test('should throw error when decorating a class method', () => {
      expect(() => {

        // @ts-expect-error: unused class
        class InjectableDecoratingClassMethod {
          // @ts-expect-error: cannot decorate a class method
          @Injectable
          method(): void {}
        }

      }).toThrow(`[odin]: The @Injectable decorator can only decorate a class. Check the method named 'method'.`);
    });

  });
});
