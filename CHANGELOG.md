# [3.0.0](https://github.com/philips-software/odin/compare/v2.0.0...v3.0.0) (2023-10-04)


* refactor!: migrate to typescript ([9a7a32d](https://github.com/philips-software/odin/commit/9a7a32d42dca13955960a72ff96d89ec052a80b8))


### Features

* add deprecation warnings and improve error messages ([b9412b4](https://github.com/philips-software/odin/commit/b9412b48e118a25197b2928d14e810e690aadb12))
* allow custom injectable name ([fbd702d](https://github.com/philips-software/odin/commit/fbd702d556847bb54d5cb0df52b51523b63f0392))
* allow manual constructors with optional injects ([9fa92ae](https://github.com/philips-software/odin/commit/9fa92ae4597810d1520347309f4527a7fa0c9d14))
* **deps:** update dependencies and node engine version ([27bf5b3](https://github.com/philips-software/odin/commit/27bf5b320dfb6bd0f846aee214c3bd7743e45d0f))
* reuse singleton odin instance ([b172fe1](https://github.com/philips-software/odin/commit/b172fe115aaf3b03e9db6f0f8e6c757e748eee87))


### BREAKING CHANGES

* The `@OdinConfig` decorator is now `@Configuration`.
* The `@PostConstruct` decorator is now `@Initializer`.
* The `@Singleton` decorator is now `@Injectable({ singleton: true })`.
* `Bundle.get` now returns `undefined` instead of `null`.
* `Container.get` now returns `undefined` instead of `null`.
* `Container.provide` now returns `undefined` instead of `null`.
* `CustomProvider.resolve` now returns `undefined` instead of `null`.
* `Registry.get` now returns `undefined` instead of `null`.
* Renamed `InjectableDef` to `Descriptor`.
* Renamed `InjectableDef.args` to `Descriptor.options`.
* Renamed `InjectableDef.definition` to `Descriptor.injectable`.
* Renamed `Bundle.checkHas` to `Bundle.validateRegistration`.
* Renamed `Registry.checkHas` to `Registry.validateRegistration`.
* Renamed `Secrets.getPostContruct` to `Secrets.getInitializer`.
* Renamed `Secrets.setPostContruct` to `Secrets.setInitializer`.
* Removed `Bundle.getId`. The user should not have to decide which identifier to use, all of them should be accepted everywhere.
* Removed `Registry.getId`. The user should not have to decide which identifier to use, all of them should be accepted everywhere.
* Removed `Registry.hasName`. It has been covered by the new `has` implementation.
* Removed `Secrets.getNamed`, `Secrets.isNamed` and `Secrets.setNamed`. It was the wrong solution for a simple problem, which has now been resolved. Feel free to implement/manage your own secrets.
* Removed `Secrets.getWrapper`, `Secrets.isWrapper` and `Secrets.setWrapper`. The `wrapper` had no purpose within odin itself. Feel free to implement/manage your own secrets.
* Removed `Secrets.isCustom` and `Secrets.setCustom`. The `custom` flag had no purpose within odin itself. Feel free to implement/manage your own secrets.

# [2.0.0](https://github.com/philips-software/odin/compare/v1.5.4...v2.0.0) (2023-06-20)


### Code Refactoring

* remove auto binding ([2ec080c](https://github.com/philips-software/odin/commit/2ec080c7cf7694a4d0683599ea1d265a2a0c9cc9))
* rename unregister to deregister of Bundle and Registry ([b7355f4](https://github.com/philips-software/odin/commit/b7355f4ec7aa3f22bf74c78439974ec8b3ff6165))


### Features

* support injectable wrappers for composing decorators ([8cdefea](https://github.com/philips-software/odin/commit/8cdefea597bc0cf9394a5e0fa45bc08f32f7ac7b))


### BREAKING CHANGES

* Removed the auto binding of `action`, `state`
and any other methods that start with `on`. Binding must be done by
the user, as `odin` should not be responsible for choosing which
methods should be bound.
* Renamed `unregister` to `deregister` of the `Bundle`
and `Registry` classes. The removal is now done using the definition
itself, so the `args` argument has been removed.
