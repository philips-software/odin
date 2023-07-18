import { describe, expect, test, vi } from 'vitest';

import { Inject } from '../../src/decorators/inject.js';
import { Injectable } from '../../src/decorators/injectable.js';
import { odin } from '../../src/singletons/odin.js';

describe('decorators', () => {
  describe('@Inject', () => {
    describe('eager', () => {
      @Injectable
      class InjectableFixture {}

      const container = odin.container();

      test('should inject eager and apply resolution during instantiation', () => {
        @Injectable
        class InjectEager {
          @Inject({ name: InjectableFixture.name, eager: true })
          // @ts-expect-error: implicit any
          fixture;
        }

        const propertyName = 'fixture';
        const provided = container.provide<InjectEager>(InjectEager.name, true);

        const descriptor = Object.getOwnPropertyDescriptor(provided, propertyName);
        expect(descriptor).not.toBeUndefined();

        if (descriptor) {
          expect(descriptor.value).toBeInstanceOf(InjectableFixture);
        }
      });

      test('should inject non-eager and delay resolution until first access', () => {
        @Injectable
        class InjectNonEager {
          @Inject({ name: InjectableFixture.name, eager: false })
          // @ts-expect-error: implicit any
          fixture;
        }

        const propertyName = 'fixture';
        const provided = container.provide<InjectNonEager>(InjectNonEager.name, true);

        const descriptor = Object.getOwnPropertyDescriptor(provided, propertyName);
        expect(descriptor).not.toBeUndefined();

        if (descriptor) {
          expect(descriptor.get).not.toBeUndefined();
          expect(descriptor.value).toBeUndefined();

          if (descriptor.get) {
            const spy = vi.fn(descriptor.get);
            Object.defineProperty(provided, propertyName, { get: spy });

            expect(provided.fixture).toBeInstanceOf(InjectableFixture);
            expect(spy).toHaveBeenCalledOnce();
          }
        }
      });

    });
  });
});
