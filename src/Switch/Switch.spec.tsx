import { describe, expect, mock, test } from 'bun:test';
import { render } from '@testing-library/react';
import { Switch } from './Switch';
import { Case } from './Case';

describe('<Switch>', () => {
  test('renders nothing when DefaultCase is not provided and other Case does not match', () => {
    const { getByTestId, unmount } = render(
      <div data-testid="wrapper">
        <Switch by="nonMatchingValue">
          <Case of="otherValue">Test</Case>
        </Switch>
      </div>
    );
    const wrapper = getByTestId('wrapper');

    expect(wrapper.childNodes.length).toBe(0);

    unmount();
  });

  test('renders value from matched Case', () => {
    const { getByTestId, unmount } = render(
      <div data-testid="wrapper">
        <Switch by="matchingValue2">
          <Case of="matchingValue1">Test 1</Case>
          <Case of="matchingValue2">Test 2</Case>
          <Case of="matchingValue3">Test 3</Case>
        </Switch>
      </div>
    );
    const wrapper = getByTestId('wrapper');

    expect(wrapper.textContent).toBe('Test 2');

    unmount();
  });

  test('renders value from matched Case when it is a function', () => {
    const test2 = mock(() => 'Test 2');
    const { getByTestId, unmount } = render(
      <div data-testid="wrapper">
        <Switch by="matchingValue2">
          <Case of="matchingValue1">Test 1</Case>
          <Case of="matchingValue2">{test2}</Case>
          <Case of="matchingValue3">Test 3</Case>
        </Switch>
      </div>
    );
    const wrapper = getByTestId('wrapper');

    expect(wrapper.textContent).toBe('Test 2');

    unmount();
  });

  test('do not invoke other cases if they do not match', () => {
    const test1 = mock(() => 'Test 1');
    const test2 = mock(() => 'Test 2');
    const test3 = mock(() => 'Test 3');
    const { unmount } = render(
      <div data-testid="wrapper">
        <Switch by="matchingValue2">
          <Case of="matchingValue1">{test1}</Case>
          <Case of="matchingValue2">{test2}</Case>
          <Case of="matchingValue3">{test3}</Case>
        </Switch>
      </div>
    );

    expect(test1).not.toHaveBeenCalled();
    expect(test2).toHaveBeenCalledTimes(1);
    expect(test3).not.toHaveBeenCalled();

    unmount();
  });
});
