import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes intelligently.
 *
 * @param inputs - Class names to be merged. Can be strings, arrays, or objects.
 * @returns A single string containing all class names, with conflicting Tailwind CSS classes resolved.
 *
 * */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
