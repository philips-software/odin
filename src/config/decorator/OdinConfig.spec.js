import Config from '../Config';
import OdinConfig from './OdinConfig';

describe('[ODIN]', () => {

  describe('@OdinConfig', () => {

    it(`Should throw error without mandatory 'strict' parameter`, () => {
      expect(() => {

        @OdinConfig
        class Configuration { } //eslint-disable-line
      }).toThrowError(`[ODIN] Configuration[OdinConfig]: mandatory property 'strict' not found.`);
    });

    afterEach(() => {
      Config.setStrict(false);
      Config.setInitialized(false);
    });

    it('should put Odin in Strict Mode', () => {
      @OdinConfig({ strict: true })
      class Configuration { } //eslint-disable-line

      expect(Config.isStrict()).toBe(true);
      expect(Config.isInitialized()).toBe(true);
    });

    it('should throw error if @OdinConfig is used more than once', () => {
      expect(() => {
        @OdinConfig({ strict: true })
        class Configuration { } //eslint-disable-line

        expect(Config.isInitialized()).toBe(true);

        @OdinConfig({ strict: false })
        class ConfigurationTwo { } //eslint-disable-line
      }).toThrowError('[ODIN] @OdinConfig can only be used once');
    });

  });

});