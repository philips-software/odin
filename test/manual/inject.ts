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

  // @ts-expect-error: TS2554, too few or too many arguments
  @Inject()
  injectCall: any;

  @Inject('name')
  injectString: any;

  @Inject({ name: 'name' })
  injectOptions: any;
}
new Injects('injects');
