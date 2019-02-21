# ODIN

[![Build Status](https://travis-ci.com/philips-software/odin.svg?branch=master)](https://travis-ci.com/philips-software/odin)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=philips-software_odin&metric=alert_status)](https://sonarcloud.io/dashboard?id=philips-software_odin)

ODIN (On-demand Dependency InjectioN) is a Dependency Injection library inspired by Java CDI, enabling lazy loading pattern on JavaScript applications, providing every resource on-demand.

Dependency Injection (DI) is a technique used to reduce programmer's concern about objects creation and life-cycle. Delegating the management to DI, is possible to build a **flexible coupling** among resources and parts of the application.

When injecting a resource through the DI, it's only necessary think about how to use, neither about how it is provided or discarded - and well, that is why ODIN has born.

> Besides of the _lazy load_, the resources are only instantiated when necessary. It means that even when a class is instantiated, not necessarily its dependencies were as well. By providing the dependencies at the last possible moment a lot of computational resource are saved, reducing the application requirements and extending the useful life time.
>
> Another feature available is the possiblity to create a CustomProvider, customizing dependencies and the way that these ones are provided.


## Dependencies

ODIN was built in Javascript, but uses [`decorators`](https://github.com/tc39/proposal-decorators) - an Stage 2 proposal from tc39 - to create a better experience on providing dependencies.

Since that [`decorators`](https://github.com/tc39/proposal-decorators) is not nativally supported by browsers or node, projects using ODIN will depends on [babel](https://babeljs.io/) and [decorators pollifyl](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) (legacy mode).

## Installation

To use ODIN, execute:

```
$ npm i --save @philips/odin
```

## Usage

To use ODIN is simple. Define a dependecy and inject it in another class. 🙃

```javascript
  import { Injectable, Singleton } from '@philips/odin';

  @Singleton
  class MyDependency {

    sayHi() {
      console.log(`Hi, I'm a potato!!`);
    }
  }

  @Injectable
  class AnotherDependency {

    @Inject
    myDependency;

    doSomething() {
      this.myDependency.sayHi();
    }
  }

```

To initialize the dependency injector, it's necessary to create a container - that will provide dependencies instances.

```javascript
  import odin from '@philips/odin';

  // creates a container based on root bundle
  const container = odin.container();

  // container is responsible to provide and manage all dependencies
  const intance = container.provide(AnotherDependency.name);

  // using provided dependency, that will use antoher dependency inside 
  instance.doSomething();

```

To make the better use of ODIN, you could read our [wiki](http://github.com/philips-software/odin/wiki).

## Known issues

See [issues](http://github.com/philips-software/odin/issues).

## Contributing

Please refer to our [Contribution Guide](./CONTRIBUTING.md) for instructions on how to setup the development environment.

## Contact / Getting help

Join us on our [Slack channel](https://odin-evangelists.slack.com).

## License

[MIT](./LICENSE.md)

---

### Author

Thiago Teixeira <thiago.teixeira@philips.com>
