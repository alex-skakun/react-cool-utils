import { describe, expect, test } from 'bun:test';
import { dataAttrs } from './dataAttrs';

describe('dataAttrs()', () => {
  test('return empty object if empty object passed as argument', () => {
    expect(dataAttrs({})).toEqual({});
  });

  test('convert camelCase properties to kebab-case', () => {
    expect(dataAttrs({
      testProperty: 'test',
      propertyWithMoreThanTwoWords: 'test',
    })).toEqual({
      'data-test-property': 'test',
      'data-property-with-more-than-two-words': 'test',
    });
  });

  test('convert kebab- or snake_ properties to kebab-case', () => {
    expect(dataAttrs({
      'test_property': 'test',
      'property-withMixed_style': 'test',
    })).toEqual({
      'data-test-property': 'test',
      'data-property-with-mixed-style': 'test',
    });
  });

  test('convert values to strings', () => {
    expect(dataAttrs({
      numberProperty: 123,
      booleanProperty: true,
      nullProperty: null,
      undefinedProperty: undefined,
    })).toEqual({
      'data-number-property': '123',
      'data-boolean-property': 'true',
      'data-null-property': 'null',
      'data-undefined-property': 'undefined'
    });
  });
});
