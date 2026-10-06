import { enumValues } from "../../../utils/enum";

export enum DotCount {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

export const DEFAULT_DOT_COUNTS: DotCount[] = enumValues(DotCount);
