const RESOLVER = Symbol('resolver'); // NEVER export!
const VALUE = Symbol('value'); // NEVER export!

/**
 * Wrapper to provided value resolver.
 * It resolves the value each time that the get is invoked.
 */
export class ValueResolver {

  constructor(resolver) {
    this[RESOLVER] = resolver;
  }

  /**
   * Resolve the value based on the instance retrieving it.
   * @param {Injectable} instance the injectable retrieving.
   */
  get(instance) {
    return this[RESOLVER](instance);
  }

}

/**
 * Wrapper to provided value resolver.
 * It only evals the value once.
 */
export class FinalValueResolver extends ValueResolver {

  get(instance) {
    if (this[VALUE] === undefined) {
      this[VALUE] = super.get(instance);
    } 
    return this[VALUE];
  }

}
