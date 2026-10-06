import { SmplrInstrumentType } from "../types/instrument";
import { SmplrPlayer } from "./abstract/smplr-player";
import { SmplrCelloPlayer } from "./instruments/smplr-cello-player";
import { SmplrGuitarPlayer } from "./instruments/smplr-guitar-player";
import { SmplrMarimbaPlayer } from "./instruments/smplr-marimba-player";
import { SmplrPianoPlayer } from "./instruments/smplr-piano-player";
import { SmplrTrumpetPlayer } from "./instruments/smplr-trumpet-player";
import { SmplrViolinPlayer } from "./instruments/smplr-violin-player";

export const SMPLR_INSTRUMENT_MAP: Record<
  SmplrInstrumentType,
  (context: AudioContext) => SmplrPlayer
> = {
  [SmplrInstrumentType.PIANO]: (context: AudioContext) => new SmplrPianoPlayer(context),
  [SmplrInstrumentType.MARIMBA]: (context: AudioContext) => new SmplrMarimbaPlayer(context),
  [SmplrInstrumentType.GUITAR]: (context: AudioContext) => new SmplrGuitarPlayer(context),
  [SmplrInstrumentType.CELLO]: (context: AudioContext) => new SmplrCelloPlayer(context),
  [SmplrInstrumentType.TRUMPET]: (context: AudioContext) => new SmplrTrumpetPlayer(context),
  [SmplrInstrumentType.VIOLIN]: (context: AudioContext) => new SmplrViolinPlayer(context),
};
