import { EngraverStaveVoice } from '@/lib/modules/engraver/model/core/types/engraver-model.types';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';
import { DotCount } from '@/lib/modules/musical-core/types/dot-count.enum';

import {
  EngraverApplyActionPayload,
  EngraverApplyChromaticShiftActionPayload,
  EngraverChangeActionPayload,
  EngraverMoveSelectedTickableActionPayload,
  EngraverScoreAddTickableActionPayload,
  EngraverScoreDeleteNotesActionPayload,
  EngraverSelectRemoveSelectionActionPayload,
  EngraverSelectTickableActionPayload,
  EngraverToggleActionPayload,
} from './engraver-action-payload';
import { EngraverActionType } from './engraver-action-type.enum';
import { EngraverViewMode } from '@/lib/modules/engraver/view/types/engraver-mode.types';

export interface EngraverScoreActionMap {
  [EngraverActionType.SCORE_ADD_TICKABLE]: EngraverScoreAddTickableActionPayload;
  [EngraverActionType.SCORE_DELETE_NOTES]: EngraverScoreDeleteNotesActionPayload;
}

export interface EngraverSelectActionMap {
  [EngraverActionType.SELECT_ADD_TICKABLE]: EngraverSelectTickableActionPayload;
  [EngraverActionType.SELECT_CHANGE_TICKABLE]: EngraverSelectTickableActionPayload;
  [EngraverActionType.SELECT_MOVE_SELECTION]: EngraverMoveSelectedTickableActionPayload;
  [EngraverActionType.SELECT_REMOVE_SELECTION]: EngraverSelectRemoveSelectionActionPayload;
}

export interface EngraverChangeActionMap {
  [EngraverActionType.CHANGE_DURATION]: EngraverChangeActionPayload<BaseDuration>;
  [EngraverActionType.CHANGE_DOT_COUNT]: EngraverChangeActionPayload<DotCount>;
  [EngraverActionType.CHANGE_ACCIDENTAL]: EngraverChangeActionPayload<Accidental>;
  [EngraverActionType.CHANGE_VOICE]: EngraverChangeActionPayload<EngraverStaveVoice>;
  [EngraverActionType.CHANGE_VIEW_MODE]: EngraverChangeActionPayload<EngraverViewMode>;
}

export interface EngraverToggleActionMap {
  [EngraverActionType.TOGGLE_REST]: EngraverToggleActionPayload;
  [EngraverActionType.TOGGLE_VIEW_MODE]: EngraverToggleActionPayload;
}

export interface EngraverApplyActionMap {
  [EngraverActionType.APPLY_TIE]: EngraverApplyActionPayload;
  [EngraverActionType.APPLY_TUPLET]: EngraverApplyActionPayload;
  [EngraverActionType.APPLY_CHROMATIC_SHIFT]: EngraverApplyChromaticShiftActionPayload;
}

export interface EngraverPlaybackActionMap {
  [EngraverActionType.PLAYBACK_TOGGLE]: EngraverToggleActionPayload;
  [EngraverActionType.PLAYBACK_REWIND]: EngraverToggleActionPayload;
}

export interface EngraverActionMap
  extends EngraverScoreActionMap,
    EngraverSelectActionMap,
    EngraverChangeActionMap,
    EngraverToggleActionMap,
    EngraverApplyActionMap,
    EngraverPlaybackActionMap {}

export type EngraverAction = {
  [K in keyof EngraverActionMap]: {
    type: K;
    payload: EngraverActionMap[K];
  };
}[keyof EngraverActionMap];
