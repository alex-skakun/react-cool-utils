import { ReactNode } from 'react';

import { CaseRenderFn } from './CaseRenderFn';
import { useSwitchContext } from './SwitchContext';

export type DefaultCaseProps<T> = {
  children: CaseRenderFn<T> | ReactNode;
};

export function DefaultCase<T>({ children }: DefaultCaseProps<T>): null {
  const context = useSwitchContext<T>();

  context.setDefaultCase(children);

  return null;
}
