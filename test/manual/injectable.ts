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

// @ts-expect-error: TS2554, too few or too many arguments
@Injectable()
class InjectableCall extends Base {}
new InjectableCall('injectable-call');

@Injectable({ domain: 'qwe', singleton: true })
class InjectableOptions extends Base {}
new InjectableOptions('injectable-options');

@Injectable({ domain: 'qwe', singleton: true, name: 'name-in-options' })
class InjectableOptionsWithName extends Base {}
new InjectableOptionsWithName('injectable-options-with-name');
