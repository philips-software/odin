# Bundle & Inject

## Bundle

The main export of Odin works like a facade object that exposes the library methods, which can be used both to manually add dependencies to Odin's registry and to build containers for dependencies resolution. 

The snippet below shows how to add a dependency to Odin's registry manually:

```javascript
  import odin from '@philips/odin';

  class MyInjectable { ... }

  const bundle = odin.bundle();
  bundle.register(MyInjectable);
  ...
```

> Most of the times, you do not need to add dependencies to Odin's registry like that, instead, you should use Odin's built-in decorators, to avoid such verbosity. See more [here](./How-to-define-a-dependency).

The snippet below shows how to build a container and how to use it to resolve dependencies:

```javascript
  import odin from '@philips/odin';

  const container = odin.container();
  const instance = container.provide('MyInjectble');
  ...
```

Odin's core instance **is unique**, a singleton. It means that, everything registered into Odin through `odin` facade object is going to be available for the whole application. Sometimes, this is not the desirable scenario, especially when dealing with huge applications, where tons of dependencies are needed. 

In order to both avoid name collision among dependencies from differents parts of the application and to promote low-coupling among these parts, Odin uses the concept of domains.

## Domain

Domains are quite useful for spliting big applications into smaller parts, by turning each part of application responsible for managing its bounded-context dependencies. Thus, any dependencies registered into a domain, will not be available on siblings or parent bundles.

A `domain` represents a chain of bundles, hierarchically organized.

![Registration Lifecycle](./imgs/bundle-hierarchy.png "Registration Lifecycle")

When dealing with manual registration of dependencies, the bundle used to add dependencies should be retrieved from `odin` facade object using a optional parameter, specifing the desired domain. 

The snippet below shows how to do that:

```javascript
  import odin from '@philips/odin';

  class MyInjectable { ... }

  const bundle = odin.bundle('domain1');
  bundle.register(MyInjectable);
  ...
```

In the other hand, while dealing with Odin's build-in *decorators* `@Injectable` and `@Singleton`, the desired domain should be specified along with the decorator definition. 

The snippet below shows how to do that:

```javascript
  import odin, { Injectable } from '@philips/odin';

  @Injectable({ domain: 'domain1' })
  class Injectable1 { ... };
  ...
```

Find below an example of a `domain` in action, giving a brief overview of its behaviors:

```javascript
  import odin, { Injectable } from '@philips/odin';

  @Injectable
  class Injectable0 { ... };

  @Injectable({ domain: 'domain1' })
  class Injectable1 { ... };

  @Injectable({ domain: 'domain1/sub-domain1' })
  class Injectable2 { ... };

  @Injectable({ domain: 'domain2' })
  class Injectable3 { ... };

  //retrieve a new container with bundle 'domain1/sub-domain1'
  const containerDomain1 = odin.container('domain1/sub-domain1');

  containerDomain1.provide(Injectable0.name); // instance of Injectable0
  containerDomain1.provide(Injectable1.name); // instance of Injectable1
  containerDomain1.provide(Injectable2.name); // instance of Injectable2

  // if tries to retrieve a dependency out of bundle chain hirarchy, not found
  containerDomain1.provide(Injectable3.name); // null


  //retrieve another container with bundle 'domain2'
  const containerDomain1 = odin.container('domain2');

  containerDomain1.provide(Injectable0.name); // instance of Injectable0
  containerDomain1.provide(Injectable3.name); // instance of Injectable3

  // if tries to retrieve a dependency out of bundle chain hirarchy, not found
  containerDomain1.provide(Injectable1.name); // null
  containerDomain1.provide(Injectable2.name); // null
```

## @Inject

After retrieving a container from `odin`, the first use of a dependency is through the method `provide`.

```javascript
  const container = odin.container(domain);
  const dependencyInstance = container.provide('MyInjectable', true);
  ...
```

When a dependency is provided by Odin, any class field decorated with `@Inject`, is auto-bound.

```javascript
  @Injetable
  class MyInjectable {

    @Inject
    anotherInjectable;

    ...
  }
```

Odin looks for the correct dependency to be bound to class fields using one of the methods listed below:

### @Inject through field name

This method uses the name of the fields to identity which dependency should be injected into which field, by comparing the name of the field with the name of each dependency available in the dependency's domain.

> For dependencies that didn't specify a domain during their registration, Odin is going to only iterate over the root domain registry, which is the unique domain available in this case.

The field name case sensitiveness is handled according to Odin's configuration, meaning that when Odin is configured to be in Strict mode the field name will be case sensitive, otherwise, it will be case insensitive.

The snippet below shows a dependency resolution considering the Strict mode:

```javascript
  @Injectable
  class AnotherInjectable {
    ...
  }

  @Injectable
  class MyInjectable {

    @Inject
    AnotherInjectable; // matches AnotherInjectable
  }
```

### @Inject with parameters

Sometimes it is necessary to inject a dependency into a field named differently from the dependency name. In this case, the `@Inject` decorator should be used in conjunction with the `name` parameter, which takes precedence over the field name.

The same case sensitiveness applied to the previous method is also applied here.

> When using ODIN in Strict mode it's mandatory to inform the parameter `name` in conjunction with the `@Inject` decorator.

The snippet below shows a dependency resolution considering the parameter `name`:

```javascript
  @Injectable
  class AnotherInjectable {
    ...
  }

  @Injectable
  class MyInjectable {

    @Inject({ name: 'AnotherInjectable' })
    anotherName; // matches AnotherInjectable

  }
```

In order to resolve dependency eagerly, during the instance building, the `@Inject` decorator should be used in conjunction with the `eager` parameter.

```javascript
  class MyInjectable {

    @Inject({ name: 'AnotherInjectable', eager: true })
    anotherName; // matches with AnotherInjectable
                 // and will provide MyInjectable on creation
  }
```

> Each param is independent, and can be used separately or together.

###  @Inject with string

This binding method works as an alias for the previous method, transforming the passed string in an object with the string value as the `name` parameter.

The same case sensitiveness applied to the previous method is also applied here.

```javascript
  @Injectable
  class AnotherInjectable {
    ...
  }

  @Injectable
  class MyInjectable {
    @Inject('AnotherInjectable')
    anotherName; // matches AnotherInjectable
  }
```

Except when using `eager` injection, all the methods mentioned above will only resolve internal dependencies `class fields` right before the first access to the field, see [dependency resolution](./Behaviors-and-lifecycles#dependency-resolution).

## @PostConstruct

According to the [dependency resolution flow](./Behaviors-and-lifecycles#dependency-resolution), Odin first builds the dependency and only after that, it resolves the class fields decorated with @Inject.

It means no injectables are available during dependency construction, i.e., any attempt to read injected fields during instance building are going to return `null`.

To execute something after a dependency is built, use `@PostContruct`.

```javascript
  @Injectable
  class MyInjectable {

    @Inject
    anotherInjectable;

    constructor() {
      console.log(this.anotherInjectable); // null
    }

    @PostContruct
    init() {
      console.log(this.anotherInjectable); // instance of AnotherInjectable
    }
  }
```

It's only possible to have one `@PostContruct` per class.