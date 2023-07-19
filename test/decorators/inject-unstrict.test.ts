import { beforeEach, describe, expect, test } from 'vitest';

import { Inject } from '../../src/decorators/inject.js';
import { Injectable } from '../../src/decorators/injectable.js';
import { configuration } from '../../src/singletons/configuration.js';
import { odin } from '../../src/singletons/odin.js';

describe('decorators', () => {
  describe('@Inject (unstrict)', () => {
    const container = odin.container();

    beforeEach(() => {
      configuration.setStrict(false);
    });

    test('should inject based on the property name', () => {
      @Injectable
      class Fixture {}

      @Injectable
      class InjectableByPropertyFixture {
        @Inject
        // @ts-expect-error: TS7008, implicit any
        fixture;
      }

      const provided = container.provide<InjectableByPropertyFixture>(InjectableByPropertyFixture.name, true);
      expect(provided.fixture).toBeInstanceOf(Fixture);
    });

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
      expect(provided.lowerCaseBasedOnStringFixture).toBeInstanceOf(CaseBasedOnStringFixture);
      expect(provided.upperCaseBasedOnStringFixture).toBeInstanceOf(CaseBasedOnStringFixture);
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
      expect(provided.lowerCaseBasedOnObjectFixture).toBeInstanceOf(CaseBasedOnObjectFixture);
      expect(provided.upperCaseBasedOnObjectFixture).toBeInstanceOf(CaseBasedOnObjectFixture);
    });

  });
});
