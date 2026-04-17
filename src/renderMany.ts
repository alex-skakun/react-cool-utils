import { Key, ReactNode } from 'react';
import { EmptyObject, isNonNegativeSafeInteger } from 'value-guards';
import { getReactKey } from './withReactKey';
import { objectEntries } from './objectEntries';

type AnyRecord = Record<string | symbol, any>;

export type RenderMappingFunction = (
  ((value: any, key: any, reactKey: number) => ReactNode) |
  ((value: any, key: any, reactKey: string) => ReactNode) |
  ((value: any, key: any, reactKey: bigint) => ReactNode)
  );

export function renderMany<Result extends ReactNode = ReactNode>(
  count: 0,
  fn: (el: void, index: number, reactKey: number) => Result,
): [];
export function renderMany<Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  count: 0,
  fn: (el: void, index: number, reactKey: number) => Result,
  fallback: () => Fallback,
): [Fallback];
export function renderMany<Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  count: number,
  fn: (el: void, index: number, reactKey: number) => Result,
): Result[];
export function renderMany<Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  count: number,
  fn: (el: void, index: number, reactKey: number) => Result,
  fallback: () => Fallback,
): Result[] | [Fallback];
export function renderMany<T, Result extends ReactNode = ReactNode>(
  collection: [],
  fn: (value: NoInfer<T>, index: number, reactKey: number) => Result,
): [];
export function renderMany<T, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  collection: [],
  fn: (el: NoInfer<T>, index: number, key: number) => Result,
  fallback: () => Fallback,
): [Fallback];
export function renderMany<T, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  collection: T[],
  fn: (el: NoInfer<T>, index: number, key: Key) => Result,
): Result[];
export function renderMany<T, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  collection: T[],
  fn: (el: NoInfer<T>, index: number, key: Key) => Result,
  fallback: () => Fallback,
): Result[] | [Fallback];
export function renderMany<T, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  collection: Set<T>,
  fn: (el: NoInfer<T>, index: T, key: Key) => Result,
): Result[];
export function renderMany<T, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  collection: Set<T>,
  fn: (el: NoInfer<T>, index: T, key: Key) => Result,
  fallback: () => Fallback,
): Result[] | [Fallback];
export function renderMany<K, V, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  collection: Map<K, V>,
  fn: (el: NoInfer<V>, index: NoInfer<K>, key: Key) => Result,
): Result[];
export function renderMany<K, V, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  collection: Map<K, V>,
  fn: (el: NoInfer<V>, index: NoInfer<K>, key: Key) => Result,
  fallback: () => Fallback,
): Result[] | [Fallback];
export function renderMany<T, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  iterable: Iterable<T>,
  fn: (el: NoInfer<T>, index: number, key: Key) => Result,
): Result[];
export function renderMany<T, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  iterable: Iterable<T>,
  fn: (el: NoInfer<T>, index: number, key: Key) => Result,
  fallback: () => Fallback,
): Result[] | [Fallback];
export function renderMany<K, V, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  collection: EmptyObject,
  fn: (el: NoInfer<V>, index: NoInfer<K>, key: Key) => Result,
  fallback: () => Fallback,
): [Fallback];
export function renderMany<K extends string | symbol, V, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  collection: Record<K, V>,
  fn: (el: NoInfer<V>, index: NoInfer<K>, key: Key) => Result,
): Result[];
export function renderMany<K extends string | symbol, V, Result extends ReactNode = ReactNode, Fallback extends ReactNode = ReactNode>(
  collection: Record<K, V>,
  fn: (el: NoInfer<V>, index: NoInfer<K>, key: Key) => Result,
  fallback: () => Fallback,
): Result[] | [Fallback];

export function renderMany(
  collectionOrRecordOrCount: Iterable<any> | AnyRecord | number,
  fn: RenderMappingFunction,
  fallback?: () => ReactNode,
): ReactNode[] {
  const arrayForRendering = Array.from(
    toArraySource(collectionOrRecordOrCount),
    getMapFunction(collectionOrRecordOrCount, fn as ((el: any, index: any, key: Key) => ReactNode)),
  );

  if (arrayForRendering.length) {
    return arrayForRendering;
  }

  const fallbackContent = fallback?.();

  return fallbackContent ? [fallbackContent] : [];
}

function toArraySource(source: Iterable<any> | AnyRecord | number): Iterable<any> | { length: number } {
  if (typeof source === 'number') {
    if (isNonNegativeSafeInteger(source)) {
      return { length: source };
    }

    throw new Error('The source of renderMany() must be Iterable or Record or non negative integer');
  }

  if (source && (source as Iterable<any>)[Symbol.iterator]) {
    return source as Iterable<any>;
  }

  if (source && typeof source === 'object') {
    return objectEntries(source);
  }

  throw new Error('The source of renderMany() must be Iterable or Record or non negative integer');
}

function getMapFunction<V, K>(
  collectionOrRecordOrCount: Iterable<V> | Map<K, V> | Array<V> | Set<V> | AnyRecord | number,
  fn: (el: V | void, index: number | K | V, key: Key) => ReactNode,
) {
  if (collectionOrRecordOrCount instanceof Map) {
    return ([key, value]: [key: K, value: V], index: number) => fn(value, key, provideReactKey(value, index));
  }

  if (collectionOrRecordOrCount && (collectionOrRecordOrCount as Iterable<V>)[Symbol.iterator] || typeof collectionOrRecordOrCount === 'number') {
    return (value: V, index: number) => fn(value, index, provideReactKey(value, index));
  }

  if (collectionOrRecordOrCount && typeof collectionOrRecordOrCount === 'object') {
    return ([key, value]: [key: K, value: V], index: number) => fn(value, key, provideReactKey(value, index));
  }

  throw new Error('The source of renderMany() must be Iterable or Record or non negative integer');
}

function provideReactKey<V>(value: V, index: number): Key {
  if (value instanceof Object) {
    return getReactKey(value);
  }

  return index;
}
