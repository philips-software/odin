import { describe, expect, test } from 'vitest';

import { Secrets } from '../../src/common/secrets.js';
import { Injectable } from '../../src/index.js';

describe('secrets', () => {
  describe('getters/setters', () => {

    test('discardable', () => {
      class Fixture {}
      expect(Secrets.isDiscardable(Fixture)).toBe(false);

      Secrets.setDiscardable(Fixture);
      expect(Secrets.isDiscardable(Fixture)).toBe(true);
    });

    test('eager', () => {
      class Fixture {}
      expect(Secrets.getEagers(Fixture)).toStrictEqual([]);

      const eagers = ['a', 'b'];
      Secrets.setEager(Fixture, eagers[0]);
      Secrets.setEager(Fixture, eagers[1]);

      expect(Secrets.getEagers(Fixture)).toStrictEqual(eagers);
    });

    test('initializer', () => {
      class Fixture {}
      expect(Secrets.getInitializer(Fixture)).toBeUndefined();

      const name = 'test';
      Secrets.setInitializer(Fixture, name);
      expect(Secrets.getInitializer(Fixture)).toBe(name);
    });

    test('singleton', () => {
      class Fixture {}
      expect(Secrets.isSingleton(Fixture)).toBe(false);

      Secrets.setSingleton(Fixture);
      expect(Secrets.isSingleton(Fixture)).toBe(true);
    });
  });

  describe('decorators', () => {

    test('should be set correctly for an injectable', () => {
      @Injectable
      class InjectableFixture {}

      expect(Secrets.isSingleton(InjectableFixture)).toBe(false);
      expect(Secrets.isDiscardable(InjectableFixture)).toBe(false);
    });

    test('should be set correctly for a singleton', () => {
      @Injectable({ singleton: true })
      class SingletonFixture {}

      expect(Secrets.isSingleton(SingletonFixture)).toBe(true);
      expect(Secrets.isDiscardable(SingletonFixture)).toBe(false);
    });

    test('should be set correctly for a discardable', () => {
      @Injectable({ singleton: true })
      class DiscardableSingletonFixture {}
      Secrets.setDiscardable(DiscardableSingletonFixture);

      expect(Secrets.isSingleton(DiscardableSingletonFixture)).toBe(true);
      expect(Secrets.isDiscardable(DiscardableSingletonFixture)).toBe(true);
    });

  });

});
