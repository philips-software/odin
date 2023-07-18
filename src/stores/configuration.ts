const initializedSymbol = Symbol('odin-initialized');
const strictSymbol = Symbol('odin-strict');

/**
 * Maintains all configuration options.
 */
class Configuration {
  [initializedSymbol] = false;
  [strictSymbol] = false;

  /**
   * Defines whether strict mode is enabled or not.
   *
   * @param strict strict or not
   */
  public setStrict(strict: boolean): void {
    this[strictSymbol] = strict;
  }

  /**
   * Whether strict mode is enabled or not.
   *
   * @returns if strict mode is enabled or not.
   */
  public isStrict(): boolean {
    return this[strictSymbol];
  }

  /**
   * Defines whether this configuration has been initialized or not.
   *
   * @param initialized initialized or not
   */
  public setInitialized(initialized: boolean): void {
    this[initializedSymbol] = initialized;
  }

  /**
   * Whether this configuration has been initialized or not.
   *
   * @returns if it has been initialized or not.
   */
  public isInitialized(): boolean {
    return this[initializedSymbol];
  }
}

export {
  Configuration,
};
