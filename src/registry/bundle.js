import Registry from './registry.js';
import Config from '../configuration/config.js';
import { error } from '../utils/logger.js';

/**
* Describes the expected class registered as injectable.
* @typedef {{new (): object}} Injectable
*/

/**
* Bundle responsible for holds a Registry.
* It's possible to chain Bundle's and every bundle has a parent.
*/
export default class Bundle {

  /**
  * The Bundle identifier.
  * @type {string}
  */
  id;

  /**
  * The Bundle registry containing its dependencies.
  * @type Registry
  */
  injectables = new Registry();

  /**
  * @type {Object.<string, Bundle>}
  */
  children = {};

  /**
  * @type {Array.<string>}
  */
  childrenName = [];

  /**
  * Create a new Bundle.
  *
  * @param {string} id id.
  * @param {Bundle} parent parent bundle.
  */
  constructor(id, parent = new DummyBundle()) {
    if (!id) {
      error(`Invalid bundle id '${id}'.`);
    }
    this.id = id;
    this.parent = parent;
  }

  /**
  * Create a new child bundle.
  *
  * @param {string} id the bundle id.
  */
  child(id) {
    if (!id) {
      error(`The value '${id}' is not valid as bundle id.`);
    }
    const lowerName = id.toLowerCase();

    let child = this.children[lowerName];
    if (!child) {
      child = this.children[lowerName] = {
        id,
        bundle: new Bundle(id, this),
      };
    }
    return child.bundle;
  }

  /**
  * Checks if there is a child id as param.
  *
  * @param {string} id child id.
  */
  hasChild(id = '') {
    const lowerName = id.toLowerCase();
    return !!this.children[lowerName];
  }

  /**
  * Registers an injectable for this Bundle.
  * It checks if already exists an injectable with the given id or name.
  *
  * @param {Injectable} definition class definition for the injectable.
  * @param {string} args arguments.
  * @returns {string} the registered name.
  */
  register(definition, args = {}) {
    this.checkHas(definition, args.name);

    return this.injectables.register(definition, args);
  }

  /**
  * Deregisters an injectable for this Bundle.
  * If injectable has been removed will return `true`.
  * If injectable has NOT been removed, or does not exist, will return `false`.
  *
  * @param {Injectable} definition class definition for the injectable.
  * @returns {boolean} if the injectable has been removed or not.
  */
  deregister(definition) {
    return this.injectables.deregister(definition);
  }

  /**
  * Receives a injectable definition and provides a new instance.
  *
  * @param {InjectableDef} def the defition to instance.
  */
  instantiate(def) {
    const { definition, args } = def;
    const argsCopy = { ...args };
    return new definition(argsCopy);
  }

  /**
  * Check if the injectable is already registered.
  * If there already is a injectable with the given name/identiier, throws error.
  *
  * @param {InjectableDef} def the injectable to check.
  */
  checkHas(def, name) {
    return this.injectables.checkHas(def, name) || this.parent.checkHas(def, name);
  }

  /**
  * Verify if there is a injectable registered with the given identifier.
  *
  * @param {string|Injectable} def the identifier.
  */
  has(def) {
    const name = typeof def === 'function' ? def.name : def;
    return this.injectables.has(name) || this.parent.has(name);
  }

  /**
  * Obtain the registered injectable, if exists.
  * @param {string} def the definition identifier.
  */
  get(def) {
    return this.injectables.get(def) || this.parent.get(def);
  }

  /**
  * Obtain the injectable idenfier used to retrieve.
  *
  * @param {*} ref the injectable identifier.
  */
  getId(ref) {
    const str = Config.isStrict() ? String(ref) : String(ref).toLowerCase();

    return this.injectables.getId(ref) || this.parent.getId(ref) || str;
  }

}

/**
* Dummy class to clear check.
*/
class DummyBundle {

  has() {
    return false;
  }

  checkHas() {
    return false;
  }

  get() {
    return null;
  }

  getId() {
    return null;
  }

}
