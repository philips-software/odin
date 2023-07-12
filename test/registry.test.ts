import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import Config from '../src/configuration/config.js';
import Registry from '../src/registry/registry.js';
import InjectableDef from '../src/registry/injectable-def.js';

const CustomName = 'CustomName';
const AnotherCustomName = 'AnotherCustomName';

class Fixture { }
class AnotherFixture { }

describe('registry', () => {
  let registry = null;

  beforeEach(() => {
    registry = new Registry();
  });

  test('should register class on its own', () => {
    registry.register(Fixture);

    expect(registry.has(Fixture.name)).toBe(true);
    expect(registry.has(AnotherFixture.name)).toBe(false);
  });

  test('should register class with a custom name', () => {
    registry.register(Fixture, { name: CustomName });

    expect(registry.has(Fixture.name)).toBe(true);
    expect(registry.has(AnotherFixture.name)).toBe(false);
    expect(registry.has(CustomName)).toBe(true);
    expect(registry.has(AnotherCustomName)).toBe(false);
  });

  test('should register class only once', () => {
    registry.register(Fixture);

    expect(registry.has(Fixture.name)).toBe(true);
    expect(registry.has(AnotherFixture.name)).toBe(false);
    expect(() => {
      registry.register(Fixture);
    }).toThrow(`[ODIN] There already is a injectable 'fixture' registered.`);
  });

  test('should register class again after deregister', () => {
    registry.register(Fixture);

    expect(registry.has(Fixture.name)).toBe(true);
    expect(registry.has(AnotherFixture.name)).toBe(false);

    expect(registry.deregister(Fixture)).toBe(true);
    expect(registry.has(Fixture.name)).toBe(false);

    expect(registry.register(Fixture)).toBe('fixture');
    expect(registry.has(Fixture.name)).toBe(true);
  });

  test('should not register different classes with the same custom name', () => {
    registry.register(Fixture, { name: CustomName });

    expect(() => {
      registry.register(AnotherFixture, { name: CustomName });
    }).toThrow(`[ODIN] There already is a injectable named '${CustomName}' registered.`);
  });

  test('should not register a class with the custom name of an already registered class', () => {
    registry.register(Fixture);

    expect(() => {
      registry.register(AnotherFixture, { name: Fixture.name });
    }).toThrow(`[ODIN] There already is a injectable '${Fixture.name}' registered.`);
  });

  test('should not register a class with the name of an already registered custom name', () => {
    registry.register(Fixture, { name: AnotherFixture.name });

    expect(() => {
      registry.register(AnotherFixture);
    }).toThrow(`[ODIN] There already is a injectable named '${AnotherFixture.name.toLowerCase()}' registered.`);
  });

  test('should deregister on its own', () => {
    registry.register(Fixture);

    expect(registry.has(Fixture.name)).toBe(true);
    expect(registry.has(AnotherFixture.name)).toBe(false);

    expect(registry.deregister(Fixture)).toBe(true);
    expect(registry.has(Fixture.name)).toBe(false);
    expect(registry.has(AnotherFixture.name)).toBe(false);

    expect(registry.deregister(AnotherFixture)).toBe(false);
    expect(registry.has(AnotherFixture.name)).toBe(false);
  });

  test('should deregister with a custom name', () => {
    registry.register(Fixture, { name: CustomName });

    expect(registry.has(Fixture.name)).toBe(true);
    expect(registry.has(AnotherFixture.name)).toBe(false);
    expect(registry.has(CustomName)).toBe(true);
    expect(registry.has(AnotherCustomName)).toBe(false);

    expect(registry.deregister(Fixture)).toBe(true);
    expect(registry.deregister(AnotherFixture)).toBe(false);

    expect(registry.has(Fixture.name)).toBe(false);
    expect(registry.has(AnotherFixture.name)).toBe(false);
    expect(registry.has(CustomName)).toBe(false);
    expect(registry.has(AnotherCustomName)).toBe(false);
  });

  test('should return an id upon register', () => {
    const fixtureId = registry.register(Fixture);
    expect(fixtureId).toBe(Fixture.name.toLowerCase());

    const anotherFixtureId = registry.register(AnotherFixture);
    expect(anotherFixtureId).toBe(AnotherFixture.name.toLowerCase());
  });

  test('should return null when trying to get an id without an id', () => {
    expect(registry.getId()).toBeNull();
  });

  test('should return an InjectableDef when registered', () => {
    const args = { something: 123 };
    const id = registry.register(Fixture, args);

    const def = registry.get(id);
    expect(def).toBeInstanceOf(InjectableDef);
    expect(def.id).toBe(Fixture.name.toLowerCase());
    expect(def.args).toBe(args);
    expect(def.definition).toBe(Fixture);
  });

  test(`should not return an InjectableDef when deregistered`, () => {
    const args = { something: 123 };
    const id = registry.register(Fixture, args);
    expect(registry.deregister(Fixture)).toBe(true);

    const def = registry.get(id);
    expect(def).toBeNull();
  });

  test('should return same InjectableDef when registered and getting by id or custom name', () => {
    const id = registry.register(Fixture, { name: CustomName });

    const firstDef = registry.get(id);
    expect(firstDef).toBeInstanceOf(InjectableDef);

    const secondDef = registry.get(CustomName);
    expect(secondDef).toBeInstanceOf(InjectableDef);
    expect(secondDef).toBe(firstDef);
  });

  test('should not return an InjectableDef when deregistered and getting by id or custom name', () => {
    const id = registry.register(Fixture, { name: CustomName });
    expect(registry.deregister(Fixture)).toBe(true);

    const firstDef = registry.get(id);
    expect(firstDef).toBeNull();

    const secondDef = registry.get(CustomName);
    expect(secondDef).toBeNull();
  });

  describe('strict', () => {
    let registry = null;

    beforeEach(() => {
      registry = new Registry();
      Config.setStrict(true);
    });

    afterEach(() => {
      Config.setStrict(false);
    });

    test('should differentiate the case to register class on its own', () => {
      const id = registry.register(Fixture);
      expect(id).toBe(Fixture.name);

      expect(registry.has(Fixture.name)).toBe(true);
      expect(registry.has(Fixture.name.toUpperCase())).toBe(false);

      expect(registry.has(AnotherFixture.name)).toBe(false);
      expect(registry.has(AnotherFixture.name.toUpperCase())).toBe(false);
    });

    test('should differentiate the case to register class with a custom name', () => {
      const id = registry.register(Fixture, { name: CustomName });
      expect(id).toBe(Fixture.name);

      expect(registry.has(Fixture.name)).toBe(true);
      expect(registry.has(Fixture.name.toUpperCase())).toBe(false);

      expect(registry.has(AnotherFixture.name)).toBe(false);
      expect(registry.has(AnotherFixture.name.toUpperCase())).toBe(false);

      expect(registry.has(CustomName)).toBe(true);
      expect(registry.has(CustomName.toUpperCase())).toBe(false);

      expect(registry.has(AnotherCustomName)).toBe(false);
      expect(registry.has(AnotherCustomName.toUpperCase())).toBe(false);
    });

    test('should differentiate the case to register different classes with the same custom name, but with different cases', () => {
      registry.register(Fixture, { name: CustomName });

      expect(() => {
        registry.register(AnotherFixture, { name: CustomName.toUpperCase() });
      }).not.toThrow();
    });

    test('should differentiate the case to not register a class with the name of an already registered custom name', () => {
      registry.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        registry.register(AnotherFixture);
      }).toThrow(`[ODIN] There already is a injectable named '${AnotherFixture.name}' registered.`);
    });
  });

  describe('not strict', () => {
    let registry = null;

    beforeEach(() => {
      registry = new Registry();
      Config.setStrict(false);
    });

    test('should ignore the case to register class on its own', () => {
      const id = registry.register(Fixture);
      expect(id).toBe(Fixture.name.toLowerCase());

      expect(registry.has(Fixture.name)).toBe(true);
      expect(registry.has(Fixture.name.toUpperCase())).toBe(true);

      expect(registry.has(AnotherFixture.name)).toBe(false);
      expect(registry.has(AnotherFixture.name.toUpperCase())).toBe(false);
    });

    test('should ignore the case to register class with a custom name', () => {
      const id = registry.register(Fixture, { name: CustomName });
      expect(id).toBe(Fixture.name.toLowerCase());

      expect(registry.has(Fixture.name)).toBe(true);
      expect(registry.has(Fixture.name.toUpperCase())).toBe(true);

      expect(registry.has(AnotherFixture.name)).toBe(false);
      expect(registry.has(AnotherFixture.name.toUpperCase())).toBe(false);

      expect(registry.has(CustomName)).toBe(true);
      expect(registry.has(CustomName.toUpperCase())).toBe(true);

      expect(registry.getId(CustomName)).toBe(id);
      expect(registry.getId(CustomName.toUpperCase())).toBe(id);

      expect(registry.has(AnotherCustomName)).toBe(false);
      expect(registry.has(AnotherCustomName.toUpperCase())).toBe(false);
    });

    test('should ignore the case to register different classes with the same custom name, but with different cases', () => {
      registry.register(Fixture, { name: CustomName });

      expect(() => {
        registry.register(AnotherFixture, { name: CustomName.toUpperCase() });
      }).toThrow(`[ODIN] There already is a injectable named '${CustomName.toUpperCase()}' registered.`);
    });

    test('should ignore the case to not register a class with the name of an already registered custom name', () => {
      registry.register(Fixture, { name: AnotherFixture.name });

      expect(() => {
        registry.register(AnotherFixture);
      }).toThrow(`[ODIN] There already is a injectable named '${AnotherFixture.name.toLowerCase()}' registered.`);
    });
  });
});
