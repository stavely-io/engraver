import { SmplrInstrumentType } from "../types/instrument.js";
import { SmplrPlayer } from "./abstract/smplr-player.js";
import { SmplrCelloPlayer } from "./instruments/smplr-cello-player.js";
import { SmplrGuitarPlayer } from "./instruments/smplr-guitar-player.js";
import { SmplrMarimbaPlayer } from "./instruments/smplr-marimba-player.js";
import { SmplrPianoPlayer } from "./instruments/smplr-piano-player.js";
import { SmplrTrumpetPlayer } from "./instruments/smplr-trumpet-player.js";
import { SmplrViolinPlayer } from "./instruments/smplr-violin-player.js";

export const SMPLR_INSTRUMENT_MAP: Record<
  SmplrInstrumentType,
  (context: AudioContext) => SmplrPlayer
> = {
  [SmplrInstrumentType.PIANO]: (context: AudioContext) =>
    new SmplrPianoPlayer(context),
  [SmplrInstrumentType.MARIMBA]: (context: AudioContext) =>
    new SmplrMarimbaPlayer(context),
  [SmplrInstrumentType.GUITAR]: (context: AudioContext) =>
    new SmplrGuitarPlayer(context),
  [SmplrInstrumentType.CELLO]: (context: AudioContext) =>
    new SmplrCelloPlayer(context),
  [SmplrInstrumentType.TRUMPET]: (context: AudioContext) =>
    new SmplrTrumpetPlayer(context),
  [SmplrInstrumentType.VIOLIN]: (context: AudioContext) =>
    new SmplrViolinPlayer(context),
};
