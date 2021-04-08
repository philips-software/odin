import { error } from './Logger';

/**
* Helper to generate a validator to check the decorators meta info.
* There are other util methods too.
*/
export default class MetaValidator {

  /**
  * Create a validator to check the decorators meta info.
  */
  static create() {
    const meta = {};
    const mim = {
      str: (name, mandatory, depends) => newProp(name, 'string', mandatory, depends),
      bool: (name, mandatory, depends) => newProp(name, 'boolean', mandatory, depends),
      number: (name, mandatory, depends) => newProp(name, 'number', mandatory, depends),
      validator: () => {
        return createValidator(meta);
      },
    };

    function newProp(name, type, mandatory = false, depends = []) {
      meta[name] = { type, mandatory, depends };
      return mim;
    }
    return mim;
  }

  /**
  * Validate if the decorator structure is right.
  * @param {function} fn the decorator being applyed.
  * @param {*} paramsValidator function that validate params.
  * @param {*} definition tha class receiving the decorator.
  * @param {*} params the received params.
  */
  static validateDecorator(fn, paramsValidator, definition, params) {
    const name = fn.name;

    MetaValidator.checkDef(definition, name);

    if (definition.constructor === Object) {
      return (...args) => fn(...args, definition);
    }

    paramsValidator(params, definition, name);
  }

  /**
  * Check if decorator is being invoked without params.
  *
  * @param {class} definition the receiving the decorator.
  * @param {*} name decorator name.
  */
  static checkDef(definition, name) {
    if (!definition) {
      logError(name, '', `If there are no params, remove the ()`);
    }
  }

  /**
  * Check if is a valid domain.
  *
  * @param {string} domain the domain to check.
  * @param {number} min the min amount of chunks.
  * @param {number} max the max amount of chunks.
  */
  static validateDomain(domain, min = 0, max = 999) {
    if (min <= 0 && !domain) {
      return;
    }

    const chunks = String(domain).split('/');
    chunks.forEach(chunk => {
      const t = chunk.trim();
      if (t !== chunk) {
        error(`Invalid domain '${domain}', should not has empty spaces in '${chunk}'.`);
      } else if (!t) {
        error(`Invalid domain '${domain}', remove empty chunks.`);
      }
    });
    const length = chunks.length;
    if (length < min || length > max) {
      error(`Invalid domain '${domain}', domain must have at least ${min} and no more than ${max} chunks.`);
    }
  }

}

////////
// UTILS
////////

function createValidator(knewProps) {
  const props = Object.getOwnPropertyNames(knewProps);
  const mandatories = props.filter(p => knewProps[p].mandatory);
  return (foundParams, definition, field) => {
    const isFunction = typeof definition === 'function';
    const defName = isFunction ? definition.name : definition.constructor.name;
    validateParams(knewProps, mandatories, foundParams, defName, field);
  };
}

function validateParams(knewProps, mandatories, foundParams, defName, field = '') {
  if (field) {
    field = `[${field}]`;
  }

  const props = Object.getOwnPropertyNames(foundParams);
  props.forEach(prop => {
    const tp = knewProps[prop];
    if (!tp) logError(defName, field, `unknow property '${prop}'`);

    const typeOfParam = typeof foundParams[prop];
    if (tp && typeOfParam !== tp.type) logError(defName, field, `expected property '${prop}' as '${tp.type}', found '${typeOfParam}'`);

    if (tp && tp.depends) {
      tp.depends.forEach(dep => {
        if (props.indexOf(dep) === -1) logError(defName, field, `when has '${prop}', props '${tp.depends}' are mandatory`);
      });
    }
  });

  mandatories.forEach(prop => {
    if (foundParams[prop] === undefined) logError(defName, field, `mandatory property '${prop}' not found`);
  });
}

function logError(defName, field, msg) {
  error(`${defName}${field}: ${msg}.`);
}
