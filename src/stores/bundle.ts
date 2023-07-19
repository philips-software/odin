import { Descriptor } from '../common/descriptor.js';
import type { DescriptorOptions } from '../common/descriptor.js';
import { normalizeDomain } from '../common/normalizers.js';
import { isEmpty, validateDomain } from '../common/validators.js';
import { logger } from '../singletons/logger.js';
import type { Injectable, Store } from '../types.js';

import { Registry } from './registry.js';

/**
 * Holds injectable {@link Registry} as a hierarchy.
 */
class Bundle implements Store {

  // @ts-expect-error: TS6133, never read
  private readonly domain: string;
  private readonly parent?: Bundle;

  private readonly children = new Map<string, Bundle>();
  private readonly registry: Registry = new Registry();

  /**
   * Creates a new bundle.
   *
   * @param domain the bundle domain.
   * @param parent the parent bundle.
   *
   * @throws Error for an invalid {@link domain}.
   * @throws Error for an invalid {@link parent}.
   */
  constructor(domain: string, parent?: Bundle) {
    validateDomain(domain, { allowHierarchy: false });

    if (!isEmpty(parent) && !(parent instanceof Bundle)) {
      throw new Error(logger.createMessage('The parent must be or extend Bundle.'));
    }

    this.domain = normalizeDomain(domain);
    this.parent = parent;
  }

  register(injectable: Injectable, options?: DescriptorOptions): string {
    this.validateRegistration(injectable, options);
    return this.registry.register(injectable, options);
  }

  deregister(injectable: Injectable): boolean {
    return this.registry.deregister(injectable);
  }

  has(nameOrIdentifier?: string): boolean {
    return this.registry.has(nameOrIdentifier)
      || (this.parent?.has(nameOrIdentifier) ?? false);
  }

  get(nameOrIdentifier?: string): Descriptor | undefined {
    return this.registry.get(nameOrIdentifier)
      ?? this.parent?.get(nameOrIdentifier);
  }

  validateRegistration(injectable: Injectable, options?: DescriptorOptions): void {
    this.registry.validateRegistration(injectable, options);
    this.parent?.validateRegistration(injectable, options);
  }

  /**
   * Creates a new instance of a descriptor's injectable.
   *
   * @param descriptor the descriptor to instantiate.
   * @returns a new instance of the injectable.
   */
  instantiate(descriptor: Descriptor): InstanceType<Injectable> {
    const { injectable, options } = descriptor;
    const args = options
      ? { ...options }
      : undefined;

    return new injectable(args);
  }

  /**
   * Gets or creates a child bundle.
   *
   * @param domain the child domain.
   * @returns the child bundle, new or existing.
   *
   * @throws Error for an invalid {@link domain}.
   */
  child(domain: string): Bundle {
    validateDomain(domain);

    domain = normalizeDomain(domain);

    const bundle = this.children.get(domain)
      ?? new Bundle(domain, this);

    this.children.set(domain, bundle);

    return bundle;
  }

  /**
   * Checks if there is a child bundle for the given domain.
   *
   * @param domain the child domain.
   * @returns if there is a child bundle for the given domain.
   */
  hasChild(domain?: string): boolean {
    domain = normalizeDomain(domain);

    if (domain) {
      return this.children.has(domain);
    }
    return false;
  }

}

export {
  Bundle,
};
