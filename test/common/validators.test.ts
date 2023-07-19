import { beforeEach, describe, expect, test } from 'vitest';

import { isContentfulString, isEmpty, isEmptyOrBlankString, validateDecoratorOptions, validateDomain, validateNameOrIdentifier } from '../../src/common/validators.js';
import { configuration } from '../../src/singletons/configuration.js';

describe('common', () => {
  describe('validators', () => {

    beforeEach(() => {
      configuration.setStrict(false);
    });

    describe('isContentfulString', () => {
      testValidatorOutputMatrix(isContentfulString, [
        ['a blank string', false, ['']],
        ['a contentful string', true, ['contentful']],
        ['a number', false, [123]],
        ['an array', false, [[]]],
        ['an object', false, [{}]],
        ['false', false, [false]],
        ['null', false, [null]],
        ['true', false, [true]],
        ['undefined', false, [undefined]],
      ]);
    });

    describe('isEmpty', () => {
      testValidatorOutputMatrix(isEmpty, [
        ['a blank string', false, ['']],
        ['a contentful string', false, ['contentful']],
        ['a number', false, [123]],
        ['an array', false, [[]]],
        ['an object', false, [{}]],
        ['false', false, [false]],
        ['null', true, [null]],
        ['true', false, [true]],
        ['undefined', true, [undefined]],
      ]);
    });

    describe('isEmptyOrBlankString', () => {
      testValidatorOutputMatrix(isEmptyOrBlankString, [
        ['a blank string', true, ['']],
        ['a contentful string', false, ['contentful']],
        ['a number', false, [123]],
        ['an array', false, [[]]],
        ['an object', false, [{}]],
        ['false', false, [false]],
        ['null', true, [null]],
        ['true', false, [true]],
        ['undefined', true, [undefined]],
      ]);
    });

    describe('validateDecoratorOptions', () => {
      testValidatorSuccessMatrix(validateDecoratorOptions, [
        ['known options', [
          { fixture: 123 },
          {
            allowUnknown: false,
            known: ['fixture'],
          },
        ]],
        ['required options', [
          { fixture: 123 },
          {
            allowUnknown: false,
            known: ['fixture'],
            required: ['fixture'],
          },
        ]],
        ['unknown options', [
          { fixture: 123 },
          {
            allowUnknown: true,
            known: [],
          },
        ]],
      ]);

      testValidatorErrorMatrix(validateDecoratorOptions, [
        // @ts-expect-error: TS2322, invalid argument type
        ['a blank string', '[odin]: Invalid decorator options. It must be an object.', ['']],

        // @ts-expect-error: TS2322, invalid argument type
        ['a contentful string', '[odin]: Invalid decorator options. It must be an object.', ['contentful']],

        // @ts-expect-error: TS2322, invalid argument type
        ['an array', '[odin]: Invalid decorator options. It must be an object.', [[]]],

        // @ts-expect-error: TS2322, invalid argument type
        ['false', '[odin]: Invalid decorator options. It must be an object.', [false]],

        // @ts-expect-error: TS2322, invalid argument type
        ['null', '[odin]: Invalid decorator options. It must be an object.', [null]],

        // @ts-expect-error: TS2322, invalid argument type
        ['true', '[odin]: Invalid decorator options. It must be an object.', [true]],

        // @ts-expect-error: TS2322, invalid argument type
        ['undefined', '[odin]: Invalid decorator options. It must be an object.', [undefined]],

        // @ts-expect-error: TS2322, invalid argument type
        ['an empty object and no options', '[odin]: Invalid validator options. It must be an object.', [{}]],

        [
          'an object, not allowing unknown options',
          '[odin]: Invalid decorator options. The unknown options are not allowed: fixture.',
          [
            { fixture: 123 },
            {
              allowUnknown: false,
              known: [],
            },
          ],
        ],
        [
          'an empty object and a required option',
          `[odin]: Invalid decorator options. The option 'fixture' is required.`,
          [
            {},
            {
              allowUnknown: false,
              known: [],
              required: ['fixture'],
            },
          ],
        ],
      ]);
    });

    describe('validateDomain', () => {
      testValidatorSuccessMatrix(validateDomain, [
        ['a contentful string', ['contentful']],
        [
          'a contentful string without chunks, while disallowing hierarchy',
          [
            'contentful',
            {
              allowHierarchy: false,
            },
          ],
        ],
      ]);

      testValidatorErrorMatrix(validateDomain, [
        ['a blank string', '[odin]: Invalid domain. It should be a contentful string.', ['']],
        ['a contentful string with empty chunks', `[odin]: Invalid domain 'parent//child'. It cannot have empty chunks.`, ['parent//child']],
        ['a contentful string with spaces', `[odin]: Invalid domain 'contentful '. It cannot have empty spaces in 'contentful '.`, ['contentful ']],

        // @ts-expect-error: TS2322, invalid argument type
        ['a number', '[odin]: Invalid domain. It should be a contentful string.', [123]],

        // @ts-expect-error: TS2322, invalid argument type
        ['an array', '[odin]: Invalid domain. It should be a contentful string.', [[]]],

        // @ts-expect-error: TS2322, invalid argument type
        ['an object', '[odin]: Invalid domain. It should be a contentful string.', [{}]],

        // @ts-expect-error: TS2322, invalid argument type
        ['false', '[odin]: Invalid domain. It should be a contentful string.', [false]],

        // @ts-expect-error: TS2322, invalid argument type
        ['null', '[odin]: Invalid domain. It should be a contentful string.', [null]],

        // @ts-expect-error: TS2322, invalid argument type
        ['true', '[odin]: Invalid domain. It should be a contentful string.', [true]],

        ['undefined', '[odin]: Invalid domain. It should be a contentful string.', [undefined]],
        [
          'a contentful string with chunks, while disallowing hierarchy',
          `[odin]: Invalid domain 'parent/child'. It cannot have multiple chunks here.`,
          [
            'parent/child',
            {
              allowHierarchy: false,
            },
          ],
        ],
      ]);
    });

    describe('validateNameOrIdentifier', () => {
      testValidatorSuccessMatrix(validateNameOrIdentifier, [
        ['a contentful string', ['contentful']],
      ]);

      testValidatorErrorMatrix(validateNameOrIdentifier, [
        ['a blank string', '[odin]: Invalid name or identifier. It should be a contentful string.', ['']],
        ['a contentful string with chunks', `[odin]: Invalid name or identifier 'parent/child'. It cannot have chunks.`, ['parent/child']],
        ['a contentful string with spaces', `[odin]: Invalid name or identifier 'contentful '. It cannot have empty spaces.`, ['contentful ']],

        // @ts-expect-error: TS2322, invalid argument type
        ['a number', '[odin]: Invalid name or identifier. It should be a contentful string.', [123]],

        // @ts-expect-error: TS2322, invalid argument type
        ['an array', '[odin]: Invalid name or identifier. It should be a contentful string.', [[]]],

        // @ts-expect-error: TS2322, invalid argument type
        ['an object', '[odin]: Invalid name or identifier. It should be a contentful string.', [{}]],

        // @ts-expect-error: TS2322, invalid argument type
        ['false', '[odin]: Invalid name or identifier. It should be a contentful string.', [false]],

        // @ts-expect-error: TS2322, invalid argument type
        ['null', '[odin]: Invalid name or identifier. It should be a contentful string.', [null]],

        // @ts-expect-error: TS2322, invalid argument type
        ['true', '[odin]: Invalid name or identifier. It should be a contentful string.', [true]],

        ['undefined', '[odin]: Invalid name or identifier. It should be a contentful string.', [undefined]],
      ]);
    });

  });
});

function testValidatorErrorMatrix<T extends (...args: any[]) => void>(validate: T, matrix: [string, string, Parameters<T>][]): void {
  test.each(matrix)('should throw error when the arguments are %s', (_, error, args) => {
    expect(() => validate(...args)).toThrow(error);
  });
}

function testValidatorSuccessMatrix<T extends (...args: any[]) => void>(validate: T, matrix: [string, Parameters<T>][]): void {
  test.each(matrix)('should accept %s', (_, args) => {
    expect(() => validate(...args)).not.toThrow();
  });
}

function testValidatorOutputMatrix<T extends (...args: any[]) => any>(validate: T, matrix: [string, ReturnType<T>, Parameters<T>][]): void {
  test.each(matrix)('should accept %s and return %s', (_, output, args) => {
    expect(validate(...args)).toBe(output);
  });
}
