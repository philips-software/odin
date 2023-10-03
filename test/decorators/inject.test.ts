import { describe, expect, test } from 'vitest';

import { Inject } from '../../src/decorators/inject.js';
import { Injectable } from '../../src/decorators/injectable.js';
import { odin } from '../../src/index.js';

describe('decorators', () => {
  describe('@Inject', () => {
    const container = odin.container();

    test('should inject respecting the name casing based on a string', () => {
      @Injectable
      class CaseBasedOnStringFixture {}

      @Injectable
      class MultipleCaseBasedOnStringFixture {
        @Inject(CaseBasedOnStringFixture.name)
        // @ts-expect-error: TS7008, implicit any
        rightCaseBasedOnStringFixture;

        @Inject(CaseBasedOnStringFixture.name.toLowerCase())
        // @ts-expect-error: TS7008, implicit any
        lowerCaseBasedOnStringFixture;

        @Inject(CaseBasedOnStringFixture.name.toUpperCase())
        // @ts-expect-error: TS7008, implicit any
        upperCaseBasedOnStringFixture;
      }

      const provided = container.provide<MultipleCaseBasedOnStringFixture>(MultipleCaseBasedOnStringFixture.name, true);

      expect(provided.rightCaseBasedOnStringFixture).toBeInstanceOf(CaseBasedOnStringFixture);
      expect(provided.lowerCaseBasedOnStringFixture).toBeUndefined();
      expect(provided.upperCaseBasedOnStringFixture).toBeUndefined();
    });

    test('should inject respecting the name casing based on an object with a name', () => {
      @Injectable
      class CaseBasedOnObjectFixture {}

      @Injectable
      class MultipleCaseBasedOnObjectFixture {
        @Inject({ name: CaseBasedOnObjectFixture.name })
        // @ts-expect-error: TS7008, implicit any
        rightCaseBasedOnObjectFixture;

        @Inject({ name: CaseBasedOnObjectFixture.name.toLowerCase() })
        // @ts-expect-error: TS7008, implicit any
        lowerCaseBasedOnObjectFixture;

        @Inject({ name: CaseBasedOnObjectFixture.name.toUpperCase() })
        // @ts-expect-error: TS7008, implicit any
        upperCaseBasedOnObjectFixture;
      }

      const provided = container.provide<MultipleCaseBasedOnObjectFixture>(MultipleCaseBasedOnObjectFixture.name, true);

      expect(provided.rightCaseBasedOnObjectFixture).toBeInstanceOf(CaseBasedOnObjectFixture);
      expect(provided.lowerCaseBasedOnObjectFixture).toBeUndefined();
      expect(provided.upperCaseBasedOnObjectFixture).toBeUndefined();
    });

    test('should not throw error when injecting based on the property name', () => {
      expect(() => {

        @Injectable
        // @ts-expect-error: TS6196, unused class
        class StrictWithoutStringNameFixture {
          @Inject
          // @ts-expect-error: TS7008, implicit any
          fixture;
        }

      }).not.toThrow();
    });

    test('should not throw error when injecting based on an object without a name', () => {
      expect(() => {

        @Injectable
        // @ts-expect-error: TS6196, unused class
        class StrictWithoutObjectNameFixture {
          @Inject({ eager: false })
          // @ts-expect-error: TS7008, implicit any
          fixture;
        }

      }).not.toThrow();
    });

    test('should throw error when called without any arguments', () => {
      expect(() => {

        @Injectable
        // @ts-expect-error: TS6196, unused class
        class Fixture {
          // @ts-expect-error: TS2554, too few or too many arguments
          @Inject()
          // @ts-expect-error: TS7008, implicit any
          fixture;
        }

      }).toThrow('[odin]: The @Inject decorator cannot be called without any arguments. Add an argument or remove the ().');
    });

    test('should throw error when passing more than one argument', () => {
      expect(() => {

        @Injectable
        // @ts-expect-error: TS6196, unused class
        class Fixture {
          // @ts-expect-error: TS2554, too few or too many arguments
          @Inject(1, 2)
          // @ts-expect-error: TS7008, implicit any
          fixture;
        }

      }).toThrow('[odin]: The @Inject decorator cannot be called with more than one argument.');
    });

    test('should throw error when called with an array as argument', () => {
      expect(() => {

        @Injectable
        // @ts-expect-error: TS6196, unused class
        class Fixture {
          // @ts-expect-error: TS2345, invalid argument type
          @Inject([])
          // @ts-expect-error: TS7008, implicit any
          fixture;
        }

      }).toThrow('[odin]: The @Inject decorator cannot be called with an array as argument.');
    });

    test('should throw error when called with an empty object as options', () => {
      expect(() => {

        @Injectable
        // @ts-expect-error: TS6196, unused class
        class Fixture {
          @Inject({})
          // @ts-expect-error: TS7008, implicit any
          fixture;
        }

      }).toThrow('[odin]: The @Inject decorator cannot be called with an empty object as argument.');
    });

    test('should throw error when decorating a class', () => {
      expect(() => {

        // @ts-expect-error: TS1238, cannot decorate a class
        @Inject({ name: 'InjectDecoratingClass' })
        // @ts-expect-error: TS6196, unused class
        class InjectDecoratingClass {}

      }).toThrow(`[odin]: The @Inject decorator can only decorate a class field. Check the class named 'InjectDecoratingClass'.`);
    });

    test('should throw error when decorating a class method', () => {
      expect(() => {

        // @ts-expect-error: TS6196, unused class
        class InjectDecoratingClassMethod {
          // @ts-expect-error: TS1241, cannot decorate a class method
          @Inject({ name: 'InjectDecoratingClassMethod' })
          method(): void {}
        }

      }).toThrow(`[odin]: The @Inject decorator can only decorate a class field. Check the method named 'method'.`);
    });

  });
});
