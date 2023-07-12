import { beforeEach, describe, expect, test } from 'vitest';
import CustomProvider from '../src/container/custom-provider.js';

import Bundle from '../src/registry/bundle.js';
import Container, { getContainer, setContainer } from '../src/container/container.js';
import { FinalValueResolver, ValueResolver } from '../src/container/value-resolver.js';
import Secrets from '../src/container/secrets.js';

class Injectable {}

class Singleton {}
Secrets.setSingleton(Singleton);

class DiscardableSingleton {}
Secrets.setSingleton(DiscardableSingleton);
Secrets.setDiscardable(DiscardableSingleton);

describe('container', () => {
  const parent = new Bundle('parent');
  parent.register(Injectable);
  parent.register(Singleton);

  const child = new Bundle('child', parent);
  child.register(DiscardableSingleton);

  let container = null;

  beforeEach(() => {
    container = new Container(child);
  });

  test('should have no dependencies', () => {
    expect(container.has(Injectable.name)).toBe(false);
    expect(container.has(Injectable.name.toUpperCase())).toBe(false);

    expect(container.has(Singleton.name)).toBe(false);
    expect(container.has(Singleton.name.toUpperCase())).toBe(false);

    expect(container.has(DiscardableSingleton.name)).toBe(false);
    expect(container.has(DiscardableSingleton.name.toUpperCase())).toBe(false);
  });

  test('should return no resolvers', () => {
    expect(container.get(Injectable.name)).toBeNull();
    expect(container.get(Injectable.name.toUpperCase())).toBeNull();

    expect(container.get(Singleton.name)).toBeNull();
    expect(container.get(Singleton.name.toUpperCase())).toBeNull();

    expect(container.get(DiscardableSingleton.name)).toBeNull();
    expect(container.get(DiscardableSingleton.name.toUpperCase())).toBeNull();
  });

  test('should resolve to null if the custom resolver value is empty', () => {
    class Fixture { }

    const provider = new CustomProvider();
    const resolver = new ValueResolver(() => undefined);
    provider.register(Fixture.name, resolver);

    const container = new Container(child, provider);
    expect(container.provide(Fixture.name, true)).toBeNull();
  });

  test('should not throw error when discarding unknown identifier', () => {
    expect(() => {
      container.discard('unknown');
    }).not.toThrow();
  });

  describe('injectable', () => {

    test('should store container', () => {
      expect(getContainer(Injectable)).toBeUndefined();

      setContainer(Injectable, container);
      expect(getContainer(Injectable)).toStrictEqual(container);

      setContainer(Injectable, undefined);
      expect(getContainer(Injectable)).toBeUndefined();
    });

    test('should not cache instance', () => {
      const id = container.bundle.getId(Injectable.name);
      const injectable = container.bundle.get(id);
      const resolver = container.createValueResolver(injectable, id);

      expect(resolver.get()).toBeNull();
    });

    test('should provide FinalValueResolver', () => {
      const resolver = container.provide(Injectable.name);
      expect(resolver).toBeInstanceOf(FinalValueResolver);

      const firstValue = resolver.get();
      expect(firstValue).toBeInstanceOf(Injectable);

      const secondValue = resolver.get();
      expect(secondValue).toBe(firstValue);
    });

    test('should provide different instances of FinalValueResolver', () => {
      const firstResolver = container.provide(Injectable.name);
      expect(firstResolver).toBeInstanceOf(FinalValueResolver);

      const firstValue = firstResolver.get();
      expect(firstValue).toBeInstanceOf(Injectable);

      const secondResolver = container.provide(Injectable.name.toUpperCase());
      expect(secondResolver).toBeInstanceOf(FinalValueResolver);
      expect(secondResolver).not.toBe(firstResolver);

      const secondValue = secondResolver.get();
      expect(secondValue).toBeInstanceOf(Injectable);
      expect(secondValue).not.toBe(firstValue);
    });

    test('should return null even after provide', () => {
      let resolver = container.provide(Injectable.name);
      expect(resolver).toBeInstanceOf(FinalValueResolver);

      resolver = container.get(Injectable.name);
      expect(resolver).toBeNull();
    });

  });

  describe('singleton', () => {

    test('should store container', () => {
      expect(getContainer(Singleton)).toBeUndefined();

      setContainer(Singleton, container);
      expect(getContainer(Singleton)).toStrictEqual(container);

      setContainer(Singleton, undefined);
      expect(getContainer(Singleton)).toBeUndefined();
    });

    test('should cache instance', () => {
      const id = container.bundle.getId(Singleton.name);
      const injectable = container.bundle.get(id);
      const resolver = container.createValueResolver(injectable, id);

      expect(resolver.get()).toBeInstanceOf(Singleton);
    });

    test('should always provide resolver and get the same instance', () => {
      const resolver = container.provide(Singleton.name);
      expect(resolver).toBeInstanceOf(FinalValueResolver);

      const firstValue = resolver.get();
      expect(firstValue).toBeInstanceOf(Singleton);

      const secondValue = resolver.get();
      expect(secondValue).toBeInstanceOf(Singleton);
      expect(secondValue).toStrictEqual(firstValue);
    });

    test('should always provide the same resolver', () => {
      const firstResolver = container.provide(Singleton.name);
      expect(firstResolver).toBeInstanceOf(FinalValueResolver);

      const firstValue = firstResolver.get();
      expect(firstValue).toBeInstanceOf(Singleton);

      const secondResolver = container.provide(Singleton.name);
      expect(secondResolver).toBeInstanceOf(FinalValueResolver);
      expect(secondResolver).toBe(firstResolver);

      const secondValue = secondResolver.get();
      expect(secondValue).toBeInstanceOf(Singleton);
      expect(secondValue).toBe(firstValue);
    });

    test('should always resolve to the same instance', () => {
      const firstValue = container.provide(Singleton.name, true);
      expect(firstValue).toBeInstanceOf(Singleton);

      const secondValue = container.provide(Singleton.name, true);
      expect(secondValue).toBeInstanceOf(Singleton);
      expect(secondValue).toStrictEqual(firstValue);
    });

    test('should keep resolver and instance when discarding', () => {
      const firstResolver = container.provide(Singleton.name);
      expect(firstResolver).toBeInstanceOf(FinalValueResolver);

      const firstValue = firstResolver.get();
      expect(firstValue).toBeInstanceOf(Singleton);

      container.discard(Singleton.name);

      const secondResolver = container.provide(Singleton.name);
      expect(secondResolver).toBeInstanceOf(FinalValueResolver);
      expect(secondResolver).toBe(firstResolver);

      const secondValue = secondResolver.get();
      expect(secondValue).toBeInstanceOf(Singleton);
      expect(secondValue).toBe(firstValue);
    });

  });

  describe('discardable', () => {

    test('should store container', () => {
      expect(getContainer(DiscardableSingleton)).toBeUndefined();

      setContainer(DiscardableSingleton, container);
      expect(getContainer(DiscardableSingleton)).toStrictEqual(container);

      setContainer(DiscardableSingleton, undefined);
      expect(getContainer(DiscardableSingleton)).toBeUndefined();
    });

    test('should cache instance', () => {
      const id = container.bundle.getId(DiscardableSingleton.name);
      const injectable = container.bundle.get(id);
      const resolver = container.createValueResolver(injectable, id);

      expect(resolver.get()).toBeInstanceOf(DiscardableSingleton);
    });

    test('should not keep resolver and instance when discarding', () => {
      const firstResolver = container.provide(DiscardableSingleton.name);
      expect(firstResolver).toBeInstanceOf(ValueResolver);

      const firstValue = firstResolver.get();
      expect(firstValue).toBeInstanceOf(DiscardableSingleton);

      container.discard(DiscardableSingleton.name);

      const secondResolver = container.provide(DiscardableSingleton.name);
      expect(secondResolver).toBeInstanceOf(ValueResolver);
      expect(secondResolver).toBe(firstResolver);

      const secondValue = secondResolver.get();
      expect(secondValue).toBeInstanceOf(DiscardableSingleton);
      expect(secondValue).not.toBe(firstValue);
    });

  });
});
