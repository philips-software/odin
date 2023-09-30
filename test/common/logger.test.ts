import { describe, expect, test } from 'vitest';

import { Logger } from '../../src/common/logger.js';

describe('common', () => {
  describe('logger', () => {
    const parent = new Logger('parent');
    const child = new Logger('child', parent);

    describe('hierarchy', () => {
      test('should compose using constructor', () => {
        // @ts-expect-error: TS2341, private readonly field
        expect(parent.scope).toBe('parent');

        // @ts-expect-error: TS2341, private readonly field
        expect(child.scope).toBe('parent:child');
      });

      test('should compose using getters', () => {
        // @ts-expect-error: TS2341, private readonly field
        expect(parent.decorators.scope).toBe('parent:decorators');

        // @ts-expect-error: TS2341, private readonly field
        expect(child.decorators.scope).toBe('parent:child:decorators');
      });
    });

    describe('message', () => {
      const validMatrix: [string, unknown, string][] = [
        ['false', false, '[parent]: false'],
        ['null', null, '[parent]: null'],
        ['number', 123, '[parent]: 123'],
        ['true', true, '[parent]: true'],
        ['undefined', undefined, '[parent]: undefined'],
      ];

      test.each(validMatrix)('should format with %s', (_, fixture, expected) => {
        expect(parent.createMessage(fixture)).toBe(expected);
      });

      const invalidMatrix: [string, unknown][] = [
        ['array', []],
        ['object', {}],
      ];

      test.each(invalidMatrix)('should throw error when formatting with %s', (_, fixture) => {
        expect(() => {
          parent.createMessage(fixture);
        }).toThrow('[parent]: Cannot create message with array or object as argument.');
      });

      test('should remove same scope when nesting', () => {
        const innerMessage = parent.createMessage('Inner error.');
        expect(innerMessage).toBe('[parent]: Inner error.');

        const outerMessage = parent.createMessage(`Outer error: ${innerMessage}`);
        expect(outerMessage).toBe('[parent]: Outer error: Inner error.');
      });

      test('should remove parent scope when nesting child scope', () => {
        const innerMessage = parent.createMessage('Inner error.');
        expect(innerMessage).toBe('[parent]: Inner error.');

        const outerMessage = child.createMessage(`Outer error: ${innerMessage}`);
        expect(outerMessage).toBe('[parent:child]: Outer error: Inner error.');
      });
    });
  });
});
