import { afterEach, describe, expect, test } from 'vitest';

import { Configuration } from '../../src/decorators/configuration.js';
import { configuration } from '../../src/singletons/configuration.js';

describe('decorators', () => {
  describe('@Configuration', () => {

    afterEach(() => {
      configuration.setStrict(false);
      configuration.setInitialized(false);
    });

    test('should put odin in strict mode', () => {
      expect(() => {

        @Configuration({ strict: true })
        // @ts-expect-error: TS6196, unused class
        class ConfigurationWithStrictTrue {}

      }).not.toThrow();

      expect(configuration.isStrict()).toBe(true);
      expect(configuration.isInitialized()).toBe(true);
    });

    test('should throw error when used without any arguments', () => {
      expect(() => {

        // @ts-expect-error: TS2554, too few or too many arguments
        @Configuration
        // @ts-expect-error: TS6196, unused class
        class ConfigurationUsedWithoutAnyArguments {}

      }).toThrow(`[odin]: Invalid decorator options. The option 'strict' is required.`);
    });

    test('should throw error when called without any arguments', () => {
      expect(() => {

        // @ts-expect-error: TS2554, too few or too many arguments
        @Configuration()
        // @ts-expect-error: TS6196, unused class
        class ConfigurationCalledWithoutAnyArguments {}

      }).toThrow(`[odin]: The @Configuration decorator cannot be called without any arguments. Add an argument or remove the ().`);
    });

    test('should throw error when called with too many arguments', () => {
      expect(() => {

        // @ts-expect-error: TS2554, too few or too many arguments
        @Configuration(1, 2, 3)
        // @ts-expect-error: TS6196, unused class
        class ConfigurationCalledWithTooManyArguments {}

      }).toThrow(`[odin]: The @Configuration decorator cannot be called with more than one argument.`);
    });

    test('should throw error when used more than once', () => {
      expect(() => {

        @Configuration({ strict: true })
        // @ts-expect-error: TS6196, unused class
        class ConfigurationWithStrictTrue {}

      }).not.toThrow();

      expect(configuration.isInitialized()).toBe(true);

      expect(() => {
        @Configuration({ strict: false })
        // @ts-expect-error: TS6196, unused class
        class ConfigurationWithStrictFalse {}

      }).toThrow(`[odin]: The @Configuration decorator can only be used once.`);

      expect(configuration.isInitialized()).toBe(true);
    });

    test('should throw error when decorating a class field', () => {
      expect(() => {

        // @ts-expect-error: TS6196, unused class
        class ConfigurationDecoratingClassField {
          // @ts-expect-error: TS1240, cannot decorate a class field
          @Configuration({})
          field: any;
        }

      }).toThrow(`[odin]: The @Configuration decorator can only decorate a class. Check the field named 'field'.`);
    });

    test('should throw error when decorating a class method', () => {
      expect(() => {

        // @ts-expect-error: TS6196, unused class
        class ConfigurationDecoratingClassMethod {
          // @ts-expect-error: TS1240, cannot decorate a class field
          @Configuration
          method(): void {}
        }

      }).toThrow(`[odin]: The @Configuration decorator can only decorate a class. Check the method named 'method'.`);
    });
  });
});
