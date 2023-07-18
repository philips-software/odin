import { Injectable } from '../../src/decorators/injectable.js';

class Base {
  base: string;

  constructor(base: string) {
    this.base = base;
  }
}

@Injectable
class InjectableExpression extends Base {}
new InjectableExpression('injectable-expression');

// @ts-expect-error: cant call without arguments
@Injectable()
class InjectableCall extends Base {}
new InjectableCall('injectable-call');

@Injectable({ singleton: true, domain: 'qwe' })
class InjectableOptions extends Base {}
new InjectableOptions('injectable-options');
