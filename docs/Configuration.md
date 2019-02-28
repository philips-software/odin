# Configuration

Odin can be configured to use a Strict mode validation for its dependencies.

This configuration can be done through the `OdinConfig` decorator, as shown in the following example.

```javascript
import { OdinConfig } from '@odinjs/odin';

@OdinConfig({ strict: true })
class OdinBootstrap {

}
```


The `strict` parameter indicates whether Odin must be case sensitive towards dependency names. It means that a name could be repeated when used with a different case, see below.

```javascript
  @Injectable
  class CrazyPotato {

  }

  @Injectable
  class CrAzYPotato {

  }

  @Injectable
  class AnotherPotato {

    @Inject('CrazyPotato')
    crazyPotato1;

    @Inject('CrAzYPotato')
    crazyPotato2;
  }
```