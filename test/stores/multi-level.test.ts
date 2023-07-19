import { beforeEach, describe, expect, test } from 'vitest';

import { Descriptor } from '../../src/common/descriptor.js';
import { Bundle } from '../../src/stores/bundle.js';

const CustomIdentifier = 'CustomIdentifier';

class Fixture {}
class AnotherFixture {}

describe('stores', () => {
  describe('multi level', () => {
    let parentBundle: Bundle;
    let childBundle: Bundle;

    beforeEach(() => {
      parentBundle = new Bundle('bundle-multi-level-parent');
      childBundle = parentBundle.child('bundle-multi-level-child');
    });

    test('should both be related', () => {
      // @ts-expect-error: TS2341, private readonly field
      expect(parentBundle.hasChild(childBundle.domain)).toBe(true);

      // @ts-expect-error: TS2341, private readonly field
      expect(childBundle.parent).toBe(parentBundle);
    });

    test('should not have child with an empty name or identifier', () => {
      // @ts-expect-error: TS2345, invalid argument type
      expect(parentBundle.hasChild(null)).toBe(false);
      expect(parentBundle.hasChild(undefined)).toBe(false);
    });

    test('should be available on both when registered by the parent', () => {
      parentBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);
    });

    test('should be available only on the child when registered by the child', () => {
      childBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(true);
    });

    test('should not be available on both when registered and deregistered by the parent', () => {
      parentBundle.register(Fixture);

      expect(parentBundle.deregister(Fixture)).toBe(true);

      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(false);
    });

    test('should not be available on both when registered and deregistered by the child', () => {
      childBundle.register(Fixture);

      expect(childBundle.deregister(Fixture)).toBe(true);

      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(false);
    });

    test('should register by the child with same name after deregistered by the parent', () => {
      parentBundle.register(Fixture, { name: CustomIdentifier });

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(parentBundle.deregister(Fixture)).toBe(true);
      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(false);

      expect(childBundle.register(Fixture, { name: CustomIdentifier })).toBe(Fixture.name);
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

      expect(childBundle.register(AnotherFixture, { name: Fixture.name })).toBe(AnotherFixture.name);

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
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name}' registered.`);
    });

    test('should not register by the child when already registered by the parent with a different name', () => {
      parentBundle.register(Fixture, { name: CustomIdentifier });

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(() => {
        childBundle.register(Fixture);
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name}' registered.`);
    });

    test('should not register by the child with a different name when already registered by the parent', () => {
      parentBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(() => {
        childBundle.register(Fixture, { name: CustomIdentifier });
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name}' registered.`);
    });

    test('should not register different classes with the same custom identifier in the same level', () => {
      parentBundle.register(Fixture, { name: CustomIdentifier });

      expect(() => {
        parentBundle.register(AnotherFixture, { name: CustomIdentifier });
      }).toThrow(`[odin]: There already is an injectable '${CustomIdentifier}' registered.`);
    });

    test('should not register different classes with the same custom identifier in different levels', () => {
      parentBundle.register(Fixture, { name: CustomIdentifier });

      expect(() => {
        childBundle.register(AnotherFixture, { name: CustomIdentifier });
      }).toThrow(`[odin]: There already is an injectable '${CustomIdentifier}' registered.`);
    });

    test('should not register with the custom identifier of an already registered class in the same level', () => {
      parentBundle.register(Fixture);

      expect(() => {
        parentBundle.register(AnotherFixture, { name: Fixture.name });
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name}' registered.`);
    });

    test('should not register with the custom identifier of an already registered class in different levels', () => {
      parentBundle.register(Fixture);

      expect(() => {
        childBundle.register(AnotherFixture, { name: Fixture.name });
      }).toThrow(`[odin]: There already is an injectable '${Fixture.name}' registered.`);
    });

    test('should not register with the name of an already registered custom identifier in the same level', () => {
      parentBundle.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        parentBundle.register(AnotherFixture);
      }).toThrow(`[odin]: There already is an injectable '${AnotherFixture.name}' registered.`);
    });

    test('should not register with the name of an already registered custom identifier in different levels', () => {
      parentBundle.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        childBundle.register(AnotherFixture);
      }).toThrow(`[odin]: There already is an injectable '${AnotherFixture.name}' registered.`);
    });

    test('should deregister by the parent when registered by the parent', () => {
      parentBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(parentBundle.deregister(Fixture)).toBe(true);
      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(false);
    });

    test('should deregister by the child when registered by the child', () => {
      childBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(childBundle.deregister(Fixture)).toBe(true);
      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(false);
    });

    test('should not deregister by the child when registered by the parent', () => {
      parentBundle.register(Fixture);

      expect(childBundle.deregister(Fixture)).toBe(false);

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);
    });

    test('should not deregister by the parent when registered by the child', () => {
      childBundle.register(Fixture);

      expect(parentBundle.deregister(Fixture)).toBe(false);

      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(true);
    });

    test('should return a descriptor when registered', () => {
      const options = { something: 123 };
      const name = parentBundle.register(Fixture, options);

      const fromParent = parentBundle.get(name);
      expect(fromParent).toBeInstanceOf(Descriptor);
      expect(fromParent?.identifier).toBeUndefined();
      expect(fromParent?.injectable).toBe(Fixture);
      expect(fromParent?.name).toBe(Fixture.name);
      expect(fromParent?.options).toStrictEqual(options);

      const fromChild = childBundle.get(name);
      expect(fromChild).toBeInstanceOf(Descriptor);
      expect(fromChild?.identifier).toBeUndefined();
      expect(fromChild?.injectable).toBe(Fixture);
      expect(fromChild?.name).toBe(Fixture.name);
      expect(fromChild?.options).toStrictEqual(options);
    });

    test(`should not return a descriptor when deregistered`, () => {
      const options = { something: 123 };
      const name = parentBundle.register(Fixture, options);
      expect(parentBundle.deregister(Fixture)).toBe(true);

      const fromParent = parentBundle.get(name);
      expect(fromParent).toBeUndefined();

      const fromChild = childBundle.get(name);
      expect(fromChild).toBeUndefined();
    });

    test('should return same descriptor when registered and getting by name or custom identifier', () => {
      const name = parentBundle.register(Fixture, { name: CustomIdentifier });

      const firstFromParent = parentBundle.get(name);
      expect(firstFromParent).toBeInstanceOf(Descriptor);

      const secondFromParent = parentBundle.get(CustomIdentifier);
      expect(secondFromParent).toBeInstanceOf(Descriptor);
      expect(secondFromParent).toBe(firstFromParent);

      const firstFromChild = childBundle.get(name);
      expect(firstFromChild).toBeInstanceOf(Descriptor);

      const secondFromChild = childBundle.get(CustomIdentifier);
      expect(secondFromChild).toBeInstanceOf(Descriptor);
      expect(secondFromChild).toBe(firstFromChild);
    });

    test('should not return a descriptor when deregistered and getting by name or custom identifier', () => {
      const name = parentBundle.register(Fixture, { name: CustomIdentifier });
      expect(parentBundle.deregister(Fixture)).toBe(true);

      const firstFromParent = parentBundle.get(name);
      expect(firstFromParent).toBeUndefined();

      const secondFromParent = parentBundle.get(CustomIdentifier);
      expect(secondFromParent).toBeUndefined();

      const firstFromChild = childBundle.get(name);
      expect(firstFromChild).toBeUndefined();

      const secondFromChild = childBundle.get(CustomIdentifier);
      expect(secondFromChild).toBeUndefined();
    });
  });
});
