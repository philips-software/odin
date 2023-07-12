import { beforeAll, describe, expect, test } from 'vitest';

import OdinCore from '../src/odin-core.js';

describe('exports', () => {

  let exports = null;

  beforeAll(async () => {
    exports = await import('../src/index.js');
  });

  test('should export odin as default', () => {
    expect(exports.default).toBeDefined();
    expect(exports.default).toBeInstanceOf(OdinCore);
  });

});
