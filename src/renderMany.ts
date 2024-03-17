import { createElement, Fragment, Key, ReactNode } from 'react';
import { generateKey } from './withReactKey';

export function renderMany(
  count: number,
  mapFn: (_: void, index: number) => ReactNode,
  fallback?: () => ReactNode,
): ReactNode;
export function renderMany<K, V extends object>(
  map: Map<K, V>,
  mapFn: (entry: [K, V], index: number, reactKey: Key) => ReactNode,
  fallback?: () => ReactNode,
): ReactNode;
export function renderMany<K, V>(
  map: Map<K, V>,
  mapFn: (entry: [K, V], index: number) => ReactNode,
  fallback?: () => ReactNode,
): ReactNode;
export function renderMany<T extends object>(
  map: Iterable<T>,
  mapFn: (entry: T, index: number, reactKey: Key) => ReactNode,
  fallback?: () => ReactNode,
): ReactNode;
export function renderMany<T>(
  map: Iterable<T>,
  mapFn: (entry: T, index: number) => ReactNode,
  fallback?: () => ReactNode,
): ReactNode;

export function renderMany<T>(
  collectionOrCount: number | Iterable<T>,
  mapFn: (item: T | void, index: number, reactKey: Key) => ReactNode,
  fallback?: () => ReactNode,
): ReactNode {
  if (typeof collectionOrCount === 'number' && (collectionOrCount <= 0 || !Number.isSafeInteger(collectionOrCount))) {
    return fallback?.();
  }

  const mappedNodes = Array.from(
    isPositiveInteger(collectionOrCount) ? { length: collectionOrCount } : collectionOrCount,
    getMapperFunction(collectionOrCount, mapFn),
  );

  return mappedNodes.length ? createElement(Fragment, {}, mappedNodes) : fallback?.();
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function getMapperFunction<T>(
  collectionOrCount: number | Iterable<T>,
  mapFn: (item: T | void, index: number, reactKey: Key) => ReactNode,
): (item: T, index: number) => ReactNode {
  if (typeof collectionOrCount === 'number') {
    return (_, index: number) => mapFn(undefined, index, undefined as unknown as Key);
  }

  if (collectionOrCount instanceof Map) {
    return (entry: T, index: number) => mapFn(
      entry,
      index,
      getKey((entry as [unknown, unknown])[1]) as Key,
    );
  }

  return (item: T, index: number) => mapFn(item, index, getKey(item) as Key);
}

function getKey(item: unknown): Key | undefined {
  if (item instanceof Object) {
    return generateKey(item);
  }

  return undefined;
}
