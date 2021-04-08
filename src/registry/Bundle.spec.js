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

  describe('Bundle', () => {

    let bundle = null;

    it('should throw error when try to create without id', () => {
      expect(() => {
        new Bundle();
      }).toThrowError(`[ODIN] Invalid bundle id 'undefined'.`);
    });

    describe('Single Level Bundle Register', () => {

      beforeEach(() => {
        bundle = new Bundle('root');
      });

      it('should register class', () => {
        bundle.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(bundle.has(Teste2.name)).toBe(false);
      });

      it('should not register same class twice', () => {
        bundle.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste);
        }).toThrowError(`[ODIN] There already is a injectable 'teste' registered.`);
      });

    });

    describe('Multi Level Bundle Register', () => {

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

      it('should has on both when registered by parent', () => {
        parent.register(Teste);

        expect(parent.has(Teste.name)).toBe(true);
        expect(bundle.has(Teste.name)).toBe(true);
      });

      it('should has only at bundle when registered by child', () => {
        bundle.register(Teste);

        expect(parent.has(Teste.name)).toBe(false);
        expect(bundle.has(Teste.name)).toBe(true);
      });

      it('should not register same class twice, event when first try use different name', () => {
        parent.register(Teste, { name: 'potato' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste);
        }).toThrowError(`[ODIN] There already is a injectable 'teste' registered.`);
      });

      it('should not register same class twice, event when second try use different name', () => {
        parent.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste, { name: 'potato' });
        }).toThrowError(`[ODIN] There already is a injectable 'teste' registered.`);
      });

      it('should not register different classes, when same name', () => {
        parent.register(Teste, { name: 'potato' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste2, { name: 'potato' });
        }).toThrowError(`[ODIN] There already is a injectable named 'potato' registered.`);
      });

      it('should not register different classes, when name already used as class name', () => {
        parent.register(Teste);

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste2, { name: 'Teste' });
        }).toThrowError(`[ODIN] There already is a injectable 'Teste' registered.`);
      });

      it('should not register different classes, when class name already used as name', () => {
        parent.register(Teste, { name: 'Teste2' });

        expect(bundle.has(Teste.name)).toBe(true);
        expect(() => {
          bundle.register(Teste2);
        }).toThrowError(`[ODIN] There already is a injectable named 'teste2' registered.`);
      });

      it('should return a InjectableDef when register class', () => {
        const id = bundle.register(Teste, { teste: 123 });

        const def = bundle.get(id);
        expect(def instanceof InjectableDef).toBe(true);

        expect(def.id).toBe('teste');
        expect(def.args.teste).toBe(123);
        expect(def.definition).toBe(Teste);
      });

      it('should return same InjectableDef when use class name or name', () => {
        parent.register(Teste, { name: 'potato' });

        const def = bundle.get('teste');
        const def2 = bundle.get('potato');
        expect(def).toBe(def2);
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

      it('should get the right id no matter the bundle level', () => {
        parent.register(Teste3, { name: 'potato', cow: 7 });

        const def = bundle.get('POTATO');
        const instance = bundle.instantiate(def);

        expect(instance instanceof Teste3).toBe(true);
        expect(instance.potato.cow).toBe(7);
      });
    });

  });

});
