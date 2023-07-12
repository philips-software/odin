import { describe, expect, test } from 'vitest';

import Secrets from '../src/container/secrets.js';

import { InjectableFixture } from './fixtures/injectable.js';
import { DiscardableSingletonFixture, SingletonFixture } from './fixtures/singleton.js';

describe('secrets', () => {
  describe('getters/setters', () => {

    test('custom', () => {
      class Fixture { }
      expect(Secrets.isCustom(Fixture)).toBe(false);

      Secrets.setCustom(Fixture);
      expect(Secrets.isCustom(Fixture)).toBe(true);
    });

    test('discardable', () => {
      class Fixture { }
      expect(Secrets.isDiscardable(Fixture)).toBe(false);

      Secrets.setDiscardable(Fixture);
      expect(Secrets.isDiscardable(Fixture)).toBe(true);
    });

    test('eager', () => {
      class Fixture { }
      expect(Secrets.getEagers(Fixture)).toStrictEqual([]);

      const eagers = ['a', 'b'];
      Secrets.setEager(Fixture, eagers[0]);
      Secrets.setEager(Fixture, eagers[1]);

      expect(Secrets.getEagers(Fixture)).toStrictEqual(eagers);
    });

    test('named', () => {
      class Fixture { }
      expect(Secrets.isNamed(Fixture)).toBe(false);
      expect(Secrets.getNamed(Fixture)).toBeUndefined();

      const name = 'test';
      Secrets.setNamed(Fixture, name);
      expect(Secrets.isNamed(Fixture)).toBe(true);
      expect(Secrets.getNamed(Fixture)).toStrictEqual(name);
    });

    test('post construct', () => {
      class Fixture { }
      expect(Secrets.getPostContruct(Fixture)).toBeUndefined();

      const name = 'test';
      Secrets.setPostContruct(Fixture, name);
      expect(Secrets.getPostContruct(Fixture)).toBe(name);
    });

    test('singleton', () => {
      class Fixture { }
      expect(Secrets.isSingleton(Fixture)).toBe(false);

      Secrets.setSingleton(Fixture);
      expect(Secrets.isSingleton(Fixture)).toBe(true);
    });

    test('wrapper', () => {
      class Fixture { }
      // @ts-expect-error
      expect(Secrets.isWrapper()).toBe(false);
      expect(Secrets.isWrapper(Fixture)).toBe(false);
      expect(Secrets.getWrapper(Fixture)).toBeUndefined();

      const wrapper = { something: 123 };
      Secrets.setWrapper(Fixture, wrapper);
      expect(Secrets.isWrapper(Fixture)).toBe(true);
      expect(Secrets.getWrapper(Fixture)).toStrictEqual(wrapper);
    });
  });

  describe('decorators', () => {

    test('should be set correctly for an @Injectable', () => {
      expect(Secrets.isCustom(InjectableFixture)).toBe(false);
      expect(Secrets.isSingleton(InjectableFixture)).toBe(false);
      expect(Secrets.isDiscardable(InjectableFixture)).toBe(false);
    });

    test('should be set correctly for a @Singleton', () => {
      expect(Secrets.isCustom(SingletonFixture)).toBe(false);
      expect(Secrets.isSingleton(SingletonFixture)).toBe(true);
      expect(Secrets.isDiscardable(SingletonFixture)).toBe(false);
    });

    test('should be set correctly for a discardable @Singleton', () => {
      expect(Secrets.isCustom(DiscardableSingletonFixture)).toBe(false);
      expect(Secrets.isSingleton(DiscardableSingletonFixture)).toBe(true);
      expect(Secrets.isDiscardable(DiscardableSingletonFixture)).toBe(true);
    });
  });
});
