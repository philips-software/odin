import Secrets from './secrets.js';
import CustomProvider from './custom-provider.js';
import { FinalValueResolver, ValueResolver } from './value-resolver.js';

const INJECTABLE_DEF = Symbol('injectable-def');
const CONTAINER_ACCESSOR = Symbol('container-accessor'); //NEVER export!

function noop() {
  // do nothing :|
}

/**
* Describes the expected class registered as injectable.
* @typedef {{new (): object}} Injectable
*/

/**
* Container responsible for manage injectables life-cycle.
* Using the container is possible to retrieve dependecies without
* previous knowlodg about what it is, or from where it comes.
*
* Container works using a domained bundle and a resolver to custom dependencies.
* The bundle contains the dependencies registered throught odin (usually Injectable/Singleton or custom ones).
*
*/
export default class Container {

  /**
  * Bundle containing the dependecies definition.
  * @type Bundle
  */
  bundle = null;

  /**
  * Resolve to non-default injectables.
  */
  resolver = null;

  /**
  * Holds the injectable instances.
  * @type {Object.<string, object>}
  */
  instances = { };

  /**
  * Holds the resolvers for injetable values.
  * @type {Object.<string, ValueResolver>}
  */
  resolvers = { };

  constructor(bundle, resolver = new CustomProvider()) {
    this.bundle = bundle;
    this.resolver = resolver;
  }

  /**
  * Check if there is an instance of the injectable with the given identifier.
  *
  * @param {string} identifier the identifier of ther injectable.
  */
  has(identifier) {
    return !!this.instances[identifier];
  }

  /**
  * Get or provide a resolver of the injectable by the given identifier.
  * The resolve may be a instance of ValueResolver or VolatileValue.
  * When any resolver knows the dependenct, null might be return as well.
  *
  * The identifier is normalized to retrieve the dependency, so is possible to use the custom name.
  * If the injectable is marked as `singleton`, it'll be reused according with the properly life-cycle.
  *
  * @param {string} identifier the identifier of ther injectable.
  * @returns {ValueResolver} a instance of ValueResolver, VolatileValue or null.
  */
  provide(identifier, resolve = false) {
    const ref = this.bundle.getId(identifier);

    let resolver = null;
    if (this.has(ref)) {
      resolver = this.get(ref);
      return resolve ? resolver.get() : resolver;
    }

    const injectable = this.bundle.get(ref);
    if (injectable) {
      resolver = this.resolve(injectable);
    } else {
      resolver = this.resolver.resolve(identifier);
    }

    if (resolver && resolve) {
      return resolver.get() || null;
    }
    return resolver || null;
  }

  /**
  * Get an instance of the injectable with the given identifier.
  *
  * @param {string} identifier the identifier of ther injectable.
  */
  get(identifier) {
    const ref = this.bundle.getId(identifier);
    return this.resolvers[ref] || null;
  }

  /**
  * Discard the injectable value.
  * It's only possible to dicard injectables marked as `singleton`, if it is marked as `dicardable`.
  *
  * @param {string} identifier the identifier of ther injectable.
  */
  discard(identifier) {
    const ref = this.bundle.getId(identifier);
    const instance = this.instances[ref] || identifier;
    const def = this.getDef(instance);
    if (def && Secrets.isDiscardable(def.definition)) {
      delete this.instances[def.id];
    }
  }

  /**
  * Resolve an instance of the given injectable definition.
  *
  * @param {Injectable} injectable the definition to be built.
  */
  resolve(injectable) {
    const { id, definition } = injectable;

    let instance = this.bundle.instantiate(injectable);

    let resolver = this.resolvers[id];

    if (!resolver) {
      if (!Secrets.isSingleton(definition) || !Secrets.isDiscardable(definition)) {
        resolver = new FinalValueResolver(() => instance);
      } else {
        resolver = this.createValueResolver(injectable, id);
      }
    }

    if (Secrets.isSingleton(definition)) {
      this.instances[id] = instance;
      this.resolvers[id] = resolver;
    }
    instance[INJECTABLE_DEF] = { ...injectable };
    setContainer(instance, this);
    this.invokeEagers(instance);
    this.invokePostConstruct(instance);

    return resolver;
  }

  createValueResolver(injectable, id) {
    return new ValueResolver(() => {
      if (!this.instances[id]) {
        this.resolve(injectable);
      }
      return this.instances[id] || null;
    });
  }

  /**
  * Invoke the eager injected properties to bootstrap them.
  *
  * @param {object} injectable the instance to initialize.
  */
  invokeEagers(instance) {
    const eagers = Secrets.getEagers(instance);
    eagers.forEach(eager => noop(instance[eager]));
  }

  /**
  * Invoke the method decorated with PostConstruct.
  *
  * @param {*} instance the injectable instance to invoke the post construct method.
  */
  invokePostConstruct(instance) {
    const methodName = Secrets.getPostContruct(instance);
    if (methodName) {
      instance[methodName]();
    }
  }

  /**
  * Obtain the definitions of the injectable.
  * It returns an object containing: { id, definition, args }.
  *
  * @param {Injectable} instance the injectable instance.
  */
  getDef(instance) {
    return instance[INJECTABLE_DEF];
  }

}

/**
* Setter that creates a hidden property containing the feature injector container.
* The container only can be accessed through the Inject decorator.
*
* @param {object} injectable the injectable instance to receive the hidden property.
* @param {object} container the container instance to store into the injectable.
*/
export function setContainer(injectable, container) {
  injectable[CONTAINER_ACCESSOR] = container;
}

/**
* Getter to retrieve a hidden property which contains feature injector container.
*
* NEVER EXPORT/USE OUTSIDE ODIN OR YOU'LL BE FIRED
*
* @param {object} injectable the injectable instance to receive the hidden property.
*/
export function getContainer(injectable) {
  return injectable[CONTAINER_ACCESSOR];
}
