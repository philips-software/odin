import { Initializer } from '../../src/decorators/initializer.js';

class Base {
  base: string;

  constructor(base: string) {
    this.base = base;
  }
}

class Initializers extends Base {
  @Initializer
  initExpression(): void {}

  // @ts-expect-error: cant call without arguments
  @Initializer()
  initCall(): void {}

  // @ts-expect-error: cant call with any arguments
  @Initializer({ name: 'qwe' })
  initOptions(): void {}
}
new Initializers('initializers');
