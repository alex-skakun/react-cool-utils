type PossibleClassName = string | undefined | null;

interface ClassNamesAccumulator {
  uniqueClassNames: Set<string>;
  results: string[];
}

export function classNames(...args: (Record<string, unknown> | PossibleClassName[] | PossibleClassName)[]): string {
  const { results } = args.reduce<ClassNamesAccumulator>((acc, argument) => {
    if (!argument) {
      return acc;
    }

    if (typeof argument === 'string') {
      return handleStringArgument(argument, acc);
    }

    if (Array.isArray(argument)) {
      return argument.length ? handleArrayArgument(argument, acc) : acc;
    }

    if (typeof argument === 'object') {
      return handleObjectArgument(argument, acc);
    }

    return acc;
  }, {
    uniqueClassNames: new Set(),
    results: [],
  });

  return results.join(' ');
}

function handleStringArgument(arg: string, acc: ClassNamesAccumulator): ClassNamesAccumulator {
  const cssClasses = arg.trim().split(/\s+/);

  forLoop(cssClasses, (cssClass) => {
    if (!acc.uniqueClassNames.has(cssClass)) {
      acc.uniqueClassNames.add(cssClass);
      acc.results.push(cssClass);
    }
  });

  return acc;
}

function handleArrayArgument(arg: PossibleClassName[], acc: ClassNamesAccumulator): ClassNamesAccumulator {
  forLoop(arg, (possibleClassName) => {
    if (possibleClassName) {
      handleStringArgument(possibleClassName, acc);
    }
  });

  return acc;
}

function handleObjectArgument(arg: Record<string, unknown>, acc: ClassNamesAccumulator): ClassNamesAccumulator {
  forLoop(Object.entries(arg), ([cssClass, shouldBeAdded]) => {
    const cssClassValue = cssClass.trim();

    if (cssClassValue && shouldBeAdded) {
      handleStringArgument(cssClassValue, acc);
    }
  });

  return acc;
}

function forLoop<T>(arr: T[], cb: (item: T) => void): void {
  for (let i = 0, l = arr.length; i < l; i++) {
    cb(arr[i]);
  }
}
