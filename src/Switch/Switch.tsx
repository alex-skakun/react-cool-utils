import { Fragment, ReactElement, useEffect, useMemo, useState } from 'react';

import { Case, CaseProps } from './Case';
import { DefaultCase, DefaultCaseProps } from './DefaultCase';
import { SwitchContext, SwitchContextState, useSwitchContext } from './SwitchContext';
import { NonEmptyTuple } from 'value-guards';

type SwitchChild<T> = ReactElement<CaseProps<T>, typeof Case<T>> | ReactElement<DefaultCaseProps<T>, typeof DefaultCase<T>>;

export type SwitchProps<T> = {
  by: T;
  children: NonEmptyTuple<SwitchChild<T>> | SwitchChild<T>;
};

export function Switch<T>({ by, children }: SwitchProps<T>): ReactElement<SwitchProps<T>, typeof Switch<T>> {
  const switchContext = useMemo(() => new SwitchContextState<T>(), []);

  useEffect(() => () => {
    switchContext.clear();
  });

  return (
    <SwitchContext value={switchContext}>
      <CasesRenderer nodes={children}/>
      <SelectedRenderer selected={by}/>
    </SwitchContext>
  );
}

function CasesRenderer({ nodes }: { nodes: NonEmptyTuple<ReactElement> | ReactElement }): ReactElement {
  const context = useSwitchContext();

  context.clear();

  return <Fragment>{nodes}</Fragment>;
}

function SelectedRenderer<T>({ selected }: { selected: T }): ReactElement {
  const context = useSwitchContext<T>();

  return <Fragment>{context.render(selected)}</Fragment>;
}
