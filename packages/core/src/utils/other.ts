/**
 *
 * @param text - The string to capitalize.
 * @returns The input string with the first character capitalized.
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
/**
 * Converts snake_case to camelCase
 *
 * @param text
 * @returns text in camelCase
 */
export const snakeToCamel = (text: string): string =>
  text.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
