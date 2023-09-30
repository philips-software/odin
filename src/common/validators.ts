import { logger } from '../singletons/logger.js';

/**
 * Checks if the value is a contentful string.
 * A contentful string has non-zero length and any characters other than whitespace characters (spaces, tabs, line breaks).
 *
 * @param value the value to check.
 * @returns if the value is a contentful string.
 */
function isContentfulString(value: any): value is string {
  return typeof value === 'string' && !isEmptyOrBlankString(value);
}

/**
 * Checks if the value is {@link null} or {@link undefined}.
 *
 * @param value the value to check.
 * @returns if the value is empty.
 */
function isEmpty(value?: any): value is undefined | null {
  return value === undefined || value === null;
}

/**
 * Checks if the value is {@link null}, {@link undefined} or a blank string.
 * A blank string has zero length or only has whitespace characters (spaces, tabs, line breaks).
 *
 * @param value the value to check.
 * @returns if the value is empty or a blank string.
 */
function isEmptyOrBlankString(value?: any): boolean {
  if (typeof value === 'string') {
    return /^\s*$/.test(value);
  }
  return isEmpty(value);
}

/**
 * Customizes the validation of decorator options.
 */
interface ValidateDecoratorOptions {
  /**
   * Allows unknown properties.
   *
   * @default false
   */
  allowUnknown: boolean;

  /**
   * Known properties, used by {@link allowUnknown}.
   */
  known: string[];

  /**
   * Required properties.
   */
  required?: string[];
}

/**
 * Validates decorator options.
 *
 * @param decoratorOptions the options to validate.
 * @param options the options to customize the validation.
 *
 * @throws Error if {@link decoratorOptions} is not an object.
 * @throws Error if {@link decoratorOptions} has unknown properties, according to {@link options.allowUnknown} and {@link options.known}.
 * @throws Error if {@link decoratorOptions} does not have the required properties, according to {@link options.required}.
 * @throws Error if {@link options} is not an object.
 */
function validateDecoratorOptions(decoratorOptions: any, options: ValidateDecoratorOptions): void {
  logger.debug('validating decorator options:', { decoratorOptions, options });

  if (isEmpty(decoratorOptions) || typeof decoratorOptions !== 'object' || Array.isArray(decoratorOptions)) {
    throw new Error(logger.createMessage(`Invalid decorator options. It must be an object.`));
  }

  if (isEmpty(options) || typeof options !== 'object' || Array.isArray(options)) {
    throw new Error(logger.createMessage(`Invalid validator options. It must be an object.`));
  }

  const { allowUnknown = false, known = [], required = [] } = options;

  try {
    if (known.includes('domain') && decoratorOptions.domain) {
      validateDomain(decoratorOptions.domain);
    }

    if (known.includes('name') && decoratorOptions.name) {
      validateNameOrIdentifier(decoratorOptions.name);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(logger.createMessage(`Invalid validator options. ${error.message}`));
    }
  }

  for (const name of required) {
    if (name in decoratorOptions && !isEmpty(decoratorOptions[name])) {
      continue;
    }
    throw new Error(logger.createMessage(`Invalid decorator options. The option '${name}' is required.`));
  }

  if (allowUnknown) {
    return;
  }

  const names = Object.getOwnPropertyNames(decoratorOptions);
  const unknown = names.filter(name => !known.includes(name));

  if (unknown.length > 0) {
    throw new Error(logger.createMessage(`Invalid decorator options. The unknown options are not allowed: ${unknown.join(', ')}.`));
  }
}

interface ValidateDomainOptions {
  /**
   * Allows the domain to denote hierarchy by separating chunks with a /.
   *
   * @default true
   */
  allowHierarchy: boolean;
}

/**
 * Validates domain.
 *
 * @param domain the domain to be validated.
 * @param options the options to customize the validation.
 *
 * @throws Error if the {@link domain} is not a contentful string.
 * @throws Error if the {@link domain} has chunks and {@link options.allowHierarchy} is {@link false}.
 * @throws Error if any of the {@link domain} chunks is blank.
 * @throws Error if any of the {@link domain} chunks is empty.
 * @throws Error if any of the {@link domain} chunks has spaces.
 */
function validateDomain(domain?: string, options?: ValidateDomainOptions): void {
  logger.debug('validating domain:', domain);

  const { allowHierarchy = true } = options ?? {};

  if (!isContentfulString(domain)) {
    throw new Error(logger.createMessage(`Invalid domain. It should be a contentful string.`));
  }

  if (!allowHierarchy && domain.includes('/')) {
    throw new Error(logger.createMessage(`Invalid domain '${domain}'. It cannot have multiple chunks here.`));
  }

  const chunks = domain.split('/');

  for (const chunk of chunks) {
    if (chunk.includes(' ')) {
      throw new Error(logger.createMessage(`Invalid domain '${domain}'. It cannot have empty spaces in '${chunk}'.`));
    }

    if (isEmptyOrBlankString(chunk)) {
      throw new Error(logger.createMessage(`Invalid domain '${domain}'. It cannot have empty chunks.`));
    }
  }
}

/**
 * Validates name or identifier.
 *
 * @param nameOrIdentifier the name or identifier to validate.
 *
 * @throws Error if the {@link nameOrIdentifier} is not a contentful string.
 * @throws Error if the {@link nameOrIdentifier} has chunks.
 * @throws Error if the {@link nameOrIdentifier} has spaces.
 */
function validateNameOrIdentifier(nameOrIdentifier?: string): void {
  logger.debug('validating name or identifier:', nameOrIdentifier);

  if (!isContentfulString(nameOrIdentifier)) {
    throw new Error(logger.createMessage(`Invalid name or identifier. It should be a contentful string.`));
  }

  if (nameOrIdentifier.includes(' ')) {
    throw new Error(logger.createMessage(`Invalid name or identifier '${nameOrIdentifier}'. It cannot have empty spaces.`));
  }

  if (nameOrIdentifier.includes('/')) {
    throw new Error(logger.createMessage(`Invalid name or identifier '${nameOrIdentifier}'. It cannot have chunks.`));
  }
}

export {
  isContentfulString,
  isEmpty,
  isEmptyOrBlankString,
  validateDecoratorOptions,
  validateDomain,
  validateNameOrIdentifier,
};

export type {
  ValidateDecoratorOptions,
  ValidateDomainOptions,
};
