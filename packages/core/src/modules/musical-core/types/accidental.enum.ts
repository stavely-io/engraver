import { enumValues } from "../../../utils/enum";

export enum Accidental {
  NONE = "",
  DOUBLE_SHARP = "##",
  SHARP = "#",
  NATURAL = "n",
  FLAT = "b",
  DOUBLE_FLAT = "bb",
}

export const DEFAULT_ACCIDENTAL_TYPES: Accidental[] = enumValues(Accidental);
