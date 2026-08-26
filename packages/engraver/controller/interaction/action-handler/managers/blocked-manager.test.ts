import { EngraverChord } from '@/lib/modules/engraver/model/elements/events/engraver-chord';
import { Fraction } from '@stavely-io/vexflow';
import { beforeEach, describe, expect, it } from 'vitest';
import { BlockedManager } from './blocked-manager';

describe('BlockedManager', () => {
  let mockContext: any;
  let blockedManager: BlockedManager;

  beforeEach(() => {
    mockContext = {
      score: {
        staves: [],
      },
      store: {},
    };
    blockedManager = new BlockedManager(mockContext);
  });

  it('should return true if no parent is blocked', () => {
    const obj = { isBlocked: false, parentChord: { isBlocked: false } };
    expect(blockedManager.isNotBlocked(obj)).toBe(true);
  });

  it('should return false if any parent is blocked', () => {
    const obj = { isBlocked: false, parentChord: { isBlocked: true } };
    expect(blockedManager.isNotBlocked(obj)).toBe(false);
  });

  it('should return false if object itself is blocked', () => {
    const obj = { isBlocked: true };
    expect(blockedManager.isNotBlocked(obj)).toBe(false);
  });

  it('should identify blocked notes affected by accidentals', () => {
    const mockNote = { isBlocked: true };
    const mockChord = Object.create(EngraverChord.prototype);
    Object.assign(mockChord, { notes: [mockNote], isBlocked: false });

    const mockMeasure = { isBlocked: false, voices: [{ isBlocked: false, tickables: [mockChord] }] };
    const mockStave = { isBlocked: false, measures: [mockMeasure] };
    mockContext.score.staves = [mockStave];

    const affected = blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();
    expect(affected).toContain(mockNote);
    expect(affected).toHaveLength(1);
  });

  it('forceAccidentalsOnGivenBlockedNotes should set accidental to NATURAL if NONE', () => {
    const note = { pitch: { accidental: '' }, effectivePitch: { accidental: '' } } as any;
    blockedManager.forceAccidentalsOnGivenBlockedNotes([note]);
    expect(note.pitch.accidental).toBe('n'); // NATURAL
  });

  it('checkIfDurationChangeAffectsBlockedElement should return true if blocked note in duration range', () => {
    const tickable = {
      coordinates: { staveIndex: 0, voiceIndex: 0 },
      duration: { toFractionValue: () => new Fraction(1, 1) },
    } as any;
    const blockedChord = {
      duration: { toFractionValue: () => new Fraction(1, 1) },
      notes: [{ isBlocked: true }],
    } as any;
    Object.setPrototypeOf(blockedChord, EngraverChord.prototype);

    const mockStave = {
      getCombinedVoices: () => [[tickable, blockedChord]],
    } as any;
    mockContext.score.staves = [mockStave];

    const newDuration = { toFractionValue: () => new Fraction(2, 1) } as any;

    const affected = blockedManager.checkIfDurationChangeAffectsBlockedElement(tickable, newDuration);

    expect(affected).toBe(true);
  });

  it('getBlockedNotesThatMayBeAffectedAccidentalwise should hit all branches', () => {
    const mockNote1 = { isBlocked: false };
    const mockNote2 = { isBlocked: true };
    const mockChord = Object.create(EngraverChord.prototype);
    Object.assign(mockChord, { notes: [mockNote1, mockNote2], isBlocked: false });

    const blockedChord = Object.create(EngraverChord.prototype);
    Object.assign(blockedChord, { notes: [{ id: 'n3' }], isBlocked: true });

    const blockedVoice = { isBlocked: true, tickables: [Object.create(EngraverChord.prototype)] };
    Object.assign(blockedVoice.tickables[0], { notes: [{ id: 'n4' }] });

    const mockMeasure = {
      isBlocked: false,
      voices: [{ isBlocked: false, tickables: [mockChord, blockedChord] }, blockedVoice],
    };
    mockContext.score.staves = [{ isBlocked: false, measures: [mockMeasure] }];

    const affected = blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();
    expect(affected).toHaveLength(3); // mockNote2, n3, n4
  });

  it('checkIfDurationChangeAffectsBlockedElement should return true if another tickable in range is blocked', () => {
    const tickable = {
      isBlocked: false,
      coordinates: { staveIndex: 0, voiceIndex: 0 },
      duration: { toFractionValue: () => new Fraction(1, 1) },
    } as any;

    const otherBlocked = {
      isBlocked: true,
      duration: { toFractionValue: () => new Fraction(1, 1) },
    } as any;

    const mockStave = {
      getCombinedVoices: () => [[tickable, otherBlocked]],
    } as any;
    mockContext.score.staves = [mockStave];

    const newDuration = { toFractionValue: () => new Fraction(2, 1) } as any;
    const affected = blockedManager.checkIfDurationChangeAffectsBlockedElement(tickable, newDuration);
    expect(affected).toBe(true);
  });
});
