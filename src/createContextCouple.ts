import { Children, createContext, createElement, PropsWithChildren, ReactElement, useContext } from 'react';
import { Nullish, OverrideProperties } from 'value-guards';

export interface ContextProviderComponent<Props extends {} = {}> extends CallableFunction {
  (props: PropsWithChildren<Props>): ReactElement<Props>;
}

export interface ContextConsumerHook<Data = unknown> extends CallableFunction {
  (): Data;
}

export type ContextCouple<Props extends {} = {}, Data = unknown> = [
  ContextProvider: ContextProviderComponent<Props>,
  useContextConsumer: ContextConsumerHook<Data>,
];

export interface ContextCoupleInit<Props extends {} = {}, Data = unknown> {
  name: string;
  defaultValue?: Nullish<Data>;
  throwIfNotProvided?: boolean | string;
  useValueProvider: {
    (props: Props): Nullish<Data>;
  };
}

const NOT_PROVIDED = Symbol('NOT_PROVIDED');
type NotProvided = typeof NOT_PROVIDED;

export function createContextCouple<Props extends {} = {}, Data = unknown>(
  init: OverrideProperties<ContextCoupleInit<Props, Data>, {
    throwIfNotProvided: true | string,
    useValueProvider: (props: Props) => NonNullable<Data>,
  }>,
): ContextCouple<Props, NonNullable<Data>>;
export function createContextCouple<Props extends {} = {}, Data = unknown>(
  init: OverrideProperties<ContextCoupleInit<Props, Data>, {
    throwIfNotProvided: true | string,
    useValueProvider: (props: Props) => Nullish<Data>,
  }>,
): ContextCouple<Props, NonNullable<Data> | undefined>;
export function createContextCouple<Props extends {} = {}, Data = unknown>(
  init: OverrideProperties<ContextCoupleInit<Props, Data>, {
    defaultValue: NonNullable<Data>,
    useValueProvider: (props: Props) => NonNullable<Data>,
  }>,
): ContextCouple<Props, NonNullable<Data>>;
export function createContextCouple<Props extends {} = {}, Data = unknown>(
  init: ContextCoupleInit<Props, Data>,
): ContextCouple<Props, NonNullable<Data> | undefined>;

export function createContextCouple<Props extends {} = {}, Data = unknown>(
  { name, defaultValue, throwIfNotProvided, useValueProvider }: ContextCoupleInit<Props, Data>,
): ContextCouple<Props, Nullish<Data>> {
  const InternalContext = createContext<Nullish<Data> | NotProvided>(defaultValue ?? NOT_PROVIDED);

  const ContextProvider = ({ children, ...props }: PropsWithChildren<Props>): ReactElement<Props> => {
    const value = useValueProvider(props as Props);

    return createElement(InternalContext.Provider, { value }, ...Children.toArray(children)) as unknown as ReactElement<Props>;
  };

  const useContextConsumer: ContextConsumerHook<Nullish<Data>> = () => {
    const contextValue = useContext(InternalContext);

    if (contextValue === NOT_PROVIDED) {
      if (throwIfNotProvided) {
        throw new Error(typeof throwIfNotProvided === 'string' ? throwIfNotProvided : `Context "${name}" is not provided`);
      }

      return undefined;
    }

    return contextValue;
  };

  return [ContextProvider, useContextConsumer];
}
