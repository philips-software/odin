import { beforeEach } from 'vitest';

import { configuration } from '../../src/singletons/configuration.js';

configuration.setStrict(true);

beforeEach(() => {
  configuration.setStrict(true);
});
