import type { Descriptor, DescriptorOptions } from './common/descriptor.js';

type ClassDecorator = DecoratorFunction<ClassDecoratorTarget, ClassDecoratorContext>;
type ClassDecoratorCallback = (...args: any[]) => any;
type ClassDecoratorTarget = Injectable;

type ClassFieldDecorator<This> = DecoratorFunction<ClassFieldDecoratorTarget, ClassFieldDecoratorContext<This>>;
type ClassFieldDecoratorCallback = (initialValue: unknown) => unknown | void;
type ClassFieldDecoratorTarget = undefined;

type ClassMethodDecorator<This> = DecoratorFunction<ClassMethodDecoratorTarget<This>, ClassMethodDecoratorContext<This, ClassMethodDecoratorTarget<This>>>;
type ClassMethodDecoratorCallback = (initialValue: unknown) => unknown | void;
type ClassMethodDecoratorTarget<This> = (this: This, ...args: any[]) => any;

type DecoratorFunction<Target, Context> = (target: Target, context: Context) => Target | void;

type Injectable = new (...args: any[]) => any;

interface PermissiveOptions {
  [key: string]: unknown;
}

type Resolver<T = unknown> = (injectable?: Injectable) => T;

interface Store {
  /**
   * Registers an injectable class.
   * The class should be retrieved using the class name or a custom identifier.
   *
   * @param injectable the injectable class.
   * @param options the options.
   * @returns the registered name.
   *
   * @throws Error if the name or identifier is already registered.
   */
  register(injectable: Injectable, options?: DescriptorOptions): string;

  /**
   * Deregisters an injectable class.
   * This method should be called before re-registering an injectable class.
   *
   * @param injectable the injectable class.
   * @returns if the injectable has been removed or not.
   */
  deregister(injectable: Injectable): boolean;

  /**
   * Checks if there is an injectable registered with the given name or identifier.
   *
   * @param nameOrIdentifier the name or identifier.
   * @returns if there is an injectable registered with the given name or identifier.
   */
  has(nameOrIdentifier?: string): boolean;

  /**
   * Gets a descriptor of the injectable registered with the given name or identifier.
   *
   * @param nameOrIdentifier the name or identifier.
   * @returns the descriptor.
   */
  get(nameOrIdentifier?: string): Descriptor | undefined;

  /**
   * Validates if there is an injectable registered with the given name or identifier.
   *
   * @param injectable the injectable class.
   * @param options the options.
   *
   * @throws Error if the name or identifier is already registered.
   */
  validateRegistration(injectable: Injectable, options?: DescriptorOptions): void;
}

export type {
  ClassDecorator,
  ClassDecoratorCallback,
  ClassDecoratorTarget,
  ClassFieldDecorator,
  ClassFieldDecoratorCallback,
  ClassFieldDecoratorTarget,
  ClassMethodDecorator,
  ClassMethodDecoratorCallback,
  ClassMethodDecoratorTarget,
  DecoratorFunction,
  Injectable,
  PermissiveOptions,
  Resolver,
  Store,
};
