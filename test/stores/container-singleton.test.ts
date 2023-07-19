import { beforeEach, describe, expect, test } from 'vitest';

import { getContainer, stashContainer } from '../../src/common/decorators.js';
import { Secrets } from '../../src/common/secrets.js';
import { FinalValueResolver } from '../../src/resolvers/final-value-resolver.js';
import { Bundle } from '../../src/stores/bundle.js';
import { Container } from '../../src/stores/container.js';

describe('container', () => {
  describe('singleton', () => {
    class Singleton {}
    Secrets.setSingleton(Singleton);

    const bundle = new Bundle('bundle');
    bundle.register(Singleton);

    let container: Container;

    beforeEach(() => {
      container = new Container(bundle);
    });

    test('should store container', () => {
      expect(getContainer(Singleton)).toBeUndefined();

      stashContainer(Singleton, container);
      expect(getContainer(Singleton)).toStrictEqual(container);

      // @ts-expect-error: TS2322, invalid argument type
      stashContainer(Singleton, undefined);
      expect(getContainer(Singleton)).toBeUndefined();
    });

    test('should always provide resolver and get the same instance', () => {
      const resolver = container.provide(Singleton.name);
      expect(resolver).toBeInstanceOf(FinalValueResolver);

      if (resolver) {
        const firstValue = resolver.get();
        expect(firstValue).toBeInstanceOf(Singleton);

        const secondValue = resolver.get();
        expect(secondValue).toBeInstanceOf(Singleton);
        expect(secondValue).toStrictEqual(firstValue);
      }
    });

    test('should always provide the same resolver', () => {
      const firstResolver = container.provide(Singleton.name);
      expect(firstResolver).toBeInstanceOf(FinalValueResolver);

      if (firstResolver) {
        const firstValue = firstResolver.get();
        expect(firstValue).toBeInstanceOf(Singleton);

        const secondResolver = container.provide(Singleton.name);
        expect(secondResolver).toBeInstanceOf(FinalValueResolver);
        expect(secondResolver).toBe(firstResolver);

        if (secondResolver) {
          const secondValue = secondResolver.get();
          expect(secondValue).toBeInstanceOf(Singleton);
          expect(secondValue).toBe(firstValue);
        }
      }
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

      if (firstResolver) {
        const firstValue = firstResolver.get();
        expect(firstValue).toBeInstanceOf(Singleton);

        container.discard(Singleton.name);

        const secondResolver = container.provide(Singleton.name);
        expect(secondResolver).toBeInstanceOf(FinalValueResolver);
        expect(secondResolver).toBe(firstResolver);

        if (secondResolver) {
          const secondValue = secondResolver.get();
          expect(secondValue).toBeInstanceOf(Singleton);
          expect(secondValue).toBe(firstValue);
        }
      }
    });
  });
});
