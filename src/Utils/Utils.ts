export const getV = (divider: number): number => {
  return Math.floor(Date.now() / divider);
};

// pad value with zero
export const padNumber = (value: number, padded: string | undefined = '0') => {
  return (padded + Math.floor(value)).slice(-2);
};

export const getLastPathName = (pathName: string) => {
  const tmpPathName = pathName.split('/');

  return tmpPathName[tmpPathName.length - 1] || 'bet';
};

export function parseQueryString(fullString: string): {
  originValue: string;
} & Record<string, string> {
  const [originValue, queryString] = fullString.split('?');
  const params: { [key: string]: string } = {};

  if (queryString) {
    queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = value;
    });
  }

  return { originValue, ...params };
}

export const getUniquePermutations = (
  array: string[],
  length: number,
): string[][] => {
  if (length === 1) return array.map((item) => [item]);

  const permutations = new Set<string>(); // Use Set to prevent duplicates
  for (let i = 0; i < array.length; i++) {
    const current = array[i];
    const remaining = array.slice(0, i).concat(array.slice(i + 1));
    const subPermutations = getUniquePermutations(remaining, length - 1);
    subPermutations.forEach((perm) => {
      permutations.add([current, ...perm].join(',')); // Join to ensure uniqueness
    });
  }

  // Convert back to array format
  return [...permutations].map((perm) => perm.split(','));
};

export const getKeyByValue = <T>(
  object: Record<string, T>,
  value: T,
): string | undefined => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const autoBlur = () => {
  setTimeout(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, 0);
};

export const isValidHttpUrl = (url: string) => {
  try {
    const newUrl = new URL(url);

    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

export const isHiddenKey = (key: string) => {
  return key.startsWith('__');
};
