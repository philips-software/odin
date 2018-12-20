# About Life-cycle

ODIN is a Dependency Injection lib implementation, providing every resource on-demand.

Odin's life-cycle can be splitted in two stages: *registration* and *consume*.


## Registration
![Registration Life cycle](./imgs/life-cycle--registration.png "Registration Life cycle")

There are two agents acting during registration stage: the JavaScript engine (browser or node), and ODIN.
- The engine is responsible for evaluating the application code;
- Each time that an `@` is found, the dependency annotated is registered into ODIN;

> The _registration stage_ usually happen on application bootstrap.
>
> But is possible to do it _progressively_, async loading and filling the dependency injector.


## Consume
![Consume Life cycle](./imgs/life-cycle--consume.png "Consume Life cycle")

 In _consume stage_ the application and ODIN work together:
 - Application is responsible for retrieve a **dependency container** from ODIN;
 - Also application uses the dependencies provided by _container_;
 - ODIN is reponsible for provide dependency containers, resolve dependencies and manage the dependencies life-cycle.


> There is no rule related to containers quantity per time.
> Each container is isolated, never interacting with other container's instances.


## Dependency resolution

ODIN resolves the dependecy only when necessary, it means: even if there is a instance of the dependency, not necessarilly its dependencies were resolved yet.

This strategy is adopted to reduce the unnecessary creation of resources, as much as possible. By default all injections are lazy, but using param on injection is possible to change this behavior.

See the depedency resolution flow below.

![Dependency Resolution Flow](./imgs/flow--dependency-resolution.png "Dependency Resolution Flow")

> As seen at [Registration](#registration), ODIN works with `Registry`. There is a root Registry which is fully available in all dependency injector context.
>
> Everything registered at ODIN's *root registry* would be present into every dependency container.
>
> To isolated registries, use **domain** based registries. See more [here](./define-dependency.md#Domain).

---------------------
#### See more

- [Kinds of dependencies](./kinds-of-dependencies.md)
- [How to define a dependency](./define-dependency.md)
- [Bundles & Inject](./bundle-and-inject.md)
- [Custom Provider](./container-and-custom-provider.md)
- [Configuration](./configuration.md)