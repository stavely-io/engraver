// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// VF.* Prefix Tests
//
// VexFlow classes are available under the Vex.Flow.* namespace.

import { describe, expect, test } from "vite-plus/test";

import {
  Accidental,
  Annotation,
  Articulation,
  Barline,
  BarNote,
  Beam,
  Bend,
  BoundingBox,
  BoundingBoxComputation,
  ChordSymbol,
  Clef,
  ClefNote,
  Crescendo,
  Curve,
  Dot,
  EasyScore,
  Element,
  Factory,
  Flow,
  Font,
  Formatter,
  Fraction,
  FretHandFinger,
  GhostNote,
  Glyph,
  GlyphNote,
  GraceNote,
  GraceNoteGroup,
  GraceTabNote,
  KeyManager,
  KeySignature,
  KeySigNote,
  Modifier,
  ModifierContext,
  MultiMeasureRest,
  Music,
  Note,
  NoteHead,
  NoteSubGroup,
  Ornament,
  Parser,
  PedalMarking,
  Registry,
  Renderer,
  RepeatNote,
  Repetition,
  Stave,
  StaveConnector,
  StaveHairpin,
  StaveLine,
  StaveModifier,
  StaveNote,
  StaveTempo,
  StaveText,
  StaveTie,
  Stem,
  StringNumber,
  Stroke,
  System,
  TabNote,
  TabSlide,
  TabStave,
  TabTie,
  TextBracket,
  TextDynamics,
  TextFormatter,
  TextNote,
  TickContext,
  TimeSignature,
  TimeSigNote,
  Tremolo,
  Tuning,
  Tuplet,
  Vibrato,
  VibratoBracket,
  Voice,
  Volta,
} from "../src/index";
import { Vex as VexNamespace } from "../src/vex";

// Use very flexible typing, so we can use the Vex.Flow.* API in unusual ways without warnings.
// eslint-disable-next-line
const Vex = VexNamespace as unknown as Record<string, any> & {
  Flow: typeof Flow & Record<string, any>;
};

describe("VF.* API", () => {
  test("VF.* API", VF_Prefix);
  test("VF Alias", VF_Alias);
});

