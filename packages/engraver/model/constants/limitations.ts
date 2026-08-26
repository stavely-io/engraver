import { DotCount } from '@/lib/modules/musical-core/types/dot-count.enum';
import { enumValues } from '@/lib/utils/enum';
import { EngraverStaveVoice } from '../core/types/engraver-model.types';

export const MAX_DOT_MODIFIERS = DotCount.THREE;

export const MAX_VOICE_COUNT = enumValues(EngraverStaveVoice).length;

export const LOWEST_OCTAVE = 0;
export const HIGHEST_OCTAVE = 9;
