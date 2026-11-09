/**
 * Converts unknown value into a string.
 * Uses JSON.stringify if value is not typeof string
 *
 * @param value - value of type unknown to be converted to string
 *
 * @returns - value converted to string
 */
export function stringifyUnknown(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}
