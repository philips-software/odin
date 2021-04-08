const SINGLETON_DEF = Symbol('singleton-def'); //NEVER export!
const DISCARDABLE_DEF = Symbol('discardable-def'); //NEVER export!
const CUSTOM_DEF = Symbol('custom-def'); //NEVER export!

const POST_CONSTRUCTOR_ACCESSOR = Symbol('post-contructor-accessor'); //NEVER export!
const EAGER_ACCESSOR = Symbol('eager-accessor'); //NEVER export!

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

}
