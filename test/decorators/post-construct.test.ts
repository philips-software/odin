import { describe, expect, test } from 'vitest';

import odin from '../../src/odin.js';
import PostConstruct from '../../src/container/decorators/post-construct.js';
import Secrets from '../../src/container/secrets.js';

import { InjectableWithPostConstructFixture } from '../fixtures/injectable.js';

describe('decorators', function() {
  describe('@PostConstruct', () => {

    test('should store @PostConstruct method in class definition', () => {
      const container = odin.container('parent/child');
      container.provide(InjectableWithPostConstructFixture.name, true);
    });

    test('should store @PostConstruct method in class definition', () => {
      class ValidPostConstruct {
        @PostConstruct oneMethod(): void { return; }
      }

      expect(Secrets.getPostContruct(ValidPostConstruct.prototype)).toBe('oneMethod');
    });

    describe('errors', () => {

      test('should throw error when defining @PostConstruct method more than once', () => {
        expect(() => {
          class InvalidPostConstruct {
            @PostConstruct oneMethod(): void { return; }
            @PostConstruct anotherMethod(): void { return; }
          }
        }).toThrow(`[ODIN] The class 'InvalidPostConstruct' must constains no more than one PostConstruct method.`);
      });
    });
  });
});
