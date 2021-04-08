import odin from './Odin';

import Injectable from './container/decorator/Injectable';
import Singleton from './container/decorator/Singleton';

import PostConstruct from './container/decorator/PostConstruct';
import Inject from './container/decorator/Inject';
import Secrets from './container/Secrets';
import CustomProvider from './container/CustomProvider';
import { FinalValueResolver, ValueResolver } from './container/ValueResolver';
import MetaValidator from './utils/MetaValidator';
import * as Logger from './utils/Logger';

import OdinConfig from './config/decorator/OdinConfig';

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
