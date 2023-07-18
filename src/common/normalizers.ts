import { configuration } from '../singletons/configuration.js';
import { isContentfulString } from './validators.js';

/**
 * Normalizes the domain.
 * In strict mode, normalizes the domain to lower case.
 *
 * @param domain the domain to normalize.
 * @returns the normalized domain or the input as-is.
 */
function normalizeDomain<T extends string | null | undefined>(domain: T): T {
  if (isContentfulString(domain) && !configuration.isStrict()) {
    return domain.toLowerCase() as T;
  }
  return domain;
}

/**
 * Normalizes the name or identifier.
 * In strict mode, normalizes the name or identifier to lower case.
 *
 * @param nameOrIdentifier the name or identifier to normalize.
 * @returns the normalized name or identifier or the input as-is.
 */
function normalizeNameOrIdentifier<T extends string | null | undefined>(nameOrIdentifier: T): T {
  if (isContentfulString(nameOrIdentifier) && !configuration.isStrict()) {
    return nameOrIdentifier.toLowerCase() as T;
  }
  return nameOrIdentifier;
}

export {
  normalizeDomain,
  normalizeNameOrIdentifier,
};
