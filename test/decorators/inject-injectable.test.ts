import { describe, expect, test } from 'vitest';

import { Inject } from '../../src/decorators/inject.js';
import { Injectable } from '../../src/decorators/injectable.js';
import { odin } from '../../src/singletons/odin.js';

describe('decorators', () => {
  describe('@Inject', () => {
    describe('injectable', () => {
      @Injectable
      class InjectableFixture {}

      const container = odin.container();

      test('should inject based on a string', () => {
        @Injectable
        class InjectBasedOnStringFixture {
          @Inject(InjectableFixture.name)
          // @ts-expect-error: implicit any
          rightCaseFixture;

          @Inject(InjectableFixture.name.toLowerCase())
          // @ts-expect-error: implicit any
          lowerCaseFixture: InjectableFixture;

          @Inject(InjectableFixture.name.toUpperCase())
          // @ts-expect-error: implicit any
          upperCaseFixture: InjectableFixture;
        }

        const provided = container.provide<InjectBasedOnStringFixture>(InjectBasedOnStringFixture.name, true);

        expect(provided.rightCaseFixture).toBeInstanceOf(InjectableFixture);
        expect(provided.lowerCaseFixture).toBeUndefined();
        expect(provided.upperCaseFixture).toBeUndefined();
      });

      test('should inject based on an object with a name', () => {
        @Injectable
        class InjectBasedOnObjectFixture {
          @Inject({ name: InjectableFixture.name })
          // @ts-expect-error: implicit any
          rightCaseFixture;

          @Inject({ name: InjectableFixture.name.toLowerCase() })
          // @ts-expect-error: implicit any
          lowerCaseFixture;

          @Inject({ name: InjectableFixture.name.toUpperCase() })
          // @ts-expect-error: implicit any
          upperCaseFixture;
        }

        const provided = container.provide<InjectBasedOnObjectFixture>(InjectBasedOnObjectFixture.name, true);

        expect(provided.rightCaseFixture).toBeInstanceOf(InjectableFixture);
        expect(provided.lowerCaseFixture).toBeUndefined();
        expect(provided.upperCaseFixture).toBeUndefined();
      });

      test('should inject into multiple properties', () => {
        @Injectable
        class MultipleInjectableFixture {
          @Inject(InjectableFixture.name)
          // @ts-expect-error: implicit any
          basedOnStringFixture;

          @Inject({ name: InjectableFixture.name })
          // @ts-expect-error: implicit any
          basedOnObjectFixture;
        }

        const provided = container.provide<MultipleInjectableFixture>(MultipleInjectableFixture.name, true);

        expect(provided.basedOnStringFixture).toBeInstanceOf(InjectableFixture);
        expect(provided.basedOnObjectFixture).toBeInstanceOf(InjectableFixture);
      });

    });
  });
});
