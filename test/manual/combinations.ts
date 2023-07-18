import { Initializer } from '../../src/decorators/initializer.js';
import { Inject } from '../../src/decorators/inject.js';
import { Injectable } from '../../src/decorators/injectable.js';

class Base {
  base: string;

  constructor(base: string) {
    this.base = base;
  }
}

@Injectable({ singleton: true })
class Target extends Base {}

@Injectable
class Combinations extends Base {
  @Inject
  target1?: Target;

  @Inject
  target2?: Target;

  @Initializer
  init(): void {
    console.log('Combinations init');
  }
}
new Combinations('combinations');
