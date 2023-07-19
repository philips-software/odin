import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { DescriptorOptions } from '../../src/common/descriptor.js';

import { Bundle } from '../../src/stores/bundle.js';

describe('bundle', () => {

  const domain = 'domain';
  const name = 'name';

  const spy = vi.fn((..._: any[]) => void 0);

  class Fixture {
    constructor(...args: any[]) {
      spy(...args);
    }
  }

  beforeEach(() => {
    spy.mockReset();
  });

  const matrix: [string, DescriptorOptions?, DescriptorOptions?][] = [
    ['undefined to undefined', undefined, undefined],
    ['defaulting to undefined', {}, undefined],
    ['ignoring name', { name, something: 123 }, { something: 123 }],
  ];

  test.each(matrix)('should forward registered options to the injectable constructor: %s', (_, registerOptions, constructorOptions) => {
    const bundle = new Bundle(domain);
    bundle.register(Fixture, registerOptions);

    const descriptor = bundle.get(Fixture.name);

    if (descriptor) {
      bundle.instantiate(descriptor);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(constructorOptions);
    }
  });

});
