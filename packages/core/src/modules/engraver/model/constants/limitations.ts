import { EngraverStaveVoice } from "../core/types/engraver-model.types";
import { DotCount } from "@/modules/musical-core/types/dot-count.enum";
import { enumValues } from "@/utils/enum";

export const MAX_DOT_MODIFIERS = DotCount.THREE;

export const MAX_VOICE_COUNT = enumValues(EngraverStaveVoice).length;

export const LOWEST_OCTAVE = 0;
export const HIGHEST_OCTAVE = 9;
