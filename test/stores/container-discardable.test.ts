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
      expect(getContainer(DiscardableSingleton)).toBeUndefined();

      stashContainer(DiscardableSingleton, container);
      expect(getContainer(DiscardableSingleton)).toStrictEqual(container);

      // @ts-expect-error: undefined is not allowed
      stashContainer(DiscardableSingleton, undefined);
      expect(getContainer(DiscardableSingleton)).toBeUndefined();
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
