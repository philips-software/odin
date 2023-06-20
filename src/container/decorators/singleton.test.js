import Singleton from './singleton.js';
import Secrets from '../secrets.js';
import odin from '../../odin.js';
import Inject from './inject.js';

describe('[ODIN]', function() {

  describe('@Singleton', () => {

    it('should register class', () => {
      expect(() => {
        @Singleton
        class S1 { } //eslint-disable-line
      }).not.toThrow();
    });

    it('should throw error, using () withou params', () => {
      expect(() => {
        @Singleton()
        class S2 { } //eslint-disable-line
      }).toThrow(`[ODIN] Singleton: If there are no params, remove the ().`);
    });

    it('should throw error, unkown param', () => {
      expect(() => {
        @Singleton({ potato: 'test' })
        class S3 { } //eslint-disable-line
      }).toThrow(`[ODIN] S3[Singleton]: unknow property 'potato'.`);
    });

    it('should not mark class as singleton, discardable or custom', () => {
      @Singleton
      class S4 { }

      expect(Secrets.isSingleton(S4)).toBe(true);
      expect(Secrets.isDiscardable(S4)).toBe(false);
      expect(Secrets.isCustom(S4)).toBe(false);
    });

    it('should use domain prop to define the destin bundle', () => {
      @Singleton({ domain: 'potato/test' })
      class S5 { }

      const parent = odin.bundle('potato');
      expect(parent.has(S5.name)).toBe(false);

      const bundle = parent.child('test');
      expect(bundle.has(S5.name)).toBe(true);
    });

    it('should not accept domain with empty spaces', () => {
      expect(() => {
        @Singleton({ domain: 'potato /test' })
        class S6 { } //eslint-disable-line
      }).toThrow(`[ODIN] Invalid domain 'potato /test', should not has empty spaces in 'potato '.`);
    });

    it('should not accept domain with empty chunks', () => {
      expect(() => {
        @Singleton({ domain: 'potato //test' })
        class S7 { } //eslint-disable-line
      }).toThrow(`[ODIN] Invalid domain 'potato //test', should not has empty spaces in 'potato '.`);
    });

    it('should accept cyclical dependency', () => {
      @Singleton({ domain: 'cyclical' })
      class CyclicalSingleton1 { //eslint-disable-line

        @Inject({ name: 'CyclicalSingleton2', eager: true })
        cyclical;
      }

      @Singleton({ domain: 'cyclical' })
      class CyclicalSingleton2 { //eslint-disable-line

        @Inject({ name: 'CyclicalSingleton1', eager: true })
        cyclical;
      }

      const container = odin.container('cyclical');

      const cyclical1 = container.provide('CyclicalSingleton1', true);
      const cyclical2 = container.provide('CyclicalSingleton2', true);

      expect(cyclical1.cyclical).toBe(cyclical2);
      expect(cyclical2.cyclical).toBe(cyclical1);
    });

  });

});
