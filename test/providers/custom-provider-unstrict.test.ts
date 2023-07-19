import { beforeEach, describe, expect, test } from 'vitest';

import { CustomProvider } from '../../src/providers/custom-provider.js';
import { ValueResolver } from '../../src/resolvers/value-resolver.js';
import { configuration } from '../../src/singletons/configuration.js';

describe('custom-provider', () => {
  class Fixture {}
  const fixture = 1;

  let provider: CustomProvider;
  let resolver: ValueResolver;

  beforeEach(() => {
    configuration.setStrict(false);

    provider = new CustomProvider();
    resolver = new ValueResolver(() => fixture);
  });

  test('should register', () => {
    expect(provider.register(Fixture.name, resolver)).toBe(Fixture.name.toLowerCase());
  });

  test('should register with a resolver that extends ValueResolver', () => {
    class Resolver extends ValueResolver {}
    const resolver = new Resolver(() => fixture);

    expect(provider.register(Fixture.name, resolver)).toBe(Fixture.name.toLowerCase());
  });

  test('should not register more than once', () => {
    provider.register(Fixture.name, resolver);

    expect(() => {
      provider.register(Fixture.name, resolver);
    }).toThrow(`[odin]: The name or identifier '${Fixture.name.toLowerCase()}' is already registered.`);
  });

  test('should not register with a resolver not based on ValueResolver', () => {
    class Resolver {}
    const resolver = new Resolver();

    expect(() => {
      // @ts-expect-error: TS2345, invalid argument type
      provider.register(Fixture.name, resolver);
    }).toThrow(`[odin]: The resolver '${Fixture.name.toLowerCase()}' must be or extend ValueResolver.`);
  });

  test('should report whether it can resolve an injectable or not', () => {
    // @ts-expect-error: TS2345, invalid argument type
    expect(provider.has(null)).toBe(false);

    // @ts-expect-error: TS2345, invalid argument type
    expect(provider.has(undefined)).toBe(false);

    provider.register(Fixture.name, resolver);
    expect(provider.has(Fixture.name)).toBe(true);
    expect(provider.has(Fixture.name.toUpperCase())).toBe(true);
    expect(provider.has(Fixture.name.toLowerCase())).toBe(true);
  });

  test('should resolve to the resolver or undefined', () => {
    // @ts-expect-error: TS2345, invalid argument type
    expect(provider.resolve(null)).toBeUndefined();

    // @ts-expect-error: TS2345, invalid argument type
    expect(provider.resolve(undefined)).toBeUndefined();

    // missing
    expect(provider.resolve(Fixture.name)).toBeUndefined();

    provider.register(Fixture.name, resolver);
    expect(provider.resolve(Fixture.name)).toBe(resolver);
    expect(provider.resolve(Fixture.name.toUpperCase())).toBe(resolver);
    expect(provider.resolve(Fixture.name.toLowerCase())).toBe(resolver);
  });

});
