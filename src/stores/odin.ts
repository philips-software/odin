import { normalizeDomain } from '../common/normalizers.js';
import { validateDomain } from '../common/validators.js';
import type { CustomProvider } from '../providers/custom-provider.js';
import type { ValueResolver } from '../resolvers/value-resolver.js';
import { logger } from '../singletons/logger.js';
import { Bundle } from '../stores/bundle.js';
import { Container } from '../stores/container.js';

const bundleSymbol = Symbol('odin-bundle');

/**
 * Maintains odin's root bundle and the hierarchy that goes with it.
 * Provides sugar functions to find/create bundles and containers.
 * Ideally there should only be one instance of this class at a time.
 */
class Odin {

  private readonly [bundleSymbol] = new Bundle('odin');

  /**
   * Finds or creates a bundle based on the given domain.
   * Hierarchy can be denoted by separating domains with /.
   *
   * @param domain the domain to find or create the bundle.
   * @param create whether to create non-existent bundles or not.
   * @returns the bundle.
   *
   * @throws Error for an invalid {@link domain}.
   */
  bundle(domain?: string, create?: true): Bundle;
  bundle(domain?: string, create?: false): Bundle | undefined;
  bundle(domain?: string, create = true): Bundle | undefined {
    let bundle: Bundle | undefined = this[bundleSymbol];

    if (domain) {
      validateDomain(domain);

      const chunks = normalizeDomain(domain)
        .toLowerCase()
        .split('/');

      for (const chunk of chunks) {
        if (create || bundle?.hasChild(chunk)) {
          bundle = bundle?.child(chunk);
          continue;
        }
        bundle = undefined;
      }
    }

    return bundle;
  }

  /**
   * Creates a new container for the given domain.
   * The container is detached, never reused and not managed by this class.
   *
   * @param domain the domain to find an existing bundle.
   * @param provider a custom provider to supply values not found in the bundle.
   * @returns the container.
   *
   * @throws Error for an invalid {@link domain}.
   */
  container<T = unknown, Resolver extends ValueResolver<T> = ValueResolver<T>, Provider extends CustomProvider<T, Resolver> = CustomProvider<T, Resolver>>(domain?: string, provider?: Provider): Container<T, Resolver, Provider> {
    const bundle = this.bundle(domain, false);

    if (bundle) {
      return new Container(bundle, provider);
    }
    throw new Error(logger.createMessage(`No bundle found for domain '${domain}'.`));
  }
}

export {
  Odin,
};
