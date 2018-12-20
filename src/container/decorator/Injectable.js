import odin from '../../Odin';
import MetaValidator from '../../utils/MetaValidator';

export const paramsValidator = MetaValidator.create().str('domain').validator();

/**
* Decorator used to bind a injectable to odin.
* Only works assigned to class.
*
* @param {*} definition the class to be registered.
* @param {object} params the params received.
*/
export default function Injectable(definition, params = {}) {
  const validate = MetaValidator.validateDecorator(Injectable, paramsValidator, definition, params);

  if (validate) {
    return validate;
  }

  const { domain } = params;
  MetaValidator.validateDomain(params.domain);

  return register(definition, domain, params);
}

export function register(definition, domain, args) {
  const bundle = odin.bundle(domain);

  bundle.register(definition, args);

  return definition;
}