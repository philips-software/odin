import { invokeEagers, invokeInitializer, stashContainer } from '../common/decorators.js';
import type { Descriptor } from '../common/descriptor.js';
import { Secrets } from '../common/secrets.js';
import { isEmpty } from '../common/validators.js';
import { CustomProvider } from '../providers/custom-provider.js';
import { FinalValueResolver } from '../resolvers/final-value-resolver.js';
import { ValueResolver } from '../resolvers/value-resolver.js';
import { logger } from '../singletons/logger.js';
import type { Injectable } from '../types.js';

import { Bundle } from './bundle.js';

/**
 * Manages the lifecycle of the injectables.
 * Uses a bundle and an optional provider to resolve/provide injectable instances.
 */
class Container<
  T = unknown,
  Resolver extends ValueResolver<T> = ValueResolver<T>,
  Provider extends CustomProvider<T, Resolver> = CustomProvider<T, Resolver>,
> {

  declare private readonly bundle: Bundle;
  declare private readonly provider: Provider;

  private readonly instances = new Map<string, InstanceType<Injectable>>();
  private readonly resolvers = new Map<string, Resolver>();

  /**
   * Creates a new container.
   *
   * @param bundle the bundle where to find injectables.
   * @param provider the provider where to find resolvers.
   *
   * @throws Error for an invalid {@link bundle}.
   * @throws Error for an invalid {@link provider}.
   */
  constructor(bundle: Bundle, provider?: Provider) {
    if (!isEmpty(bundle) && !(bundle instanceof Bundle)) {
      throw new Error(logger.createMessage('The bundle must be or extend Bundle.'));
    }

    if (!isEmpty(provider) && !(provider instanceof CustomProvider)) {
      throw new Error(logger.createMessage('The provider must be or extend CustomProvider.'));
    }

    this.bundle = bundle;
    this.provider = provider ?? new CustomProvider() as Provider;
  }

  /**
   * Checks if there is an instance of the injectable with the given name or identifier.
   *
   * @param nameOrIdentifier the name or identifier.
   * @returns if there is an instance of the injectable with the given name or identifier.
   */
  has(nameOrIdentifier?: string): boolean {
    const descriptor = this.bundle.get(nameOrIdentifier);

    if (descriptor) {
      return this.instances.has(descriptor.name);
    }
    return false;
  }

  /**
   * Gets a resolver for the injectable with the given name or identifier.
   *
   * @param nameOrIdentifier the name or identifier.
   * @returns a resolver.
   * */
  get<T = unknown, R extends ValueResolver<T> = ValueResolver<T>>(nameOrIdentifier?: string): R | undefined {
    const descriptor = this.bundle.get(nameOrIdentifier);

    if (descriptor) {
      return this.resolvers.get(descriptor.name) as R | undefined;
    }
    return undefined;
  }

  /**
   * Provides a resolver or the resolved value for the given name or identifier.
   *
   * If the injectable is a singleton, the instance will be reused until explicitly discarded.
   * Only discardable injectables can be discarded.
   *
   * @param nameOrIdentifier the name or identifier.
   * @param resolve whether to resolve the to value or not.
   * @returns a resolver when resolve is false.
   * @returns the resolved value when resolve is true.
   */
  provide<T = unknown>(nameOrIdentifier: string, resolve: true): T;
  provide<T = unknown, R extends ValueResolver<T> = ValueResolver<T>>(nameOrIdentifier: string, resolve?: false): R | undefined;
  provide<T = unknown, R extends ValueResolver<T> = ValueResolver<T>>(nameOrIdentifier: string, resolve = false): T | R | undefined {
    if (this.has(nameOrIdentifier)) {
      const resolver = this.get<T, R>(nameOrIdentifier);

      return resolve
        ? resolver?.get()
        : resolver;
    }

    const descriptor = this.bundle.get(nameOrIdentifier);
    const resolver = descriptor
      ? this.resolve<T, R>(descriptor)
      : this.provider.resolve<T, R>(nameOrIdentifier);

    if (resolver && resolve) {
      return resolver.get();
    }
    return resolver;
  }

  /**
   * Discards the cached injectable instance.
   * Only discardable injectables can be discarded.
   *
   * @param nameOrIdentifier the name or identifier.
   * */
  discard(nameOrIdentifier: string): void {
    const descriptor = this.bundle.get(nameOrIdentifier);

    if (descriptor) {
      const { injectable, name } = descriptor;

      if (Secrets.isDiscardable(injectable)) {
        this.instances.delete(name);
      }
    }
  }

  /**
   * Resolves to a resolver for the given descriptor's injectable.
   *
   * @param descriptor the descriptor of the injectable.
   * @returns a resolver.
   */
  resolve<T = unknown, R extends ValueResolver<T> = ValueResolver<T>>(descriptor: Descriptor): R {
    const { injectable, name } = descriptor;

    const instance = this.bundle.instantiate(descriptor);
    const resolver = this.get<T, R>(name)
      ?? (
            Secrets.isSingleton(injectable) && Secrets.isDiscardable(injectable)
              ? new ValueResolver<T>(() => {
                  if (!this.instances.has(name)) {
                    this.resolve(descriptor);
                  }
                  return this.instances.get(name);
                })
              : new FinalValueResolver<T>(() => {
                  return instance;
                })
        );

    if (Secrets.isSingleton(injectable)) {
      this.instances.set(name, instance);
      this.resolvers.set(name, resolver as unknown as Resolver);
    }

    stashContainer(instance, this);

    invokeEagers(injectable, instance);
    invokeInitializer(injectable, instance);

    return resolver as R;
  }

}

export {
  Container,
};
