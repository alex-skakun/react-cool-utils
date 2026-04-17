import { afterAll, beforeAll, describe, expect, mock, test } from 'bun:test';
import { render } from '@testing-library/react';
import { isPresent } from 'value-guards';
import { ContextCoupleInit, createContextCouple } from './createContextCouple';

describe('createContextCouple()', () => {
  function createTestEnvironment<Props extends {} = {}, Data = unknown>(
    init: ContextCoupleInit<Props, Data>,
    provideProps?: NoInfer<Props>,
  ) {
    const [ContextProvider, useProvidedContext] = createContextCouple(init);
    const valueMock = mock();
    const ValueComponent = ({ hookValue }: { hookValue: unknown }) => {
      valueMock(hookValue);
      return 'test';
    };
    const ComponentWithHook = () => {
      const value = useProvidedContext();
      return <ValueComponent hookValue={value}/>;
    };

    const TestComponent = () => {
      const content = <ComponentWithHook/>;

      if (isPresent(provideProps)) {
        return <ContextProvider {...provideProps}>{content}</ContextProvider>;
      }

      return content;
    };

    return { TestComponent, valueMock };
  }

  test('creates provider component and consumer hook', () => {
    const [ContextProvider, useProvidedContext] = createContextCouple({
      name: 'TestContext',
      useValueProvider() {
        return 'test';
      },
    });

    expect(ContextProvider).toBeFunction();
    expect(useProvidedContext).toBeFunction();
  });

  describe('with specified default value', () => {
    test('consumer hook returns undefined when default value is null and other value is not provided', () => {
      const { TestComponent, valueMock } = createTestEnvironment({
        name: 'TestContext',
        defaultValue: null,
        useValueProvider: () => null,
      });

      const { unmount } = render(<TestComponent/>);

      expect(valueMock).toHaveBeenCalledWith(undefined);
      unmount();
    });

    test('consumer hook returns undefined when default value is undefined and other value is not provided', () => {
      const { TestComponent, valueMock } = createTestEnvironment({
        name: 'TestContext',
        defaultValue: null,
        useValueProvider: () => null,
      });

      const { unmount } = render(<TestComponent/>);

      expect(valueMock).toHaveBeenCalledWith(undefined);
      unmount();
    });

    test('consumer hook returns null when provided value is null', () => {
      const { TestComponent, valueMock } = createTestEnvironment({
        name: 'TestContext',
        defaultValue: null,
        useValueProvider: ({ customValue }: { customValue: unknown }) => customValue,
      }, { customValue: null });

      const { unmount } = render(<TestComponent/>);

      expect(valueMock).toHaveBeenCalledWith(null);
      unmount();
    });

    test('consumer hook returns undefined when provided value is undefined', () => {
      const { TestComponent, valueMock } = createTestEnvironment({
        name: 'TestContext',
        defaultValue: null,
        useValueProvider: ({ customValue }: { customValue: unknown }) => customValue,
      }, { customValue: undefined });

      const { unmount } = render(<TestComponent/>);

      expect(valueMock).toHaveBeenCalledWith(undefined);
      unmount();
    });
  });

  describe('without specified default value', () => {
    test('consumer hook returns undefined when value is not provided and there is no default value', () => {
      const { TestComponent, valueMock } = createTestEnvironment({
        name: 'TestContext',
        useValueProvider: () => null,
      });

      const { unmount } = render(<TestComponent/>);

      expect(valueMock).toHaveBeenCalledWith(undefined);
      unmount();
    });

    test('consumer hook returns null when null value is provided and there is no default value', () => {
      const { TestComponent, valueMock } = createTestEnvironment({
        name: 'TestContext',
        useValueProvider: ({ customValue }: { customValue: unknown }) => customValue,
      }, { customValue: null });

      const { unmount } = render(<TestComponent/>);

      expect(valueMock).toHaveBeenCalledWith(null);
      unmount();
    });

    test('consumer hook returns provided value when there is no default value', () => {
      const { TestComponent, valueMock } = createTestEnvironment({
        name: 'TestContext',
        useValueProvider: ({ customValue }: { customValue: unknown }) => customValue,
      }, { customValue: 'test' });

      const { unmount } = render(<TestComponent/>);

      expect(valueMock).toHaveBeenCalledWith('test');
      unmount();
    });

    test('consumer hook returns undefined when provided value is undefined and there is no default value', () => {
      const { TestComponent, valueMock } = createTestEnvironment({
        name: 'TestContext',
        useValueProvider: ({ customValue }: { customValue: unknown }) => customValue,
      }, { customValue: undefined });

      const { unmount } = render(<TestComponent/>);

      expect(valueMock).toHaveBeenCalledWith(undefined);
      unmount();
    });
  });

  describe('when throwIfNotProvided specified', () => {
    let originalConsoleError: typeof console.error;

    beforeAll(() => {
      originalConsoleError = console.error;
      console.error = () => {};
    });

    afterAll(() => {
      console.error = originalConsoleError;
    });

    test('throw error when default value is not specified', () => {
      const { TestComponent } = createTestEnvironment({
        name: 'TestContext',
        throwIfNotProvided: true,
        useValueProvider: () => null,
      });

      expect(() => render(<TestComponent/>)).toThrowError(`Context "TestContext" is not provided`);
    });

    test('throw custom error when default value is not specified', () => {
      const { TestComponent } = createTestEnvironment({
        name: 'TestContext',
        throwIfNotProvided: 'Custom error message',
        useValueProvider: () => null,
      });

      expect(() => render(<TestComponent/>)).toThrowError('Custom error message');
    });

    test('do not throw error when default value is not specified but regular value is provided', () => {
      const { TestComponent, valueMock } = createTestEnvironment({
        name: 'TestContext',
        throwIfNotProvided: true,
        useValueProvider: ({ customValue }: { customValue: unknown }) => customValue,
      }, { customValue: 'test' });

      const { unmount } = render(<TestComponent/>);

      expect(valueMock).toHaveBeenCalledWith('test');
      unmount();
    });
  });
});
