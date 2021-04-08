import odin from '../../Odin';
import Inject from './Inject';
import Injectable from './Injectable';
import Singleton from './Singleton';
import Secrets from '../Secrets';
import Config from '../../config/Config';

/* eslint-disable */

// This block is disabled because these classes aren't used by the usual way,
// but instead requested directly from within Odin's container bundler.

@Injectable
class RootInjectable { }

@Injectable({ domain: 'parent' })
class ParentInjectable { }

@Injectable({ domain: 'parent/child' })
class ChildInjectable { }

@Singleton
class RootSingleton { }

@Singleton({ domain: 'parent' })
class ParentSingleton { }

@Singleton({ domain: 'parent/child' })
class ChildSingleton { }

@Singleton
class RootDiscardable { }
Secrets.setDiscardable(RootDiscardable);

/* eslint-enable */

describe('[ODIN]', function() {

  describe('@Inject', () => {

    let container = null;

    beforeEach(() => {
      container = odin.container('parent/child');
    });

    describe ('Root', () => {
      it('should inject @Injectable into @Injectable from root', () => {
        @Injectable
        class Inj1 {
          @Inject rootInjectable;
        }

        const inj = container.provide(Inj1.name, true);
        expect(inj.rootInjectable instanceof RootInjectable).toBe(true);
      });

      it('should inject @Singleton into @Injectable from root', () => {
        @Injectable
        class Inj2 {
          @Inject rootSingleton;
        }

        const inj = container.provide(Inj2.name, true);
        expect(inj.rootSingleton instanceof RootSingleton).toBe(true);
      });

      it('should inject @Singleton (discardable) into @Injectable from root - and revoke value', () => {
        @Injectable
        class Inj3 {
          @Inject rootDiscardable;
        }

        const inj = container.provide(Inj3.name, true);
        expect(inj.rootDiscardable instanceof RootDiscardable).toBe(true);

        const oldValue = inj.rootDiscardable;
        container.discard('RootDiscardable');

        const newValue = inj.rootDiscardable;
        expect(newValue).not.toBeNull();

        expect(newValue).not.toBe(oldValue);

        const newByProvide = container.provide(RootDiscardable.name, true);
        expect(newByProvide).toBe(newValue);

        expect(oldValue instanceof RootDiscardable).toBe(true);
        expect(newValue instanceof RootDiscardable).toBe(true);
        expect(newByProvide instanceof RootDiscardable).toBe(true);
      });

      it('should inject @Singleton (discardable) into @Injectable from root - based on name param', () => {
        @Injectable
        class Inj4 {
          @Inject({ name: 'RootDiscardable' }) potato;
        }

        const inj = container.provide(Inj4.name, true);
        expect(inj.potato instanceof RootDiscardable).toBe(true);

        const oldValue = inj.potato;
        container.discard('RootDiscardable');

        const newValue = inj.potato;
        expect(newValue).not.toBeNull();

        expect(newValue).not.toBe(oldValue);

        const newByProvide = container.provide(RootDiscardable.name, true);
        expect(newByProvide).toBe(newValue);

        expect(oldValue instanceof RootDiscardable).toBe(true);
        expect(newValue instanceof RootDiscardable).toBe(true);
        expect(newByProvide instanceof RootDiscardable).toBe(true);
      });

      it('should use @Inject string parameter as name', () => {
        @Injectable
        class Inj5 {
          @Inject('RootInjectable') beatroot;
        }

        const inj = container.provide(Inj5.name, true);
        expect(inj.beatroot instanceof RootInjectable).toBe(true);
      });

      it('should use @Inject object parameter with name', () => {
        @Injectable
        class Inj6 {
          @Inject({ name: 'RootInjectable' }) carrot;
        }

        const inj = container.provide(Inj6.name, true);
        expect(inj.carrot instanceof RootInjectable).toBe(true);
      });

      it('should throw error when passing more than one argument to @Inject', () => {
        expect(() => {
          @Injectable
          class Inj7 { //eslint-disable-line
            @Inject('RootInjectable', true) strawberry;
          }
        }).toThrowError('[ODIN] @Inject should receive only one argument.');
      });
    });

    describe('Strict Mode', () => {
      beforeEach(() => {
        Config.setStrict(true);
      });

      afterEach(() => {
        Config.setStrict(false);
      });

      it('should throw error if @Inject is used without a name in Strict mode', () => {
        expect(() => {
          @Injectable
          class Inj8 { //eslint-disable-line
            @Inject({ }) potato;
          }
        }).toThrowError(`[ODIN] Inj8[Inject]: mandatory property 'name' not found.`);
      });

      it('should return correct @Injectable when using a different name than the property', () => {
        @Injectable
        class Cows { }

        @Injectable
        class Inj9 {
          @Inject({ name: 'Cows' }) potato;
          @Inject({ name: 'Cows' }) carrot;
        }

        const injection = container.provide(Inj9.name, true);

        expect(injection.potato instanceof Cows).toBe(true);
        expect(injection.carrot instanceof Cows).toBe(true);
      });

      it('should respect lowercase/uppercase names whitin @Inject', () => {
        @Injectable
        class Cats { }

        @Injectable
        class Inj10 {
          @Inject({ name: 'cats' }) sheep;
          @Inject({ name: 'Cats' }) parrot;
        }

        const injection = container.provide(Inj10.name, true);

        expect(injection.sheep).toBeUndefined();
        expect(injection.parrot instanceof Cats).toBe(true);
      });

    });

  });

});
