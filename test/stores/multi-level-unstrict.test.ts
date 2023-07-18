import { beforeEach, describe, expect, test } from 'vitest';

import { Descriptor } from '../../src/common/descriptor.js';
import { configuration } from '../../src/singletons/configuration.js';
import { Bundle } from '../../src/stores/bundle.js';

const CustomIdentifier = 'CustomIdentifier';

class Fixture {}
class AnotherFixture {}

describe('stores', () => {
  describe('multi level', () => {
    let parentBundle: Bundle;
    let childBundle: Bundle;

    beforeEach(() => {
      configuration.setStrict(false);

      parentBundle = new Bundle('bundle-multi-level-parent');
      childBundle = parentBundle.child('bundle-multi-level-child');
    });

    test('should register by the child with same name after deregistered by the parent', () => {
      parentBundle.register(Fixture, { name: CustomIdentifier });

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(parentBundle.deregister(Fixture)).toBe(true);
      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(false);

      expect(childBundle.register(Fixture, { name: CustomIdentifier })).toBe(Fixture.name.toLowerCase());
      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(true);
    });

    test('should register by the child with same custom identifier of a class that was already deregistered by the parent', () => {
      parentBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(parentBundle.deregister(Fixture)).toBe(true);
      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(false);

      expect(childBundle.register(AnotherFixture, { name: Fixture.name })).toBe(AnotherFixture.name.toLowerCase());

      expect(childBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(AnotherFixture.name)).toBe(true);

      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(parentBundle.has(AnotherFixture.name)).toBe(false);
    });

    test('should not register by the child when already registered by the parent', () => {
      parentBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(() => {
        childBundle.register(Fixture);
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name.toLowerCase()}' registered.`);
    });

    test('should not register by the child when already registered by the parent with a different name', () => {
      parentBundle.register(Fixture, { name: CustomIdentifier });

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(() => {
        childBundle.register(Fixture);
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name.toLowerCase()}' registered.`);
    });

    test('should not register by the child with a different name when already registered by the parent', () => {
      parentBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(() => {
        childBundle.register(Fixture, { name: CustomIdentifier });
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name.toLowerCase()}' registered.`);
    });

    test('should not register different classes with the same custom identifier in the same level', () => {
      parentBundle.register(Fixture, { name: CustomIdentifier });

      expect(() => {
        parentBundle.register(AnotherFixture, { name: CustomIdentifier });
      }).toThrow(`[odin]: There already is an injectable '${CustomIdentifier.toLowerCase()}' registered.`);
    });

    test('should not register different classes with the same custom identifier in different levels', () => {
      parentBundle.register(Fixture, { name: CustomIdentifier });

      expect(() => {
        childBundle.register(AnotherFixture, { name: CustomIdentifier });
      }).toThrow(`[odin]: There already is an injectable '${CustomIdentifier.toLowerCase()}' registered.`);
    });

    test('should not register with the custom identifier of an already registered class in the same level', () => {
      parentBundle.register(Fixture);

      expect(() => {
        parentBundle.register(AnotherFixture, { name: Fixture.name });
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name.toLowerCase()}' registered.`);
    });

    test('should not register with the custom identifier of an already registered class in different levels', () => {
      parentBundle.register(Fixture);

      expect(() => {
        childBundle.register(AnotherFixture, { name: Fixture.name });
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name.toLowerCase()}' registered.`);
    });

    test('should not register with the name of an already registered custom identifier in the same level', () => {
      parentBundle.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        parentBundle.register(AnotherFixture);
      }).toThrow(`[odin]: There already is an injectable '${AnotherFixture.name.toLowerCase()}' registered.`);
    });

    test('should not register with the name of an already registered custom identifier in different levels', () => {
      parentBundle.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        childBundle.register(AnotherFixture);
      }).toThrow(`[odin]: There already is an injectable '${AnotherFixture.name.toLowerCase()}' registered.`);
    });

    test('should return a descriptor when registered', () => {
      const options = { something: 123 };
      const name = parentBundle.register(Fixture, options);

      const fromParent = parentBundle.get(name);
      expect(fromParent).toBeInstanceOf(Descriptor);
      expect(fromParent?.identifier).toBeUndefined();
      expect(fromParent?.injectable).toBe(Fixture);
      expect(fromParent?.name).toBe(Fixture.name.toLowerCase());
      expect(fromParent?.options).toStrictEqual(options);

      const fromChild = childBundle.get(name);
      expect(fromChild).toBeInstanceOf(Descriptor);
      expect(fromChild?.identifier).toBeUndefined();
      expect(fromChild?.injectable).toBe(Fixture);
      expect(fromChild?.name).toBe(Fixture.name.toLowerCase());
      expect(fromChild?.options).toStrictEqual(options);
    });

  });
});
