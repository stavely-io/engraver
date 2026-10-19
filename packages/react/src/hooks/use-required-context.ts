import { type Context, useContext } from "react";

export function useRequiredContext<T>(context: Context<T | null>, error: Error): T {
  const value = useContext(context);
  if (!value) {
    throw error;
  }
  return value;
}
