import { applyEagers, applyInitializers, applyInjects } from '../common/decorators.js';
import { Secrets } from '../common/secrets.js';
import { validateDecoratorOptions } from '../common/validators.js';
import { logger } from '../singletons/logger.js';
import { odin } from '../singletons/odin.js';
import type { ClassDecorator, ClassDecoratorTarget, Injectable as InjectableConstructor } from '../types.js';

/**
 * Customizes the injectable.
 */
interface InjectableOptions {
  /**
   * The domain of the bundle where to register the injectable.
   * Hierarchy can be denoted by separating domains with /.
   */
  domain?: string;

  /**
   * The name to use to register the injectable.
   */
  name?: string;

  /**
   * Defines the injectable as singleton.
   * If {@link true}, the injected instance will be reused until explicitly discarded.
   *
   * @default false
   */
  singleton?: boolean;
}

const knownInjectableOptions: (keyof InjectableOptions)[] = [
  'domain',
  'name',
  'singleton',
];

/**
 * Decorates and registers a class as an injectable.
 * The class will be available to be injected and/or provided by the container.
 *
 * @param options customizes the injectable.
 *
 * @throws Error if decorating something other than a class.
 * @throws Error if called with too few or too many arguments.
 */
function Injectable(options: InjectableOptions): ClassDecorator;

/**
 * Decorates and registers a class as an injectable.
 *
 * @throws Error if decorating something other than a class.
 * @throws Error if called with too few or too many arguments.
 */
function Injectable(...parameters: Parameters<ClassDecorator>): ReturnType<ClassDecorator>;

function Injectable<Target extends ClassDecoratorTarget>(target: InjectableOptions | Target, context?: ClassDecoratorContext<Target>): ClassDecorator | ReturnType<ClassDecorator> {
  logger.decorators.debug('Injectable:', { target, context });

  if (arguments.length <= 0) {
    throw new Error(logger.createMessage(`The @Injectable decorator cannot be called without any arguments. Add an argument or remove the ().`));
  }

  let options: InjectableOptions | undefined;

  if (typeof target === 'function' && context) {
    logger.notifyDeprecation({
      name: '@Injectable decorator without any arguments',
      nameExample: '@Injectable',
      since: 'v3.0.0',
      use: '@Injectable decorator with options',
      useExample: '@Injectable({ ...options })',
      whatWillHappen: 'It will be removed',
    });

    return InjectableDecorator(target, context);
  }

  if (arguments.length > 1) {
    throw new Error(logger.createMessage(`The @Injectable decorator cannot be called with more than one argument.`));
  }

  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      throw new Error(logger.createMessage(`The @Injectable decorator cannot be called with an array as argument.`));
    }

    if (Object.getOwnPropertyNames(target).length <= 0) {
      throw new Error(logger.createMessage(`The @Injectable decorator cannot be called with an empty object as argument.`));
    }

    options = { ...target } as InjectableOptions;
  }

  return InjectableDecorator;

  function InjectableDecorator<Target extends ClassDecoratorTarget>(target: Target, context: ClassDecoratorContext<Target>): Target | undefined {
    logger.decorators.debug('InjectableDecorator"', { target, context, options });

    if (options && typeof options.name !== 'string') {
      logger.notifyDeprecation({
        name: '@Injectable decorator options without a name',
        nameExample: '@Injectable({})',
        since: 'v3.0.0',
        use: '@Injectable decorator options with a name',
        useExample: `@Injectable({ name: '${context.name}' })`,
        whatWillHappen: 'The name option will be required',
      });
    }

    options = options ?? {};

    if (context.kind !== 'class') {
      throw new Error(logger.createMessage(`The @Injectable decorator can only decorate a class. Check the ${String(context.kind)} named '${String(context.name)}'.`));
    }

    validateDecoratorOptions(options, {
      allowUnknown: false,
      known: knownInjectableOptions,
    });

    const constructor = function InjectableDecoratorInitializer(...args: any[]): any {
      logger.decorators.debug('InjectableDecoratorInitializer:', { target, context, options, args });

      const instance = new target(...args);

      applyEagers(constructor, instance);
      applyInitializers(constructor, instance);
      applyInjects(constructor, instance);

      return instance;
    } as unknown as InjectableConstructor;

    // ensures instanceof works
    constructor.prototype = target.prototype;

    // ensures the class name is maintained
    Object.defineProperty(constructor, 'name', {
      get(): string {
        return target.name;
      },
    });

    if (options.singleton) {
      Secrets.setSingleton(constructor);
    }

    const bundle = odin.bundle(options.domain);
    bundle.register(constructor, { name: options.name });

    // @ts-expect-error: TS2322, if this initializer is added to the decorator signature, it allows for calling it, and we'd like to avoid it
    return constructor;
  }
}

export {
  Injectable,
};

export type {
  InjectableOptions,
};
