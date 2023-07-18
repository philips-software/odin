import { beforeAll, describe, expect, test } from 'vitest';

import { Secrets } from '../src/common/secrets.js';
import { Configuration } from '../src/decorators/configuration.js';
import { Initializer } from '../src/decorators/initializer.js';
import { Inject } from '../src/decorators/inject.js';
import { Injectable } from '../src/decorators/injectable.js';
import { CustomProvider } from '../src/providers/custom-provider.js';
import { FinalValueResolver } from '../src/resolvers/final-value-resolver.js';
import { ValueResolver } from '../src/resolvers/value-resolver.js';

import { Odin } from '../src/stores/odin.js';

describe('exports', () => {

  let exports: any = null;

  beforeAll(async () => {
    exports = await import('../src/index.js');
  });

  test('should not export a default', () => {
    expect(exports.default).toBeUndefined();
  });

  test('should export odin', () => {
    expect('odin' in exports).toBe(true);
    expect(exports.odin).toBeDefined();
    expect(exports.odin).toBeInstanceOf(Odin);
  });

  const matrix: [string, unknown][] = [
    ['Secrets', Secrets],
    ['Configuration', Configuration],
    ['Initializer', Initializer],
    ['Inject', Inject],
    ['Injectable', Injectable],
    ['CustomProvider', CustomProvider],
    ['FinalValueResolver', FinalValueResolver],
    ['ValueResolver', ValueResolver],
  ];

  test.each(matrix)('should export %s', (name, decorator) => {
    expect(name in exports).toBe(true);
    expect(exports[name]).toBeDefined();
    expect(exports[name]).toBe(decorator);
  });

});
