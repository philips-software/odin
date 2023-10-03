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

  @Inject('name-as-string')
  injectString: any;

  @Inject({})
  injectOptions: any;

  @Inject({ name: 'name-in-options' })
  injectOptionsWithName: any;
}
new Injects('injects');
