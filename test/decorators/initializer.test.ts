import { describe, expect, test, vi } from 'vitest';

import { Secrets } from '../../src/common/secrets.js';
import { Initializer } from '../../src/decorators/initializer.js';
import { Injectable } from '../../src/decorators/injectable.js';
import { odin } from '../../src/singletons/odin.js';

describe('decorators', () => {
  describe('@Initializer', () => {
    const container = odin.container();

    test('should store method in the injectable', () => {
      @Injectable
      class InitializerUsedOnce {
        @Initializer
        oneMethod(): void {
          return;
        }
      }

      // the initializer decorator is only applied when instantiating
      container.provide(InitializerUsedOnce.name, true);

      expect(Secrets.getInitializer(InitializerUsedOnce)).toBe('oneMethod');
    });

    test('should be called when instantiating the injectable', () => {
      const initializerSpy = vi.fn(() => 0);

      @Injectable
      class InitializerCalled {
        @Initializer
        oneMethod(): void {
          initializerSpy();
        }
      }

      // the initializer decorator is only applied when instantiating
      container.provide(InitializerCalled.name, true);

      expect(initializerSpy).toHaveBeenCalledOnce();
    });

    test('should throw error when called with too many arguments', () => {
      expect(() => {

        @Injectable
        // @ts-expect-error: unused class
        class InitializerCalledWithTooManyArguments {
          // @ts-expect-error: too many arguments
          @Initializer(1)
          oneMethod(): void {}
        }

      }).toThrow(`[odin]: The @Initializer decorator cannot be called with any arguments.`);
    });

    test('should throw error when used more than once', () => {
      expect(() => {

        @Injectable
        class InitializerUsedTwice {
          @Initializer
          oneMethod(): void {
            return;
          }

          @Initializer
          anotherMethod(): void {
            return;
          }
        }

        // the initializer decorator is only applied when instantiating
        container.provide(InitializerUsedTwice.name, true);

      }).toThrow(`[odin]: The injectable 'InitializerUsedTwice' cannot define more than one @Initializer.`);
    });

    test('should throw error when decorating a class', () => {
      expect(() => {

        // @ts-expect-error: cannot decorate a class
        @Initializer
        // @ts-expect-error: unused class
        class InitializerDecoratingClass {}

      }).toThrow(`[odin]: The @Initializer decorator can only decorate a class method. Check the class named 'InitializerDecoratingClass'.`);
    });

    test('should throw error when decorating a class field', () => {
      expect(() => {

        // @ts-expect-error: unused class
        class InitializerDecoratingClassField {
          // @ts-expect-error: cannot decorate a class field
          @Initializer()
          field: any;
        }

      }).toThrow(`[odin]: The @Initializer decorator can only decorate a class method. Check the field named 'field'.`);
    });

  });
});
