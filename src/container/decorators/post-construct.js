import { error } from '../../utils/logger.js';
import MetaValidator from '../../utils/meta-validator.js';
import Secrets from '../secrets.js';

/**
 * Decorator used to bind the method that must be invoked when the injectable is built.
 * Only works assigned to classes method and the class must be registered on the injector system.
 *
 * @param {class} instance the object class definition.
 * @param {string} name the property name.
 * @param {object} descriptor the original property descriptor.
 */
export default function PostConstruct(definition, name, descriptor) {
  MetaValidator.checkDef(definition, 'PostConstruct');

  if (Secrets.getPostContruct(definition)) {
    error(`The class '${definition.constructor.name}' must constains no more than one PostConstruct method.`);
  }
  Secrets.setPostContruct(definition, name);
  return descriptor;
}
