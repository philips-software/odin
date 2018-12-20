import Secrets from '../Secrets';
import Config from '../../config/Config';
import { error } from '../../utils/Logger';
import MetaValidator from '../../utils/MetaValidator';
import { FinalValueResolver } from '../ValueResolver';
import { getContainer } from '../Container';

/**
* Decorator used to bind injected properties.
* Only works assigned to classes properties and the class must be known by odin.
*
* @param {class} definition the object class definition.
* @param {string} name the property name.
* @param {object} descriptor the original property descriptor.
* @param {object} params the params received.
*/
export default function Inject(definition, name, descriptor, params = {}) {
  if (typeof definition === 'string') {
    if (arguments.length > 1) {
      error('@Inject should receive only one argument.');
    }

    definition = { name: definition };
  }

const paramsValidator = MetaValidator.create().str('name', Config.isStrict()).bool('eager').validator();
const validate = MetaValidator.validateDecorator(Inject, paramsValidator, definition, params);

  if (validate) {
    return validate;
  }

  if (params.eager) {
    Secrets.setEager(definition, name);
  }

  function get() {
    const container = getContainer(this);

    if (!container) {
      error(`There is no container at '${definition}'.`);
    }

    const injectableName = params.name || name;

    let resolver = container.provide(injectableName);
    if (resolver) {
      const value = resolver.get(this);

      const isFinal = (resolver instanceof FinalValueResolver);
      const newDescriptor = isFinal ? { value } : { get: () => resolver.get(this) };

      Object.defineProperty(this, name, newDescriptor);
      return value;
    }
  }
  return { get };
}
