// components
export { Switch, Case, DefaultCase, type SwitchProps, type CaseProps, type DefaultCaseProps } from './Switch';

// contexts
export {
  createContextCouple,
  type ContextCoupleInit,
  type ContextProviderComponent,
  type ContextConsumerHook,
  type ContextCouple,
} from './createContextCouple';

// utility functions
export { classNames, type ClassNamesArgument, type PossibleClassName } from './classNames';
export { customStyle, type CustomCSSProperties } from './customStyle';
export { dataAttrs, type DataAttrs } from './dataAttrs';
export { objectEntries } from './objectEntries';
export { renderMany, type RenderMappingFunction } from './renderMany';
export { generateKey, getReactKey, withReactKey, type WithReactKey } from './withReactKey';
