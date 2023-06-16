import Registry from './Registry';
import InjectableDef from './InjectableDef';
import Config from '../config/Config';

class teste { }
class Teste { }
class Teste2 { }

describe('[ODIN]', function() {

  describe('Registry', () => {

    let registry = new Registry();

    beforeEach(() => {
      registry = new Registry();
    });

    describe('Simple Register', () => {

      it('should register class', () => {
        registry.register(Teste);

        expect(registry.has(Teste.name)).toBe(true);
        expect(registry.has(Teste2.name)).toBe(false);
      });

       it('should deregister class', () => {
        registry.register(Teste, { name: 'myTest' });

        expect(registry.has(Teste.name)).toBe(true);
        expect(registry.has('myTest')).toBe(true);
        expect(registry.deregister(Teste)).toBe(true);
        expect(registry.has(Teste.name)).toBe(false);
        expect(registry.has('myTest')).toBe(false);
      });

      it('should not register same class twice', () => {
        registry.register(Teste);

        expect(registry.has(Teste.name)).toBe(true);
        expect(() => {
          registry.register(Teste);
        }).toThrowError(`[ODIN] There already is a injectable 'teste' registered.`);
      });

      it('should register the same class twice if the previous was removed.', () => {
        registry.register(Teste);

        expect(registry.has(Teste.name)).toBe(true);
        expect(registry.deregister(Teste)).toBe(true);
        expect(registry.register(Teste)).toBe('teste');
      });

      it('should return the id when register class', () => {
        let id = registry.register(Teste);
        expect(id).toBe('teste');

        id = registry.register(Teste2);
        expect(id).toBe('teste2');
      });

    });

    describe('Custom Register', () => {

      it('should register class', () => {
        registry.register(Teste, { name: 'potato' });

        expect(registry.has(Teste.name)).toBe(true);
        expect(registry.has('potato')).toBe(true);
      });

      it('should not register same class twice, event when first try use different name', () => {
        registry.register(Teste, { name: 'potato' });

        expect(registry.has(Teste.name)).toBe(true);
        expect(() => {
          registry.register(Teste);
        }).toThrowError(`[ODIN] There already is a injectable 'teste' registered.`);
      });

      it('should not register same class twice, event when second try use different name', () => {
        registry.register(Teste);

        expect(registry.has(Teste.name)).toBe(true);
        expect(() => {
          registry.register(Teste, { name: 'potato' });
        }).toThrowError(`[ODIN] There already is a injectable 'teste' registered.`);
      });

      it('should not register different classes, when same name', () => {
        registry.register(Teste, { name: 'potato' });

        expect(registry.has(Teste.name)).toBe(true);
        expect(() => {
          registry.register(Teste2, { name: 'potato' });
        }).toThrowError(`[ODIN] There already is a injectable named 'potato' registered.`);
      });

      it('should not register different classes, when name already used as class name', () => {
        registry.register(Teste);

        expect(registry.has(Teste.name)).toBe(true);
        expect(() => {
          registry.register(Teste2, { name: 'Teste' });
        }).toThrowError(`[ODIN] There already is a injectable 'Teste' registered.`);
      });

      it('should not register different classes, when class name already used as name', () => {
        registry.register(Teste, { name: 'Teste2' });

        expect(registry.has(Teste.name)).toBe(true);
        expect(() => {
          registry.register(Teste2);
        }).toThrowError(`[ODIN] There already is a injectable named 'teste2' registered.`);
      });

    });

    it('should has when does not use name', () => {
      registry.register(Teste);

      expect(registry.has(Teste.name)).toBe(true);
      expect(registry.has(Teste2.name)).toBe(false);

      registry.register(Teste2);
      expect(registry.has(Teste2.name)).toBe(true);
    });

    it('should has when does not use name, using other char case', () => {
      registry.register(Teste);

      expect(registry.has(Teste.name.toUpperCase())).toBe(true);
      expect(registry.has(Teste2.name.toUpperCase())).toBe(false);

      registry.register(Teste2);
      expect(registry.has(Teste2.name.toUpperCase())).toBe(true);
    });

    it('should has when using name, using class name other char case', () => {
      registry.register(Teste, { name: 'potato' });
      registry.register(Teste2, { name: 'cow' });

      expect(registry.has(Teste.name.toUpperCase())).toBe(true);
      expect(registry.has(Teste2.name.toUpperCase())).toBe(true);
    });

    it('should has when using name, using other char case', () => {
      registry.register(Teste, { name: 'potato' });
      registry.register(Teste2, { name: 'cow' });

      expect(registry.has('POTATO')).toBe(true);
      expect(registry.has('COW')).toBe(true);
    });

    it('should return a InjectableDef when register class', () => {
      const id = registry.register(Teste, { teste: 123 });

      const def = registry.get(id);
      expect(def instanceof InjectableDef).toBe(true);

      expect(def.id).toBe('teste');
      expect(def.args.teste).toBe(123);
      expect(def.definition).toBe(Teste);
    });

    it('should return same InjectableDef when use class name or name', () => {
      registry.register(Teste, { name: 'potato' });

      const def = registry.get('teste');
      const def2 = registry.get('potato');
      expect(def).toBe(def2);
    });

    describe('Strict Mode', () => {

      beforeEach(() => {
        Config.setStrict(true);
      });

      afterEach(() => {
        Config.setStrict(false);
      });

      it('should respect the injectable char case when registering a new one', () => {
        const id = registry.register(Teste, { name: 123 });

        const def = registry.get(id);
        expect(def.id).toBe('Teste');
      });

      it(`should throw when there's a injectable with the same name and char case`, () => {
        registry.register(Teste, { name: 'Test' });

        expect(() => {
          registry.register(teste, { name: 'Test' });
        }).toThrowError(`[ODIN] There already is a injectable named 'Test' registered.`);
      });

      it('should allow a injectable with the same name but with different char case', () => {
        expect(() => {
          registry.register(Teste, { name: 'Test' });
          registry.register(teste, { name: 'test' });
        }).not.toThrowError();
      });

      it('should not has using name, using other char case', () => {
        registry.register(Teste, { name: 'Carrot' });
        registry.register(Teste2, { name: 'beatRoot' });

        expect(registry.has('CARROT')).toBe(false);
        expect(registry.has('carrot')).toBe(false);
        expect(registry.has('Carrot')).toBe(true);

        expect(registry.has('BEATROOT')).toBe(false);
        expect(registry.has('beatroot')).toBe(false);
        expect(registry.has('beatRoot')).toBe(true);
      });

      it('should not has when don\'t using name, using other char case', () => {
        registry.register(teste);
        registry.register(Teste);

        expect(registry.has(teste.name.toUpperCase())).toBe(false);
        expect(registry.has(teste.name)).toBe(true);

        expect(registry.has(Teste.name.toUpperCase())).toBe(false);
        expect(registry.has(Teste.name)).toBe(true);
      });

    });

  });

});
