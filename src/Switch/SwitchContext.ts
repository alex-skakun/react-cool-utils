import { PropsWithChildren, ReactNode } from 'react';
import { isFunction } from 'value-guards';

import { CaseRenderFn } from './CaseRenderFn';
import { createContextCouple } from '../createContextCouple';

export class SwitchContextState<T> {
  readonly #cases = new Map<T, CaseRenderFn<T> | ReactNode>();
  #defaultCase: CaseRenderFn<T> | ReactNode = undefined;

  clear(): void {
    this.#defaultCase = undefined;
    this.#cases.clear();
  }

  addCase(of: T, render: CaseRenderFn<T> | ReactNode): void {
    this.#cases.set(of, render);
  }

  setDefaultCase(render: CaseRenderFn<T> | ReactNode): void {
    this.#defaultCase = render;
  }

  render(selected: T): ReactNode {
    if (this.#cases.has(selected)) {
      const selectedRenderFn = this.#cases.get(selected);
      return isFunction(selectedRenderFn) ? selectedRenderFn(selected) : selectedRenderFn;
    }

    return isFunction(this.#defaultCase) ? this.#defaultCase(selected) : this.#defaultCase;
  }
}

export type SwitchContextProps = PropsWithChildren<{
  value: SwitchContextState<any>;
}>;

const [SwitchContext, useSwitchContextRaw] = createContextCouple<SwitchContextProps, SwitchContextState<any>>({
  name: 'SwitchContext',
  throwIfNotProvided: '<Case> or <DefaultCase> must be used only inside <Switch> subtree',
  useValueProvider: ({ value }) => value,
});

export function useSwitchContext<T>(): SwitchContextState<T> {
  return useSwitchContextRaw();
}

export {
  SwitchContext,
};
