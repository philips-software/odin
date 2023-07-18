import { stashInitializer } from '../common/decorators.js';
import { logger } from '../singletons/logger.js';
import type { ClassMethodDecorator, ClassMethodDecoratorTarget } from '../types.js';

/**
 * Decorates and registers a class method as the injectable initializer.
 * The class method will be invoked as soon as the injectable is instantiated.
 *
 * @throws Error if decorating something other than a class method.
 * @throws Error if called with any arguments.
 * @throws Error if used more than once per class.
 */
function Initializer<This, Target extends ClassMethodDecoratorTarget<This>>(target: Target, context: ClassMethodDecoratorContext<This, Target>): ReturnType<ClassMethodDecorator<This>> {
  logger.decorators.debug('Initializer:', { target, context });

  if (typeof target === 'function' && context) {
    return InitializerDecorator(target, context);
  }

  if (arguments.length > 0) {
    throw new Error(logger.createMessage(`The @Initializer decorator cannot be called with any arguments.`));
  }

  return InitializerDecorator;

  function InitializerDecorator<This, Target extends ClassMethodDecoratorTarget<This>>(target: Target, context: ClassMethodDecoratorContext<This, Target>): ReturnType<ClassMethodDecorator<This>> {
    logger.decorators.debug('InitializerDecorator:', { target, context });

    if (context.kind !== 'method') {
      throw new Error(logger.createMessage(`The @Initializer decorator can only decorate a class method. Check the ${String(context.kind)} named '${String(context.name)}'.`));
    }

    context.addInitializer(function InitializerDecoratorInitializer(): void {
      logger.decorators.debug('InitializerDecoratorInitializer:', { target, context });
      stashInitializer(this, context.name);
    });
  }
}

export {
  Initializer,
};
