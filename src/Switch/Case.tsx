import { ReactNode } from 'react';

import { CaseRenderFn } from './CaseRenderFn';
import { useSwitchContext } from './SwitchContext';

export type CaseProps<T> = {
  of: T;
  children: CaseRenderFn<T> | ReactNode;
};

export function Case<T>({ of, children }: CaseProps<T>): null {
  const switchContext = useSwitchContext<T>();

  switchContext.addCase(of, children);

  return null;
}
