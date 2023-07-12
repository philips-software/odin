import { afterEach, describe, expect, test } from 'vitest';

import Config from '../../src/configuration/config.js';
import OdinConfig from '../../src/configuration/decorators/odin-config.js';

describe('decorators', () => {
  describe('@OdinConfig', () => {

    afterEach(() => {
      Config.setStrict(false);
      Config.setInitialized(false);
    });

    test('should put odin in strict mode', () => {
      expect(() => {
        @OdinConfig({ strict: true })
        class Configuration { }
      }).not.toThrow();

      expect(Config.isStrict()).toBe(true);
      expect(Config.isInitialized()).toBe(true);
    });

    test('should throw error without mandatory strict parameter', () => {
      expect(() => {
        @OdinConfig
        class Configuration { }
      }).toThrow(`[ODIN] Configuration[OdinConfig]: mandatory property 'strict' not found.`);
    });

    test('should throw error if used more than once', () => {
      expect(() => {
        @OdinConfig({ strict: true })
        class Configuration { }

        expect(Config.isInitialized()).toBe(true);

        @OdinConfig({ strict: false })
        class AnotherConfiguration { }
      }).toThrow('[ODIN] @OdinConfig can only be used once');
    });
  });
});
