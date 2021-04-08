import Config from '../Config';

import { error } from '../../utils/Logger';
import MetaValidator from '../../utils/MetaValidator';

const paramsValidator = MetaValidator.create().bool('strict', true).validator();

export default function OdinConfig(definition, params = {}) {
  if (Config.isInitialized()) {
    error('@OdinConfig can only be used once');
  }

  const validate = MetaValidator.validateDecorator(OdinConfig, paramsValidator, definition, params);

  if (validate) {
    return validate;
  }

  if (params.hasOwnProperty('strict')) {
    Config.setStrict(params.strict);
  }

  Config.setInitialized(true);

  return definition;
}
