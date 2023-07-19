import { isContentfulString } from '../common/validators.js';
import type { Injectable as BaseInjectable } from '../types.js';

const discardableSymbol = Symbol('odin-discardable');
const eagerSymbol = Symbol('odin-eager');
const initializerSymbol = Symbol('odin-initializer');
const singletonSymbol = Symbol('odin-singleton');

type Injectable = BaseInjectable & {
  [discardableSymbol]?: boolean;
  [eagerSymbol]?: string[];
  [initializerSymbol]?: string;
  [singletonSymbol]?: boolean;
};

/**
* Manages secrets of injectables.
*/
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Secrets {

  /**
   * Checks if the injectable is discardable.
   *
   * @param injectable the injectable class.
   * @returns if the injectable is discardable.
   */
  static isDiscardable(injectable: Injectable): boolean {
    return injectable[discardableSymbol] === true;
  }

  /**
   * Marks the injectable as discardable.
   *
   * @param injectable the injectable class.
   */
  static setDiscardable(injectable: Injectable): void {
    injectable[discardableSymbol] = true;
  }

  /**
   * Gets the eager properties names from the injectable.
   *
   * @param injectable the injectable class.
   * @returns the eager properties names.
   */
  static getEagers(injectable: Injectable): string[] {
    return injectable[eagerSymbol] ?? [];
  }

  /**
   * Adds an eager property into the injectable.
   *
   * @param injectable the injectable class.
   * @param name the property name.
   */
  static setEager(injectable: Injectable, name: string): void {
    injectable[eagerSymbol] = injectable[eagerSymbol] ?? [];
    injectable[eagerSymbol].push(name);
  }

  /**
   * Gets the initializer method name from the injectable.
   *
   * @param injectable the injectable class.
   * @returns the initializer method name.
   */
  static getInitializer(injectable: Injectable): string | undefined {
    return injectable[initializerSymbol];
  }

  /**
   * Checks if the injectable has an initializer method name.
   *
   * @param injectable the injectable class.
   * @returns if the injectable has an initializer method name.
   */
  static hasInitializer(injectable: Injectable): boolean {
    return isContentfulString(injectable[initializerSymbol]);
  }

  /**
   * Sets initializer method name into the injectable.
   *
   * @param injectable the injectable class.
   * @param name the method name.
   */
  static setInitializer(injectable: Injectable, name: string): void {
    injectable[initializerSymbol] = name;
  }

  /**
   * Checks if the injectable is singleton.
   *
   * @param injectable the injectable class.
   * @returns if the injectable is singleton.
   */
  static isSingleton(injectable: Injectable): boolean {
    return injectable[singletonSymbol] === true;
  }

  /**
   * Marks the injectable as singleton.
   *
   * @param injectable the injectable class.
   */
  static setSingleton(injectable: Injectable): void {
    injectable[singletonSymbol] = true;
  }
}

export {
  Secrets,
};
