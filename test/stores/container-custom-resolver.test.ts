import { describe, expect, test } from 'vitest';

import { CustomProvider } from '../../src/providers/custom-provider.js';
import { ValueResolver } from '../../src/resolvers/value-resolver.js';
import { Bundle } from '../../src/stores/bundle.js';
import { Container } from '../../src/stores/container.js';

describe('container', () => {
  describe('custom resolver', () => {

    test('should resolve to the custom resolver value', () => {
      class Fixture {}
      class AnotherFixture {}

      const provider = new CustomProvider();

      const fixture = undefined;
      const resolver = new ValueResolver(() => fixture);
      provider.register(Fixture.name, resolver);

      const anotherFixture = 123;
      const anotherResolver = new ValueResolver(() => anotherFixture);
      provider.register(AnotherFixture.name, anotherResolver);

      const bundle = new Bundle('bundle');
      const container = new Container(bundle, provider);

      expect(container.provide(Fixture.name, true)).toBe(fixture);
      expect(container.provide(AnotherFixture.name, true)).toBe(anotherFixture);
    });

  });
});
