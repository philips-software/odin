import { beforeEach, describe, expect, test } from 'vitest';

import { Descriptor } from '../../src/common/descriptor.js';
import { Bundle } from '../../src/stores/bundle.js';
import { Registry } from '../../src/stores/registry.js';
import type { Store } from '../../src/types.js';

const CustomIdentifier = 'CustomIdentifier';
const AnotherCustomIdentifier = 'AnotherCustomIdentifier';

class Fixture {}
class AnotherFixture {}

describe('stores', () => {
  describe('single level', () => {
    const matrix: [string, () => Store][] = [
      ['Bundle', () => new Bundle('store')],
      ['Registry', () => new Registry()],
    ];

    describe.each(matrix)('%s', (_, createStore) => {
      let store: Store;

      beforeEach(() => {
        store = createStore();
      });

      test('should register on its own', () => {
        store.register(Fixture);

        expect(store.has(Fixture.name)).toBe(true);
        expect(store.has(AnotherFixture.name)).toBe(false);
      });

      test('should register with a custom identifier', () => {
        store.register(Fixture, { name: CustomIdentifier });

        expect(store.has(Fixture.name)).toBe(true);
        expect(store.has(AnotherFixture.name)).toBe(false);
        expect(store.has(CustomIdentifier)).toBe(true);
        expect(store.has(AnotherCustomIdentifier)).toBe(false);
      });

      test('should register again after deregister', () => {
        store.register(Fixture);

        expect(store.has(Fixture.name)).toBe(true);
        expect(store.has(AnotherFixture.name)).toBe(false);

        expect(store.deregister(Fixture)).toBe(true);
        expect(store.has(Fixture.name)).toBe(false);

        expect(store.register(Fixture)).toBe(Fixture.name);
        expect(store.has(Fixture.name)).toBe(true);
      });

      test('should deregister on its own', () => {
        store.register(Fixture);

        expect(store.has(Fixture.name)).toBe(true);
        expect(store.has(AnotherFixture.name)).toBe(false);

        expect(store.deregister(Fixture)).toBe(true);
        expect(store.has(Fixture.name)).toBe(false);
        expect(store.has(AnotherFixture.name)).toBe(false);

        expect(store.deregister(AnotherFixture)).toBe(false);
        expect(store.has(AnotherFixture.name)).toBe(false);
      });

      test('should deregister with a custom identifier', () => {
        store.register(Fixture, { name: CustomIdentifier });

        expect(store.has(Fixture.name)).toBe(true);
        expect(store.has(AnotherFixture.name)).toBe(false);
        expect(store.has(CustomIdentifier)).toBe(true);
        expect(store.has(AnotherCustomIdentifier)).toBe(false);

        expect(store.deregister(Fixture)).toBe(true);
        expect(store.deregister(AnotherFixture)).toBe(false);

        expect(store.has(Fixture.name)).toBe(false);
        expect(store.has(AnotherFixture.name)).toBe(false);
        expect(store.has(CustomIdentifier)).toBe(false);
        expect(store.has(AnotherCustomIdentifier)).toBe(false);
      });

      test('should not deregister an unregistered injectable', () => {
        expect(store.has(Fixture.name)).toBe(false);
        expect(store.deregister(Fixture)).toBe(false);
      });

      test('should return the name upon register', () => {
        const fixtureName = store.register(Fixture);
        expect(fixtureName).toBe(Fixture.name);

        const anotherFixtureName = store.register(AnotherFixture);
        expect(anotherFixtureName).toBe(AnotherFixture.name);
      });

      test('should return a descriptor when registered', () => {
        const options = { something: 123 };
        const name = store.register(Fixture, options);

        const descriptor = store.get(name);
        expect(descriptor).toBeInstanceOf(Descriptor);
        expect(descriptor?.identifier).toBeUndefined();
        expect(descriptor?.injectable).toBe(Fixture);
        expect(descriptor?.name).toBe(Fixture.name);
        expect(descriptor?.options).toStrictEqual(options);
      });

      test('should return the same descriptor when registered and getting by name or custom identifier', () => {
        const name = store.register(Fixture, { name: CustomIdentifier });

        const firstDescriptor = store.get(name);
        expect(firstDescriptor).toBeInstanceOf(Descriptor);

        const secondDescriptor = store.get(CustomIdentifier);
        expect(secondDescriptor).toBeInstanceOf(Descriptor);
        expect(secondDescriptor).toBe(firstDescriptor);
      });

      test(`should not return a descriptor when getting with an empty name or identifier`, () => {
        // @ts-expect-error: TS2322, invalid argument type
        expect(store.get(null)).toBeUndefined();
        expect(store.get(undefined)).toBeUndefined();
      });

      test(`should not return a descriptor when unregistered`, () => {
        expect(store.get(Fixture.name)).toBeUndefined();
      });

      test(`should not return a descriptor when deregistered and getting by name`, () => {
        const name = store.register(Fixture);

        expect(store.deregister(Fixture)).toBe(true);
        expect(store.get(name)).toBeUndefined();
      });

      test('should not return a descriptor when deregistered and getting by custom identifier', () => {
        const name = store.register(Fixture, { name: CustomIdentifier });
        expect(store.deregister(Fixture)).toBe(true);

        const firstDescriptor = store.get(name);
        expect(firstDescriptor).toBeUndefined();

        const secondDescriptor = store.get(CustomIdentifier);
        expect(secondDescriptor).toBeUndefined();
      });

      test('should throw error when registering more than once', () => {
        store.register(Fixture);

        expect(store.has(Fixture.name)).toBe(true);
        expect(store.has(AnotherFixture.name)).toBe(false);
        expect(() => {
          store.register(Fixture);
        }).toThrow(`[odin]: There already is an injectable '${Fixture.name}' registered.`);
      });

      test('should throw error when registering different classes with the same custom identifier', () => {
        store.register(Fixture, { name: CustomIdentifier });

        expect(() => {
          store.register(AnotherFixture, { name: CustomIdentifier });
        }).toThrow(`[odin]: There already is an injectable '${CustomIdentifier}' registered.`);
      });

      test('should throw error when registering with the custom identifier of an already registered name', () => {
        store.register(Fixture);

        expect(() => {
          store.register(AnotherFixture, { name: Fixture.name });
        }).toThrow(`[odin]: There already is an injectable '${Fixture.name}' registered.`);
      });

      test('should throw error when registering with the name of an already registered custom identifier', () => {
        store.register(Fixture, { name: AnotherFixture.name });

        expect(() => {
          store.register(AnotherFixture);
        }).toThrow(`[odin]: There already is an injectable '${AnotherFixture.name}' registered.`);
      });

      test('should register on its own, maintaining the case', () => {
        const name = store.register(Fixture);
        expect(name).toBe(Fixture.name);

        expect(store.has(Fixture.name)).toBe(true);
        expect(store.has(Fixture.name.toUpperCase())).toBe(false);

        expect(store.has(AnotherFixture.name)).toBe(false);
        expect(store.has(AnotherFixture.name.toUpperCase())).toBe(false);
      });

      test('should register with a custom identifier, maintaining the case', () => {
        const name = store.register(Fixture, { name: CustomIdentifier });
        expect(name).toBe(Fixture.name);

        expect(store.has(Fixture.name)).toBe(true);
        expect(store.has(Fixture.name.toUpperCase())).toBe(false);

        expect(store.has(AnotherFixture.name)).toBe(false);
        expect(store.has(AnotherFixture.name.toUpperCase())).toBe(false);

        expect(store.has(CustomIdentifier)).toBe(true);
        expect(store.has(CustomIdentifier.toUpperCase())).toBe(false);

        expect(store.has(AnotherCustomIdentifier)).toBe(false);
        expect(store.has(AnotherCustomIdentifier.toUpperCase())).toBe(false);
      });

      test('should register different classes with the same custom identifier, but with different cases', () => {
        store.register(Fixture, { name: CustomIdentifier });

        expect(() => {
          store.register(AnotherFixture, { name: CustomIdentifier.toUpperCase() });
        }).not.toThrow();
      });

      test('should throw error when registering with a name of an already registered custom identifier', () => {
        store.register(Fixture, { name: AnotherFixture.name });

        expect(() => {
          store.register(AnotherFixture);
        }).toThrow(`[odin]: There already is an injectable '${AnotherFixture.name}' registered.`);
      });

    });
  });
});
