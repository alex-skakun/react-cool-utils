import { CSSProperties } from 'react';

export type CustomCSSProperties = {
  [key: `--${string}`]: number | string;
};

export function customStyle(style: CSSProperties & CustomCSSProperties): CSSProperties {
  return style;
}
