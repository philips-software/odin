import { Descriptor } from '../common/descriptor.js';
import type { DescriptorOptions } from '../common/descriptor.js';
import { normalizeNameOrIdentifier } from '../common/normalizers.js';
import { logger } from '../singletons/logger.js';
import type { Injectable, Store } from '../types.js';

/**
 * Holds injectable {@link Descriptor} as a map.
 */
class Registry implements Store {

  private readonly descriptorsByIdentifier = new Map<string, Descriptor>();
  private readonly descriptorsByInjectable = new WeakMap<Injectable, Descriptor>();
  private readonly descriptorsByName = new Map<string, Descriptor>();

  register(injectable: Injectable, options?: DescriptorOptions): string {
    this.validateRegistration(injectable, options);

    const descriptor = new Descriptor(injectable, options);
    const { identifier, name } = descriptor;

    if (identifier) {
      this.descriptorsByIdentifier.set(identifier, descriptor);
    }

    this.descriptorsByInjectable.set(injectable, descriptor);
    this.descriptorsByName.set(name, descriptor);

    return name;
  }

  deregister(injectable: Injectable): boolean {
    const descriptor = this.descriptorsByInjectable.get(injectable);

    if (!descriptor) {
      return false;
    }

    const { identifier, name } = descriptor;

    if (identifier) {
      if (this.descriptorsByIdentifier.has(identifier)) {
        this.descriptorsByIdentifier.delete(identifier);
      }
    }

    this.descriptorsByInjectable.delete(injectable);

    if (this.descriptorsByName.has(name)) {
      this.descriptorsByName.delete(name);
    }

    return true;
  }

  has(nameOrIdentifier?: string): boolean {
    nameOrIdentifier = normalizeNameOrIdentifier(nameOrIdentifier);

    if (nameOrIdentifier) {
      return this.descriptorsByIdentifier.has(nameOrIdentifier)
        || this.descriptorsByName.has(nameOrIdentifier);
    }
    return false;
  }

  get(nameOrIdentifier?: string): Descriptor | undefined {
    nameOrIdentifier = normalizeNameOrIdentifier(nameOrIdentifier);

    if (nameOrIdentifier) {
      return this.descriptorsByIdentifier.get(nameOrIdentifier)
        ?? this.descriptorsByName.get(nameOrIdentifier);
    }
    return undefined;
  }

  validateRegistration(injectable: Injectable, options?: DescriptorOptions): void {
    const descriptor = new Descriptor(injectable, options);
    const { identifier, name } = descriptor;

    if (this.has(identifier)) {
      throw new Error(logger.createMessage(`There already is an injectable '${identifier}' registered.`));
    }

    if (this.has(name)) {
      throw new Error(logger.createMessage(`There already is an injectable '${name}' registered.`));
    }
  }

}

export {
  Registry,
};
