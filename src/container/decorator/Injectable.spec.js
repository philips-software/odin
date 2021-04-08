import Injectable from './Injectable';
import Secrets from '../Secrets';
import odin from '../../Odin';
import Inject from './Inject';

describe('[ODIN]', function() {
  
  describe('@Injectable', () => {
    
    it('should register class', () => {
      expect(() => {
        @Injectable
        class I1 { } //eslint-disable-line
      }).not.toThrowError();
    });

    it('should throw error, using () withou params', () => {
      expect(() => {
        @Injectable()
        class I2 { } //eslint-disable-line
      }).toThrowError(`[ODIN] Injectable: If there are no params, remove the ().`);
    });

    it('should throw error, unkown param', () => {
      expect(() => {
        @Injectable({ potato: 'test' })
        class I3 { } //eslint-disable-line
      }).toThrowError(`[ODIN] I3[Injectable]: unknow property 'potato'.`);
    });

    it('should not mark class as singleton, discardable or custom', () => {
      @Injectable
      class I4 { } //eslint-disable-line

      expect(Secrets.isSingleton(I4)).toBe(false);
      expect(Secrets.isDiscardable(I4)).toBe(false);
      expect(Secrets.isCustom(I4)).toBe(false);
    });

    it('should use domain prop to define the destin bundle', () => {
      @Injectable({ domain: 'potato/test' })
      class I5 { } //eslint-disable-line

      const parent = odin.bundle('potato');
      expect(parent.has(I5.name)).toBe(false);

      const bundle = parent.child('test');
      expect(bundle.has(I5.name)).toBe(true);
    });

    it('should not accept domain with empty spaces', () => {
      expect(() => {
        @Injectable({ domain: 'potato /test' })
        class I6 { } //eslint-disable-line
      }).toThrowError(`[ODIN] Invalid domain 'potato /test', should not has empty spaces in 'potato '.`);
    });

    it('should not accept domain with empty chunks', () => {
      expect(() => {
        @Injectable({ domain: 'potato //test' })
        class I7 { } //eslint-disable-line
      }).toThrowError(`[ODIN] Invalid domain 'potato //test', should not has empty spaces in 'potato '.`);
    });

    it('should accept cyclical dependency', () => {
      @Injectable({ domain: 'cyclical' })
      class CyclicalInjectable1 { 

        @Inject({ name: 'CyclicalInjectable2', eager: true })
        cyclical;
      } 

      @Injectable({ domain: 'cyclical' })
      class CyclicalInjectable2 { 

        @Inject({ name: 'CyclicalInjectable1' })
        cyclical;
      } 

      const container = odin.container('cyclical');

      const cyclical1 = container.provide('CyclicalInjectable1', true);
      const cyclical2 = container.provide('CyclicalInjectable2', true);

      expect(cyclical1.cyclical instanceof CyclicalInjectable2).toBe(true);
      expect(cyclical2.cyclical instanceof CyclicalInjectable1).toBe(true);
    });

  });
  
});
