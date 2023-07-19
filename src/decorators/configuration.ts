import { validateDecoratorOptions } from '../common/validators.js';
import { configuration } from '../singletons/configuration.js';
import { logger } from '../singletons/logger.js';
import type { ClassDecorator, ClassDecoratorTarget } from '../types.js';

/**
 * Customizes odin's behavior.
 */
interface ConfigurationOptions {
  /**
   * Enables strict mode.
   * If {@link true}, injectable names will be case-sensitive.
   */
  strict: boolean;
}

const knownConfigurationOptions: (keyof ConfigurationOptions)[] = [
  'strict',
];

/**
 * Decorates a class to initialize the configuration before decorating other classes.
 * The class won't be registered or used for anything.
 *
 * @param options the configuration.
 *
 * @throws Error if decorating something other than a class.
 * @throws Error if called with too few or too many arguments.
 * @throws Error if used more than once per project.
 */
function Configuration(options: ConfigurationOptions): ClassDecorator;

function Configuration<Target extends ClassDecoratorTarget>(target: ConfigurationOptions | Target, context?: ClassDecoratorContext<Target>): ClassDecorator | ReturnType<ClassDecorator> {
  logger.decorators.debug('Configuration:', { target, context });

  if (arguments.length <= 0) {
    throw new Error(logger.createMessage(`The @Configuration decorator cannot be called without any arguments. Add an argument or remove the ().`));
  }

  // @ts-expect-error: yes the type doesn't like it but necessary for consistency and validation
  let options: ConfigurationOptions = {};

  if (typeof target === 'function' && context) {
    return ConfigurationDecorator(target, context);
  }

  if (arguments.length > 1) {
    throw new Error(logger.createMessage(`The @Configuration decorator cannot be called with more than one argument.`));
  }

  options = { ...target } as ConfigurationOptions;

  return ConfigurationDecorator;

  function ConfigurationDecorator<Target extends ClassDecoratorTarget>(target: Target, context: ClassDecoratorContext<Target>): Target | undefined {
    logger.decorators.debug('ConfigurationDecorator:', { target, context });

    if (context.kind !== 'class') {
      throw new Error(logger.createMessage(`The @Configuration decorator can only decorate a class. Check the ${String(context.kind)} named '${String(context.name)}'.`));
    }

    validateDecoratorOptions(options, {
      allowUnknown: false,
      known: knownConfigurationOptions,
      required: knownConfigurationOptions,
    });

    if (configuration.isInitialized()) {
      throw new Error(logger.createMessage('The @Configuration decorator can only be used once.'));
    }

    configuration.setStrict(options.strict);
    configuration.setInitialized(true);

    return;
  }
}

export {
  Configuration,
};

export type {
  ConfigurationOptions,
};
