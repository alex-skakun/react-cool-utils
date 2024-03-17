import { describe, expect, test } from 'bun:test';
import { createElement, CSSProperties } from 'react';
import { renderToString } from 'react-dom/server';
import { CustomCSSProperties, customStyle } from './customStyle';

describe('customStyle()', () => {
  test('returns unmodified object', () => {
    const style: CSSProperties & CustomCSSProperties = {
      color: 'red',
      '--custom-color': 'yellow',
    };

    expect(customStyle(style)).toBe(style);
  });

  test('react element accepts object with custom style', () => {
    const divNode = createElement('div', {
      style: customStyle({
        color: 'red',
        '--custom-color': 'yellow'
      }),
    });

    expect(renderToString(divNode)).toBe('<div style="color:red;--custom-color:yellow"></div>')
  });
});
