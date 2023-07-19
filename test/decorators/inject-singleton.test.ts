import { describe, expect, test } from 'vitest';

import { Inject } from '../../src/decorators/inject.js';
import { Injectable } from '../../src/decorators/injectable.js';
import { odin } from '../../src/singletons/odin.js';

describe('decorators', () => {
  describe('@Inject', () => {
    describe('singleton', () => {
      @Injectable({ singleton: true })
      class SingletonFixture {}

      const container = odin.container();

      test('should inject based on a string', () => {
        @Injectable
        class SingletonBasedOnStringFixture {
          @Inject(SingletonFixture.name)
          // @ts-expect-error: TS7008, implicit any
          rightCaseFixture;

          @Inject(SingletonFixture.name.toLowerCase())
          // @ts-expect-error: TS7008, implicit any
          lowerCaseFixture;

          @Inject(SingletonFixture.name.toUpperCase())
          // @ts-expect-error: TS7008, implicit any
          upperCaseFixture;
        }

        const provided = container.provide<SingletonBasedOnStringFixture>(SingletonBasedOnStringFixture.name, true);

        expect(provided.rightCaseFixture).toBeInstanceOf(SingletonFixture);
        expect(provided.lowerCaseFixture).toBeUndefined();
        expect(provided.upperCaseFixture).toBeUndefined();
      });

      test('should inject based on an object with a name', () => {
        @Injectable
        class SingletonBasedOnObjectFixture {
          @Inject({ name: SingletonFixture.name })
          // @ts-expect-error: TS7008, implicit any
          rightCaseFixture;

          @Inject({ name: SingletonFixture.name.toLowerCase() })
          // @ts-expect-error: TS7008, implicit any
          lowerCaseFixture;

          @Inject({ name: SingletonFixture.name.toUpperCase() })
          // @ts-expect-error: TS7008, implicit any
          upperCaseFixture;
        }

        const provided = container.provide<SingletonBasedOnObjectFixture>(SingletonBasedOnObjectFixture.name, true);

        expect(provided.rightCaseFixture).toBeInstanceOf(SingletonFixture);
        expect(provided.lowerCaseFixture).toBeUndefined();
        expect(provided.upperCaseFixture).toBeUndefined();
      });

      test('should inject into multiple properties', () => {
        @Injectable
        class MultipleSingletonFixture {
          @Inject(SingletonFixture.name)
          // @ts-expect-error: TS7008, implicit any
          basedOnStringFixture;

          @Inject({ name: SingletonFixture.name })
          // @ts-expect-error: TS7008, implicit any
          basedOnObjectFixture;
        }

        const provided = container.provide<MultipleSingletonFixture>(MultipleSingletonFixture.name, true);

        expect(provided.basedOnStringFixture).toBeInstanceOf(SingletonFixture);
        expect(provided.basedOnObjectFixture).toBeInstanceOf(SingletonFixture);
      });

    });
  });
});
