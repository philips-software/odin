import Bundle from '../registry/Bundle';
import Container from './Container';
import { FinalValueResolver, ValueResolver } from './ValueResolver';
import Secrets from './Secrets';

class Nothing {
  constructor(args) { this.args = args; }
}

class Singleton extends Nothing {
  potato = null;
}
Secrets.setSingleton(Singleton);

class Discardable extends Nothing {
  onBla() {
    return this.args.cow;
  }
}
Secrets.setSingleton(Discardable);
Secrets.setDiscardable(Discardable);

describe('[ODIN]', function() {

  describe('Container', () => {

    const parent = new Bundle('parent');
    parent.register(Nothing);
    parent.register(Singleton, { name: 'sing' });

    const bundle = new Bundle('child', parent);
    bundle.register(Discardable, { name: 'disc', cow: 7 });

    let container = null;

    beforeEach(() => {
      container = new Container(bundle);
    });

    it('should has no instance of any dependency', () => {
      expect(container.has('Nothing')).toBe(false);
      expect(container.has('nothing')).toBe(false);

      expect(container.has('Singleton')).toBe(false);
      expect(container.has('singleton')).toBe(false);
      expect(container.has('sing')).toBe(false);

      expect(container.has('Discardable')).toBe(false);
      expect(container.has('discardable')).toBe(false);
      expect(container.has('disc')).toBe(false);
    });

    it('should does not get any instance of any dependency', () => {
      expect(container.get('Nothing')).toBeNull();
      expect(container.get('nothing')).toBeNull();

      expect(container.get('Singleton')).toBeNull();
      expect(container.get('singleton')).toBeNull();
      expect(container.get('sing')).toBeNull();

      expect(container.get('Discardable')).toBeNull();
      expect(container.get('discardable')).toBeNull();
      expect(container.get('disc')).toBeNull();
    });

    describe('Injectable', () => {

      it('should provide FinalValueResolver', () => {
        const nothing = container.provide('Nothing');
        expect(nothing instanceof FinalValueResolver).toBe(true);

        const value = nothing.get();
        expect(value instanceof Nothing).toBe(true);

        const value2 = nothing.get();
        expect(value).toBe(value2);
      });

      it('should provide different instances of FinalValueResolver', () => {
        const nothing = container.provide('Nothing');
        expect(nothing instanceof FinalValueResolver).toBe(true);

        const value = nothing.get();
        expect(value instanceof Nothing).toBe(true);

        const nothing2 = container.provide('nothing');
        expect(nothing2 instanceof FinalValueResolver).toBe(true);

        const value2 = nothing2.get();
        expect(value2 instanceof Nothing).toBe(true);

        expect(nothing).not.toBe(nothing2);
        expect(value).not.toBe(value2);
      });

      it('should return null even after provide', () => {
        let nothing = container.provide('Nothing');
        expect(nothing instanceof FinalValueResolver).toBe(true);

        nothing = container.get('Nothing');
        expect(nothing).toBeNull();
      });

    });

    describe('Singleton', () => {

      it('should provide FinalValueResolver', () => {
        const singleton = container.provide('Singleton');
        expect(singleton instanceof FinalValueResolver).toBe(true);

        const value = singleton.get();
        expect(value instanceof Singleton).toBe(true);

        const value2 = singleton.get();
        expect(value).toBe(value2);
      });

      it('should provide same instances of FinalValueResolver', () => {
        const singleton = container.provide('Singleton');
        expect(singleton instanceof FinalValueResolver).toBe(true);

        const value = singleton.get();
        expect(value instanceof Singleton).toBe(true);

        const singleton2 = container.provide('Singleton');
        expect(singleton2 instanceof FinalValueResolver).toBe(true);

        const value2 = singleton2.get();
        expect(value2 instanceof Singleton).toBe(true);

        expect(singleton).toBe(singleton2);
        expect(value).toBe(value2);
      });

      it('should keeps resolver and the instance when discard', () => {
        const sing = container.provide('sing');
        expect(sing instanceof FinalValueResolver).toBe(true);

        const value = sing.get();
        expect(value instanceof Singleton).toBe(true);

        container.discard('sing');

        const sing2 = container.provide('sing');
        expect(sing2 instanceof FinalValueResolver).toBe(true);

        const value2 = sing2.get();
        expect(value2 instanceof Singleton).toBe(true);

        expect(sing).toBe(sing2);
        expect(value).toBe(value2);
      });

    });

    describe('Discardable', () => {

      it('shouldnt keep resolver when discard and return another instance', () => {
        const discardable = container.provide('Discardable');
        expect(discardable instanceof ValueResolver).toBe(true);

        const value = discardable.get();
        expect(value instanceof Discardable).toBe(true);

        container.discard('discardable');

        const discardable2 = container.provide('Discardable');
        expect(discardable2 instanceof ValueResolver).toBe(true);

        const value2 = discardable2.get();
        expect(value2 instanceof Discardable).toBe(true);

        expect(discardable).toBe(discardable2);
        expect(value).not.toBe(value2);
      });

    });

  });

});

