# Define Dependency

Dependency definitions on Odin are typically realized by applying the *decorators* `@Injectable` and `@Singleton` to class definitions.

## @Injectable

The `@Injectable` decorator defines a Odin dependency, and it has a non-mandatory parameter `domain`.

> The `domain` determines the scope of the dependecy. In other words, it defines a type of hierarchy inside Odin's register, see more [here](./Bundle-and-Inject#domain).
>
> This hierarchy determines which dependencies are available when creating a container - which provides the dependencies instances.

```javascript
  import { Injectable } from '@philips-software/odin';

  @Injectable({ domain: 'scope1' })
  class MyInjectable {

  }

```

Odin's registry always has a `root` scope, and dependencies registered inside it can be injected from any container - no matter the scope or domain.

Any container created through Odin's registry is able to instantiate these dependencies, but:

### `EACH CONTAINER HAS ITS OWN INSTANCES`.

---------------------
## @Singleton

Differently from `@Injectable`, dependencies of the type `@Singleton` are not exclusive for each instance. It means, the first instance will be kept by Odin and reused everywhere it is `@Injected` - again, **into the same container**.

```javascript
  import odin, { Singleton, Injectable } from '@philips-software/odin';

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
By using the main export `odin` and `Secrets`, it is possible to declare dependencies without any decorator ( i.e. `@Singleton`).

```javascript
  import odin from '@philips-software/odin';

  class MyDependency {

    constructor(args) {
      this.prop1 = args.prop1;
    }

    doSomething() {
      console.log(this.prop1);
    }

  }

  const bundle = odin.bundle();
  // the second param 'args' will be passed on MyDependecy constructor each time
  bundle.register(MyDependency, { prop1: 'Potato' });

```

Or even, build your own decorators.

```javascript
  import odin, { Secrets } from '@philips-software/odin';

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
