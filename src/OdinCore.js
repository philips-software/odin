import Bundle from './registry/Bundle';
import Container from './container/Container';
import CustomProvider from './container/CustomProvider';
import { error } from './utils/Logger';

const BUNDLE = Symbol('bundle');

/**
 * Core of Odin, mantain all bundles and injectables registereds.
 * It builds Container's based on domain.
 *
 * Should exists only one instance at time.
 */
export default class OdinCore {

  constructor() {
    this[BUNDLE] = new Bundle('odin');
  }

  /**
   * Navigate througt domains based on path domain received and get it.
   *
   * @param {string} domain the domain to navigate and get the bundle.
   * @param {*} create if should create the bundle, when does not exist.
   */
  bundle(domain, create = true) {
    let bundle = this[BUNDLE];

    if (domain) {
      if (domain !== domain.trim()) {
        error(`Invalid domain '${domain}'.`);
      }
      const path = domain.toLowerCase().split('/');
      bundle = path.reduce((b, p) => {
        if (p !== p.trim()) {
          error(`Invalid sub domain '${p}' on domain '${domain}'.`);
        }
        if (create || (b && b.hasChild(p))) {
          return b.child(p);
        }
      }, bundle);
    }

    return bundle;
  }

  /**
  * Create a new container to the domain, never reusing.
  * Every call returns a new instance, and this one is not managed by this class.
  *
  * @param {string} domain the domain that must create a container.
  * @param {CustomProvider} resolver resolver responsible to for dependencies not registered in bundles.
  */
  container(domain, resolver = new CustomProvider()) {
    const bundle = this.bundle(domain, false);
    if (!bundle) {
      error(`There is no bundle to domain '${domain}'.`);
    }
    return new Container(bundle, resolver);
  }
}