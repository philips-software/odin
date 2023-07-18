import { normalizeNameOrIdentifier } from '../common/normalizers.js';
import { isContentfulString } from '../common/validators.js';
import { PermissiveOptions } from '../types.js';
import type { Injectable } from '../types.js';

interface DescriptorOptions extends PermissiveOptions {
  /**
   * A custom name, will be defined as the custom identifier.
   */
  name?: string;
}

/**
 * Describes an injectable.
 */
class Descriptor {

  /**
   * Custom identifier.
   */
  public readonly identifier?: string;

  /**
   * The injectable itself.
   */
  public readonly injectable: Injectable;

  /**
   * The injectable name.
   */
  public readonly name: string;

  /**
   * Custom options.
   */
  public readonly options?: Omit<DescriptorOptions, 'name'>;

  constructor(injectable: Injectable, options?: DescriptorOptions) {
    this.name = injectable.name;
    this.injectable = injectable;

    if (options) {
      const { name, ...rest } = options;

      if (isContentfulString(name) && name !== this.name) {
        // TODO: override the injectable name instead of creating an exclusive identifier
        this.identifier = name;
      }

      this.options = { ...rest };
    }

    this.identifier = normalizeNameOrIdentifier(this.identifier);
    this.name = normalizeNameOrIdentifier(this.name);
  }
}

export {
  Descriptor,
};

export type {
  DescriptorOptions,
};
