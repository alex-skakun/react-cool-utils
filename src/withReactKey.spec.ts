import { describe, expect, test } from 'bun:test';
import { generateKey, getReactKey, withReactKey } from './withReactKey';

describe('generateKey()', () => {
  test('return same key for same object', () => {
    const object = {};
    const key1 = generateKey(object);
    const key2 = generateKey(object);

    expect(key2).toBe(key1);
  });
});

describe('withReactKey()', () => {
  test('add new property with react key in "keep" mode when key does not exist', () => {
    const object = {};
    const withKey = withReactKey(object);

    expect(object).toBe(withKey);

    const [symbolKey] = Object.getOwnPropertySymbols(withKey);

    expect((withKey as any)[symbolKey]).toBeString();
  });

  test('add new key even if it already exists in "new" mode', () => {
    const withKey = withReactKey({});
    const withNewKey = withReactKey({ ...withKey }, 'new');
    const [symbolKey] = Object.getOwnPropertySymbols(withKey);
    const key1 = (withKey as any)[symbolKey];
    const key2 = (withNewKey as any)[symbolKey];

    expect(key1).toBeString();
    expect(key2).toBeString();
    expect(key1).not.toBe(key2);
  });

  test('use same key value if property with react key already exists in "keep" mode', () => {
    const object = withReactKey({});
    const withKey = withReactKey(object);
    const [symbolKey] = Object.getOwnPropertySymbols(withKey);
    const key1 = (object as any)[symbolKey];
    const key2 = (withKey as any)[symbolKey];

    expect(key1).toBeString();
    expect(key2).toBeString();
    expect(key1).toBe(key2);
  });
});

describe('getReactKey()', () => {
  test('generate key for object without key property', () => {
    const object = {};
    const firstKey = getReactKey(object);
    const secondKey = getReactKey(object);

    expect(firstKey).toBeString();
    expect(secondKey).toBeString();
    expect(firstKey).toBe(secondKey);
  });

  test('return a key from an object with key property', () => {
    const object = {};
    const withKey = withReactKey(object);
    const firstKey = getReactKey(withKey);
    const secondKey = getReactKey(withKey);

    expect(firstKey).toBeString();
    expect(secondKey).toBeString();
    expect(firstKey).toBe(secondKey);
  });
});
