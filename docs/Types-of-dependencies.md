# Types of Dependency

During the *registration stage*, Odin puts some "invisible information" into dependency's prototype - *marks* to make the comprehension easier.

These information - not available from outside, are used to determine: how the dependency must be created and managed inside Odin and for how long it's supposed to be alive.

The current available *marks* are: `singleton`, `discardable` and `custom`. They can also be mixed to create custom behaviors.

> Any dependency willing to be REGISTERED into Odin at any given time, `must be a class`.
> This rule does not apply to *custom provided* dependencies, see [here](./Container-and-customprovider#custom-provider).

By default ODIN has only two types of dependency: `Injectable` and `Singleton`.

```javascript
  import { Injectable, Singleton } from '@odinjs/odin';

  @Injectable
  class MyInjectable {

    sayHi() {
      console.log(`Hi, I'm always a new potato!`);
    }
  }

  @Singleton
  class MySingleton {

    sayHi() {
      console.log(`Hi, I'm the same potato forever!`);
    }
  }
```

The main difference between these two types of dependencies, can be roughly described as the following:

- Whenever you inject an `@Injectable`, it will always be a new instance. 
- Whenever you inject a `@Singleton`, it will always be the same instance. ***by container***.

> Remember that keeping complex states into *singletons* might be a bad idea.

For better understand dependencies definition, see [here](./How-to-define-a-dependency#injectable).
