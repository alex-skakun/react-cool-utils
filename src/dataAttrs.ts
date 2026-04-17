import { KebabCase } from 'value-guards';
import { objectEntries } from './objectEntries';

const CASE_DETECTION_REG_EXP = /[a-z]([A-Z])|[-_]+([A-z])/g;

export type DataAttrs<Attrs extends Record<string, any>> = {
  [P in keyof Attrs as P extends string ? `data-${KebabCase<P>}` : P]: string;
};

export function dataAttrs<const Attrs extends Record<string, any>>(attrs: Attrs): DataAttrs<Attrs> {
  return Object.fromEntries(
    isIteratorMapSupported()
      ? objectEntries(attrs).map(([key, value]) => [toDataAttributeName(key as string), String(value)])
      : Object.entries(attrs).map(([key, value]) => [toDataAttributeName(key), String(value)]),
  ) as DataAttrs<Attrs>;
}

function toDataAttributeName<P extends string>(property: P): `data-${KebabCase<P>}` {
  const kebabPart = property
    .replace(CASE_DETECTION_REG_EXP, replacer)
    .toLowerCase() as KebabCase<P>;

  return `data-${kebabPart}`;
}

function replacer(match: string, camelLetter: string | undefined, snakeLetter: string | undefined): string {
  if (camelLetter) {
    return `${match.charAt(0)}-${camelLetter.toLowerCase()}`;
  }

  if (snakeLetter) {
    return `-${snakeLetter.toLowerCase()}`;
  }

  return match;
}

function isIteratorMapSupported(): boolean {
  return 'Iterator' in globalThis && Boolean(Iterator?.prototype?.map);
}
