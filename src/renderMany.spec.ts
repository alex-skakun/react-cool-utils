import { describe, expect, test, mock } from 'bun:test';
import { createElement, Fragment, Key } from 'react';
import { renderMany } from './renderMany';

describe('renderMany()', () => {
  describe('for amount', () => {
    test('return empty array for zero when fallback is not provided', () => {
      expect(renderMany(0, () => 'test')).toEqual([]);
    });

    test('return [fallback] for zero when fallback is provided', () => {
      expect(renderMany(0, () => 'test', () => 'fallback')).toEqual(['fallback']);
    });

    test('throw error for negative amount', () => {
      expect(() => renderMany(-5, () => 'test'))
        .toThrow('The source of renderMany() must be Iterable or Record or non negative integer');
    });

    test('throw error for negative amount even when fallback is provided', () => {
      expect(() => renderMany(-5, () => 'test', () => 'fallback'))
        .toThrow('The source of renderMany() must be Iterable or Record or non negative integer');
    });

    test('throw error for float amount', () => {
      expect(() => renderMany(5.5, () => 'test'))
        .toThrow('The source of renderMany() must be Iterable or Record or non negative integer');
    });

    test('throw error for float amount even when fallback is provided', () => {
      expect(() => renderMany(5.5, () => 'test', () => 'fallback'))
        .toThrow('The source of renderMany() must be Iterable or Record or non negative integer');
    });

    test('throw error for NaN amount even when fallback is provided', () => {
      expect(() => renderMany(Number.NaN, () => 'test', () => 'fallback'))
        .toThrow('The source of renderMany() must be Iterable or Record or non negative integer');
    });

    test('invoke callback same amount of times as provided integer', () => {
      const mapFunction = mock(() => 'test');

      renderMany(5, mapFunction);

      expect(mapFunction).toHaveBeenCalledTimes(5);
    });

    test('pass "undefined, number, number" as arguments into mapper function', () => {
      const mapFunction = mock((value: void, index: number, reactKey: Key) => {
        expect(value).toBeUndefined();
        expect(index).toBeNumber();
        expect(reactKey).toBeNumber();
        expect(reactKey).toBe(index);
        return 'test';
      });

      renderMany(3, mapFunction);
    });

    test('return an array with mapped values inside', () => {
      const mapFunction = mock(() => 'test');

      const result = renderMany(3, mapFunction);

      expect(result).toEqual(['test', 'test', 'test']);
    });
  });

  describe('for regular object', () => {
    test('throw error when source is null', () => {
      expect(() => renderMany(null as unknown as object, () => 'test'))
        .toThrow('The source of renderMany() must be Iterable or Record or non negative integer');
    });

    test('throw error when source is undefined', () => {
      expect(() => renderMany(undefined as unknown as object, () => 'test'))
        .toThrow('The source of renderMany() must be Iterable or Record or non negative integer');
    });

    test('return empty array for empty object', () => {
      expect(renderMany({}, () => 'test')).toEqual([]);
    });

    test('return [fallback] for empty object when fallback is provided', () => {
      expect(renderMany({}, () => 'test', () => 'fallback')).toEqual(['fallback']);
    });

    test('pass "value, key, index" as arguments into mapper function', () => {
      const mapFunction = mock((value: string, key: string, reactKey: Key) => {
        expect(key).toBeString();
        expect(value).toBeString();
        expect(reactKey).toBeNumber();
        return 'test';
      });

      renderMany(
        {
          key1: 'value1',
          key2: 'value2',
          key3: 'value3',
        },
        mapFunction
      );
    });

    test('return array with mapped values inside', () => {
      const mapFunction = mock((value: string, key: string, reactKey: Key) => {
        return `${value}-${key}-${reactKey}`;
      });

      const result = renderMany(
        {
          key1: 'value1',
          key2: 'value2',
          key3: 'value3',
        },
        mapFunction,
      );

      expect(result).toEqual([
        'value1-key1-0',
        'value2-key2-1',
        'value3-key3-2',
      ]);
    });

    test('pass "value, key, string" as arguments into mapper function when object contains objects', () => {
      const mapFunction = mock((value: object, key: string, reactKey: Key) => {
        expect(key).toBeString();
        expect(value).toBeObject();
        expect(reactKey).toBeString();
        return '';
      });

      renderMany(
        {
          key1: {},
          key2: {},
          key3: {},
        },
        mapFunction,
      );
    });
  });

  describe('for Map object', () => {
    test('return empty array for empty Map', () => {
      expect(renderMany(new Map(), () => 'test')).toEqual([]);
    });

    test('return [fallback] for empty Map when fallback is provided', () => {
      expect(renderMany(new Map(), () => 'test', () => 'fallback')).toEqual(['fallback']);
    });

    test('pass "value, key, index" as arguments into mapper function', () => {
      const mapFunction = mock((value: string, key: string, reactKey: Key) => {
        expect(key).toBeString();
        expect(value).toBeString();
        expect(reactKey).toBeNumber();
        return 'test';
      });

      renderMany(
        new Map([
          ['key1', 'value1'],
          ['key2', 'value2'],
          ['key3', 'value3'],
        ]),
        mapFunction
      );
    });

    test('return array with mapped values inside', () => {
      const mapFunction = mock((value: string, key: string, reactKey: Key) => {
        return `${value}-${key}-${reactKey}`;
      });

      const result = renderMany(
        new Map([
          ['key1', 'value1'],
          ['key2', 'value2'],
          ['key3', 'value3'],
        ]),
        mapFunction,
      );

      expect(result).toEqual([
        'value1-key1-0',
        'value2-key2-1',
        'value3-key3-2',
      ]);
    });

    test('pass "value, key, string" as arguments into mapper function when Map contains objects', () => {
      const mapFunction = mock((value: object, key: string, reactKey: Key) => {
        expect(key).toBeString();
        expect(value).toBeObject();
        expect(reactKey).toBeString();
        return '';
      });

      renderMany(
        new Map([
          ['key1', {}],
          ['key2', {}],
          ['key3', {}],
        ]),
        mapFunction,
      );
    });
  });

  describe('for Set object', () => {
    test('return fallback for empty Set', () => {
      expect(renderMany(new Set(), () => 'test', () => 'fallback')).toEqual(['fallback']);
    });

    test('pass "value, number, undefined" as arguments into mapper function', () => {
      const mapFunction = mock((value: string, index: number, reactKey: Key) => {
        expect(value).toBeString();
        expect(index).toBeNumber();
        expect(reactKey).toBeNumber();
        return 'test';
      });

      renderMany(
        new Set(['value1', 'value2', 'value3']),
        mapFunction
      );
    });

    test('return array with mapped values inside', () => {
      const mapFunction = mock((value: string, index: number, reactKey: Key) => {
        return `${value}-${index}-${reactKey}`;
      });

      const result = renderMany(
        new Set(['value1', 'value2', 'value3']),
        mapFunction
      );

      expect(result).toEqual([
        'value1-0-0',
        'value2-1-1',
        'value3-2-2',
      ]);
    });

    test('pass "value, number, string" as arguments into mapper function when Set contains objects', () => {
      const mapFunction = mock((value: object, index: number, reactKey: Key) => {
        expect(value).toBeObject();
        expect(index).toBeNumber();
        expect(reactKey).toBeString();
        return '';
      });

      renderMany(
        new Set([{}, {}, {}]),
        mapFunction,
      );
    });
  });

  describe('for Array object', () => {
    test('return fallback for empty Array', () => {
      expect(renderMany([], () => 'test', () => 'fallback')).toEqual(['fallback']);
    });

    test('pass "value, number, undefined" as arguments into mapper function', () => {
      const mapFunction = mock((value: string, index: number, reactKey: Key) => {
        expect(value).toBeString();
        expect(index).toBeNumber();
        expect(reactKey).toBeNumber();
        return 'test';
      });

      renderMany(
        ['value1', 'value2', 'value3'],
        mapFunction
      );
    });

    test('return array with mapped values inside', () => {
      const mapFunction = mock((value: string, index: number, reactKey: Key) => {
        return `${value}-${index}-${reactKey}`;
      });

      const result = renderMany(
        ['value1', 'value2', 'value3'],
        mapFunction
      );

      expect(result).toEqual([
        'value1-0-0',
        'value2-1-1',
        'value3-2-2',
      ]);
    });

    test('pass "value, number, string" as arguments into mapper function when Array contains objects', () => {
      const mapFunction = mock((value: object, index: number, reactKey: Key) => {
        expect(value).toBeObject();
        expect(index).toBeNumber();
        expect(reactKey).toBeString();
        return '';
      });

      renderMany(
        [{}, {}, {}],
        mapFunction,
      );
    });
  });

  describe('for Generator object', () => {
    test('return fallback for empty Generator', () => {
      function* items() {
        // empty
      }

      expect(renderMany(items(), () => 'test', () => 'fallback')).toEqual(['fallback']);
    });

    test('pass "value, number, undefined" as arguments into mapper function', () => {
      function* items() {
        yield 'value1';
        yield 'value2';
        yield 'value3';
      }
      const mapFunction = mock((value: string, index: number, reactKey: Key) => {
        expect(value).toBeString();
        expect(index).toBeNumber();
        expect(reactKey).toBeNumber();
        return 'test';
      });

      renderMany(items(), mapFunction);
    });

    test('return array with mapped values inside', () => {
      function* items() {
        yield 'value1';
        yield 'value2';
        yield 'value3';
      }
      const mapFunction = mock((value: string, index: number, reactKey: Key) => {
        return `${value}-${index}-${reactKey}`;
      });

      const result = renderMany(items(), mapFunction);

      expect(result).toEqual([
        'value1-0-0',
        'value2-1-1',
        'value3-2-2',
      ]);
    });

    test('pass "value, number, string" as arguments into mapper function when Generator yields objects', () => {
      function* items() {
        yield {};
        yield {};
        yield {};
      }
      const mapFunction = mock((value: object, index: number, reactKey: Key) => {
        expect(value).toBeObject();
        expect(index).toBeNumber();
        expect(reactKey).toBeString();
        return '';
      });

      renderMany(items(), mapFunction);
    });
  });
});
