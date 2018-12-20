# Container & Custom Provider


## Container

The `container` provides instances of dependencies, managing them by kind.

By default, ODIN only registers `class` as dependency. To provide another kind of dependency, ODIN allows to create a **Custom Provider**, that must be used when creating a container.

```javascript
  import odin, { CustomProvider } from '@philips/odin';

  const container = odin.container('domain', new CustomProvider());

  ...
```

## Custom Provider

Custom Provider allows to create a provider for special dependencies.

It has only two methods: `register` and `get`.

### register

The method `register` receives two params: `name` and a intance of `ValueResolver`, the name will be used to make the resolver available to inject through container's instance.

The `ValueResolver` must receive a function in the constructor - which is the value generator, and has a method `get` that invokes the function retrieving the value.

Besides `ValueResolver`, ODIN still provides another implementation of *resolver*: `FinalValueResolver`. It only evaluates the value once and returns always the first invocation value when calling `get` again.

```javascript
  import odin, { CustomProvider, ValueResolver, FinalValueResolver } from '@philips/odin';

  const customProvider = new CustomProvider();

  let last = 1;

  customProvider.register('custom', new ValueResolver(() => {
    return last++;
  }));

  customProvider.register('customButFinal', new FinalValueResolver(() => {
    return last++;
  }));

  const container = odin.container('domain', customProvider);

  container.provide('custom', true); // 1;
  container.provide('custom', true); // 2;
  container.provide('custom', true); // 3;

  container.provide('customButFinal', true); // 4;
  container.provide('customButFinal', true); // 4;

  container.provide('custom', true); // 5;

  container.provide('customButFinal', true); // 4;
```

When the *resolver* is invoked by `container.provide(...)`, no arguments would be passed.

But if invoked by dependency resolution - uses of `@Inject`, the instance requiring the dependency will be received as argument.

```javascript
  import odin, { CustomProvider, ValueResolver} from '@philips/odin';

  ...

  customProvider.register('custom', new ValueResolver((instance) => {
    return instance;
  }));

  ...

  // retrieve 'custom' without a context (@Inject)
  container.provide('custom', true); //undefined

  @Injectable
  class MyInjectable {

    @Inject
    custom;

    getCustom() {
      return this.custom;
    }
  }

  // retrieve MyInjectable instance
  const myInjectable = container.provide(MyInjectable.name, true);

  // will retrieve 'custom' using myInjectable instance as context
  myInjectable.getCustom(); // MyInjectable instance

```

When using `FinalValueResolver` not matter the context, once evaluated the value never changes.

```javascript
  import odin, { CustomProvider, FinalValueResolver} from '@philips/odin';

  ...

  //now declaring a FinalValueResolver
  customProvider.register('custom', new FinalValueResolver((instance) => {
    return instance;
  }));

  ...

  // retrieve 'custom' without a context (@Inject)
  container.provide('custom', true); //undefined

  @Injectable
  class MyInjectable {

    @Inject
    custom;

    getCustom() {
      return this.custom;
    }
  }

  // retrieve MyInjectable instance
  const myInjectable = container.provide(MyInjectable.name, true);

  // will retrieve 'custom' using myInjectable instance as context
  myInjectable.getCustom(); // undefined
```


The instance of `CustomProvider` might be shared between containers, and isn't mandatory to create these ones. Sharing the instance or not, take care about leaking resources or keeping large states.

---------------------
#### See more

- [Behaviors and life-cicles](./behaviors-and-life-cicles.md)
- [Kinds of dependencies](./kinds-of-dependencies.md)
- [How to define a dependency](./define-dependency.md)
- [Bundles & Inject](./bundle-and-inject.md)
- [Configuration](./configuration.md)