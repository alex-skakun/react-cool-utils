import { describe, expect, test } from 'bun:test';
import { objectEntries } from './objectEntries';

describe('objectEntries()', () => {
  test('returns an iterator', () => {
    const entriesIterator = objectEntries({});

    expect(entriesIterator instanceof Iterator).toBeTrue();
  });

  test('yields entries of passed object', () => {
    const entriesIterator = objectEntries({
      one: 1,
      two: 2,
    });

    expect(entriesIterator.next()).toEqual({ done: false, value: ['one', 1] });
    expect(entriesIterator.next()).toEqual({ done: false, value: ['two', 2] });
    expect(entriesIterator.next()).toEqual({ done: true, value: undefined });
  });
});
