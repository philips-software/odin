import { error } from '../../utils/Logger';
import MetaValidator from '../../utils/MetaValidator';
import Secrets from '../Secrets';

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