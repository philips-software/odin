import { error } from '../utils/Logger';
import { ValueResolver } from './ValueResolver';

/**
* Custom provider to retrieve non odin provide values.
*/
export default class CustomProvider {

  injectables = {};

  /**
  * Register a custom injectable generator.
  * @param {string} identifier the generator identifier.
  * @param {ValueResolver} resolver the value resolver.
  *
  * @returns {string} the registered name.
  * @throws if the identifier is already registered.
  */
  register(identifier, resolver) {
    const name = String(identifier).toLowerCase();

    if (this.has(name)) {
      error(`The injectable '${name}' was already registered.`);
    } else if (!(resolver instanceof ValueResolver)) {
      error(`The injectable '${name}' must be 'ValueResolver'.`);
    }

    this.injectables[name] = {
      name,
      resolver,
    };
    return name;
  }

  /**
  * Check if there is a registered injectable with the given identifier.
  *
  * @param {string} ref the identifier.
  */
  has(ref = '') {
    const str = String(ref).toLowerCase();
    return !!this.injectables[str];
  }

  /**
  * Provide the value resolver based on param.
  *
  * @param {string} identifier the dependency name.
  * @returns the dependency if exists, or null.
  */
  resolve(identifier) {
    const name = String(identifier).toLowerCase();
    const injectable = this.injectables[name];
    if (injectable) {
      return injectable.resolver;
    }
    return null;
  }

}
