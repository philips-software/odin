# [2.1.0](https://github.com/philips-software/odin/compare/v2.0.0...v2.1.0) (2023-10-19)


### Features

* rename package to @philips-software/odin ([2365850](https://github.com/philips-software/odin/commit/23658505572c5568fdf8a27b8728695d1507135d))

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
