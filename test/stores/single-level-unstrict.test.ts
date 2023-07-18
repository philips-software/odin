import { beforeEach, describe, expect, test } from 'vitest';

import { Descriptor } from '../../src/common/descriptor.js';
import { configuration } from '../../src/singletons/configuration.js';
import { Bundle } from '../../src/stores/bundle.js';
import { Registry } from '../../src/stores/registry.js';
import type { Store } from '../../src/types.js';

const CustomIdentifier = 'CustomIdentifier';
const AnotherCustomIdentifier = 'AnotherCustomIdentifier';

class Fixture {}
class AnotherFixture {}

describe('stores (unstrict)', () => {
  const matrix: [string, () => Store][] = [
    ['Bundle', () => new Bundle('store')],
    ['Registry', () => new Registry()],
  ];

  describe.each(matrix)('%s', (_, createStore) => {
    let store: Store;

    beforeEach(() => {
      configuration.setStrict(false);

      store = createStore();
    });

    test('should register again after deregister', () => {
      store.register(Fixture);

      expect(store.has(Fixture.name)).toBe(true);
      expect(store.has(AnotherFixture.name)).toBe(false);

      expect(store.deregister(Fixture)).toBe(true);
      expect(store.has(Fixture.name)).toBe(false);

      expect(store.register(Fixture)).toBe(Fixture.name.toLowerCase());
      expect(store.has(Fixture.name)).toBe(true);
    });

    test('should return the name upon register', () => {
      const fixtureName = store.register(Fixture);
      expect(fixtureName).toBe(Fixture.name.toLowerCase());

      const anotherFixtureName = store.register(AnotherFixture);
      expect(anotherFixtureName).toBe(AnotherFixture.name.toLowerCase());
    });

    test('should return a descriptor when registered', () => {
      const options = { something: 123 };
      const name = store.register(Fixture, options);

      const descriptor = store.get(name);
      expect(descriptor).toBeInstanceOf(Descriptor);
      expect(descriptor?.identifier).toBeUndefined();
      expect(descriptor?.injectable).toBe(Fixture);
      expect(descriptor?.name).toBe(Fixture.name.toLowerCase());
      expect(descriptor?.options).toStrictEqual(options);
    });

    test('should throw error when registering more than once', () => {
      store.register(Fixture);

      expect(store.has(Fixture.name)).toBe(true);
      expect(store.has(AnotherFixture.name)).toBe(false);
      expect(() => {
        store.register(Fixture);
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name.toLowerCase()}' registered.`);
    });

    test('should throw error when registering different classes with the same custom identifier', () => {
      store.register(Fixture, { name: CustomIdentifier });

      expect(() => {
        store.register(AnotherFixture, { name: CustomIdentifier });
      }).toThrow(`[odin]: There already is an injectable '${CustomIdentifier.toLowerCase()}' registered.`);
    });

    test('should throw error when registering with the custom identifier of an already registered name', () => {
      store.register(Fixture);

      expect(() => {
        store.register(AnotherFixture, { name: Fixture.name });
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name.toLowerCase()}' registered.`);
    });

    test('should throw error when registering with the name of an already registered custom identifier', () => {
      store.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        store.register(AnotherFixture);
      }).toThrow(`[odin]: There already is an injectable '${AnotherFixture.name.toLowerCase()}' registered.`);
    });

    test('should register on its own, ignoring the case', () => {
      const name = store.register(Fixture);
      expect(name).toBe(Fixture.name.toLowerCase());

      expect(store.has(Fixture.name)).toBe(true);
      expect(store.has(Fixture.name.toUpperCase())).toBe(true);

      expect(store.has(AnotherFixture.name)).toBe(false);
      expect(store.has(AnotherFixture.name.toUpperCase())).toBe(false);
    });

    test('should register with a custom identifier, ignoring the case', () => {
      const name = store.register(Fixture, { name: CustomIdentifier });
      expect(name).toBe(Fixture.name.toLowerCase());

      expect(store.has(Fixture.name)).toBe(true);
      expect(store.has(Fixture.name.toUpperCase())).toBe(true);

      expect(store.has(AnotherFixture.name)).toBe(false);
      expect(store.has(AnotherFixture.name.toUpperCase())).toBe(false);

      expect(store.has(CustomIdentifier)).toBe(true);
      expect(store.has(CustomIdentifier.toUpperCase())).toBe(true);

      expect(store.has(AnotherCustomIdentifier)).toBe(false);
      expect(store.has(AnotherCustomIdentifier.toUpperCase())).toBe(false);
    });

    test('should throw error when registering different classes with the same custom identifier, ignoring the case', () => {
      store.register(Fixture, { name: CustomIdentifier });

      expect(() => {
        store.register(AnotherFixture, { name: CustomIdentifier.toUpperCase() });
      }).toThrow(`[odin]: There already is an injectable '${CustomIdentifier.toLowerCase()}' registered.`);
    });

    test('should throw error when registering with the name of an already registered custom identifier, ignoring the case', () => {
      store.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        store.register(AnotherFixture);
      }).toThrow(`[odin]: There already is an injectable '${AnotherFixture.name.toLowerCase()}' registered.`);
    });

  });
});
