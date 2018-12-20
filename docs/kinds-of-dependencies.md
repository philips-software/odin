# Kinds of Dependency

During the *registration stage*, ODIN puts some "invisible information" into dependecy's prototype - *marks* to make the comprehension easier.

These information - not available from outside, are used to determine: how the dependency must be created and managed inside ODIN, how long it will live and its scope.

The existent *marks* are: `singleton`, `discardable` and `custom`. They might be mixed to create custom behaviors.

> No matter the kind - provided by ODIN or not, IF REGISTERED INTO ODIN: the dependency `must be a class`.
>
> This rule does not apply to *custom provided* dependencies, see [here](./container-and-custom-provider.md).


By default ODIN has only two kinds of dependency: `Injectable` and `Singleton`.

```javascript
  import { Injectable, Singleton } from '@philips/odin';

  @Injectable
  class MyInjectable {

    sayHi() {
      console.log(`Hi, I'm a potato!`);
    }
  }

  @Singleton
  class MySingleton {

    sayHi() {
      console.log(`Hi, I'm a potato forever!`);
    }
  }
```

The main difference between then is: each time that you inject a `@Injectable` will be a new instance, for `@Singleton` will always be the same one ***by container***.

> Remember that keeping large states into *singletons* might be a bad ideia.

For a better understand of dependency definition, see [here](./define-dependency.md).

---------------------
#### See more

- [Behaviors and life-cicles](./behaviors-and-life-cicles.md)
- [How to define a dependency](./define-dependency.md)
- [Bundles & Inject](./bundle-and-inject.md)
- [Custom Provider](./container-and-custom-provider.md)
- [Configuration](./configuration.md)