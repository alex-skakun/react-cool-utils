import { describe, expect, test } from 'bun:test';
import { classNames } from './classNames';

describe('classNames()', () => {
  describe('string arguments', () => {
    test('combine class names as separate arguments', () => {
      expect(classNames('test', 'class', 'name')).toBe('test class name');
    });

    test('skip null or undefined', () => {
      expect(classNames('test', null, undefined, 'css')).toBe('test css');
    });
  });

  describe('array arguments', () => {
    test('combine class names as separate arguments', () => {
      expect(classNames(['test'], ['class', 'name'])).toBe('test class name');
    });

    test('combine strings with multiple classes as is', () => {
      expect(classNames(['test', 'class name'], ['class'])).toBe('test class name class');
    });

    test('skip null or undefined', () => {
      expect(classNames(['test', null, undefined, 'css'])).toBe('test css');
    });
  });

  describe('object arguments', () => {
    test('combine class names as separate arguments', () => {
      expect(classNames({ test: true }, { class: 1 }, { name: 'name' })).toBe('test class name');
    });

    test('ignore class names with falsy values or empty names', () => {
      expect(classNames({
        test: true,
        css: NaN,
        class: true,
        name: 0,
        active: '',
        valid: false,
      })).toBe('test class');
    });
  });
});