function VF_Prefix(): void {
  // Intentionally use Vex.Flow here so we can verify that the Vex.Flow.* API
  // is equivalent to using the individual classes in TypeScript.
  const VF = Vex.Flow;
  expect(Accidental).toBe(VF.Accidental);
  expect(Annotation).toBe(VF.Annotation);
  expect(Articulation).toBe(VF.Articulation);
  expect(Barline).toBe(VF.Barline);
  expect(BarNote).toBe(VF.BarNote);
  expect(Beam).toBe(VF.Beam);
  expect(Bend).toBe(VF.Bend);
  expect(BoundingBox).toBe(VF.BoundingBox);
  expect(BoundingBoxComputation).toBe(VF.BoundingBoxComputation);
  expect(ChordSymbol).toBe(VF.ChordSymbol);
  expect(Clef).toBe(VF.Clef);
  expect(ClefNote).toBe(VF.ClefNote);
  expect(Crescendo).toBe(VF.Crescendo);
  expect(Curve).toBe(VF.Curve);
  expect(Dot).toBe(VF.Dot);
  expect(EasyScore).toBe(VF.EasyScore);
  expect(Element).toBe(VF.Element);
  expect(Factory).toBe(VF.Factory);
  expect(Flow.RESOLUTION).toBe(VF.RESOLUTION);
  expect(Font).toBe(VF.Font);
  expect(Formatter).toBe(VF.Formatter);
  expect(new Formatter(), "new Formatter()").toEqual(new VF.Formatter());
  expect(Fraction).toBe(VF.Fraction);
  expect(FretHandFinger).toBe(VF.FretHandFinger);
  expect(GhostNote).toBe(VF.GhostNote);
  expect(Glyph).toBe(VF.Glyph);
  expect(GlyphNote).toBe(VF.GlyphNote);
  expect(GraceNote).toBe(VF.GraceNote);
  expect(GraceNoteGroup).toBe(VF.GraceNoteGroup);
  expect(GraceTabNote).toBe(VF.GraceTabNote);
  expect(KeyManager).toBe(VF.KeyManager);
  expect(KeySignature).toBe(VF.KeySignature);
  expect(KeySigNote).toBe(VF.KeySigNote);
  expect(Modifier).toBe(VF.Modifier);
  expect(ModifierContext).toBe(VF.ModifierContext);
  expect(MultiMeasureRest).toBe(VF.MultiMeasureRest);
  expect(Music).toBe(VF.Music);
  expect(Note).toBe(VF.Note);
  expect(NoteHead).toBe(VF.NoteHead);
  expect(NoteSubGroup).toBe(VF.NoteSubGroup);
  expect(Ornament).toBe(VF.Ornament);
  expect(Parser).toBe(VF.Parser);
  expect(PedalMarking).toBe(VF.PedalMarking);
  expect(Registry).toBe(VF.Registry);
  expect(Renderer).toBe(VF.Renderer);
  expect(RepeatNote).toBe(VF.RepeatNote);
  expect(Repetition).toBe(VF.Repetition);
  expect(Stave).toBe(VF.Stave);
  expect(Stave).not.toBe(VF.StaveNote);
  expect(StaveConnector).toBe(VF.StaveConnector);
  expect(StaveHairpin).toBe(VF.StaveHairpin);
  expect(StaveLine).toBe(VF.StaveLine);
  expect(StaveModifier).toBe(VF.StaveModifier);
  expect(StaveNote).toBe(VF.StaveNote);
  expect(StaveTempo).toBe(VF.StaveTempo);
  expect(StaveText).toBe(VF.StaveText);
  expect(StaveTie).toBe(VF.StaveTie);
  expect(Stem).toBe(VF.Stem);
  expect(StringNumber).toBe(VF.StringNumber);
  expect(Stroke).toBe(VF.Stroke);
  expect(System).toBe(VF.System);
  expect(TabNote).toBe(VF.TabNote);
  expect(TabSlide).toBe(VF.TabSlide);
  expect(TabStave).toBe(VF.TabStave);
  expect(TabTie).toBe(VF.TabTie);
  expect(TextBracket).toBe(VF.TextBracket);
  expect(TextDynamics).toBe(VF.TextDynamics);
  expect(TextFormatter).toBe(VF.TextFormatter);
  expect(TextNote).toBe(VF.TextNote);
  expect(TickContext).toBe(VF.TickContext);
  expect(TimeSignature).toBe(VF.TimeSignature);
  expect(TimeSigNote).toBe(VF.TimeSigNote);
  expect(Tremolo).toBe(VF.Tremolo);
  expect(Tuning).toBe(VF.Tuning);
  expect(Tuplet).toBe(VF.Tuplet);
  expect(Vibrato).toBe(VF.Vibrato);
  expect(VibratoBracket).toBe(VF.VibratoBracket);
  expect(Voice).toBe(VF.Voice);
  expect(Volta).toBe(VF.Volta);
}

/**
 * If you have name collisions with VexFlow classes, consider extracting classes from Vex.Flow
 * and renaming them with a VF prefix.
 */
function VF_Alias(): void {
  const Flow = Vex.Flow;
  const VFAliases = {
    get VFAccidental() {
      return Flow.Accidental;
    },
    get VFAnnotation() {
      return Flow.Annotation;
    },
    get VFVibrato() {
      return Flow.Vibrato;
    },
  };
  const { VFVibrato, VFAccidental, VFAnnotation } = VFAliases;
  expect(Accidental).toBe(VFAccidental);
  expect(Annotation).toBe(VFAnnotation);

  const vibrato = new VFVibrato();
  expect(vibrato).toBeTruthy();

  const acc1 = new VFAccidental("##");
  const acc2 = new Accidental("##");
  expect(acc1.type).toBe(acc2.type);
}
