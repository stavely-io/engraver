import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEngraverActions } from './use-engraver-actions';
import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';
import { DotCount } from '@/lib/modules/musical-core/types/dot-count.enum';
import {
  EngraverOverlayCoordinates,
  EngraverTickableCoordinates,
} from '../../controller/interaction/action-handler/types/engraver-coordinates';
import { EngraverStaveVoice } from '../../model/core/types/engraver-model.types';
import { act, renderHook } from '@testing-library/react';
import { BasePitchLabel } from '@/lib/modules/musical-core/types/base-pitch-label.enum';
import { EngraverActionFactory } from '../../controller/interaction/action-handler/engraver-action-factory';

vi.mock('../../controller/interaction/action-handler/engraver-action-factory', () => ({
  EngraverActionFactory: {
    createSelectRemoveSelectionAction: vi.fn(() => ({ type: 'SelectRemoveSelection' })),
    createAddTickableAction: vi.fn((pitch, coords) => ({ type: 'AddTickable', pitch, coords })),
    createChangeDurationAction: vi.fn((duration) => ({ type: 'ChangeDuration', duration })),
    createChangeDotCountAction: vi.fn((dotCount) => ({ type: 'ChangeDotCount', dotCount })),
    createChangeVoiceAction: vi.fn((voice) => ({ type: 'ChangeVoice', voice })),
    createChangeAccidentalAction: vi.fn((accidental) => ({ type: 'ChangeAccidental', accidental })),
    createToggleRestAction: vi.fn(() => ({ type: 'ToggleRest' })),
    createToggleViewModeAction: vi.fn(() => ({ type: 'ToggleViewMode' })),
    createApplyTieAction: vi.fn(() => ({ type: 'ApplyTie' })),
    createApplyTupletAction: vi.fn(() => ({ type: 'ApplyTuplet' })),
    createPlaybackToggleAction: vi.fn(() => ({ type: 'PlaybackToggle' })),
    createPlaybackRewindAction: vi.fn(() => ({ type: 'PlaybackRewind' })),
  },
}));

const mockDispatchAction = vi.fn();
const mockOnOverlayMouseEnter = vi.fn();
const mockOnOverlayMouseExit = vi.fn();
const mockController = {
  dispatchAction: mockDispatchAction,
  onOverlayMouseEnter: mockOnOverlayMouseEnter,
  onOverlayMouseExit: mockOnOverlayMouseExit,
};
vi.mock('../../controller/context/hooks/use-engraver-controller', () => ({
  useEngraverController: vi.fn(() => mockController),
}));

