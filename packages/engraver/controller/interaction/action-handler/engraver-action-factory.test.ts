import { EngraverStaveVoice } from '@/lib/modules/engraver/model/core/types/engraver-model.types';
import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';
import { describe, expect, it } from 'vitest';
import { EngraverViewMode } from '../../../view/types/engraver-mode.types';
import { EngraverActionFactory } from './engraver-action-factory';
import { EngraverActionType } from './types/actions/engraver-action-type.enum';
import { EngraverMoveSelectionDirection } from './types/selection/engraver-move-selected-direction.enum';

describe('EngraverActionFactory', () => {
  it('should create AddTickable action', () => {
    const pitch = {} as Pitch;
    const coords = { staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0 };
    const action = EngraverActionFactory.createAddTickableAction(pitch, coords);
    expect(action).toEqual({
      type: EngraverActionType.SCORE_ADD_TICKABLE,
      payload: { basePitch: pitch, coordinates: coords },
    });
  });

  it('should create DeleteNotes action', () => {
    const action = EngraverActionFactory.createDeleteNotesAction();
    expect(action).toEqual({ type: EngraverActionType.SCORE_DELETE_NOTES, payload: {} });
  });

  it('should create SelectAddTickable action', () => {
    const coords = { staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0, noteIndex: 0 };
    const action = EngraverActionFactory.createSelectAddTickableAction(coords);
    expect(action).toEqual({
      type: EngraverActionType.SELECT_ADD_TICKABLE,
      payload: { coordinates: coords },
    });
  });

  it('should create ChangeDuration action', () => {
    const action = EngraverActionFactory.createChangeDurationAction(BaseDuration.QUARTER);
    expect(action).toEqual({
      type: EngraverActionType.CHANGE_DURATION,
      payload: { newValue: BaseDuration.QUARTER },
    });
  });

  it('should create ChangeAccidental action', () => {
    const action = EngraverActionFactory.createChangeAccidentalAction(Accidental.SHARP);
    expect(action).toEqual({
      type: EngraverActionType.CHANGE_ACCIDENTAL,
      payload: { newValue: Accidental.SHARP },
    });
  });

  it('should create ChangeVoice action', () => {
    const action = EngraverActionFactory.createChangeVoiceAction(EngraverStaveVoice.SECOND);
    expect(action).toEqual({
      type: EngraverActionType.CHANGE_VOICE,
      payload: { newValue: EngraverStaveVoice.SECOND },
    });
  });

  it('should create ChangeViewMode action', () => {
    const action = EngraverActionFactory.createChangeViewModeAction(EngraverViewMode.EDIT);
    expect(action).toEqual({
      type: EngraverActionType.CHANGE_VIEW_MODE,
      payload: { newValue: EngraverViewMode.EDIT },
    });
  });

  it('should create MoveSelection action', () => {
    const action = EngraverActionFactory.createMoveSelectionAction(EngraverMoveSelectionDirection.RIGHT);
    expect(action).toEqual({
      type: EngraverActionType.SELECT_MOVE_SELECTION,
      payload: { direction: EngraverMoveSelectionDirection.RIGHT },
    });
  });

  it('should create ToggleRest action', () => {
    const action = EngraverActionFactory.createToggleRestAction();
    expect(action).toEqual({ type: EngraverActionType.TOGGLE_REST, payload: {} });
  });
});
