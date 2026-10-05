export function enumValues<T extends Record<string, string | number>>(e: T): T[keyof T][] {
  return Object.keys(e)
    .filter((key) => isNaN(Number(key)))
    .map((key) => e[key]) as T[keyof T][];
}
