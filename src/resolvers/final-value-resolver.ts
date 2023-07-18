import type { Injectable } from '../types.js';
import { ValueResolver } from './value-resolver.js';

const valueSymbol = Symbol('odin-value');

/**
 * Wrapper of cached value.
 * Resolves the value only once.
 */
class FinalValueResolver<T = unknown> extends ValueResolver<T> {

  private [valueSymbol]?: T;

  /**
   * Resolves to a value based on the injectable retrieving it.
   * Resolves the first time its invoked and caches the value.
   *
   * @param injectable the injectable retrieving the value
   * @returns the cached/resolved value.
   */
  override get(injectable?: Injectable): T {
    if (this[valueSymbol] === undefined) {
      this[valueSymbol] = super.get(injectable);
    }
    return this[valueSymbol];
  }

}

export {
  FinalValueResolver,
};
