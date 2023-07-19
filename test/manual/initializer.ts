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

  // @ts-expect-error: TS2554, too few or too many arguments
  @Initializer()
  initCall(): void {}

  // @ts-expect-error: TS2345, invalid argument type
  @Initializer({ name: 'name' })
  initOptions(): void {}
}
new Initializers('initializers');
