import { Entry } from 'value-guards';

export function* objectEntries<const T extends object>(value: T): Generator<Entry<T>, void, void> {
  for (const property in value) {
    if (value.hasOwnProperty(property)) {
      yield [property, Reflect.get(value, property)] as Entry<T>;
    }
  }
}
