import type { Injectable, Resolver } from '../types.js';

const resolverSymbol = Symbol('odin-resolver');

/**
 * Wrapper of resolver.
 * Resolves every time the get is invoked.
 */
class ValueResolver<T = unknown> {

  private [resolverSymbol]: Resolver<T>;

  constructor(resolver: Resolver<T>) {
    this[resolverSymbol] = resolver;
  }

  /**
   * Resolves to a value based on the injectable retrieving it.
   * Resolves every time its invoked.
   *
   * @param injectable the injectable retrieving the value.
   * @returns the resolved value.
   */
  get(injectable?: Injectable): T {
    return this[resolverSymbol](injectable);
  }

}

export {
  ValueResolver,
};
