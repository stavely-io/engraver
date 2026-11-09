import type { EngraverStore } from "../engraver-store";

type StoreValues<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

export type EngraverStoreValues = StoreValues<EngraverStore>;
