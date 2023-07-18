import { beforeEach, describe, expect, test } from 'vitest';

import { CustomProvider } from '../../src/providers/custom-provider.js';
import { ValueResolver } from '../../src/resolvers/value-resolver.js';
import { Bundle } from '../../src/stores/bundle.js';
import { Container } from '../../src/stores/container.js';

describe('custom-provider', () => {
  class Fixture {}
  const fixture = 1;

  let provider: CustomProvider;
  let resolver: ValueResolver;

  beforeEach(() => {
    provider = new CustomProvider();
    resolver = new ValueResolver(() => fixture);
  });

  test('should register', () => {
    expect(provider.register(Fixture.name, resolver)).toBe(Fixture.name);
  });

  test('should register with a resolver that extends ValueResolver', () => {
    class Resolver extends ValueResolver {}
    const resolver = new Resolver(() => fixture);

    expect(provider.register(Fixture.name, resolver)).toBe(Fixture.name);
  });

  test('should not register more than once', () => {
    provider.register(Fixture.name, resolver);

    expect(() => {
      provider.register(Fixture.name, resolver);
    }).toThrow(`[odin]: The name or identifier '${Fixture.name}' is already registered.`);
  });

  test('should not register with a resolver not based on ValueResolver', () => {
    class Resolver {}
    const resolver = new Resolver();

    expect(() => {
      // @ts-expect-error
      provider.register(Fixture.name, resolver);
    }).toThrow(`[odin]: The resolver '${Fixture.name}' must be or extend ValueResolver.`);
  });

  test('should report whether it can resolve an injectable or not', () => {
    // @ts-expect-error: doesn't accept null
    expect(provider.has(null)).toBe(false);

    // @ts-expect-error: doesn't accept undefined
    expect(provider.has(undefined)).toBe(false);

    expect(provider.has(Fixture.name)).toBe(false);
    expect(provider.has(Fixture.name.toUpperCase())).toBe(false);
    expect(provider.has(Fixture.name.toLowerCase())).toBe(false);
  });

  test('should resolve to the resolver or undefined', () => {
    // @ts-expect-error: doesn't accept null
    expect(provider.resolve(null)).toBeUndefined();

    // @ts-expect-error: doesn't accept undefined
    expect(provider.resolve(undefined)).toBeUndefined();

    // missing
    expect(provider.resolve(Fixture.name)).toBeUndefined();

    expect(provider.resolve(Fixture.name)).toBeUndefined();
    expect(provider.resolve(Fixture.name.toUpperCase())).toBeUndefined();
    expect(provider.resolve(Fixture.name.toLowerCase())).toBeUndefined();
  });

  test('should not resolve an unknown injectable', () => {
    expect(provider.resolve(Fixture.name)).toBeUndefined();
  });

  test('should provide an injectable that does not exist in the container', () => {
    provider.register(Fixture.name, resolver);

    const bundle = new Bundle('test');
    const container = new Container(bundle, provider);
    const provided = container.provide(Fixture.name, true);

    expect(provided).not.toBeInstanceOf(Fixture);
    expect(provided).toBe(fixture);
  });

  test('should not provide an injectable that exists in the container', () => {
    provider.register(Fixture.name, resolver);

    const bundle = new Bundle('test');
    bundle.register(Fixture);

    const container = new Container(bundle, provider);
    const provided = container.provide(Fixture.name, true);

    expect(provided).toBeInstanceOf(Fixture);
    expect(provided).not.toBe(fixture);
  });

});
