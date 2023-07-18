import { beforeEach, describe, expect, test } from 'vitest';

import { getContainer, stashContainer } from '../../src/common/decorators.js';
import { FinalValueResolver } from '../../src/resolvers/final-value-resolver.js';
import { Bundle } from '../../src/stores/bundle.js';
import { Container } from '../../src/stores/container.js';

describe('container', () => {
  describe('injectable', () => {
    class Injectable {}

    const bundle = new Bundle('bundle');
    bundle.register(Injectable);

    let container: Container;

    beforeEach(() => {
      container = new Container(bundle);
    });

    test('should store container', () => {
      expect(getContainer(Injectable)).toBeUndefined();

      stashContainer(Injectable, container);
      expect(getContainer(Injectable)).toStrictEqual(container);

      // @ts-expect-error: undefined is not allowed
      stashContainer(Injectable, undefined);
      expect(getContainer(Injectable)).toBeUndefined();
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

      const secondResolver = container.provide(Injectable.name);
      expect(secondResolver).toBeInstanceOf(FinalValueResolver);
      expect(secondResolver).not.toBe(firstResolver);

      const secondValue = secondResolver.get();
      expect(secondValue).toBeInstanceOf(Injectable);
      expect(secondValue).not.toBe(firstValue);
    });

    test('should return undefined even after provide', () => {
      const resolverFromProvide = container.provide(Injectable.name);
      expect(resolverFromProvide).toBeInstanceOf(FinalValueResolver);

      const resolverFromGet = container.get(Injectable.name);
      expect(resolverFromGet).toBeUndefined();
    });

  });
});
