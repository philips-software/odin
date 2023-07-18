import { normalizeNameOrIdentifier } from '../common/normalizers.js';
import { ValueResolver } from '../resolvers/value-resolver.js';
import { logger } from '../singletons/logger.js';

/**
 * Custom provider of custom resolvers.
 */
class CustomProvider<T = unknown, Resolver extends ValueResolver<T> = ValueResolver<T>> {

  private readonly resolvers: Map<string, Resolver> = new Map();

  /**
   * Register a custom injectable resolver.

   * @param nameOrIdentifier the name or identifier.
   * @param resolver the custom resolver.
   * @returns the registered name or identifier.
   *
   * @throws Error if the name or identifier is already registered.
   * @throws Error if the resolver does not extend ValueResolver.
   */
  register(nameOrIdentifier: string, resolver: Resolver): string {
    nameOrIdentifier = normalizeNameOrIdentifier(nameOrIdentifier);

    if (this.has(nameOrIdentifier)) {
      throw new Error(logger.createMessage(`The name or identifier '${nameOrIdentifier}' is already registered.`));
    }

    if (!(resolver instanceof ValueResolver)) {
      throw new Error(logger.createMessage(`The resolver '${nameOrIdentifier}' must be or extend ValueResolver.`));
    }

    this.resolvers.set(nameOrIdentifier, resolver);

    return nameOrIdentifier;
  }

  /**
   * Checks if there is a registered resolver for the given name or identifier.
   *
   * @param nameOrIdentifier the nameOrIdentifier.
   * @returns if there is a registered resolver for the given name or identifier.
   */
  has(nameOrIdentifier: string): boolean {
    nameOrIdentifier = normalizeNameOrIdentifier(nameOrIdentifier);

    if (nameOrIdentifier) {
      return this.resolvers.has(nameOrIdentifier);
    }
    return false;
  }

  /**
   * Provide the value resolver based on param.
   *
   * @param nameOrIdentifier the nameOrIdentifier.
   * @returns the resolver.
   */
  resolve<T = unknown, R extends ValueResolver<T> = ValueResolver<T>>(nameOrIdentifier: string): R | undefined {
    nameOrIdentifier = normalizeNameOrIdentifier(nameOrIdentifier);

    if (nameOrIdentifier) {
      return this.resolvers.get(nameOrIdentifier) as R | undefined;
    }
    return undefined;
  }

}

export {
  CustomProvider,
};
