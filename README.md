# react-cool-utils

Helpful utility functions that you usually need in any react project.

> Breaking changes in v2.0.0
> 
> - `renderMany()` now returns an array instead of Fragment
> - `classNames()` do not deduplicate css-classes anymore
> - package `uuid` moved to peerDependencies and should be installed separately


### `classNames()`

Creates string with css-class names. Accepts non fixed amount of arguments.
Possible values are: strings, arrays, objects, `null` and `undefined`.

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

Function allows to render arrays and any other iterables as ready render array.
Additionally, instead of iterable object, may accept positive integer. 
It allows to render something specified amount of times.
 - may render custom fallback in case of empty iterable or 0 times;
 - for iterable of objects automatically provides react keys;

##### With integer

```typescript jsx
import { renderMany } from 'react-cool-utils';
import { Fragment } from 'react';

function Example(): ReactElement {
  return (
    <Fragment>
      {renderMany(5, (_, index) => (
        <span>{index}</span>
      ))}
    </Fragment>
  );
}
```
##### With Map or Record

```typescript jsx
import { renderMany } from 'react-cool-utils';
import { Fragment } from 'react';

function ExampleWithMap(): ReactElement {
  const data = useMemo((): Map<RegExp, Date> => createExampleMap(), []);

  return (
    <Fragment>
      {renderMany(data, (value, key, reactKey) => (
        // value - value of Map<RegExp, Date>, Date object
        // key - key of Map<RegExp, Date>, RegExp object
        // reactKey - uuid string
        <span key={reactKey}>{date}</span>
      ))}
    </Fragment>
  );
}

function ExampleWithRecord(): ReactElement {
  const data = useMemo((): Record<string, Date> => createExampleRecord(), []);

  return (
    <Fragment>
      {renderMany(data, (value, key, reactKey) => (
        // value - value of Record<string, Date>, Date object
        // key - key of Record<string, Date>, string, name of own property
        // reactKey - uuid string
        <span key={reactKey}>{date}</span>
      ))}
    </Fragment>
  );
}
```

##### With iterable

```typescript jsx
import { useMemo } from 'react';
import { renderMany } from 'react-cool-utils';

function Example(): ReactElement {
  const data = useMemo((): Set<object> => createExampleSet(), []);
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

### `createContextCouple()`

It's very often when you need to create react context, that receives regular props and provides some aggregated value internally.
And additionally you need a custom hook, that reads value from context, but throws error when value is not provided.
To simplify a way of creating things above there is utility function `createContextCouple()`.
Ite receives configuration that describes behavior of provider component and consumer hook.
And returns this couple in tuple.

```typescript
import { createContextCouple } from 'react-cool-utils';

const [SpecialContextProvider, useSpecialContext] = createContextCouple({
  // name of your context
  name: 'SpecialContext',
  // if defaultValue is null or undefined it will be recognized as "not provided"
  defaultValue: null,
  // hook will throw an error wneh value is not provided though context provider component
  // may be a string, it will be used as custom error message
  throwIfNotProvided: true,
  // a hook that works inside context provider component
  // it transforms props into aggregated context value
  // feel free to use other hooks inside
  useValueProvider: (props: ProviderProps): ContextValue => {
    // create your context value here
  },
});

export {
  // use it as context provider in your JSX code and pass separate props instead of whole value
  SpecialContextProvider,
  // use it as replacement of useContext(Context)
  useSpecialContext,
};
```

### `objectEntries()`

Returns a generator which yields well typed entries of passed object.

```typescript
import { objectEntries } from 'react-cool-utils';

const data = {
  value: 123,
  validUntil: new Date(),
  description: 'test description',
};

for (const [property, value] of objectEntries(data)) {
  // typeof property = 'value' | 'validUntil' | 'description'
  // typeof value = number | Date | string
}
```

### `<Switch>`/`<Case>`

Component `Switch` renders content from only one `Case` which matches by value.

```typescript jsx
import { Switch, Case, DefaultCase } from 'react-cool-utils';

function StatusIcon({ status }: MyComponentProps) {
  return (
    <Switch by={status}>
      <Case of={Status.IDLE}>
        <IdleIcon/>
      </Case>
      <Case of={Status.ACTIVE}>
        {() => (
          // function will be invoked only if value from Case matches with value in Switch
          <ActiveIcon/>
        )}
      </Case>
      <Case of={Status.DELETED}>
        <DeletedIcon/>
      </Case>
      <DefaultCase>
        <UnknownIcon/>
      </DefaultCase>
    </Switch>
  );
}
```
