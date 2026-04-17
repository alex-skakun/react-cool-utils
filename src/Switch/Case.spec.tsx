import { afterAll, beforeAll, describe, expect, mock, test } from 'bun:test';
import { render } from '@testing-library/react';
import { Case } from './Case';
import { Switch } from './Switch';
import { PropsWithChildren } from 'react';

describe('<Case>', () => {
  describe('Outside <Switch>', () => {
    let originalConsoleError: typeof console.error;

    beforeAll(() => {
      originalConsoleError = console.error;
      console.error = () => {};
    });

    afterAll(() => {
      console.error = originalConsoleError;
    });

    test('throws error if used outside of <Switch>', () => {
      expect(() => render(<Case of="test">Rendered value</Case>))
        .toThrowError('<Case> or <DefaultCase> must be used only inside <Switch> subtree');
    });
  });

  describe('Inside <Switch>', () => {
    test('render nothing', () => {
      const Wrapper = mock(({ children }: PropsWithChildren) => {
        return <div data-testid="wrapper">{children}</div>;
      });
      const { unmount, getByTestId } = render(
        <Switch by="someValue">
          <Wrapper>
            <Case of="someValue">Test</Case>
          </Wrapper>
        </Switch>
      );

      const wrapper = getByTestId('wrapper');

      expect(wrapper.childNodes.length).toBe(0);

      unmount();
    });
  });
});
