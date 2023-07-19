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

interface InstanceSecrets {
  [containerSymbol]?: Container;
  [eagersSymbol]?: string[];
  [initializersSymbol]?: string[];
  [injectsSymbol]?: [string, string, InjectOptions][];
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type Instance = InstanceType<Injectable> & InstanceSecrets;

/**
 * Transfers the eager class field names previously stashed into an injectable instance to the injectable itself.
 *
 * @param injectable the injectable where to transfer the eager class field names.
 * @param instance the injectable instance from where to transfer the eager class field names.
 */
function applyEagers(injectable: Injectable, instance: Instance): void {
  const instanceSecrets = instance as InstanceSecrets;
  const eagers = instanceSecrets[eagersSymbol] ?? [];

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
    throw new Error(logger.createMessage(`The injectable '${injectable.name}' already has an initializer named '${Secrets.getInitializer(injectable)}'.`));
  }

  const instanceSecrets = instance as InstanceSecrets;
  const initializers = instanceSecrets[initializersSymbol] ?? [];

  if (initializers.length > 1) {
    throw new Error(logger.createMessage(`The injectable '${injectable.name}' cannot define more than one @Initializer.`));
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
  const instanceSecrets = instance as InstanceSecrets;
  const injects = instanceSecrets[injectsSymbol] ?? [];

  for (const [propertyName, injectableName, options] of injects) {
    logger.decorators.debug('applying inject:', propertyName, 'for', injectableName);

    const descriptor = Object.getOwnPropertyDescriptor(instance, propertyName);

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

            // redefines the descriptor to skip this custom getter on the next calls
            Object.defineProperty(this, propertyName, descriptor);

            // returns the value resolved so far
            return value;
          }

          // no resolver, no value
          return undefined;
        }

        if (options.optional) {
          // remove this custom getter, so it does not get called again
          Object.defineProperty(this, propertyName, { get: undefined });

          // restore original descriptor value
          Object.defineProperty(this, propertyName, { value: descriptor?.value });

          // returns value using the original descriptor, so the current get is already consistent with the next
          return descriptor?.value;
        }

        throw new Error(logger.createMessage(`There is no container at '${injectable.name}'.`));
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
function getContainer(instance: Instance): Container | undefined {
  logger.decorators.debug('getting container');

  const instanceSecrets = instance as InstanceSecrets;
  return instanceSecrets[containerSymbol];
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
    instance[eager];
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

    const initialize = instance[initializer];

    if (typeof initialize === 'function') {
      initialize(); // eslint-disable-line @typescript-eslint/no-unsafe-call
    }
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

  const instanceSecrets = instance as InstanceSecrets;
  instanceSecrets[containerSymbol] = container;
}

/**
 * Stashes eager class field names into an injectable instance using a symbol.
 *
 * @param instance the injectable instance where to stash the eager class field name.
 * @param name the eager class field name.
 */
function stashEager(instance: Instance, name: string): void {
  logger.decorators.debug('stashing eager:', name);

  const instanceSecrets = instance as InstanceSecrets;
  instanceSecrets[eagersSymbol] = instanceSecrets[eagersSymbol] ?? [];
  instanceSecrets[eagersSymbol].push(name);
}

/**
 * Stashes the initializer class method name into an injectable instance using a symbol.
 *
 * @param instance the injectable instance where to stash the initializer class method name.
 * @param name the class method name.
 */
function stashInitializer(instance: Instance, name: string): void {
  logger.decorators.debug('stashing initializer:', name);

  const instanceSecrets = instance as InstanceSecrets;
  instanceSecrets[initializersSymbol] = instanceSecrets[initializersSymbol] ?? [];
  instanceSecrets[initializersSymbol].push(name);
}

/**
 * Stashes class field injects into an injectable instance using a symbol.
 *
 * @param instance the injectable instance where to stash the class field inject.
 * @param name the class field name.
 * @param id the injectable name to be injected into the class field.
 * @param options the inject options.
 */
function stashInject(instance: Instance, name: string, id: string, options: InjectOptions): void {
  logger.decorators.debug('stashing inject:', name, 'for', id);

  const instanceSecrets = instance as InstanceSecrets;
  instanceSecrets[injectsSymbol] = instanceSecrets[injectsSymbol] ?? [];
  instanceSecrets[injectsSymbol].push([name, id, options]);
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
