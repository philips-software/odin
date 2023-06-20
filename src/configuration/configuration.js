const STRICT = Symbol('strict');
const INITIALIZED = Symbol('initialized');

/**
 * Odin configuration, mantain all configuration options.
 *
 * Should exists only one instance at time.
 */
export default class Configuration {
  [STRICT] = false;
  [INITIALIZED] = false;

  /**
   * Setter for the Odin strict state.
   *
   * @param {boolean} strict whether Odin should use strict mode.
   */
  setStrict(strict = false) {
    this[STRICT] = strict;
  }

  /**
   * Whether Odin is in strict mode.
   *
   * @returns {boolean}
   */
  isStrict() {
    return this[STRICT];
  }

  /**
   * Setter for the config initialized state.
   *
   * @param {boolean} initialized Whether the config should be set as initialized.
   */
  setInitialized(initialized = false) {
    this[INITIALIZED] = initialized;
  }

  /**
   * Whether the config has been initialized.
   *
   * @returns {boolean}
   */
  isInitialized() {
    return this[INITIALIZED];
  }
}
