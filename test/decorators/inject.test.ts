import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import odin from '../../src/odin.js';
import Config from '../../src/configuration/config.js';
import Inject from '../../src/container/decorators/inject.js';
import Injectable from '../../src/container/decorators/injectable.js';

import { InjectableFixture } from '../fixtures/injectable.js';
import { DiscardableSingletonFixture, SingletonFixture } from '../fixtures/singleton.js';

describe('decorators', function() {
  describe('@Inject', () => {
    const container = odin.container('parent/child');

    describe('@Injectable', () => {

      test('should inject based on the property', () => {
        @Injectable
        class InjectBasedOnPropertyFixture {
          @Inject
          InjectableFixture;
        }

        const provided = container.provide(InjectBasedOnPropertyFixture.name, true);
        expect(provided.InjectableFixture instanceof InjectableFixture).toBe(true);
      });

      test('should inject based on a string', () => {
        @Injectable
        class InjectBasedOnStringFixture {
          @Inject(InjectableFixture.name)
          rightCaseFixture;

          @Inject(InjectableFixture.name.toLowerCase())
          lowerCaseFixture;

          @Inject(InjectableFixture.name.toUpperCase())
          upperCaseFixture;
        }

        const provided = container.provide(InjectBasedOnStringFixture.name, true);
        expect(provided.rightCaseFixture instanceof InjectableFixture).toBe(true);
        expect(provided.lowerCaseFixture instanceof InjectableFixture).toBe(true);
        expect(provided.upperCaseFixture instanceof InjectableFixture).toBe(true);
      });

      test('should inject based on an object', () => {
        @Injectable
        class InjectBasedOnObjectFixture {
          @Inject({ name: InjectableFixture.name })
          rightCaseFixture;

          @Inject({ name: InjectableFixture.name.toLowerCase() })
          lowerCaseFixture;

          @Inject({ name: InjectableFixture.name.toUpperCase() })
          upperCaseFixture;
        }

        const provided = container.provide(InjectBasedOnObjectFixture.name, true);
        expect(provided.rightCaseFixture instanceof InjectableFixture).toBe(true);
        expect(provided.lowerCaseFixture instanceof InjectableFixture).toBe(true);
        expect(provided.upperCaseFixture instanceof InjectableFixture).toBe(true);
      });

      test('should inject into multiple properties', () => {
        @Injectable
        class MultipleInjectableFixture {
          @Inject
          InjectableFixture;

          @Inject(InjectableFixture.name)
          basedOnStringFixture;

          @Inject({ name: InjectableFixture.name })
          basedOnObjectFixture;
        }

        const provided = container.provide(MultipleInjectableFixture.name, true);
        expect(provided.InjectableFixture instanceof InjectableFixture).toBe(true);
        expect(provided.basedOnStringFixture instanceof InjectableFixture).toBe(true);
        expect(provided.basedOnObjectFixture instanceof InjectableFixture).toBe(true);
      });
    });

    describe('@Singleton', () => {

      test('should inject based on the property', () => {
        @Injectable
        class SingletonBasedOnPropertyFixture {
          @Inject
          SingletonFixture;
        }

        const provided = container.provide(SingletonBasedOnPropertyFixture.name, true);
        expect(provided.SingletonFixture instanceof SingletonFixture).toBe(true);
      });

      test('should inject based on a string', () => {
        @Injectable
        class SingletonBasedOnStringFixture {
          @Inject(SingletonFixture.name)
          rightCaseFixture;

          @Inject(SingletonFixture.name.toLowerCase())
          lowerCaseFixture;

          @Inject(SingletonFixture.name.toUpperCase())
          upperCaseFixture;
        }

        const provided = container.provide(SingletonBasedOnStringFixture.name, true);
        expect(provided.rightCaseFixture instanceof SingletonFixture).toBe(true);
        expect(provided.lowerCaseFixture instanceof SingletonFixture).toBe(true);
        expect(provided.upperCaseFixture instanceof SingletonFixture).toBe(true);
      });

      test('should inject based on an object', () => {
        @Injectable
        class SingletonBasedOnObjectFixture {
          @Inject({ name: SingletonFixture.name })
          rightCaseFixture;

          @Inject({ name: SingletonFixture.name.toLowerCase() })
          lowerCaseFixture;

          @Inject({ name: SingletonFixture.name.toUpperCase() })
          upperCaseFixture;
        }

        const provided = container.provide(SingletonBasedOnObjectFixture.name, true);
        expect(provided.rightCaseFixture instanceof SingletonFixture).toBe(true);
        expect(provided.lowerCaseFixture instanceof SingletonFixture).toBe(true);
        expect(provided.upperCaseFixture instanceof SingletonFixture).toBe(true);
      });

      test('should inject into multiple properties', () => {
        @Injectable
        class MultipleSingletonFixture {
          @Inject
          SingletonFixture;

          @Inject(SingletonFixture.name)
          basedOnStringFixture;

          @Inject({ name: SingletonFixture.name })
          basedOnObjectFixture;
        }

        const provided = container.provide(MultipleSingletonFixture.name, true);
        expect(provided.SingletonFixture instanceof SingletonFixture).toBe(true);
        expect(provided.basedOnStringFixture instanceof SingletonFixture).toBe(true);
        expect(provided.basedOnObjectFixture instanceof SingletonFixture).toBe(true);
      });
    });

    describe('@Singleton (discardable)', () => {

      test('should inject based on the property and discard it', () => {
        @Injectable
        class DiscardableSingletonByPropertyFixture {
          @Inject DiscardableSingletonFixture;
        }

        const provided = container.provide(DiscardableSingletonByPropertyFixture.name, true);
        expect(provided.DiscardableSingletonFixture instanceof DiscardableSingletonFixture).toBe(true);

        const oldValue = provided.DiscardableSingletonFixture;
        container.discard(DiscardableSingletonFixture.name);

        const newValue = provided.DiscardableSingletonFixture;
        expect(newValue).not.toBeNull();
        expect(newValue).not.toBe(oldValue);

        const newByProvide = container.provide(DiscardableSingletonFixture.name, true);
        expect(newByProvide).toBe(newValue);

        expect(oldValue instanceof DiscardableSingletonFixture).toBe(true);
        expect(newValue instanceof DiscardableSingletonFixture).toBe(true);
        expect(newByProvide instanceof DiscardableSingletonFixture).toBe(true);
      });

      test('should inject based on a string and discard it', () => {
        @Injectable
        class DiscardableSingletonByStringFixture {
          @Inject(DiscardableSingletonFixture.name) fixture;
        }

        const provided = container.provide(DiscardableSingletonByStringFixture.name, true);
        expect(provided.fixture instanceof DiscardableSingletonFixture).toBe(true);

        const oldValue = provided.fixture;
        container.discard(DiscardableSingletonFixture.name);

        const newValue = provided.fixture;
        expect(newValue).not.toBeNull();
        expect(newValue).not.toBe(oldValue);

        const newByProvide = container.provide(DiscardableSingletonFixture.name, true);
        expect(newByProvide).toBe(newValue);

        expect(oldValue instanceof DiscardableSingletonFixture).toBe(true);
        expect(newValue instanceof DiscardableSingletonFixture).toBe(true);
        expect(newByProvide instanceof DiscardableSingletonFixture).toBe(true);
      });

      test('should inject based on an object and discard it', () => {
        @Injectable
        class DiscardableSingletonByObjectFixture {
          @Inject({ name: DiscardableSingletonFixture.name }) fixture;
        }

        const provided = container.provide(DiscardableSingletonByObjectFixture.name, true);
        expect(provided.fixture instanceof DiscardableSingletonFixture).toBe(true);

        const oldValue = provided.fixture;
        container.discard(DiscardableSingletonFixture.name);

        const newValue = provided.fixture;
        expect(newValue).not.toBeNull();
        expect(newValue).not.toBe(oldValue);

        const newByProvide = container.provide(DiscardableSingletonFixture.name, true);
        expect(newByProvide).toBe(newValue);

        expect(oldValue instanceof DiscardableSingletonFixture).toBe(true);
        expect(newValue instanceof DiscardableSingletonFixture).toBe(true);
        expect(newByProvide instanceof DiscardableSingletonFixture).toBe(true);
      });
    });

    describe('errors', () => {

      test('should throw error when passing more than one argument', () => {
        expect(() => {
          @Injectable
          class Fixture {
            @Inject(InjectableFixture.name, true)
            fixture;
          }
        }).toThrow('[ODIN] @Inject should receive only one argument.');
      });
    });

    describe('strict', () => {

      beforeEach(() => {
        Config.setStrict(true);
      });

      afterEach(() => {
        Config.setStrict(false);
      });

      test('should inject into multiple properties', () => {
        @Injectable
        class MultipleFixture { }

        @Injectable
        class MultipleInjectableFixture {
          @Inject(MultipleFixture.name)
          basedOnStringFixture;

          @Inject({ name: MultipleFixture.name })
          basedOnObjectFixture;
        }

        const provided = container.provide(MultipleInjectableFixture.name, true);
        expect(provided.basedOnStringFixture instanceof MultipleFixture).toBe(true);
        expect(provided.basedOnObjectFixture instanceof MultipleFixture).toBe(true);
      });

      test('should inject respecting the name casing based on a string', () => {
        @Injectable
        class CaseBasedOnStringFixture { }

        @Injectable
        class MultipleCaseBasedOnStringFixture {
          @Inject(CaseBasedOnStringFixture.name)
          rightCaseBasedOnStringFixture;

          @Inject(CaseBasedOnStringFixture.name.toLowerCase())
          lowerCaseBasedOnStringFixture;

          @Inject(CaseBasedOnStringFixture.name.toUpperCase())
          upperCaseBasedOnStringFixture;
        }

        const provided = container.provide(MultipleCaseBasedOnStringFixture.name, true);
        expect(provided.rightCaseBasedOnStringFixture instanceof CaseBasedOnStringFixture).toBe(true);
        expect(provided.lowerCaseBasedOnStringFixture).toBeUndefined();
        expect(provided.upperCaseBasedOnStringFixture).toBeUndefined();
      });

      test('should inject respecting the name casing based on an object', () => {
        @Injectable
        class CaseBasedOnObjectFixture { }

        @Injectable
        class MultipleCaseBasedOnObjectFixture {
          @Inject({ name: CaseBasedOnObjectFixture.name })
          rightCaseBasedOnObjectFixture;

          @Inject({ name: CaseBasedOnObjectFixture.name.toLowerCase() })
          lowerCaseBasedOnObjectFixture;

          @Inject({ name: CaseBasedOnObjectFixture.name.toUpperCase() })
          upperCaseBasedOnObjectFixture;
        }

        const provided = container.provide(MultipleCaseBasedOnObjectFixture.name, true);
        expect(provided.rightCaseBasedOnObjectFixture instanceof CaseBasedOnObjectFixture).toBe(true);
        expect(provided.lowerCaseBasedOnObjectFixture).toBeUndefined();
        expect(provided.upperCaseBasedOnObjectFixture).toBeUndefined();
      });

      test('should throw error if used without a string name', () => {
        expect(() => {
          @Injectable
          class StrictWithoutStringNameFixture {
            @Inject
            fixture;
          }
        }).toThrow(`[ODIN] StrictWithoutStringNameFixture[Inject]: mandatory property 'name' not found.`);
      });

      test('should throw error if used without an object name', () => {
        expect(() => {
          @Injectable
          class StrictWithoutObjectNameFixture {
            @Inject({ })
            fixture;
          }
        }).toThrow(`[ODIN] StrictWithoutObjectNameFixture[Inject]: mandatory property 'name' not found.`);
      });
    });
  });
});
