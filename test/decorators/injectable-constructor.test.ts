import { describe, expect, test, vi } from 'vitest';

import { Inject } from '../../src/decorators/inject.js';
import { Injectable } from '../../src/decorators/injectable.js';
import { odin } from '../../src/singletons/odin.js';

describe('decorators', () => {
  describe('@Injectable', () => {
    describe('constructor', () => {

      @Injectable
      class InjectableFixture {}

      test('should support manual constructors if the injects are optional', () => {
        const spy = vi.fn<[InjectableFixture]>(() => void 0);

        @Injectable
        class InjectableWithConstructorAndOptionalInject {
          @Inject({ name: InjectableFixture.name, optional: true })
          fixture: any;

          constructor(fixture: InjectableFixture) {
            this.fixture = fixture;
            spy(fixture);
          }
        }

        const container = odin.container();
        const provided = container.provide<InjectableWithConstructorAndOptionalInject>(InjectableWithConstructorAndOptionalInject.name, true);

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(undefined);
        expect(provided.fixture).toBeInstanceOf(InjectableFixture);

        spy.mockReset();

        const fixture = new InjectableFixture();
        const manual = new InjectableWithConstructorAndOptionalInject(fixture);

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(fixture);
        expect(manual.fixture).toBeInstanceOf(InjectableFixture);
      });

      test('should throw error when using manual constructor with required injects', () => {
        const spy = vi.fn<[InjectableFixture]>(() => void 0);

        @Injectable
        class InjectableWithConstructorAndRequiredInject {
          @Inject({ name: InjectableFixture.name })
          fixture: any;

          constructor(fixture: InjectableFixture) {
            this.fixture = fixture;
            spy(fixture);
          }
        }

        const container = odin.container();
        const provided = container.provide<InjectableWithConstructorAndRequiredInject>(InjectableWithConstructorAndRequiredInject.name, true);

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(undefined);
        expect(provided.fixture).toBeInstanceOf(InjectableFixture);

        spy.mockReset();

        const fixture = new InjectableFixture();
        const manual = new InjectableWithConstructorAndRequiredInject(fixture);

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(fixture);

        expect(() => {
          manual.fixture;
        }).toThrow(`[odin]: There is no container at '${InjectableWithConstructorAndRequiredInject.name}'.`);
      });

    });
  });
});