describe('useEngraverActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an object with expected action categories and methods', () => {
    const { result } = renderHook(() => useEngraverActions());

    const actions = result.current;

    expect(actions).toHaveProperty('click');
    expect(actions.click).toHaveProperty('sheet');
    expect(actions.click).toHaveProperty('score');

    expect(actions).toHaveProperty('select');
    expect(actions.select).toHaveProperty('duration');
    expect(actions.select).toHaveProperty('dotCount');
    expect(actions.select).toHaveProperty('voice');
    expect(actions.select).toHaveProperty('accidental');

    expect(actions).toHaveProperty('toggle');
    expect(actions.toggle).toHaveProperty('restInput');
    expect(actions.toggle).toHaveProperty('viewMode');

    expect(actions).toHaveProperty('apply');
    expect(actions.apply).toHaveProperty('tie');
    expect(actions.apply).toHaveProperty('tuplet');

    expect(actions).toHaveProperty('playback');
    expect(actions.playback).toHaveProperty('toggle');
    expect(actions.playback).toHaveProperty('rewind');

    expect(actions).toHaveProperty('overlay');
    expect(actions.overlay).toHaveProperty('onMouseEnter');
    expect(actions.overlay).toHaveProperty('onMouseExit');
  });

  it('click.sheet should dispatch createSelectRemoveSelectionAction', () => {
    const { result } = renderHook(() => useEngraverActions());

    act(() => {
      result.current.click.sheet();
    });

    expect(vi.mocked(EngraverActionFactory).createSelectRemoveSelectionAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'SelectRemoveSelection' });
  });

  it('click.score should dispatch createAddTickableAction with correct pitch and coordinates', () => {
    const { result } = renderHook(() => useEngraverActions());
    const mockPitch = new Pitch(BasePitchLabel.C, 4);
    const mockCoords: EngraverTickableCoordinates = {
      staveIndex: 0,
      measureIndex: 0,
      voiceIndex: EngraverStaveVoice.FIRST,
      tickableIndex: 0,
    };

    act(() => {
      result.current.click.score(mockPitch, mockCoords);
    });

    expect(vi.mocked(EngraverActionFactory).createAddTickableAction).toHaveBeenCalledTimes(1);
    expect(vi.mocked(EngraverActionFactory).createAddTickableAction).toHaveBeenCalledWith(mockPitch, mockCoords);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'AddTickable', pitch: mockPitch, coords: mockCoords });
  });

  it('select.duration should dispatch createChangeDurationAction with correct duration', () => {
    const { result } = renderHook(() => useEngraverActions());
    const mockDuration = BaseDuration.HALF;

    act(() => {
      result.current.select.duration(mockDuration);
    });

    expect(vi.mocked(EngraverActionFactory).createChangeDurationAction).toHaveBeenCalledTimes(1);
    expect(vi.mocked(EngraverActionFactory).createChangeDurationAction).toHaveBeenCalledWith(mockDuration);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'ChangeDuration', duration: mockDuration });
  });

  it('select.dotCount should dispatch createChangeDotCountAction with correct dot count', () => {
    const { result } = renderHook(() => useEngraverActions());
    const mockDotCount = DotCount.ONE;

    act(() => {
      result.current.select.dotCount(mockDotCount);
    });

    expect(vi.mocked(EngraverActionFactory).createChangeDotCountAction).toHaveBeenCalledTimes(1);
    expect(vi.mocked(EngraverActionFactory).createChangeDotCountAction).toHaveBeenCalledWith(mockDotCount);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'ChangeDotCount', dotCount: mockDotCount });
  });

  it('select.voice should dispatch createChangeVoiceAction with correct voice', () => {
    const { result } = renderHook(() => useEngraverActions());
    const mockVoice: EngraverStaveVoice = EngraverStaveVoice.FIRST;

    act(() => {
      result.current.select.voice(mockVoice);
    });

    expect(vi.mocked(EngraverActionFactory).createChangeVoiceAction).toHaveBeenCalledTimes(1);
    expect(vi.mocked(EngraverActionFactory).createChangeVoiceAction).toHaveBeenCalledWith(mockVoice);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'ChangeVoice', voice: mockVoice });
  });

  it('select.accidental should dispatch createChangeAccidentalAction with correct accidental', () => {
    const { result } = renderHook(() => useEngraverActions());
    const mockAccidental = Accidental.SHARP;

    act(() => {
      result.current.select.accidental(mockAccidental);
    });

    expect(vi.mocked(EngraverActionFactory).createChangeAccidentalAction).toHaveBeenCalledTimes(1);
    expect(vi.mocked(EngraverActionFactory).createChangeAccidentalAction).toHaveBeenCalledWith(mockAccidental);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'ChangeAccidental', accidental: mockAccidental });
  });

  it('toggle.restInput should dispatch createToggleRestAction', () => {
    const { result } = renderHook(() => useEngraverActions());

    act(() => {
      result.current.toggle.restInput();
    });

    expect(vi.mocked(EngraverActionFactory).createToggleRestAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'ToggleRest' });
  });

  it('toggle.viewMode should dispatch createToggleViewModeAction', () => {
    const { result } = renderHook(() => useEngraverActions());

    act(() => {
      result.current.toggle.viewMode();
    });

    expect(vi.mocked(EngraverActionFactory).createToggleViewModeAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'ToggleViewMode' });
  });

  it('apply.tie should dispatch createApplyTieAction', () => {
    const { result } = renderHook(() => useEngraverActions());

    act(() => {
      result.current.apply.tie();
    });

    expect(vi.mocked(EngraverActionFactory).createApplyTieAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'ApplyTie' });
  });

  it('apply.tuplet should dispatch createApplyTupletAction', () => {
    const { result } = renderHook(() => useEngraverActions());

    act(() => {
      result.current.apply.tuplet();
    });

    expect(vi.mocked(EngraverActionFactory).createApplyTupletAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'ApplyTuplet' });
  });

  it('playback.toggle should dispatch createPlaybackToggleAction', () => {
    const { result } = renderHook(() => useEngraverActions());

    act(() => {
      result.current.playback.toggle();
    });

    expect(vi.mocked(EngraverActionFactory).createPlaybackToggleAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'PlaybackToggle' });
  });

  it('playback.rewind should dispatch createPlaybackRewindAction', () => {
    const { result } = renderHook(() => useEngraverActions());

    act(() => {
      result.current.playback.rewind();
    });

    expect(vi.mocked(EngraverActionFactory).createPlaybackRewindAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAction).toHaveBeenCalledWith({ type: 'PlaybackRewind' });
  });

  it('overlay.onMouseEnter should call controller.onOverlayMouseEnter when invoked', () => {
    const { result } = renderHook(() => useEngraverActions());
    const { onMouseEnter } = result.current.overlay;
    const pitch = new Pitch(BasePitchLabel.C, 4);
    const coords: EngraverOverlayCoordinates = {
      staveIndex: 0,
      measureIndex: 0,
      voiceIndex: EngraverStaveVoice.FIRST,
      tickableIndex: 0,
      systemIndex: 0,
    };

    act(() => {
      onMouseEnter(pitch, coords);
    });

    expect(mockOnOverlayMouseEnter).toHaveBeenCalledTimes(1);
  });

  it('overlay.onMouseExit should call controller.onOverlayMouseExit when invoked', () => {
    const { result } = renderHook(() => useEngraverActions());
    const { onMouseExit } = result.current.overlay;

    act(() => {
      onMouseExit();
    });

    expect(mockOnOverlayMouseExit).toHaveBeenCalledTimes(1);
  });
});
