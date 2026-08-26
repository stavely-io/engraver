import {
  EngraverChromaticShiftDirection,
  EngraverStaveVoice,
} from '@/lib/modules/engraver/model/core/types/engraver-model.types';
import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';
import { DotCount } from '@/lib/modules/musical-core/types/dot-count.enum';

import { EngraverViewMode } from '../../../view/types/engraver-mode.types';
import { EngraverActionMap } from './types/actions/engraver-action';
import { EngraverActionType } from './types/actions/engraver-action-type.enum';
import { EngraverPlayableSelectableCoordinates, EngraverTickableCoordinates } from './types/engraver-coordinates';
import { EngraverMoveSelectionDirection } from './types/selection/engraver-move-selected-direction.enum';

export class EngraverActionFactory {
  private static createEngraverAction<T extends EngraverActionType>(
    type: T,
    payload: EngraverActionMap[T],
  ): { type: T; payload: EngraverActionMap[T] } {
    return { type, payload };
  }

  // Score
  public static createAddTickableAction(basePitch: Pitch, coordinates: EngraverTickableCoordinates) {
    return this.createEngraverAction(EngraverActionType.SCORE_ADD_TICKABLE, { basePitch, coordinates });
  }

  public static createDeleteNotesAction() {
    return this.createEngraverAction(EngraverActionType.SCORE_DELETE_NOTES, {});
  }
  // Select
  public static createSelectAddTickableAction(coordinates: EngraverPlayableSelectableCoordinates) {
    return this.createEngraverAction(EngraverActionType.SELECT_ADD_TICKABLE, { coordinates });
  }

  public static createSelectChangeTickableAction(coordinates: EngraverPlayableSelectableCoordinates) {
    return this.createEngraverAction(EngraverActionType.SELECT_CHANGE_TICKABLE, { coordinates });
  }

  public static createMoveSelectionAction(direction: EngraverMoveSelectionDirection) {
    return this.createEngraverAction(EngraverActionType.SELECT_MOVE_SELECTION, { direction });
  }

  public static createSelectRemoveSelectionAction() {
    return this.createEngraverAction(EngraverActionType.SELECT_REMOVE_SELECTION, {});
  }

  // Change
  public static createChangeDurationAction(newDuration: BaseDuration) {
    return this.createEngraverAction(EngraverActionType.CHANGE_DURATION, { newValue: newDuration });
  }

  public static createChangeDotCountAction(newDotCount: DotCount) {
    return this.createEngraverAction(EngraverActionType.CHANGE_DOT_COUNT, { newValue: newDotCount });
  }

  public static createChangeAccidentalAction(newAccidental: Accidental) {
    return this.createEngraverAction(EngraverActionType.CHANGE_ACCIDENTAL, { newValue: newAccidental });
  }

  public static createChangeVoiceAction(newVoice: EngraverStaveVoice) {
    return this.createEngraverAction(EngraverActionType.CHANGE_VOICE, { newValue: newVoice });
  }

  public static createChangeViewModeAction(viewMode: EngraverViewMode) {
    return this.createEngraverAction(EngraverActionType.CHANGE_VIEW_MODE, { newValue: viewMode });
  }

  // Toggle
  public static createToggleRestAction() {
    return this.createEngraverAction(EngraverActionType.TOGGLE_REST, {});
  }

  public static createToggleViewModeAction() {
    return this.createEngraverAction(EngraverActionType.TOGGLE_VIEW_MODE, {});
  }

  // Apply
  public static createApplyTieAction() {
    return this.createEngraverAction(EngraverActionType.APPLY_TIE, {});
  }

  public static createApplyTupletAction() {
    return this.createEngraverAction(EngraverActionType.APPLY_TUPLET, {});
  }

  public static createApplyChromaticShiftAction(direction: EngraverChromaticShiftDirection) {
    return this.createEngraverAction(EngraverActionType.APPLY_CHROMATIC_SHIFT, { direction });
  }

  // Playback
  public static createPlaybackToggleAction() {
    return this.createEngraverAction(EngraverActionType.PLAYBACK_TOGGLE, {});
  }

  public static createPlaybackRewindAction() {
    return this.createEngraverAction(EngraverActionType.PLAYBACK_REWIND, {});
  }
}
