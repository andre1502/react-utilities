export const padArrayStart = (
  array: string[],
  targetLength: number,
  padValue: string,
): string[] => {
  const padding = Array(Math.max(targetLength - array.length, 0)).fill(
    padValue,
  );
  return [...padding, ...array];
};

export const sliceFromEnd = (
  array: string[],
  positionFromEnd: number,
): string[] => {
  if (positionFromEnd <= 0) return []; // If position is 0 or negative, return an empty array

  return array.slice(-positionFromEnd);
};

export const joinWithoutFalsy = (array: string[], separator = ','): string => {
  return array.filter(Boolean).join(separator);
};
