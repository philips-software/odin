import Config from '../config/Config';
import { error } from "../utils/Logger";
import InjectableDef from "./InjectableDef";

/**
* Describes the expected class registered as injectable.
* @typedef {{new (): object}} Injectable
*/

/**
* Injectable's registry.
* It maps and holds the injectable definitions.
*/
export default class Registry {
  /**
  * Map the injectable's classes.
  * @type {Object.<string, InjectableDef>}
  */
  injectables = {};

  /**
  * Map the injectable's identifiers by name.
  * @type {Object.<string, string>}
  */
  identifierByName = {};

  /**
  * Set of registered names.
  * @type {Array.<string>}
  */
  names = [];

  /**
  * Register a injectable class.
  * The class should be retrieved using the class name or a custom name.
  * The custom name must be inside the parameter args as property `name`.
  *
  * @param {Injectable} definition injectable class.
  * @param {string} args object containing other arguments.
  * @returns {string} the registered identifier.
  */
  register(definition, args = {}) {
    const { name } = args;
    this.checkHas(definition, name);

    const id = getAsString(definition.name);
    this.injectables[id] = new InjectableDef(id, definition, args);

    if (name) {
      const lowerName = getAsString(name);
      this.names.push(lowerName);
      this.identifierByName[lowerName] = id;
    }

    return id;
  }

  /**
  * Check if exists an injectable with the given identifier.
  * It checks if exists another injectable using the custom name, as well.
  *
  * @param {Injectable} def the injectable.
  * @param {string} name the custom name.
  */
  checkHas(def, name = '') {
    const id = getAsString(def.name);
    if (name && this.hasName(name)) {
      error(`There already is a injectable named '${name}' registered.`);
    }else if (this.hasName(id)) {
      error(`There already is a injectable named '${id}' registered.`);
    } else if (name && this.has(name)) {
      error(`There already is a injectable '${name}' registered.`);
    } else if (this.has(id)) {
      error(`There already is a injectable '${id}' registered.`);
    }
  }

  /**
  * Check if there is a registered injectable with the given identifier.
  *
  * @param {string} ref the identifier.
  */
  has(ref = '') {
    const str = getAsString(ref);
    return this.hasName(ref) || !!this.injectables[str];
  }

  /**
  * Check if there is a registered injectable with the given name.
  *
  * @param {string} name the name.
  */
  hasName(name = '') {
    const str = getAsString(name);
    return this.names.indexOf(str) > -1;
  }

  /**
  * Try to get the injectable class difinition.
  * It would retrieve the class using the arguments as identifier or name.
  * If found the injectable using any of both, will return.
  *
  * @param {string} ref the identifier or name.
  */
  get(ref = '') {
    const str = getAsString(ref);
    const name = this.identifierByName[str];
    return this.injectables[str] || this.injectables[name] || null;
  }

  /**
   * Get injectable id from given name.
   *
   * @param {string} ref the injectable name.
   */
  getId(ref = '') {
    const str = getAsString(ref);
    return this.identifierByName[str] || null;
  }

}

/**
 * Helper to obtain a string based on Odin strict rule.
 *
 * @param {str} str the string to be mutated.
 */
function getAsString(str) {
  if (Config.isStrict()) {
    return String(str);
  }

  return String(str).toLowerCase();
}