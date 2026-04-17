import { ReactNode } from 'react';

export type CaseRenderFn<T> = {
  (value: T): ReactNode;
};
