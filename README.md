# react-cool-utils

Helpful utility functions that you usually need in any react project.

### `classNames()`

Creates string with unique css class names. Accepts non fixed amount of arguments.
Possible values are: strings, arrays, objects, `null` and `undefined`. 
Function understands space separated classes in strings, inside arrays and in property names of objects.

```typescript jsx
import { ReactElement } from 'react';
import { classNames } from 'react-cool-utils';

function Example(): ReactElement {
  return (
    <div className={classNames(
      'static-class another-class',
      'one-more-class',
      {
        ['conditional-class']: condition()
      },
      cssClassesFromUtilityFunctionAsArray(),
    )}/>
  );
}
```

### `dataAttrs()`

Creates an object with data attributes. Convert property names to lowercase kebab-case strings with `data-` prefix.
All values will be converted to strings.

```typescript jsx
import { ReactElement, useMemo } from 'react';
import { dataAttrs } from 'react-cool-utils';

type ExampleProps = {
  id: number;
  kind: string;
};

function Example({ id, kind }: ExampleProps): ReactElement {
  const dataset = useMemo(() => dataAttrs({
    elementId: id,
    exampleKind: kind,
    'wrong-style_property': false,
  }), [id, kind]);
  
  /*
  dataset object will be:
  {
    'data-element-id': '123',
    'data-example-kind': 'test',
    'data-wrong-style-property': 'false',
  }
  */

  return (
    <div {...dataset}/>
  );
}
```

### `customStyle()`

Just type safe function for creating `CSSProperties` object with custom css properties inside.
So it's not needed anymore to use `as` type casting.

```typescript jsx
import { ReactElement, useMemo } from 'react';
import { customStyle } from 'react-cool-utils';

type ExampleProps = {
  columns: number;
};

function Example({ columns }: ExampleProps): ReactElement {
  const style = useMemo(() => customStyle({
    backgroundColor: 'red',
    '--example-columnsAmount': columns,
  }), [columns]);

  return (
    <div style={style}/>
  );
}
```

### `generateKey()`

Receives as object and returns uuid string for it. Returns same value for same object on each call.

```typescript
import { generateKey } from 'react-cool-utils';

const data = { someProperty: 'someValue' };
const uuid1 = generateKey(data);
const uuid2 = generateKey(data);

console.log(uuid1 === uuid2); // true
```

### `withReactKey()`

This function adds a special property with a unique string to the passed object. 
If the passed object already contains this property, its value will be kept unchanged.
For the case when a new object will be passed, but with a property and value generated earlier for another object, 
the function can work in two modes: `new` and `keep`.

- `keep` (default): the property will be kept unchanged;
- `new`: a new value will be generated for the property.

The property name is a private `symbol`, so this property will not be included in JSON when sending data over the network.

### `getReactKey()`

Returns previously generated unique string from special property 
(created by `withReactKey()` function) or generates new key for passed object.

```typescript
import { getReactKey, withReactKey } from 'react-cool-utils';

const dataWithKey = withReactKey({
  some: 'property',
});
const key = getReactKey(dataWithKey); // retunrns unique string
```

### `renderMany()`

Function allows to render arrays and any other iterables as single React.Fragment.
Additionally, instead of iterable object, may accept positive integer. 
It allows to render something specified amount of times.
 - may render custom fallback in case of empty iterable or 0 times;
 - for iterable of objects automatically provides keys;

##### With integer

```typescript jsx
import { renderMany } from 'react-cool-utils';

function Example(): ReactElement {
  // returns a Fragment with 5 span elements inside
  return renderMany(5, (_, index) => (
    <span>{index}</span>
  ));
}
```

##### With iterable

```typescript jsx
import { useMemo } from 'react';
import { renderMany } from 'react-cool-utils';

function Example(): ReactElement {
  const data = useMemo((): Set<object> => createExampleMap(), []);
  // returns a Fragment with generated span elements inside
  return renderMany(data, (element, index, key) => (
    // key is unique for each element
    <div key={key}>{index}</div>
  ));
}
```

##### With fallback

```typescript jsx
import { useMemo } from 'react';
import { renderMany } from 'react-cool-utils';

function Example(): ReactElement {
  // returns a Fragment with generated fallback
  return renderMany([], (element, index) => (
    <div key={key}>{index}</div>
  ), () => (
    <div>I'm fallback</div>
  ));
}
```
