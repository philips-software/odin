import { describe, expect, test, vi } from 'vitest';

import { applyEagers, applyInitializers, applyInjects, getContainer, invokeEagers, invokeInitializer, stashContainer, stashEager, stashInitializer, stashInject } from '../../src/common/decorators.js';
import { Secrets } from '../../src/common/secrets.js';
import { Bundle } from '../../src/stores/bundle.js';
import { Container } from '../../src/stores/container.js';

describe('common', () => {
  describe('decorators', () => {

    describe('container', () => {
      test('should stash and get', () => {
        class Fixture {}

        const bundle = new Bundle('domain');
        const container = new Container(bundle);

        const instance = new Fixture();
        expect(getContainer(instance)).toBeUndefined();

        stashContainer(instance, container);
        expect(getContainer(instance)).toBe(container);
      });
    });

    describe('eagers', () => {
      const name = 'eager';

      test('should stash, apply and invoke', () => {
        class Fixture {}
        expect(Secrets.getEagers(Fixture)).toStrictEqual([]);

        const instance = new Fixture();
        stashEager(instance, name);
        applyEagers(Fixture, instance);
        expect(Secrets.getEagers(Fixture)).toStrictEqual([name]);

        const spy = vi.fn(() => 0);
        Object.defineProperty(instance, name, { get: spy });

        invokeEagers(Fixture, instance);
        expect(spy).toHaveBeenCalledOnce();
      });
    });

    describe('initializer', () => {
      const name = 'initializer';

      test('should stash, apply and invoke', () => {
        const spy = vi.fn(() => 0);

        class Fixture {
          [name](): void {
            spy();
          }
        }

        expect(Secrets.getInitializer(Fixture)).toBeUndefined();

        const instance = new Fixture();
        stashInitializer(instance, name);
        applyInitializers(Fixture, instance);
        expect(Secrets.getInitializer(Fixture)).toBe(name);

        invokeInitializer(Fixture, instance);
        expect(spy).toHaveBeenCalledOnce();
      });

      test('should throw when the injectable already has an initializer', () => {
        class Fixture {}
        expect(Secrets.getInitializer(Fixture)).toBeUndefined();

        Secrets.setInitializer(Fixture, name);
        expect(Secrets.getInitializer(Fixture)).toBe(name);

        const instance = new Fixture();

        expect(() => {
          applyInitializers(Fixture, instance);
        }).toThrow(`[odin]: The injectable '${Fixture.name}' already has an initializer named '${name}'.`);
      });
    });

    describe('inject', () => {
      const name = 'inject';

      test('should stash, apply and invoke', () => {
        class Fixture {
          [name]: any;
        }

        const instance = new Fixture();
        stashInject(instance, name, name, {});
        applyInjects(Fixture, instance);

        expect(() => {
          instance[name];
        }).toThrow(`[odin]: There is no container at '${Fixture.name}'.`);
      });
    });
  });
});
