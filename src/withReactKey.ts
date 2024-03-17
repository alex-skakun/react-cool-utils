import { v4 as uuid } from 'uuid';

const KEY_SYMBOL = Symbol('key');
const KEYS = new WeakMap<object, string>();

export type WithReactKey<T extends object> = T & {
  [KEY_SYMBOL]: string;
};

export function withReactKey<T extends object>(
  from: T & { [KEY_SYMBOL]?: string },
  mode: 'new' | 'keep' = 'keep',
): WithReactKey<T> {
  const existingKey = from[KEY_SYMBOL];

  return Object.defineProperty(from, KEY_SYMBOL, {
    enumerable: true,
    writable: true,
    value: mode === 'new' || !existingKey ? generateKey(from) : existingKey,
  }) as WithReactKey<T>;
}

export function generateKey(targetObject: object): string {
  let key = KEYS.get(targetObject);

  if (!key) {
    KEYS.set(targetObject, key = uuid());
  }

  return key;
}

export function getReactKey<T>(from: T & { [KEY_SYMBOL]?: string }): string {
  return from[KEY_SYMBOL] ?? generateKey(from);
}
