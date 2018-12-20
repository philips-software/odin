# Define Dependency

The easier way to define a dependecy is using the *decorators* `@Injectable` and `@Singleton`.

## @Injectable

The `@Injectable` decorator defines a ODIN dependecy, and it has a non-mandatory param `domain`.

> The `domain` determines the scope of the dependecy; in other words, it defines a kind of hierarchy inside the ODIN register, see more [here](./bundle-and-inject.md).
>
> This hierarchy determines which dependencies are available when creating a container - that provides the dependencies instances.

```javascript
  import { Injectable } from '@philips/odin';

  @Injectable({ domain: 'scope1' })
  class MyInjectable {

  }

```

ODIN's registry always begin with `root` scope, and dependencies registered inside it can be injected from any container - no matter the scope or domain.

Any container create through ODIN registry is able to instance these dependencies, but:
### `EACH CONTAINER HAS ITS OWN INSTANCES`.

---------------------
## @Singleton

Differently from `@Injectable`, dependencies of the kind `@Singleton` are not exclusive for each instance. It means, the first instance will be kept by ODIN and reused everywhere it be `@Inject`ed - again, **into the same container**.

```javascript
  import odin, { Singleton, Injectable } from '@philips/odin';

  @Singleton
  class MySingleton {
    value: 1;

    next() {
      return this.value++;
    }
  }

  @Injectable
  class CoolInjectable {
    @Inject;
    mySingleton; // depends on MySingleton
                 // every instance of CoolInjectable will receive
                 // the same instance of MySingleton if is the same container

    getValue() {
      return this.mySingleton.next();
    }
  }

  // create a container
  const container = odin.container();

  // provide a instance of CoolInjectable
  const first = container.provide(CoolInjectable.name);
  // provide a NEW instance of CoolInjectable
  const second = container.provide(CoolInjectable.name);

  console.log(first.getValue()); //1
  console.log(second.getValue()); //2

  console.log(first.getValue()); //3
  console.log(second.getValue()); //4


  // create another container
  const container2 = odin.container();

  // provide a NEW instance of CoolInjectable, from another container
  const third = container.provide(CoolInjectable.name);

  // here will be a new MySingleton because it is another container
  console.log(third.getValue()); //1
```


---------------------

## Defining dependency without *@decorator*

The `@Injectable` and `@Singleton` decorators are sugars to define dependencies.
Using the main export `odin` and `Secrets` is possible to declare dependencies without any @.

```javascript
  import odin from '@philips/odin';

  class MyDependency {

    constructor(args) {
      this.prop1 = args.prop1;
    }

    doSomething() {
      console.log(this.prop1);
    }

  }

  const bundle = odin.bundle();
  // the second param 'args' will passed on MyDependecy constructor each time
  bundle.register(MyDependency, { prop1: 'Potato' });

```

Or even, built your own decorators.

```javascript
  import odin, { Secrets } from '@philips/odin';

  function MySingleton(definition) {

    Secrets.setSingleton(definition);
    Secrets.setCustom(definition);

    const bundle = odin.bundle('fix-domain');
    bundle.register(definition, args);

    return definition;
  }

  @MySingleton
  class MyDependency {

    doSomething() {
      console.log(`Hi, I'm a custom decorator to define a singleton.`);
    }

  }

```

---------------------
#### See more

- [Behaviors and life-cicles](./behaviors-and-life-cicles.md)
- [Kinds of dependencies](./kinds-of-dependencies.md)
- [Bundles & Inject](./bundle-and-inject.md)
- [Custom Provider](./container-and-custom-provider.md)
- [Configuration](./configuration.md)