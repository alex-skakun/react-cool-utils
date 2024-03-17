import { describe, expect, test, mock } from 'bun:test';
import { createElement, Fragment, Key } from 'react';
import { renderMany } from './renderMany';

describe('renderMany()', () => {
  describe('for amount', () => {
    test('return undefined for zero', () => {
      expect(renderMany(0, () => 'test')).toBeUndefined();
    });

    test('return fallback for zero when provided', () => {
      expect(renderMany(0, () => 'test', () => 'fallback')).toBe('fallback');
    });

    test('return undefined for negative amount', () => {
      expect(renderMany(-5, () => 'test')).toBeUndefined();
    });

    test('return fallback for negative amount when provided', () => {
      expect(renderMany(-5, () => 'test', () => 'fallback')).toBe('fallback');
    });

    test('return undefined for float amount', () => {
      expect(renderMany(5.5, () => 'test')).toBeUndefined();
    });

    test('return fallback for float amount when provided', () => {
      expect(renderMany(5.5, () => 'test', () => 'fallback')).toBe('fallback');
    });

    test('invoke callback same amount of times as provided integer', () => {
      const mapFunction = mock(() => 'test');

      renderMany(5, mapFunction);

      expect(mapFunction).toHaveBeenCalledTimes(5);
    });

    test('pass "undefined, number, undefined" as arguments into mapper function', () => {
      const mapFunction = mock((value: void, index: number, reactKey: void) => {
        expect(value).toBeUndefined();
        expect(index).toBeNumber();
        expect(reactKey).toBeUndefined();
        return 'test';
      });

      renderMany(3, mapFunction);
    });

    test('return Fragment with mapped values inside', () => {
      const mapFunction = mock(() => 'test');

      const result = renderMany(3, mapFunction);

      expect(result).toEqual(createElement(Fragment, {}, ['test', 'test', 'test']));
    });
  });

  describe('for Map object', () => {
    test('return undefined for empty Map', () => {
      expect(renderMany(new Map(), () => 'test')).toBeUndefined();
    });

    test('return fallback for empty Map when provided', () => {
      expect(renderMany(new Map(), () => 'test', () => 'fallback')).toBe('fallback');
    });

    test('pass "[key, value], number, undefined" as arguments into mapper function', () => {
      const mapFunction = mock(([key, value]: [string, string], index: number, reactKey: void) => {
        expect(key).toBeString();
        expect(value).toBeString();
        expect(index).toBeNumber();
        expect(reactKey).toBeUndefined();
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

    test('return Fragment with mapped values inside', () => {
      const mapFunction = mock(([key, value]: [string, string], index: number, reactKey: void) => {
        return `${key}-${value}-${index}-${reactKey}`;
      });

      const result = renderMany(
        new Map([
          ['key1', 'value1'],
          ['key2', 'value2'],
          ['key3', 'value3'],
        ]),
        mapFunction
      );

      expect(result).toEqual(createElement(Fragment, {}, [
        'key1-value1-0-undefined',
        'key2-value2-1-undefined',
        'key3-value3-2-undefined',
      ]));
    });

    test('pass "[key, value], number, string" as arguments into mapper function when Map contains objects', () => {
      const mapFunction = mock(([key, value]: [string, object], index: number, reactKey: Key) => {
        expect(key).toBeString();
        expect(value).toBeObject();
        expect(index).toBeNumber();
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
      expect(renderMany(new Set(), () => 'test', () => 'fallback')).toBe('fallback');
    });

    test('pass "value, number, undefined" as arguments into mapper function', () => {
      const mapFunction = mock((value: string, index: number, reactKey: void) => {
        expect(value).toBeString();
        expect(index).toBeNumber();
        expect(reactKey).toBeUndefined();
        return 'test';
      });

      renderMany(
        new Set(['value1', 'value2', 'value3']),
        mapFunction
      );
    });

    test('return Fragment with mapped values inside', () => {
      const mapFunction = mock((value: string, index: number, reactKey: void) => {
        return `${value}-${index}-${reactKey}`;
      });

      const result = renderMany(
        new Set(['value1', 'value2', 'value3']),
        mapFunction
      );

      expect(result).toEqual(createElement(Fragment, {}, [
        'value1-0-undefined',
        'value2-1-undefined',
        'value3-2-undefined',
      ]));
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
      expect(renderMany([], () => 'test', () => 'fallback')).toBe('fallback');
    });

    test('pass "value, number, undefined" as arguments into mapper function', () => {
      const mapFunction = mock((value: string, index: number, reactKey: void) => {
        expect(value).toBeString();
        expect(index).toBeNumber();
        expect(reactKey).toBeUndefined();
        return 'test';
      });

      renderMany(
        ['value1', 'value2', 'value3'],
        mapFunction
      );
    });

    test('return Fragment with mapped values inside', () => {
      const mapFunction = mock((value: string, index: number, reactKey: void) => {
        return `${value}-${index}-${reactKey}`;
      });

      const result = renderMany(
        ['value1', 'value2', 'value3'],
        mapFunction
      );

      expect(result).toEqual(createElement(Fragment, {}, [
        'value1-0-undefined',
        'value2-1-undefined',
        'value3-2-undefined',
      ]));
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

      expect(renderMany(items(), () => 'test', () => 'fallback')).toBe('fallback');
    });

    test('pass "value, number, undefined" as arguments into mapper function', () => {
      function* items() {
        yield 'value1';
        yield 'value2';
        yield 'value3';
      }
      const mapFunction = mock((value: string, index: number, reactKey: void) => {
        expect(value).toBeString();
        expect(index).toBeNumber();
        expect(reactKey).toBeUndefined();
        return 'test';
      });

      renderMany(items(), mapFunction);
    });

    test('return Fragment with mapped values inside', () => {
      function* items() {
        yield 'value1';
        yield 'value2';
        yield 'value3';
      }
      const mapFunction = mock((value: string, index: number, reactKey: void) => {
        return `${value}-${index}-${reactKey}`;
      });

      const result = renderMany(items(), mapFunction);

      expect(result).toEqual(createElement(Fragment, {}, [
        'value1-0-undefined',
        'value2-1-undefined',
        'value3-2-undefined',
      ]));
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
