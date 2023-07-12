import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import Config from '../src/configuration/config.js';

import Bundle from '../src/registry/bundle.js';
import Inject from '../src/container/decorators/inject.js';
import InjectableDef from '../src/registry/injectable-def.js';

const CustomName = 'CustomName';
const AnotherCustomName = 'AnotherCustomName';

class Fixture { }
class AnotherFixture { }

describe('bundle', () => {
  describe('creation', () => {

    test('should set id and parent', () => {
      const id = 'id';
      const parent = new Bundle('parent');
      const bundle = parent.child(id);

      expect(bundle).toBeInstanceOf(Bundle);
      expect(bundle.id).toBe(id);
      expect(bundle.parent).toBe(parent);
    });

    test('should throw error when creating a new bundle without an id', () => {
      expect(() => {
        new Bundle();
      }).toThrow(`[ODIN] Invalid bundle id 'undefined'.`);
    });

    test('should throw error when creating a child bundle without an id', () => {
      const bundle = new Bundle('id');

      expect(() => {
        bundle.child();
      }).toThrow(`[ODIN] The value 'undefined' is not valid as bundle id.`);
    });

  });

  describe('single level', () => {
    let bundle = null;

    beforeEach(() => {
      bundle = new Bundle('single');
    });

    test('should register class on its own', () => {
      bundle.register(Fixture);

      expect(bundle.has(Fixture.name)).toBe(true);
      expect(bundle.has(AnotherFixture.name)).toBe(false);
    });

    test('should register class with a custom name', () => {
      bundle.register(Fixture, { name: CustomName });

      expect(bundle.has(Fixture.name)).toBe(true);
      expect(bundle.has(AnotherFixture.name)).toBe(false);
      expect(bundle.has(CustomName)).toBe(true);
      expect(bundle.has(AnotherCustomName)).toBe(false);
    });

    test('should register class only once', () => {
      bundle.register(Fixture);

      expect(bundle.has(Fixture.name)).toBe(true);
      expect(bundle.has(AnotherFixture.name)).toBe(false);
      expect(() => {
        bundle.register(Fixture);
      }).toThrow(`[ODIN] There already is a injectable 'fixture' registered.`);
    });

    test('should register class again after deregister', () => {
      bundle.register(Fixture);

      expect(bundle.has(Fixture.name)).toBe(true);
      expect(bundle.has(AnotherFixture.name)).toBe(false);

      expect(bundle.deregister(Fixture)).toBe(true);
      expect(bundle.has(Fixture.name)).toBe(false);

      expect(bundle.register(Fixture)).toBe('fixture');
      expect(bundle.has(Fixture.name)).toBe(true);
    });

    test('should not register different classes with the same custom name', () => {
      bundle.register(Fixture, { name: CustomName });

      expect(() => {
        bundle.register(AnotherFixture, { name: CustomName });
      }).toThrow(`[ODIN] There already is a injectable named '${CustomName}' registered.`);
    });

    test('should not register a class with the custom name of an already registered class', () => {
      bundle.register(Fixture);

      expect(() => {
        bundle.register(AnotherFixture, { name: Fixture.name });
      }).toThrow(`[ODIN] There already is a injectable '${Fixture.name}' registered.`);
    });

    test('should not register a class with the name of an already registered custom name', () => {
      bundle.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        bundle.register(AnotherFixture);
      }).toThrow(`[ODIN] There already is a injectable named '${AnotherFixture.name.toLowerCase()}' registered.`);
    });

    test('should deregister on its own', () => {
      bundle.register(Fixture);

      expect(bundle.has(Fixture.name)).toBe(true);
      expect(bundle.has(AnotherFixture.name)).toBe(false);

      expect(bundle.deregister(Fixture)).toBe(true);
      expect(bundle.has(Fixture.name)).toBe(false);
      expect(bundle.has(AnotherFixture.name)).toBe(false);

      expect(bundle.deregister(AnotherFixture)).toBe(false);
      expect(bundle.has(AnotherFixture.name)).toBe(false);
    });

    test('should deregister with a custom name', () => {
      bundle.register(Fixture, { name: CustomName });

      expect(bundle.has(Fixture.name)).toBe(true);
      expect(bundle.has(AnotherFixture.name)).toBe(false);
      expect(bundle.has(CustomName)).toBe(true);
      expect(bundle.has(AnotherCustomName)).toBe(false);

      expect(bundle.deregister(Fixture)).toBe(true);
      expect(bundle.deregister(AnotherFixture)).toBe(false);

      expect(bundle.has(Fixture.name)).toBe(false);
      expect(bundle.has(AnotherFixture.name)).toBe(false);
      expect(bundle.has(CustomName)).toBe(false);
      expect(bundle.has(AnotherCustomName)).toBe(false);
    });

    test('should return an id upon register', () => {
      const fixtureId = bundle.register(Fixture);
      expect(fixtureId).toBe(Fixture.name.toLowerCase());

      const anotherFixtureId = bundle.register(AnotherFixture);
      expect(anotherFixtureId).toBe(AnotherFixture.name.toLowerCase());
    });

    test('should return an InjectableDef when registered', () => {
      const args = { something: 123 };
      const id = bundle.register(Fixture, args);

      const def = bundle.get(id);
      expect(def).toBeInstanceOf(InjectableDef);
      expect(def.id).toBe(Fixture.name.toLowerCase());
      expect(def.args).toBe(args);
      expect(def.definition).toBe(Fixture);
    });

    test(`should not return an InjectableDef when deregistered`, () => {
      const args = { something: 123 };
      const id = bundle.register(Fixture, args);
      expect(bundle.deregister(Fixture)).toBe(true);

      const def = bundle.get(id);
      expect(def).toBeNull();
    });

    test('should return same InjectableDef when registered and getting by id or custom name', () => {
      const id = bundle.register(Fixture, { name: CustomName });

      const firstDef = bundle.get(id);
      expect(firstDef).toBeInstanceOf(InjectableDef);

      const secondDef = bundle.get(CustomName);
      expect(secondDef).toBeInstanceOf(InjectableDef);
      expect(secondDef).toBe(firstDef);
    });

    test('should not return an InjectableDef when deregistered and getting by id or custom name', () => {
      const id = bundle.register(Fixture, { name: CustomName });
      expect(bundle.deregister(Fixture)).toBe(true);

      const firstDef = bundle.get(id);
      expect(firstDef).toBeNull();

      const secondDef = bundle.get(CustomName);
      expect(secondDef).toBeNull();
    });

    test('should receive args in the constructor', () => {
      class FixtureWithArgs {
        args: any;
        constructor(args) {
          this.args = args;
        }
      }

      const args = { something: 123 };
      const id = bundle.register(FixtureWithArgs, args);

      const def = bundle.get(id);
      const instance = bundle.instantiate(def);

      expect(instance).toBeInstanceOf(FixtureWithArgs);
      expect(instance.args).toStrictEqual(args);
    });

    test('should not be able to @Inject because there is no container', () => {
      class FixtureWithInject {
        @Inject
        fixture;
      }

      const id = bundle.register(FixtureWithInject);
      const def = bundle.get(id);
      const instance = bundle.instantiate(def);

      expect(() => {
        instance.fixture;
      }).toThrow(`[ODIN] There is no container at 'FixtureWithInject'.`);
    });

    describe('strict', () => {
      let bundle = null;

      beforeEach(() => {
        bundle = new Bundle('single');
        Config.setStrict(true);
      });

      afterEach(() => {
        Config.setStrict(false);
      });

      test('should differentiate the case to register class on its own', () => {
        const id = bundle.register(Fixture);
        expect(id).toBe(Fixture.name);

        expect(bundle.getId(id)).toBe(id);

        expect(bundle.has(Fixture.name)).toBe(true);
        expect(bundle.has(Fixture.name.toUpperCase())).toBe(false);

        expect(bundle.has(AnotherFixture.name)).toBe(false);
        expect(bundle.has(AnotherFixture.name.toUpperCase())).toBe(false);
      });

      test('should differentiate the case to register class with a custom name', () => {
        const id = bundle.register(Fixture, { name: CustomName });
        expect(id).toBe(Fixture.name);

        expect(bundle.getId(id)).toBe(id);

        expect(bundle.has(Fixture.name)).toBe(true);
        expect(bundle.has(Fixture.name.toUpperCase())).toBe(false);

        expect(bundle.has(AnotherFixture.name)).toBe(false);
        expect(bundle.has(AnotherFixture.name.toUpperCase())).toBe(false);

        expect(bundle.has(CustomName)).toBe(true);
        expect(bundle.has(CustomName.toUpperCase())).toBe(false);

        expect(bundle.has(AnotherCustomName)).toBe(false);
        expect(bundle.has(AnotherCustomName.toUpperCase())).toBe(false);
      });

      test('should differentiate the case to register different classes with the same custom name, but with different cases', () => {
        bundle.register(Fixture, { name: CustomName });

        expect(() => {
          bundle.register(AnotherFixture, { name: CustomName.toUpperCase() });
        }).not.toThrow();
      });

      test('should differentiate the case to not register a class with the name of an already registered custom name', () => {
        bundle.register(Fixture, { name: AnotherFixture.name });

        expect(() => {
          bundle.register(AnotherFixture);
        }).toThrow(`[ODIN] There already is a injectable named '${AnotherFixture.name}' registered.`);
      });
    });

    describe('not strict', () => {
      let bundle = null;

      beforeEach(() => {
        bundle = new Bundle('single');
        Config.setStrict(false);
      });

      test('should ignore the case to register class on its own', () => {
        const id = bundle.register(Fixture);
        expect(id).toBe(Fixture.name.toLowerCase());

        expect(bundle.getId(id)).toBe(id);

        expect(bundle.has(Fixture.name)).toBe(true);
        expect(bundle.has(Fixture.name.toUpperCase())).toBe(true);

        expect(bundle.has(AnotherFixture.name)).toBe(false);
        expect(bundle.has(AnotherFixture.name.toUpperCase())).toBe(false);
      });

      test('should ignore the case to register class with a custom name', () => {
        const id = bundle.register(Fixture, { name: CustomName });
        expect(id).toBe(Fixture.name.toLowerCase());

        expect(bundle.getId(id)).toBe(id);

        expect(bundle.has(Fixture.name)).toBe(true);
        expect(bundle.has(Fixture.name.toUpperCase())).toBe(true);

        expect(bundle.has(AnotherFixture.name)).toBe(false);
        expect(bundle.has(AnotherFixture.name.toUpperCase())).toBe(false);

        expect(bundle.has(CustomName)).toBe(true);
        expect(bundle.has(CustomName.toUpperCase())).toBe(true);

        expect(bundle.has(AnotherCustomName)).toBe(false);
        expect(bundle.has(AnotherCustomName.toUpperCase())).toBe(false);
      });

      test('should ignore the case to register different classes with the same custom name, but with different cases', () => {
        bundle.register(Fixture, { name: CustomName });

        expect(() => {
          bundle.register(AnotherFixture, { name: CustomName.toUpperCase() });
        }).toThrow(`[ODIN] There already is a injectable named '${CustomName.toUpperCase()}' registered.`);
      });

      test('should ignore the case to not register a class with the name of an already registered custom name', () => {
        bundle.register(Fixture, { name: AnotherFixture.name });

        expect(() => {
          bundle.register(AnotherFixture);
        }).toThrow(`[ODIN] There already is a injectable named '${AnotherFixture.name.toLowerCase()}' registered.`);
      });
    });
  });

  describe('multi level', () => {
    let parentBundle = null;
    let childBundle = null;

    beforeEach(() => {
      parentBundle = new Bundle('parent');
      childBundle = parentBundle.child('child');
    });

    test('should both be related', () => {
      console.log(parentBundle.children);
      expect(parentBundle.hasChild(childBundle.id)).toBe(true);
      expect(childBundle.parent).toBe(parentBundle);
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
      parentBundle.register(Fixture, { name: CustomName });

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(parentBundle.deregister(Fixture)).toBe(true);
      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(false);

      expect(childBundle.register(Fixture, { name: CustomName })).toBe(Fixture.name.toLowerCase());
      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(true);
    });

    test('should register by the child a class with same custom name of a class that was already deregistered by the parent', () => {
      parentBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(parentBundle.deregister(Fixture)).toBe(true);
      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(childBundle.has(Fixture.name)).toBe(false);

      expect(childBundle.register(AnotherFixture, { name: Fixture.name })).toBe(AnotherFixture.name.toLowerCase());

      expect(childBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(AnotherFixture)).toBe(true);

      expect(parentBundle.has(Fixture.name)).toBe(false);
      expect(parentBundle.has(AnotherFixture)).toBe(false);
    });

    test('should not register by the child when already registered by the parent', () => {
      parentBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(() => {
        childBundle.register(Fixture);
      }).toThrow(`[ODIN] There already is a injectable '${Fixture.name.toLowerCase()}' registered.`);
    });

    test('should not register by the child when already registered by the parent with a different name', () => {
      parentBundle.register(Fixture, { name: CustomName });

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(() => {
        childBundle.register(Fixture);
      }).toThrow(`[ODIN] There already is a injectable '${Fixture.name.toLowerCase()}' registered.`);
    });

    test('should not register by the child with a different name when already registered by the parent', () => {
      parentBundle.register(Fixture);

      expect(parentBundle.has(Fixture.name)).toBe(true);
      expect(childBundle.has(Fixture.name)).toBe(true);

      expect(() => {
        childBundle.register(Fixture, { name: CustomName });
      }).toThrow(`[ODIN] There already is a injectable '${Fixture.name.toLowerCase()}' registered.`);
    });

    test('should not register different classes with the same custom name in the same level', () => {
      parentBundle.register(Fixture, { name: CustomName });

      expect(() => {
        parentBundle.register(AnotherFixture, { name: CustomName });
      }).toThrow(`[ODIN] There already is a injectable named '${CustomName}' registered.`);
    });

    test('should not register different classes with the same custom name in different levels', () => {
      parentBundle.register(Fixture, { name: CustomName });

      expect(() => {
        childBundle.register(AnotherFixture, { name: CustomName });
      }).toThrow(`[ODIN] There already is a injectable named '${CustomName}' registered.`);
    });

    test('should not register a class with the custom name of an already registered class in the same level', () => {
      parentBundle.register(Fixture);

      expect(() => {
        parentBundle.register(AnotherFixture, { name: Fixture.name });
      }).toThrow(`[ODIN] There already is a injectable '${Fixture.name}' registered.`);
    });

    test('should not register a class with the custom name of an already registered class in different levels', () => {
      parentBundle.register(Fixture);

      expect(() => {
        childBundle.register(AnotherFixture, { name: Fixture.name });
      }).toThrow(`[ODIN] There already is a injectable '${Fixture.name}' registered.`);
    });

    test('should not register a class with the name of an already registered custom name in the same level', () => {
      parentBundle.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        parentBundle.register(AnotherFixture);
      }).toThrow(`[ODIN] There already is a injectable named '${AnotherFixture.name.toLowerCase()}' registered.`);
    });

    test('should not register a class with the name of an already registered custom name in different levels', () => {
      parentBundle.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        childBundle.register(AnotherFixture);
      }).toThrow(`[ODIN] There already is a injectable named '${AnotherFixture.name.toLowerCase()}' registered.`);
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

    test('should return an InjectableDef when registered', () => {
      const args = { something: 123 };
      const id = parentBundle.register(Fixture, args);

      const fromParent = parentBundle.get(id);
      expect(fromParent).toBeInstanceOf(InjectableDef);
      expect(fromParent.id).toBe(Fixture.name.toLowerCase());
      expect(fromParent.args).toBe(args);
      expect(fromParent.definition).toBe(Fixture);

      const fromChild = childBundle.get(id);
      expect(fromChild).toBeInstanceOf(InjectableDef);
      expect(fromChild.id).toBe(Fixture.name.toLowerCase());
      expect(fromChild.args).toBe(args);
      expect(fromChild.definition).toBe(Fixture);
    });

    test(`should not return an InjectableDef when deregistered`, () => {
      const args = { something: 123 };
      const id = parentBundle.register(Fixture, args);
      expect(parentBundle.deregister(Fixture)).toBe(true);

      const fromParent = parentBundle.get(id);
      expect(fromParent).toBeNull();

      const fromChild = childBundle.get(id);
      expect(fromChild).toBeNull();
    });

    test('should return same InjectableDef when registered and getting by id or custom name', () => {
      const id = parentBundle.register(Fixture, { name: CustomName });

      const firstFromParent = parentBundle.get(id);
      expect(firstFromParent).toBeInstanceOf(InjectableDef);

      const secondFromParent = parentBundle.get(CustomName);
      expect(secondFromParent).toBeInstanceOf(InjectableDef);
      expect(secondFromParent).toBe(firstFromParent);

      const firstFromChild = childBundle.get(id);
      expect(firstFromChild).toBeInstanceOf(InjectableDef);

      const secondFromChild = childBundle.get(CustomName);
      expect(secondFromChild).toBeInstanceOf(InjectableDef);
      expect(secondFromChild).toBe(firstFromChild);
    });

    test('should not return an InjectableDef when deregistered and getting by id or custom name', () => {
      const id = parentBundle.register(Fixture, { name: CustomName });
      expect(parentBundle.deregister(Fixture)).toBe(true);

      const firstFromParent = parentBundle.get(id);
      expect(firstFromParent).toBeNull();

      const secondFromParent = parentBundle.get(CustomName);
      expect(secondFromParent).toBeNull();

      const firstFromChild = childBundle.get(id);
      expect(firstFromChild).toBeNull();

      const secondFromChild = childBundle.get(CustomName);
      expect(secondFromChild).toBeNull();
    });

    test('should get the right id from any level', () => {
      const parentId = parentBundle.register(Fixture, { name: CustomName });
      expect(parentId).toBe(Fixture.name.toLowerCase());

      expect(parentBundle.getId(Fixture.name)).toBe(parentId);
      expect(childBundle.getId(Fixture.name)).toBe(parentId);

      expect(parentBundle.getId(CustomName)).toBe(parentId);
      expect(childBundle.getId(CustomName)).toBe(parentId);

      const childId = childBundle.register(AnotherFixture, { name: AnotherCustomName });
      expect(childId).toBe(AnotherFixture.name.toLowerCase());

      expect(parentBundle.getId(AnotherFixture.name)).toBe(AnotherFixture.name.toLowerCase());
      expect(childBundle.getId(AnotherFixture.name)).toBe(childId);

      expect(parentBundle.getId(AnotherCustomName)).toBe(AnotherCustomName.toLowerCase());
      expect(childBundle.getId(AnotherCustomName)).toBe(childId);
    });

    test('should not get the id after deregister', () => {
      parentBundle.register(Fixture, { name: CustomName });
      expect(parentBundle.deregister(Fixture)).toBe(true);

      expect(parentBundle.getId(Fixture.name)).toBe(Fixture.name.toLowerCase());
      expect(childBundle.getId(Fixture.name)).toBe(Fixture.name.toLowerCase());

      expect(parentBundle.getId(CustomName)).toBe(CustomName.toLowerCase());
      expect(childBundle.getId(CustomName)).toBe(CustomName.toLowerCase());

      childBundle.register(AnotherFixture, { name: AnotherCustomName });
      expect(childBundle.deregister(AnotherFixture)).toBe(true);

      expect(parentBundle.getId(AnotherFixture.name)).toBe(AnotherFixture.name.toLowerCase());
      expect(childBundle.getId(AnotherFixture.name)).toBe(AnotherFixture.name.toLowerCase());

      expect(parentBundle.getId(AnotherCustomName)).toBe(AnotherCustomName.toLowerCase());
      expect(childBundle.getId(AnotherCustomName)).toBe(AnotherCustomName.toLowerCase());
    });
  });
});
