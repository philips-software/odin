import type { InjectOptions } from '../decorators/inject.js';
import { FinalValueResolver } from '../resolvers/final-value-resolver.js';
import { logger } from '../singletons/logger.js';
import type { Container } from '../stores/container.js';
import type { Injectable } from '../types.js';
import { Secrets } from './secrets.js';

const containerSymbol = Symbol('odin-container');
const eagersSymbol = Symbol('odin-eagers');
const initializersSymbol = Symbol('odin-initializers');
const injectsSymbol = Symbol('odin-injects');

type Instance = InstanceType<Injectable> & {
  [containerSymbol]?: Container;
  [eagersSymbol]?: string[];
  [initializersSymbol]?: string[];
  [injectsSymbol]?: [string, string, InjectOptions][];
};

/**
 * Transfers the eager class field names previously stashed into an injectable instance to the injectable itself.
 *
 * @param injectable the injectable where to transfer the eager class field names.
 * @param instance the injectable instance from where to transfer the eager class field names.
 */
function applyEagers(injectable: Injectable, instance: Instance): void {
  const eagers = instance[eagersSymbol] ?? [];

  for (const name of eagers) {
    logger.decorators.debug('applying eager:', name);
    Secrets.setEager(injectable, name);
  }
}

/**
 * Transfers the initializer class method name previously stashed into an injectable instance to the injectable itself.
 *
 * @param injectable the injectable where to transfer the initializer class method name.
 * @param instance the injectable instance from where to transfer the initializer class method name.
 *
 * @throws Error if the injectable already has an initializer.
 * @throws Error if trying to apply more than one initializer.
 */
function applyInitializers(injectable: Injectable, instance: Instance): void {
  if (Secrets.hasInitializer(injectable)) {
    throw new Error(logger.createMessage(`The injectable '${injectable?.name}' already has an initializer named '${Secrets.getInitializer(injectable)}'.`));
  }

  const initializers = instance[initializersSymbol] ?? [];

  if (initializers.length > 1) {
    throw new Error(logger.createMessage(`The injectable '${injectable?.name}' cannot define more than one @Initializer.`));
  }

  const [name] = initializers;
  logger.decorators.debug('applying initializer:', name);
  Secrets.setInitializer(injectable, name);
}

/**
 * Transfers the class field injects previously stashed into an injectable instance to the injectable itself.
 *
 * @param injectable the injectable where to transfer the class field injects.
 * @param instance the injectable instance from where to transfer the class field injects.
 */
function applyInjects(injectable: Injectable, instance: Instance): void {
  const injects = instance[injectsSymbol] ?? [];

  for (const [propertyName, injectableName] of injects) {
    logger.decorators.debug('applying inject:', propertyName, 'for', injectableName);

    Object.defineProperty(instance, propertyName, {
      get(): any {
        const container = getContainer(this);

        if (container) {
          const resolver = container.provide(injectableName);

          if (resolver) {
            const value = resolver.get(this);
            const descriptor = resolver instanceof FinalValueResolver
              ? { value }
              : { get: () => resolver.get(this) };

            Object.defineProperty(this, propertyName, descriptor);
            return value;
          }
          return undefined;
        }

        throw new Error(logger.createMessage(`There is no container at '${injectable?.name}'.`));
      },
    });
  }
}

/**
 * Gets the container previously stashed into an injectable instance using a symbol.
 *
 * @param instance the injectable instance where to stash the container.
 * @returns the container.
 */
function getContainer(instance: Instance): Container {
  logger.decorators.debug('getting container');

  return instance[containerSymbol];
}

/**
 * Invokes the eager inject properties to bootstrap them.
 *
 * @param injectable the injectable where the eagers are stored.
 * @param instance the injectable instance where to invoke the eagers.
 */
function invokeEagers(injectable: Injectable, instance: Instance): void {
  for (const eager of Secrets.getEagers(injectable)) {
    logger.decorators.debug('invoking eager:', eager);

    // forces get to be called
    noop(instance[eager]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function noop(_: any): void {
    // ¯\_(ツ)_/¯
  }
}

/**
 * Invokes the method decorated with @Initializer.
 *
 * @param injectable the injectable where the eagers are stored.
 * @param instance the injectable instance where to invoke the initializer.
 */
function invokeInitializer(injectable: Injectable, instance: Instance): void {
  const initializer = Secrets.getInitializer(injectable);

  if (initializer) {
    logger.decorators.debug('invoking initializer:', initializer);
    instance[initializer]();
  }
}

/**
 * Stashes the container into an injectable instance using a symbol.
 *
 * @param instance the injectable instance where to stash the container.
 * @param container the container.
 */
function stashContainer(instance: Instance, container: Container): void {
  logger.decorators.debug('stashing container:', typeof container);

  instance[containerSymbol] = container;
}

/**
 * Stashes eager class field names into an injectable instance using a symbol.
 *
 * @param instance the injectable instance where to stash the eager class field name.
 * @param name the eager class field name.
 */
function stashEager(instance: Instance, name: string | symbol): void {
  logger.decorators.debug('stashing eager:', name);

  instance[eagersSymbol] = instance[eagersSymbol] ?? [];
  instance[eagersSymbol].push(name);
}

/**
 * Stashes the initializer class method name into an injectable instance using a symbol.
 *
 * @param instance the injectable instance where to stash the initializer class method name.
 * @param name the class method name.
 */
function stashInitializer(instance: Instance, name: string | symbol): void {
  logger.decorators.debug('stashing initializer:', name);

  instance[initializersSymbol] = instance[initializersSymbol] ?? [];
  instance[initializersSymbol].push(name);
}

/**
 * Stashes class field injects into an injectable instance using a symbol.
 *
 * @param instance the injectable instance where to stash the class field inject.
 * @param name the class field name.
 * @param id the injectable name to be injected into the class field.
 * @param options the inject options.
 */
function stashInject(instance: Instance, name: string | symbol, id: string | symbol, options: InjectOptions): void {
  logger.decorators.debug('stashing inject:', name, 'for', id);

  instance[injectsSymbol] = instance[injectsSymbol] ?? [];
  instance[injectsSymbol].push([name, id, options]);
}

export {
  applyEagers,
  applyInitializers,
  applyInjects,
  getContainer,
  invokeEagers,
  invokeInitializer,
  stashContainer,
  stashEager,
  stashInitializer,
  stashInject,
};
