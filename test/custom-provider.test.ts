import { describe, expect, test } from 'vitest';

import Bundle from '../src/registry/bundle.js';
import Container from '../src/container/container.js';
import CustomProvider from '../src/container/custom-provider.js';
import { ValueResolver } from '../src/container/value-resolver.js';

describe('custom-provider', function() {

  const fixture = 1;

  test('should register', () => {
    class Fixture { }

    const provider = new CustomProvider();
    const resolver = new ValueResolver(() => fixture);
    provider.register(Fixture.name, resolver);

    expect(provider.has(Fixture.name));
  });

  test('should register with a resolver that extends ValueResolver', () => {
    class Fixture { }
    class Resolver extends ValueResolver {}

    const provider = new CustomProvider();
    const resolver = new Resolver(() => fixture);
    provider.register(Fixture.name, resolver);

    expect(provider.has(Fixture.name));
  });

  test('should not register more than once', () => {
    class Fixture { }

    const provider = new CustomProvider();
    const resolver = new ValueResolver(() => fixture);
    provider.register(Fixture.name, resolver);

    expect(() => {
      provider.register(Fixture.name, resolver);
    }).toThrow(`[ODIN] The injectable 'fixture' was already registered.`);
  });

  test('should not register with a resolver not based on ValueResolver', () => {
    class Fixture { }
    class Resolver {}

    const provider = new CustomProvider();
    const resolver = new Resolver();

    expect(() => {
      // @ts-expect-error
      provider.register(Fixture.name, resolver);
    }).toThrow(`[ODIN] The injectable 'fixture' must be 'ValueResolver'.`);
  });

  test('should resolve to the resolver', () => {
    class Fixture { }

    const provider = new CustomProvider();
    const resolver = new ValueResolver(() => fixture);
    provider.register(Fixture.name, resolver);

    expect(provider.resolve(Fixture.name)).toBe(resolver);
  });

  test('should provide an injectable that does not exist in the container', () => {
    class Fixture { }

    const bundle = new Bundle('test');

    const provider = new CustomProvider();
    const resolver = new ValueResolver(() => fixture);
    provider.register(Fixture.name, resolver);

    const container = new Container(bundle, provider);
    const provided = container.provide(Fixture.name, true);

    expect(provided).not.toBeInstanceOf(Fixture);
    expect(provided).toBe(fixture);
  });

  test('should not provide an injectable that exists in the container', () => {
    class Fixture { }

    const bundle = new Bundle('test');
    bundle.register(Fixture);

    const provider = new CustomProvider();
    const resolver = new ValueResolver(() => fixture);
    provider.register(Fixture.name, resolver);

    const container = new Container(bundle, provider);
    const provided = container.provide(Fixture.name, true);

    expect(provided).toBeInstanceOf(Fixture);
    expect(provided).not.toBe(fixture);
  });

});
