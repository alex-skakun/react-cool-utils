import { describe, expect, test } from 'bun:test';
import { classNames } from './classNames';

describe('classNames()', () => {
  describe('string arguments', () => {
    test('combine class names as separate arguments', () => {
      expect(classNames('test', 'class', 'name')).toBe('test class name');
    });

    test('recognize space separated string as different class names and use each class only once', () => {
      expect(classNames('test', 'class name', 'class')).toBe('test class name');
    });

    test('trim strings and split by groups of spaces', () => {
      expect(classNames(' test ', 'class \t name\n', 'css')).toBe('test class name css');
    });

    test('skip null or undefined', () => {
      expect(classNames('test', null, undefined, 'css')).toBe('test css');
    });
  });

  describe('array arguments', () => {
    test('combine class names as separate arguments', () => {
      expect(classNames(['test'], ['class', 'name'])).toBe('test class name');
    });

    test('recognize space separated string as different class names and use each class only once', () => {
      expect(classNames(['test', 'class name'], ['class'])).toBe('test class name');
    });

    test('trim strings and split by groups of spaces', () => {
      expect(classNames([' test ', 'class \t name\n', 'css'])).toBe('test class name css');
    });

    test('skip null or undefined', () => {
      expect(classNames(['test', null, undefined, 'css'])).toBe('test css');
    });
  });

  describe('object arguments', () => {
    test('combine class names as separate arguments', () => {
      expect(classNames({ test: true }, { class: 1 }, { name: 'name' })).toBe('test class name');
    });

    test('recognize space separated string as different class names and use each class only once', () => {
      expect(classNames({
        test: true,
        'class name': true,
        class: true,
      })).toBe('test class name');
    });

    test('trim strings and split by groups of spaces', () => {
      expect(classNames({
        ' test class \n \t name ': true
      })).toBe('test class name');
    });

    test('ignore class names with falsy values or empty names', () => {
      expect(classNames({
        test: true,
        css: NaN,
        class: true,
        name: 0,
        active: '',
        valid: false,
        ' ': true,
      })).toBe('test class');
    });
  });
});
