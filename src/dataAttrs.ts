type KebabCase<Input extends string, Result extends string = ''> = Input extends `${infer First}${infer Rest}`
  ? KebabCase<Rest, `${Result}${
    First extends '_' | '-'
      ? `-`
      : First extends Uppercase<First>
        ? `-${Lowercase<First>}`
        : First extends Lowercase<First>
          ? Lowercase<First>
          : `-${Lowercase<First>}`
    }`>
  : Result;

export type DataAttrs<Attrs extends Record<string, any>> = {
  [P in keyof Attrs as P extends string ? `data-${KebabCase<P>}` : P]: string;
};

export function dataAttrs<Attrs extends Record<string, any>>(attrs: Attrs): DataAttrs<Attrs> {
  return Object.fromEntries(
    Object.entries(attrs).map(([key, value]) => [toDataAttributeName(key), String(value)]),
  ) as DataAttrs<Attrs>;
}

function toDataAttributeName<P extends string>(property: P): `data-${KebabCase<P>}` {
  const kebabPart = property
    .replace(/[a-z]([A-Z])|[-_]+([A-z])/g, replacer)
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
