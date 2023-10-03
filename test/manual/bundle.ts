import { odin } from '../../src/singletons/odin.js';

class ManualInjectable {}

const bundle = odin.bundle();
// bundle.register(ManualInjectable);
bundle.register(ManualInjectable, { name: ManualInjectable.name });
