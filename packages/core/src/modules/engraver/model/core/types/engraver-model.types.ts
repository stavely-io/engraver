import type { Duration } from "@/modules/musical-core/models/duration";
import type { KeySignature } from "@/modules/musical-core/models/key-signature";
import { Accidental } from "@/modules/musical-core/types/accidental.enum";
import type { Clef } from "@/modules/musical-core/types/clef.types";
import { DotCount } from "@/modules/musical-core/types/dot-count.enum";
import { TimeSignature } from "@/modules/musical-core/types/time-signature.types";
import { enumValues } from "@/utils/enum";

import type {
  EngraverPlayableSelectableCoordinates,
  EngraverTickableCoordinates,
} from "../../../controller/interaction/action-handler/types/engraver-coordinates";
import { EngraverInputMode } from "../../../view/types/engraver-mode.types";
import type { EngraverChord } from "../../elements/events/engraver-chord";
import type { EngraverNote } from "../../elements/events/engraver-note";
import type { EngraverRest } from "../../elements/events/engraver-rest";

export type EngraverTickable = EngraverChord | EngraverRest;

export type EngraverPlayableSelectable = EngraverNote | EngraverRest;

export interface IEngraverPlayableSelectable {
  get coordinates(): EngraverPlayableSelectableCoordinates;
}

export interface IEngraverTickable {
  get coordinates(): EngraverTickableCoordinates;
  get duration(): Duration;
}

export interface EngraverSelectable {
  readonly id: number;
}

export interface EngraverBlockable {
  isBlocked: boolean;
}

export enum EngraverChromaticShiftDirection {
  UP,
  DOWN,
}

export enum EngraverStaveVoice {
  FIRST = 0,
  SECOND = 1,
}

export type EngraverStaveModifiers = {
  key: KeySignature;
  time: TimeSignature;
  clef: Clef;
};

export type EngraverNoteModifiers = {
  accidental: Accidental;
  dotCount: DotCount;
  duration: Duration;
  inputMode: EngraverInputMode;
};

export const DEFAULT_ENGRAVER_VOICES = enumValues(EngraverStaveVoice);
