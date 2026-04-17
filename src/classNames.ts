import { Nullish } from 'value-guards';

export type PossibleClassName = Nullish<string>;
export type ClassNamesArgument = PossibleClassName | PossibleClassName[] | Record<string, unknown> | ClassNamesArgument[];

function isSafari(): boolean {
  if ('window' in globalThis && window?.navigator?.userAgent) {
    return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
  }

  return false;
}

function appendChrome(acc: string, className: string): string {
  return acc + (acc ? ' ' : '') + className;
}

function appendSafari(acc: string, className: string): string {
  return `${acc}${acc ? ' ' : ''}${className}`;
}

const append = isSafari() ? appendSafari : appendChrome;

export function classNames(...args: ClassNamesArgument[]): string;
export function classNames(): string {
  var acc = '';

  for (var i = 0, l = arguments.length; i < l; i++) {
    var arg = arguments[i];

    if (typeof arg === 'string') {
      acc = append(acc, arg);
    } else if (Array.isArray(arg)) {
      acc = append(acc, classNames.apply(null, arg));
    } else if (arg instanceof Object) {
      for (var key in arg) {
        if (arg.hasOwnProperty(key) && arg[key]) {
          acc = append(acc, key);
        }
      }
    }
  }

  return acc;
}
