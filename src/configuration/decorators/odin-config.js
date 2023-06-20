import Config from '../config.js';

import { error } from '../../utils/logger.js';
import MetaValidator from '../../utils/meta-validator.js';

const paramsValidator = MetaValidator.create().bool('strict', true).validator();

export default function OdinConfig(definition, params = {}) {
  if (Config.isInitialized()) {
    error('@OdinConfig can only be used once');
  }

  const validate = MetaValidator.validateDecorator(OdinConfig, paramsValidator, definition, params);

  if (validate) {
    return validate;
  }

  if (Object.prototype.hasOwnProperty.call(params, 'strict')) {
    Config.setStrict(params.strict);
  }

  Config.setInitialized(true);

  return definition;
}
