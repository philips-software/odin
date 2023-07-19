import { beforeEach, describe, expect, test } from 'vitest';

import { getContainer, stashContainer } from '../../src/common/decorators.js';
import { Secrets } from '../../src/common/secrets.js';
import { ValueResolver } from '../../src/resolvers/value-resolver.js';
import { Bundle } from '../../src/stores/bundle.js';
import { Container } from '../../src/stores/container.js';

describe('container', () => {
  describe('discardable', () => {
    class DiscardableSingleton {}
    Secrets.setSingleton(DiscardableSingleton);
    Secrets.setDiscardable(DiscardableSingleton);

    const bundle = new Bundle('bundle');
    bundle.register(DiscardableSingleton);

    let container: Container;

    beforeEach(() => {
      container = new Container(bundle);
    });

    test('should store container', () => {
      const instance = new DiscardableSingleton();
      expect(getContainer(instance)).toBeUndefined();

      stashContainer(instance, container);
      expect(getContainer(instance)).toStrictEqual(container);

      // @ts-expect-error: TS2322, invalid argument type
      stashContainer(instance, undefined);
      expect(getContainer(instance)).toBeUndefined();
    });

    test('should not keep resolver and instance when discarding', () => {
      const firstResolver = container.provide(DiscardableSingleton.name);
      expect(firstResolver).toBeInstanceOf(ValueResolver);

      if (firstResolver) {
        const firstValue = firstResolver.get();
        expect(firstValue).toBeInstanceOf(DiscardableSingleton);

        container.discard(DiscardableSingleton.name);

        const secondResolver = container.provide(DiscardableSingleton.name);
        expect(secondResolver).toBeInstanceOf(ValueResolver);
        expect(secondResolver).toBe(firstResolver);

        if (secondResolver) {
          const secondValue = secondResolver.get();
          expect(secondValue).toBeInstanceOf(DiscardableSingleton);
          expect(secondValue).not.toBe(firstValue);
        }
      }
    });
  });
});
