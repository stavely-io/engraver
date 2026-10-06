/**
 * Returns a random element from the provided array.
 * Throws an error if the array is empty.
 *
 * @param {T[]} array - The array to choose from.
 * @returns {T} A random element from the array.
 * @throws `Error` If the array is empty.
 * */
export const randomChoice = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error("Cannot choose from an empty array");
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

/**
 * Returns `true` if the provided value is the first occurrence in the array.
 *
 * Useful as a predicate for `Array.prototype.filter` to filter out duplicate values.
 *
 * @typeParam T - The type of elements in the array.
 * @param value - The current element being processed in the array.
 * @param index - The index of the current element being processed in the array.
 * @param array - The array `filter` was called upon.
 * @returns `true` if the value is unique in the array up to the current index, otherwise `false`.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 2, 3, 4, 4, 5];
 * const uniqueNumbers = numbers.filter(onlyUnique); // [1, 2, 3, 4, 5]
 * ```
 */
export const onlyUnique = <T>(value: T, index: number, array: T[]) => {
  return array.indexOf(value) === index;
};

export const commonElementProperty = <T, E>(
  arr: E[],
  key: (element: E) => T,
  equalityFn: (a: T, b: T) => boolean = (a: T, b: T) => a === b,
): T | undefined => {
  const first = key(arr[0]);
  return arr.every((note) => equalityFn(key(note), first)) ? first : undefined;
};
