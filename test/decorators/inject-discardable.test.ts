import { describe, expect, test } from 'vitest';

import { Secrets } from '../../src/common/secrets.js';
import { Inject } from '../../src/decorators/inject.js';
import { Injectable } from '../../src/decorators/injectable.js';
import { odin } from '../../src/singletons/odin.js';

describe('decorators', () => {
  describe('@Inject', () => {
    describe('discardable', () => {
      @Injectable({ singleton: true })
      class DiscardableSingletonFixture {}
      Secrets.setDiscardable(DiscardableSingletonFixture);

      const container = odin.container();

      test('should inject and discard it', () => {
        @Injectable
        class DiscardableSingletonByObjectFixture {
          @Inject({ name: DiscardableSingletonFixture.name })
          // @ts-expect-error: TS7008, implicit any
          fixture;
        }

        const provided = container.provide<DiscardableSingletonByObjectFixture>(DiscardableSingletonByObjectFixture.name, true);
        expect(provided.fixture).toBeInstanceOf(DiscardableSingletonFixture);

        const oldValueFromGetter = provided.fixture;
        expect(oldValueFromGetter).toBeInstanceOf(DiscardableSingletonFixture);

        container.discard(DiscardableSingletonFixture.name);

        const newValueFromGetter = provided.fixture;
        expect(newValueFromGetter).toBeInstanceOf(DiscardableSingletonFixture);
        expect(newValueFromGetter).not.toBe(oldValueFromGetter);

        const newValueFromProvide = container.provide(DiscardableSingletonFixture.name, true);
        expect(newValueFromProvide).toBeInstanceOf(DiscardableSingletonFixture);
        expect(newValueFromProvide).toBe(newValueFromGetter);
      });

    });
  });
});
