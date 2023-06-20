const SINGLETON_DEF = Symbol('singleton-def'); //NEVER export!
const DISCARDABLE_DEF = Symbol('discardable-def'); //NEVER export!
const CUSTOM_DEF = Symbol('custom-def'); //NEVER export!
const NAMED_DEF = Symbol('named-def'); //NEVER export!

const POST_CONSTRUCTOR_ACCESSOR = Symbol('post-contructor-accessor'); //NEVER export!
const EAGER_ACCESSOR = Symbol('eager-accessor'); //NEVER export!
const WRAPPED_INJECTABLE_ACCESSOR = Symbol('wrapped-injectable-accessor'); //NEVER export!

/**
* Helper responsible to mark and check tag Injectable's.
*/
export default class Secrets {

  /**
  * Mark Injectable as singleton.
  *
  * @param {Injectable} definition the injectable to mark.
  */
  static setSingleton(definition) {
    definition[SINGLETON_DEF] = true;
  }

  /**
  * Check if Injectable is singleton.
  *
  * @param {Injectable} definition the injectable to check.
  * @returns {boolean} true if it is.
  */
  static isSingleton(definition) {
    return definition[SINGLETON_DEF] === true;
  }

  /**
  * Mark Injectable as discardable.
  *
  * @param {Injectable} definition the injectable to mark.
  */
  static setDiscardable(definition) {
    definition[DISCARDABLE_DEF] = true;
  }

  /**
  * Check if Injectable is discardable.
  *
  * @param {Injectable} definition the injectable to check.
  * @returns {boolean} true if it is.
  */
  static isDiscardable(definition) {
    return definition[DISCARDABLE_DEF] === true;
  }

  /**
  * Mark Injectable as custom.
  *
  * @param {Injectable} definition the injectable to mark.
  */
  static setCustom(definition) {
    definition[CUSTOM_DEF] = true;
  }

  /**
  * Check if Injectable is custom.
  *
  * @param {Injectable} definition the injectable to check.
  * @returns {boolean} true if it is.
  */
  static isCustom(definition) {
    return definition[CUSTOM_DEF] === true;
  }

  /**
   * Set postContruct method name into definition.
   *
   * @param {Injectable} definition the injectable to set.
   * @param {string} name the postContruct method name.
   */
  static setPostContruct(definition, name) {
    definition[POST_CONSTRUCTOR_ACCESSOR] = name;
  }

  /**
   * Get postConstruct method name from definition.
   *
   * @param {Injectable} definition the injectable to get from.
   * @returns {string} the method name.
   */
  static getPostContruct(definition) {
    return definition[POST_CONSTRUCTOR_ACCESSOR];
  }

  /**
   * Push eager prop into definition.
   *
   * @param {Injectable} definition the injectable to define.
   * @param {string} name the eager prop name.
   */
  static setEager(definition, name) {
    definition[EAGER_ACCESSOR] = definition[EAGER_ACCESSOR] || [];
    definition[EAGER_ACCESSOR].push(name);
  }

  /**
   * Get eager props name from definition.
   *
   * @param {Injectable} definition the injectable to get from.
   * @returns the eager props name.
   */
  static getEagers(definition) {
    return definition[EAGER_ACCESSOR] || [];
  }

  /**
   * Set a wrapper property in a definition insttance
   *
   * @param {Injectable} definition the injectable to set the wrapper.
   * @param {object} wrapperObj the wrapper object
   */
  static setWrapper(definition, wrapperObj) {
    definition[WRAPPED_INJECTABLE_ACCESSOR] = wrapperObj;
  }

  /**
   * Check if a definition has a wrapper property.
   *
   * @param {Injectable} definition the injectable to get from.
   * @returns {boolean} is the definition is a wrapper or not.
   */
  static isWrapper(definition) {
    if (!definition) return false;
    return definition[WRAPPED_INJECTABLE_ACCESSOR] ? true : false;
  }

  /**
   * Get a wrapper property object from a `Injectable` instance.
   *
   * @param {Injectable} definition the injectable to get from.
   * @returns {object} wrapper instance.
   */
  static getWrapper(definition) {
    return definition[WRAPPED_INJECTABLE_ACCESSOR];
  }

  /**
   * Set a definition as named one.
   *
   * @param {Injectable} definition the injectable to get from.
   */
  static setNamed(definition, name) {
    definition[NAMED_DEF] = name;
  }

  /**
   * Get name attribute from a `Injectable`.
   *
   * @param {Injectable} definition the injectable to get from.
   * @returns {string} `Injectable` name.
   */
  static getNamed(definition) {
    return definition[NAMED_DEF];
  }

  /**
   * Check if an `Injectable` is a named one.
   *
   * @param {Injectable} definition the injectable to get from.
   * @returns {boolean} If the `Injectable` is named or not.
   */
  static isNamed(definition) {
    return Boolean(definition[NAMED_DEF]);
  }
}
