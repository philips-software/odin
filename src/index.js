import odin from './odin.js';

import Injectable from './container/decorators/injectable.js';
import Singleton from './container/decorators/singleton.js';

import PostConstruct from './container/decorators/post-construct.js';
import Inject from './container/decorators/inject.js';
import Secrets from './container/secrets.js';
import CustomProvider from './container/custom-provider.js';
import { FinalValueResolver, ValueResolver } from './container/value-resolver.js';
import MetaValidator from './utils/meta-validator.js';
import * as Logger from './utils/logger.js';

import OdinConfig from './configuration/decorators/odin-config.js';

export default odin;

export {
  Injectable,
  Singleton,
  PostConstruct,
  Inject,
  Secrets,
  CustomProvider,
  ValueResolver,
  FinalValueResolver,
  MetaValidator,
  Logger,
  OdinConfig,
};
