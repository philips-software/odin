import { stashEager, stashInject } from '../common/decorators.js';
import { validateDecoratorOptions } from '../common/validators.js';
import { logger } from '../singletons/logger.js';
import type { ClassFieldDecorator, ClassFieldDecoratorTarget } from '../types.js';

/**
 * Customizes the injection.
 */
interface InjectOptions {
  /**
   * Defines the inject as eager.
   * If {@link true}, the class field will be populated during instantiation.
   * If {@link false}, the class field will be populated when it's first accessed.
   *
   * @default false
   */
  eager?: boolean;

  /**
   * The name of the injectable to inject.
   */
  name?: string;

  /**
   * Defines the inject as optional.
   * If {@link true}, it will inject undefined when not being provided by a container.
   * If {@link false}, it will throw an {@link Error} when not being provided by a container.
   *
   * @default false
   */
  optional?: boolean;
}

const knownInjectOptions: (keyof InjectOptions)[] = [
  'eager',
  'name',
  'optional',
];

/**
 * Decorates and registers a class field to be injected with an injectable.
 * The class field will be populated with the injectable instance/value provided by the container.
 *
 * @param nameOrOptions the name of the injectable to inject or options to customize the injection.
 *
 * @throws Error if decorating something other than a class field.
 * @throws Error if called with too few or too many arguments.
 */
function Inject<This>(nameOrOptions: string | InjectOptions): ClassFieldDecorator<This>;

/**
 * Decorates and registers a class field to be injected with an injectable.
 * The class field will be populated with the injectable instance/value provided by the container.
 *
 * @throws Error if decorating something other than a class field.
 * @throws Error if called with too few or too many arguments.
 */
function Inject<This>(...parameters: Parameters<ClassFieldDecorator<This>>): ReturnType<ClassFieldDecorator<This>>;

function Inject<This, Target extends ClassFieldDecoratorTarget>(target: string | InjectOptions | Target, context?: ClassFieldDecoratorContext<This>): ClassFieldDecorator<This> | ReturnType<ClassFieldDecorator<This>> {
  logger.decorators.debug('Inject:', { target, context });

  if (arguments.length <= 0) {
    throw new Error(logger.createMessage(`The @Inject decorator cannot be called without any arguments. Add an argument or remove the ().`));
  }

  let options: InjectOptions | undefined;

  if (target === undefined && context) {
    logger.notifyDeprecation({
      name: '@Inject decorator without any arguments',
      nameExample: '@Inject',
      since: 'v3.0.0',
      use: '@Inject decorator with options',
      useExample: '@Inject({ ...options })',
      whatWillHappen: 'It will be removed',
    });

    return InjectDecorator(target, context);
  }

  if (arguments.length > 1) {
    throw new Error(logger.createMessage(`The @Inject decorator cannot be called with more than one argument.`));
  }

  if (typeof target === 'string') {
    logger.notifyDeprecation({
      name: '@Inject decorator with a string',
      nameExample: `@Inject('${target}')`,
      since: 'v3.0.0',
      use: '@Inject decorator with options',
      useExample: `@Inject({ name: '${target}' })`,
      whatWillHappen: 'It will be removed',
    });

    options = options ?? {};
    options.name = target;
  }

  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      throw new Error(logger.createMessage(`The @Inject decorator cannot be called with an array as argument.`));
    }

    if (Object.getOwnPropertyNames(target).length <= 0) {
      throw new Error(logger.createMessage(`The @Inject decorator cannot be called with an empty object as argument.`));
    }

    options = { ...target } as InjectOptions;
  }

  return InjectDecorator;

  function InjectDecorator<This, Target extends ClassFieldDecoratorTarget>(target: Target, context: ClassFieldDecoratorContext<This>): Target | undefined {
    logger.decorators.debug('InjectDecorator:', { target, context, options });

    if (options && typeof options.name !== 'string') {
      logger.notifyDeprecation({
        name: '@Inject decorator options without a name',
        nameExample: '@Inject({})',
        since: 'v3.0.0',
        use: '@Inject decorator options with a name',
        useExample: `@Inject({ name: '${String(context.name)}' })`,
        whatWillHappen: 'The name option will be required',
      });
    }

    options = options ?? {};

    if (context.kind !== 'field') {
      throw new Error(logger.createMessage(`The @Inject decorator can only decorate a class field. Check the ${String(context.kind)} named '${String(context.name)}'.`));
    }

    validateDecoratorOptions(options, {
      allowUnknown: true,
      known: knownInjectOptions,
    });

    // @ts-expect-error: TS2322, if this initializer is added to the decorator signature, it allows for calling it, and we'd like to avoid it
    return function InjectDecoratorInitializer<This>(this: This, initialValue: unknown): unknown {
      logger.decorators.debug('InjectDecoratorInitializer:', { target, context, initialValue, options });

      options = options as InjectOptions;

      if (options.eager) {
        stashEager(this as any, String(context.name));
      }
      stashInject(this as any, String(context.name), String(options.name ?? context.name), options);
    };
  }
}

export {
  Inject,
};

export type {
  InjectOptions,
};
