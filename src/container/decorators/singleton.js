import { paramsValidator, register } from './injectable.js';
import MetaValidator from '../../utils/meta-validator.js';
import Secrets from '../secrets.js';

/**
 * Decorator used to bind a singleton to odin.
 * Only works assigned to class.
 *
 * @param {*} definition the class to be registered.
 * @param {object} params the params received.
 */
export default function Singleton(definition, params = {}) {
  const validate = MetaValidator.validateDecorator(Singleton, paramsValidator, definition, params);

  if (validate) {
    return validate;
  }

  const { domain } = params;
  MetaValidator.validateDomain(params.domain);

  Secrets.setSingleton(definition);
  return register(definition, domain, params);
}
