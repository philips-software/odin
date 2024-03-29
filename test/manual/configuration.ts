import { Configuration } from '../../src/decorators/configuration.js';

class Base {
  base: string;

  constructor(base: string) {
    this.base = base;
  }
}

// @ts-expect-error: TS2554, too few or too many arguments
@Configuration
class ConfigurationExpression extends Base {}
new ConfigurationExpression('configuration-expression');

// @ts-expect-error: TS2554, too few or too many arguments
@Configuration()
class ConfigurationCall extends Base {}
new ConfigurationCall('configuration-call');

@Configuration({ strict: true })
class ConfigurationOptions extends Base {}
new ConfigurationOptions('configuration-options');
