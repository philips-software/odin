import Bundle from './Bundle';
import InjectableDef from './InjectableDef';

class Teste { }
class Teste2 { }
class Teste3 {

  constructor(args) {
    this.potato = args;
  }
}

describe('[ODIN]', function() {

  describe('bundle', () => {

    let bundle = null;

    it('should throw error when try to create without id', () => {
      expect(() => {
        new Bundle();
      }).toThrow(`[ODIN] Invalid bundle id 'undefined'.`);
    });

    describe('single Level Bundle Register', () => {

      beforeEach(() => {
        bundle = new Bundle('root');
      });

      it('should register class', () => {
        bundle.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(bundle.has(Teste2.name)).toBe(false);
      });

      it('should deregister class', () => {
        bundle.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(bundle.deregister(Teste)).toBe(true);
        expect(bundle.has(Teste.name)).toBe(false);

        expect(bundle.has(Teste2.name)).toBe(false);
        expect(bundle.deregister(Teste2)).toBe(false);
        expect(bundle.has(Teste2.name)).toBe(false);
      });

      it('should not register same class twice', () => {
        bundle.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste);
        }).toThrow(`[ODIN] There already is a injectable 'teste' registered.`);
      });

      it('should be able to register the same class twice if the previous has been removed.', () => {
        bundle.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(bundle.deregister(Teste)).toBe(true);
        expect(bundle.register(Teste)).toBe('teste');
      });

    });

    describe('multi Level Bundle Register', () => {

      let parent = null;

      beforeEach(() => {
        parent = new Bundle('root');
        bundle = new Bundle('child', parent);
      });

      it('should register class', () => {
        parent.register(Teste, { name: 'potato' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(bundle.has('potato')).toBe(true);
      });

      it('should deregister class', () => {
        parent.register(Teste, { name: 'potato' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(bundle.has('potato')).toBe(true);
        expect(parent.deregister(Teste)).toBe(true);
        expect(bundle.has(Teste.name)).toBe(false);
        expect(bundle.has('potato')).toBe(false);
      });

      it('should has on both when registered by parent', () => {
        parent.register(Teste);

        expect(parent.has(Teste.name)).toBe(true);
        expect(bundle.has(Teste.name)).toBe(true);
      });

      it('should not be available on child bundle when deregistered on parent bundle.', () => {
        parent.register(Teste);
        parent.deregister(Teste);

        expect(parent.has(Teste.name)).toBe(false);
        expect(bundle.has(Teste.name)).toBe(false);
      });

      it('should has only at bundle when registered by child', () => {
        bundle.register(Teste);

        expect(parent.has(Teste.name)).toBe(false);
        expect(bundle.has(Teste.name)).toBe(true);
      });

      it('should not be available on parent bundle when deregistered on child bundle.', () => {
        bundle.register(Teste);
        bundle.deregister(Teste);

        expect(parent.has(Teste.name)).toBe(false);
        expect(bundle.has(Teste.name)).toBe(false);
      });

      it('should not register same class twice, event when first try use different name', () => {
        parent.register(Teste, { name: 'potato' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste);
        }).toThrow(`[ODIN] There already is a injectable 'teste' registered.`);
      });

      it('should register class on child bundle with same name of parent bundle one, when it has been deregistered on parent bundle.', () => {
        parent.register(Teste, { name: 'potato' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(parent.deregister(Teste)).toBe(true);
        expect(bundle.has(Teste.name)).toBe(false);
        expect(bundle.register(Teste)).toBe('teste');
        expect(bundle.has(Teste.name)).toBe(true);
      });

      it('should not register same class twice, event when second try use different name', () => {
        parent.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste, { name: 'potato' });
        }).toThrow(`[ODIN] There already is a injectable 'teste' registered.`);
      });

      it('should not be able to deregister a class registered on the parent\'s bundle.', () => {
        parent.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(bundle.deregister(Teste)).toBe(false);
        expect(() => {
          bundle.register(Teste, { name: 'potato' });
        }).toThrow(`[ODIN] There already is a injectable 'teste' registered.`);
      });

      it('should deregister only on the bundle that the class was registered before.', () => {
        parent.register(Teste, { name: 'potato' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(parent.deregister(Teste)).toBe(true);
        expect(bundle.register(Teste)).toBe('teste');
      });

      it('should not register different classes, when same name', () => {
        parent.register(Teste, { name: 'potato' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste2, { name: 'potato' });
        }).toThrow(`[ODIN] There already is a injectable named 'potato' registered.`);
      });

      it('should be able to register a class on the child bundle after it has been deregistered on the parent.', () => {
        parent.register(Teste, { name: 'potato' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(parent.deregister(Teste)).toBe(true);
        expect(bundle.has(Teste.name)).toBe(false);
        expect(bundle.register(Teste2, { name: 'potato' })).toBe('teste2');
      });

      it('should not register different classes, when name already used as class name', () => {
        parent.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste2, { name: 'Teste' });
        }).toThrow(`[ODIN] There already is a injectable 'Teste' registered.`);
      });

      it('should register on child bundle a class with same custom name of a class that was deregistered on parent bundle.', () => {
        parent.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(parent.has(Teste.name)).toBe(true);
        expect(parent.deregister(Teste)).toBe(true);
        expect(bundle.register(Teste2, { name: 'Teste' })).toBe('teste2');

        expect(bundle.has('Teste')).toBe(true);
        expect(bundle.has('Teste2')).toBe(true);

        expect(parent.has('Teste')).toBe(false);
        expect(parent.has('Teste2')).toBe(false);
      });

      it('should not register different classes, when class name already used as name', () => {
        parent.register(Teste, { name: 'Teste2' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste2);
        }).toThrow(`[ODIN] There already is a injectable named 'teste2' registered.`);
      });

      it('should return a InjectableDef when register class', () => {
        const id = bundle.register(Teste, { teste: 123 });

        const def = bundle.get(id);
        expect(def instanceof InjectableDef).toBe(true);

        expect(def.id).toBe('teste');
        expect(def.args.teste).toBe(123);
        expect(def.definition).toBe(Teste);
      });

      it(`should return null when trying to get a deregistered injectable by it's identifier.`, () => {
        const id = bundle.register(Teste, { teste: 123 });
        bundle.deregister(Teste);

        const def = bundle.get(id);

        expect(def).toBeNull();
      });

      it('should return same InjectableDef when use class name or name', () => {
        parent.register(Teste, { name: 'potato' });

        const def = bundle.get('teste');
        const def2 = bundle.get('potato');
        expect(def).toBe(def2);
      });

      it('should return null when trying to get a deregistered injectable by class name or name.', () => {
        parent.register(Teste, { name: 'potato' });
        parent.deregister(Teste);

        const def = bundle.get('teste');
        const def2 = bundle.get('potato');

        expect(def).toBeNull();
        expect(def2).toBeNull();
      });

      it('should get the right id no matter the bundle level', () => {
        parent.register(Teste, { name: 'potato' });
        bundle.register(Teste2, { name: 'cow' });

        expect(parent.getId('Teste')).toBe('teste');
        expect(parent.getId('Teste2')).toBe('teste2');

        expect(parent.getId('potato')).toBe('teste');
        expect(parent.getId('cow')).toBe('cow');

        expect(bundle.getId('Teste')).toBe('teste');
        expect(bundle.getId('Teste2')).toBe('teste2');

        expect(bundle.getId('potato')).toBe('teste');
        expect(bundle.getId('cow')).toBe('teste2');
      });

      it('should get the right id from the bundler', () => {
        parent.register(Teste3, { name: 'potato', cow: 7 });

        const def = bundle.get('POTATO');
        const instance = bundle.instantiate(def);

        expect(instance instanceof Teste3).toBe(true);
        expect(instance.potato.cow).toBe(7);
      });

      it('should NOT get the right id if the injectable has been deregistered.', () => {
        parent.register(Teste, { name: 'potato' });
        bundle.register(Teste2, { name: 'cow' });

        expect(parent.getId('potato')).toBe('teste');
        expect(parent.getId('cow')).toBe('cow');

        expect(bundle.getId('potato')).toBe('teste');
        expect(bundle.getId('cow')).toBe('teste2');

        expect(parent.deregister(Teste)).toBe(true);
        expect(bundle.deregister(Teste2)).toBe(true);

        expect(parent.getId('potato')).toBe('potato');
        expect(parent.getId('cow')).toBe('cow');

        expect(bundle.getId('potato')).toBe('potato');
        expect(bundle.getId('cow')).toBe('cow');
      });

    });

  });

});
