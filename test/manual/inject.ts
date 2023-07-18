import { Inject } from '../../src/decorators/inject.js';

class Base {
  base: string;

  constructor(base: string) {
    this.base = base;
  }
}

class Injects extends Base {
  @Inject
  injectExpression: any;

  // @ts-expect-error: cant call without arguments
  @Inject()
  injectCall: any;

  @Inject('qwe')
  injectString: any;

  @Inject({ name: 'qwe' })
  injectOptions: any;
}
new Injects('injects');
