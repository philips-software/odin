/**
 * Data that defines a Injectable.
 */
export default class InjectableDef {

  /**
   * The Injectable identifier.
   * @type {string}
   */
  id;

  /**
   * The Injectable class.
   * @type {Object.new}
   */
  definition;

  /**
   * The arguments when instanciate the definition.
   * @type {Object}
   */
  args;

  constructor(id, definition, args) {
    this.id = id;
    this.definition = definition;
    this.args = args;
  }

}