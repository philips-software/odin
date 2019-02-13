# Container & Custom Provider


## Container

The `container` is responsible for resolving registred dependencies, instantiating or forwarding dependencies values accordingly.

By default, Odin containers can only provide instances of `class` types, i.e., the values provided by the containers are typically objects. However, Odin also offers the possibility of implementing a **Custom Provider** to handle specific scenarios, when injecting a non-object value to a variable is required, for example.

## Custom Provider

In order to configure a container to use a **Custom Provider**, an instance of such custom provider should be passed as an argument to the container's factory method, as shown below.

```javascript
  import odin, { CustomProvider } from '@philips/odin';

  const container = odin.container('domain', new CustomProvider());

  ...
```

The Custom Provider object has only two public methods: `register` and `get`.

### register

The method `register` receives two params: `name` and an instance of a `ValueResolver`. The `name` will be used by Odin to identify which resolver it should use to evaluate dependencies, comparing this `name` with the name of the resquested dependencies.

The `ValueResolver` must receive a function in the constructor - which is the value generator, and has a method `get` that invokes the function retrieving the value.

Besides `ValueResolver`, Odin also provides another implementation of *resolver*: `FinalValueResolver`. It only evaluates the value once and returns always the first invocation value when calling `get` again.

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

When the *resolver* is invoked by `container.provide(...)`, no arguments is passed. But if invoked by dependency resolution - any use of `@Inject`, the instance which is requiring the dependency will be passed as argument.

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

When using `FinalValueResolver`, no matter the context, once evaluated the value never changes.

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

An instance of `CustomProvider` can be shared between containers, instead of creating new ones each time. Sharing the instances or not, take care about leaking resources or keeping large states.
