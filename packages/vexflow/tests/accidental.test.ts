// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Accidental Tests

import { Accidental } from "../src/accidental";
import type { Factory } from "../src/factory";
import { Formatter } from "../src/formatter";
import type { Modifier } from "../src/modifier";
import { Note } from "../src/note";
import type { StaveNoteStruct } from "../src/stavenote";
import { StaveNote } from "../src/stavenote";
import { Stem } from "../src/stem";
import { isAccidental } from "../src/typeguard";
import { Voice } from "../src/voice";
import type { TestOptions } from "./vexflow_test_helpers";
import { VexFlowTests, runTests } from "./vexflow_test_helpers";
import { describe, expect, test } from "vite-plus/test";

describe("Accidental", () => {
  test("Automatic Accidentals - Simple Tests", autoAccidentalWorking);
  runTests("Basic", basic);
  runTests("Stem Down", basicStemDown);
  runTests("Accidental Arrangement Special Cases", specialCases);
  runTests("Microtonal", microtonal);
  runTests("Microtonal (Iranian)", microtonal_iranian);
  runTests("Sagittal", sagittal);
  runTests("Automatic Accidentals - Multi Voice Inline", automaticAccidentalsMultiVoiceInline);
  runTests("Automatic Accidentals - Multi Voice Offset", automaticAccidentalsMultiVoiceOffset);
  runTests("Automatic Accidentals - Key C, Single Octave", automaticAccidentalsCornerCases1);
  runTests("Automatic Accidentals - Key C, Two Octaves", automaticAccidentalsCornerCases2);
  runTests("Automatic Accidentals - Key C#, Single Octave", automaticAccidentalsCornerCases3);
  runTests("Automatic Accidentals - Key C#, Two Octaves", automaticAccidentalsCornerCases4);
  runTests("Factory API", factoryAPI);
});

// Check that at least one of the note's modifiers is an Accidental.
function hasAccidental(note: StaveNote) {
  return note.getModifiers().some((modifier) => isAccidental(modifier));
}

// Return a convenience function for building accidentals from a string.
function makeNewAccid(factory: Factory) {
  return (type: string) => factory.Accidental({ type });
}

/**
 *
 */
function autoAccidentalWorking(): void {
  const createStaveNote = (noteStruct: StaveNoteStruct) => new StaveNote(noteStruct);

  let notes = [
    { keys: ["bb/4"], duration: "4" },
    { keys: ["bb/4"], duration: "4" },
    { keys: ["g#/4"], duration: "4" },
    { keys: ["g/4"], duration: "4" },
    { keys: ["b/4"], duration: "4" },
    { keys: ["b/4"], duration: "4" },
    { keys: ["a#/4"], duration: "4" },
    { keys: ["g#/4"], duration: "4" },
  ].map(createStaveNote);

  let voice = new Voice().setMode(Voice.Mode.SOFT).addTickables(notes);

  // F Major (Bb)
  Accidental.applyAccidentals([voice], "F");

  expect(hasAccidental(notes[0]), "No flat because of key signature").toBe(false);
  expect(hasAccidental(notes[1]), "No flat because of key signature").toBe(false);
  expect(hasAccidental(notes[2]), "Added a sharp").toBe(true);
  expect(hasAccidental(notes[3]), "Back to natural").toBe(true);
  expect(hasAccidental(notes[4]), "Back to natural").toBe(true);
  expect(hasAccidental(notes[5]), "Natural remembered").toBe(false);
  expect(hasAccidental(notes[6]), "Added sharp").toBe(true);
  expect(hasAccidental(notes[7]), "Added sharp").toBe(true);

  notes = [
    { keys: ["e#/4"], duration: "4" },
    { keys: ["cb/4"], duration: "4" },
    { keys: ["fb/4"], duration: "4" },
    { keys: ["b#/4"], duration: "4" },
    { keys: ["b#/4"], duration: "4" },
    { keys: ["cb/5"], duration: "4" },
    { keys: ["fb/5"], duration: "4" },
    { keys: ["e#/4"], duration: "4" },
  ].map(createStaveNote);

  voice = new Voice().setMode(Voice.Mode.SOFT).addTickables(notes);

  // A Major (F#,G#,C#)
  Accidental.applyAccidentals([voice], "A");
  expect(hasAccidental(notes[0]), "Added sharp").toBe(true);
  expect(hasAccidental(notes[1]), "Added flat").toBe(true);
  expect(hasAccidental(notes[2]), "Added flat").toBe(true);
  expect(hasAccidental(notes[3]), "Added sharp").toBe(true);
  expect(hasAccidental(notes[4]), "Sharp remembered").toBe(false);
  expect(hasAccidental(notes[5]), "Added flat(different octave)").toBe(true);
  expect(hasAccidental(notes[6]), "Added flat(different octave)").toBe(true);
  expect(hasAccidental(notes[7]), "sharp remembered").toBe(false);

  notes = [
    { keys: ["c/4"], duration: "4" },
    { keys: ["cb/4"], duration: "4" },
    { keys: ["cb/4"], duration: "4" },
    { keys: ["c#/4"], duration: "4" },
    { keys: ["c#/4"], duration: "4" },
    { keys: ["cbb/4"], duration: "4" },
    { keys: ["cbb/4"], duration: "4" },
    { keys: ["c##/4"], duration: "4" },
    { keys: ["c##/4"], duration: "4" },
    { keys: ["c/4"], duration: "4" },
    { keys: ["c/4"], duration: "4" },
  ].map(createStaveNote);

  voice = new Voice().setMode(Voice.Mode.SOFT).addTickables(notes);

  // C Major (no sharps/flats)
  Accidental.applyAccidentals([voice], "C");

  expect(hasAccidental(notes[0]), "No accidental").toBe(false);
  expect(hasAccidental(notes[1]), "Added flat").toBe(true);
  expect(hasAccidental(notes[2]), "Flat remembered").toBe(false);
  expect(hasAccidental(notes[3]), "Sharp added").toBe(true);
  expect(hasAccidental(notes[4]), "Sharp remembered").toBe(false);
  expect(hasAccidental(notes[5]), "Added doubled flat").toBe(true);
  expect(hasAccidental(notes[6]), "Double flat remembered").toBe(false);
  expect(hasAccidental(notes[7]), "Added double sharp").toBe(true);
  expect(hasAccidental(notes[8]), "Double sharp rememberd").toBe(false);
  expect(hasAccidental(notes[9]), "Added natural").toBe(true);
  expect(hasAccidental(notes[10]), "Natural remembered").toBe(false);
}

function basic(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 240);
  const accid = makeNewAccid(f);
  f.Stave({ x: 10, y: 10, width: 550 });

  const notes = [
    f
      .StaveNote({ keys: ["c/4", "e/4", "a/4"], duration: "1" })
      .addModifier(accid("b"), 0)
      .addModifier(accid("#"), 1),
    // Notes keys out of alphabetic order
    f
      .StaveNote({ keys: ["e/4", "f/4", "a/4", "c/5", "e/5", "g/5", "d/4"], duration: "2" })
      .addModifier(accid("##"), 6)
      .addModifier(accid("n"), 0)
      .addModifier(accid("bb"), 1)
      .addModifier(accid("b"), 2)
      .addModifier(accid("#"), 3)
      .addModifier(accid("n"), 4)
      .addModifier(accid("bb"), 5),

    // Notes keys out of alphabetic order
    f
      .StaveNote({ keys: ["g/5", "f/4", "g/4", "a/4", "b/4", "c/5", "e/5"], duration: "16" })
      .addModifier(accid("n"), 1)
      .addModifier(accid("#"), 2)
      .addModifier(accid("#"), 3)
      .addModifier(accid("b"), 4)
      .addModifier(accid("bb"), 5)
      .addModifier(accid("##"), 6)
      .addModifier(accid("#"), 0),

    f
      .StaveNote({ keys: ["a/3", "c/4", "e/4", "b/4", "d/5", "g/5"], duration: "1" })
      .addModifier(accid("#"), 0)
      .addModifier(accid("##").setAsCautionary(), 1)
      .addModifier(accid("#").setAsCautionary(), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("bb").setAsCautionary(), 4)
      .addModifier(accid("b").setAsCautionary(), 5),
  ];

  Formatter.SimpleFormat(notes, 10, { paddingBetween: 45 });

  notes.forEach((note, index) => {
    Note.plotMetrics(f.getContext(), note, 140);
    expect(
      note.getModifiersByType("Accidental").length > 0,
      "Note " + index + " has accidentals",
    ).toBeTruthy();
    note.getModifiersByType("Accidental").forEach((accid: Modifier, index: number) => {
      expect(accid.getWidth() > 0, "Accidental " + index + " has set width").toBeTruthy();
    });
  });

  f.draw();

  VexFlowTests.plotLegendForNoteWidth(f.getContext(), 480, 140);
}

function specialCases(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 240);
  const accid = makeNewAccid(f);
  f.Stave({ x: 10, y: 10, width: 550 });

  const notes = [
    f
      .StaveNote({ keys: ["f/4", "d/5"], duration: "1" })
      .addModifier(accid("#"), 0)
      .addModifier(accid("b"), 1),

    f
      .StaveNote({ keys: ["c/4", "g/4"], duration: "2" })
      .addModifier(accid("##"), 0)
      .addModifier(accid("##"), 1),

    f
      .StaveNote({ keys: ["b/3", "d/4", "f/4"], duration: "16" })
      .addModifier(accid("#"), 0)
      .addModifier(accid("#"), 1)
      .addModifier(accid("##"), 2),

    f
      .StaveNote({ keys: ["g/4", "a/4", "c/5", "e/5"], duration: "16" })
      .addModifier(accid("b"), 0)
      .addModifier(accid("b"), 1)
      .addModifier(accid("n"), 3),

    f
      .StaveNote({ keys: ["e/4", "g/4", "b/4", "c/5"], duration: "4" })
      .addModifier(accid("b").setAsCautionary(), 0)
      .addModifier(accid("b").setAsCautionary(), 1)
      .addModifier(accid("bb"), 2)
      .addModifier(accid("b"), 3),

    f
      .StaveNote({ keys: ["b/3", "e/4", "a/4", "d/5", "g/5"], duration: "8" })
      .addModifier(accid("bb"), 0)
      .addModifier(accid("b").setAsCautionary(), 1)
      .addModifier(accid("n").setAsCautionary(), 2)
      .addModifier(accid("#"), 3)
      .addModifier(accid("n").setAsCautionary(), 4),
  ];

  Formatter.SimpleFormat(notes, 0, { paddingBetween: 20 });

  notes.forEach((note, index) => {
    Note.plotMetrics(f.getContext(), note, 140);
    expect(
      note.getModifiersByType("Accidental").length > 0,
      "Note " + index + " has accidentals",
    ).toBeTruthy();
    note.getModifiersByType("Accidental").forEach((accid, index) => {
      expect(accid.getWidth() > 0, "Accidental " + index + " has set width").toBeTruthy();
    });
  });

  f.draw();

  VexFlowTests.plotLegendForNoteWidth(f.getContext(), 480, 140);
}

function basicStemDown(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 240);
  const accid = makeNewAccid(f);
  f.Stave({ x: 10, y: 10, width: 550 });

  const notes = [
    f
      .StaveNote({ keys: ["c/4", "e/4", "a/4"], duration: "w", stem_direction: -1 })
      .addModifier(accid("b"), 0)
      .addModifier(accid("#"), 1),

    f
      .StaveNote({
        keys: ["d/4", "e/4", "f/4", "a/4", "c/5", "e/5", "g/5"],
        duration: "2",
        stem_direction: -1,
      })
      .addModifier(accid("##"), 0)
      .addModifier(accid("n"), 1)
      .addModifier(accid("bb"), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("#"), 4)
      .addModifier(accid("n"), 5)
      .addModifier(accid("bb"), 6),

    f
      .StaveNote({
        keys: ["f/4", "g/4", "a/4", "b/4", "c/5", "e/5", "g/5"],
        duration: "16",
        stem_direction: -1,
      })
      .addModifier(accid("n"), 0)
      .addModifier(accid("#"), 1)
      .addModifier(accid("#"), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("bb"), 4)
      .addModifier(accid("##"), 5)
      .addModifier(accid("#"), 6),
  ];

  Formatter.SimpleFormat(notes, 0, { paddingBetween: 30 });

  notes.forEach((note, noteIndex) => {
    Note.plotMetrics(f.getContext(), note, 140);
    expect(
      note.getModifiersByType("Accidental").length > 0,
      "Note " + noteIndex + " has accidentals",
    ).toBeTruthy();
    note.getModifiersByType("Accidental").forEach((accid, accidIndex) => {
      expect(accid.getWidth() > 0, "Accidental " + accidIndex + " has set width").toBeTruthy();
    });
  });

  f.draw();

  VexFlowTests.plotLegendForNoteWidth(f.getContext(), 480, 140);
}

function microtonal(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 240);
  const accid = makeNewAccid(f);
  const ctx = f.getContext();
  f.Stave({ x: 10, y: 10, width: 650 });

  const notes = [
    f
      .StaveNote({ keys: ["c/4", "e/4", "a/4"], duration: "1" })
      .addModifier(accid("db"), 0)
      .addModifier(accid("d"), 1),

    f
      .StaveNote({ keys: ["d/4", "e/4", "f/4", "a/4", "c/5", "e/5", "g/5"], duration: "2" })
      .addModifier(accid("bbs"), 0)
      .addModifier(accid("++"), 1)
      .addModifier(accid("+"), 2)
      .addModifier(accid("d"), 3)
      .addModifier(accid("db"), 4)
      .addModifier(accid("+"), 5)
      .addModifier(accid("##"), 6),

    f
      .StaveNote({ keys: ["f/4", "g/4", "a/4", "b/4", "c/5", "e/5", "g/5"], duration: "16" })
      .addModifier(accid("++"), 0)
      .addModifier(accid("bbs"), 1)
      .addModifier(accid("+"), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("db"), 4)
      .addModifier(accid("##"), 5)
      .addModifier(accid("#"), 6),

    f
      .StaveNote({ keys: ["a/3", "c/4", "e/4", "b/4", "d/5", "g/5"], duration: "1" })
      .addModifier(accid("#"), 0)
      .addModifier(accid("db").setAsCautionary(), 1)
      .addModifier(accid("bbs").setAsCautionary(), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("++").setAsCautionary(), 4)
      .addModifier(accid("d").setAsCautionary(), 5),

    f
      .StaveNote({ keys: ["f/4", "g/4", "a/4", "b/4", "d/5", "g/5"], duration: "16" })
      .addModifier(accid("++-"), 0)
      .addModifier(accid("+-"), 1)
      .addModifier(accid("bs"), 2)
      .addModifier(accid("bss"), 3)
      .addModifier(accid("afhf"), 4)
      .addModifier(accid("ashs"), 5),
  ];

  Formatter.SimpleFormat(notes, 0, { paddingBetween: 35 });

  notes.forEach((note, index) => {
    Note.plotMetrics(f.getContext(), note, 140);
    expect(
      note.getModifiersByType("Accidental").length > 0,
      "Note " + index + " has accidentals",
    ).toBeTruthy();
    note.getModifiersByType("Accidental").forEach((accid: Modifier, index: number) => {
      expect(accid.getWidth() > 0, "Accidental " + index + " has set width").toBeTruthy();
    });
  });

  f.draw();

  VexFlowTests.plotLegendForNoteWidth(ctx, 580, 140);
}

function microtonal_iranian(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 240);
  const accid = makeNewAccid(f);
  const ctx = f.getContext();
  f.Stave({ x: 10, y: 10, width: 650 });

  const notes = [
    f
      .StaveNote({ keys: ["c/4", "e/4", "a/4"], duration: "1" })
      .addModifier(accid("k"), 0)
      .addModifier(accid("o"), 1),

    f
      .StaveNote({ keys: ["d/4", "e/4", "f/4", "a/4", "c/5", "e/5", "g/5"], duration: "2" })
      .addModifier(accid("b"), 0)
      .addModifier(accid("k"), 1)
      .addModifier(accid("n"), 2)
      .addModifier(accid("o"), 3)
      .addModifier(accid("#"), 4)
      .addModifier(accid("bb"), 5)
      .addModifier(accid("##"), 6),

    f
      .StaveNote({ keys: ["f/4", "g/4", "a/4", "b/4", "c/5", "e/5", "g/5"], duration: "16" })
      .addModifier(accid("o"), 0)
      .addModifier(accid("k"), 1)
      .addModifier(accid("n"), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("bb"), 4)
      .addModifier(accid("##"), 5)
      .addModifier(accid("#"), 6),

    f
      .StaveNote({ keys: ["a/3", "c/4", "e/4", "b/4", "d/5", "g/5"], duration: "1" })
      .addModifier(accid("#"), 0)
      .addModifier(accid("o").setAsCautionary(), 1)
      .addModifier(accid("n").setAsCautionary(), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("k").setAsCautionary(), 4),

    f
      .StaveNote({ keys: ["f/4", "g/4", "a/4", "b/4"], duration: "16" })
      .addModifier(accid("k"), 0)
      .addModifier(accid("k"), 1)
      .addModifier(accid("k"), 2)
      .addModifier(accid("k"), 3),
  ];

  Formatter.SimpleFormat(notes, 0, { paddingBetween: 35 });

  notes.forEach((note, index) => {
    Note.plotMetrics(f.getContext(), note, 140);
    expect(
      note.getModifiersByType("Accidental").length > 0,
      "Note " + index + " has accidentals",
    ).toBeTruthy();
    note.getModifiersByType("Accidental").forEach((accid: Modifier, index: number) => {
      expect(accid.getWidth() > 0, "Accidental " + index + " has set width").toBeTruthy();
    });
  });

  f.draw();

  VexFlowTests.plotLegendForNoteWidth(ctx, 580, 140);
}

function sagittal(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 240);
  const accid = makeNewAccid(f);
  const ctx = f.getContext();
  f.Stave({ x: 10, y: 10, width: 650 });

  const notes = [
    f
      .StaveNote({ keys: ["d/4", "f/4", "b/4", "b/4"], duration: "4" })
      .addModifier(accid("accSagittal11MediumDiesisUp"), 1)
      .addModifier(accid("accSagittal5CommaDown"), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("accSagittal7CommaDown"), 3),

    f
      .StaveNote({ keys: ["d/4", "f/4", "a/4", "b/4"], duration: "4" })
      .addModifier(accid("accSagittal35LargeDiesisDown"), 2),

    f
      .StaveNote({ keys: ["c/4", "e/4", "g/4", "c/5"], duration: "8" })
      .addModifier(accid("accSagittal5CommaDown"), 1),

    f
      .StaveNote({ keys: ["c/4", "e/4", "g/4", "b/4"], duration: "8" })
      .addModifier(accid("b"), 1)
      .addModifier(accid("accSagittal7CommaDown"), 1)
      .addModifier(accid("accSagittal11LargeDiesisDown"), 3),

    f
      .StaveNote({ keys: ["d/4", "f/4", "b/4", "b/4"], duration: "4" })
      .addModifier(accid("accSagittal11MediumDiesisUp"), 1)
      .addModifier(accid("accSagittal5CommaDown"), 2)
      .addModifier(accid("accSagittalFlat7CDown"), 3),

    f
      .StaveNote({ keys: ["d/4", "f/4", "a/4", "b/4"], duration: "4" })
      .addModifier(accid("accSagittal35LargeDiesisDown"), 2),

    f
      .StaveNote({ keys: ["c/4", "e/4", "g/4", "c/5"], duration: "8" })
      .addModifier(accid("accSagittal5CommaDown"), 1),

    f
      .StaveNote({ keys: ["c/4", "e/4", "g/4", "b/4"], duration: "8" })
      .addModifier(accid("accSagittalFlat7CDown"), 1)
      .addModifier(accid("accSagittal11LargeDiesisDown"), 3),
  ];

  f.StaveTie({
    from: notes[0],
    to: notes[1],
    first_indices: [0, 1],
    last_indices: [0, 1],
  });

  f.StaveTie({
    from: notes[0],
    to: notes[1],
    first_indices: [3],
    last_indices: [3],
    options: {
      direction: Stem.DOWN,
    },
  });

  f.StaveTie({
    from: notes[4],
    to: notes[5],
    first_indices: [0, 1],
    last_indices: [0, 1],
  });

  f.StaveTie({
    from: notes[4],
    to: notes[5],
    first_indices: [3],
    last_indices: [3],
    options: {
      direction: Stem.DOWN,
    },
  });

  f.Beam({ notes: notes.slice(2, 4) });
  f.Beam({ notes: notes.slice(6, 8) });

  Formatter.SimpleFormat(notes);

  notes.forEach((note, index) => {
    Note.plotMetrics(f.getContext(), note, 140);
    expect(
      note.getModifiersByType("Accidental").length > 0,
      "Note " + index + " has accidentals",
    ).toBeTruthy();
    note.getModifiersByType("Accidental").forEach((accid: Modifier, index: number) => {
      expect(accid.getWidth() > 0, "Accidental " + index + " has set width").toBeTruthy();
    });
  });

  f.draw();

  VexFlowTests.plotLegendForNoteWidth(ctx, 580, 140);
}

function automaticAccidentalsMultiVoiceInline(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 150);
  const stave = f.Stave().addKeySignature("Ab");

  const notes0 = [
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["d/4"], duration: "4", stem_direction: -1 },
    { keys: ["e/4"], duration: "4", stem_direction: -1 },
    { keys: ["f/4"], duration: "4", stem_direction: -1 },
    { keys: ["g/4"], duration: "4", stem_direction: -1 },
    { keys: ["a/4"], duration: "4", stem_direction: -1 },
    { keys: ["b/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
  ].map(f.StaveNote.bind(f));

  const notes1 = [
    { keys: ["c/5"], duration: "4" },
    { keys: ["d/5"], duration: "4" },
    { keys: ["e/5"], duration: "4" },
    { keys: ["f/5"], duration: "4" },
    { keys: ["g/5"], duration: "4" },
    { keys: ["a/5"], duration: "4" },
    { keys: ["b/5"], duration: "4" },
    { keys: ["c/6"], duration: "4" },
  ].map(f.StaveNote.bind(f));

  const voice0 = f.Voice().setMode(Voice.Mode.SOFT).addTickables(notes0);

  const voice1 = f.Voice().setMode(Voice.Mode.SOFT).addTickables(notes1);

  // Ab Major
  Accidental.applyAccidentals([voice0, voice1], "Ab");

  expect(hasAccidental(notes0[0])).toBe(false);
  expect(hasAccidental(notes0[1])).toBe(true);
  expect(hasAccidental(notes0[2])).toBe(true);
  expect(hasAccidental(notes0[3])).toBe(false);
  expect(hasAccidental(notes0[4])).toBe(false);
  expect(hasAccidental(notes0[5])).toBe(true);
  expect(hasAccidental(notes0[6])).toBe(true);
  expect(hasAccidental(notes0[7])).toBe(false);

  expect(hasAccidental(notes1[0])).toBe(false);
  expect(hasAccidental(notes1[1])).toBe(true);
  expect(hasAccidental(notes1[2])).toBe(true);
  expect(hasAccidental(notes1[3])).toBe(false);
  expect(hasAccidental(notes1[4])).toBe(false);
  expect(hasAccidental(notes1[5])).toBe(true);
  expect(hasAccidental(notes1[6])).toBe(true);
  expect(hasAccidental(notes1[7])).toBe(false);

  new Formatter().joinVoices([voice0, voice1]).formatToStave([voice0, voice1], stave);

  f.draw();
}

function automaticAccidentalsMultiVoiceOffset(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 150);
  const stave = f.Stave().addKeySignature("Cb");

  const notes0 = [
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["d/4"], duration: "4", stem_direction: -1 },
    { keys: ["e/4"], duration: "4", stem_direction: -1 },
    { keys: ["f/4"], duration: "4", stem_direction: -1 },
    { keys: ["g/4"], duration: "4", stem_direction: -1 },
    { keys: ["a/4"], duration: "4", stem_direction: -1 },
    { keys: ["b/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
  ].map(f.StaveNote.bind(f));

  const notes1 = [
    { keys: ["c/5"], duration: "8" },
    { keys: ["c/5"], duration: "4" },
    { keys: ["d/5"], duration: "4" },
    { keys: ["e/5"], duration: "4" },
    { keys: ["f/5"], duration: "4" },
    { keys: ["g/5"], duration: "4" },
    { keys: ["a/5"], duration: "4" },
    { keys: ["b/5"], duration: "4" },
    { keys: ["c/6"], duration: "4" },
  ].map(f.StaveNote.bind(f));

  const voice0 = f.Voice().setMode(Voice.Mode.SOFT).addTickables(notes0);

  const voice1 = f.Voice().setMode(Voice.Mode.SOFT).addTickables(notes1);

  // Cb Major (All flats)
  Accidental.applyAccidentals([voice0, voice1], "Cb");

  expect(hasAccidental(notes0[0])).toBe(true);
  expect(hasAccidental(notes0[1])).toBe(true);
  expect(hasAccidental(notes0[2])).toBe(true);
  expect(hasAccidental(notes0[3])).toBe(true);
  expect(hasAccidental(notes0[4])).toBe(true);
  expect(hasAccidental(notes0[5])).toBe(true);
  expect(hasAccidental(notes0[6])).toBe(true);
  expect(hasAccidental(notes0[7]), "Natural Remembered").toBe(false);

  expect(hasAccidental(notes1[0])).toBe(true);
  expect(hasAccidental(notes1[1])).toBe(false);
  expect(hasAccidental(notes1[2])).toBe(true);
  expect(hasAccidental(notes1[3])).toBe(true);
  expect(hasAccidental(notes1[4])).toBe(true);
  expect(hasAccidental(notes1[5])).toBe(true);
  expect(hasAccidental(notes1[6])).toBe(true);
  expect(hasAccidental(notes1[7])).toBe(true);

  new Formatter().joinVoices([voice0, voice1]).formatToStave([voice0, voice1], stave);

  f.draw();
}

function automaticAccidentalsCornerCases1(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 150);
  const stave = f.Stave().addKeySignature("C");

  const notes0 = [
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c#/4"], duration: "4", stem_direction: -1 },
    { keys: ["c#/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["cb/4"], duration: "4", stem_direction: -1 },
    { keys: ["cb/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
  ].map(f.StaveNote.bind(f));

  const voice0 = f.Voice().setMode(Voice.Mode.SOFT).addTickables(notes0);

  Accidental.applyAccidentals([voice0], "C");

  expect(hasAccidental(notes0[0])).toBe(false);
  expect(hasAccidental(notes0[1])).toBe(true);
  expect(hasAccidental(notes0[2])).toBe(false);
  expect(hasAccidental(notes0[3])).toBe(true);
  expect(hasAccidental(notes0[4])).toBe(false);
  expect(hasAccidental(notes0[5])).toBe(true);
  expect(hasAccidental(notes0[6])).toBe(false);
  expect(hasAccidental(notes0[7])).toBe(true);
  expect(hasAccidental(notes0[8])).toBe(false);

  new Formatter().joinVoices([voice0]).formatToStave([voice0], stave);

  f.draw();
}

function automaticAccidentalsCornerCases2(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 150);
  const stave = f.Stave().addKeySignature("C");

  const notes0 = [
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
    { keys: ["c#/4"], duration: "4", stem_direction: -1 },
    { keys: ["c#/5"], duration: "4", stem_direction: -1 },
    { keys: ["c#/4"], duration: "4", stem_direction: -1 },
    { keys: ["c#/5"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
    { keys: ["cb/4"], duration: "4", stem_direction: -1 },
    { keys: ["cb/5"], duration: "4", stem_direction: -1 },
    { keys: ["cb/4"], duration: "4", stem_direction: -1 },
    { keys: ["cb/5"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
  ].map(f.StaveNote.bind(f));

  const voice0 = f.Voice().setMode(Voice.Mode.SOFT).addTickables(notes0);

  Accidental.applyAccidentals([voice0], "C");

  expect(hasAccidental(notes0[0])).toBe(false);
  expect(hasAccidental(notes0[2])).toBe(true);
  expect(hasAccidental(notes0[4])).toBe(false);
  expect(hasAccidental(notes0[6])).toBe(true);
  expect(hasAccidental(notes0[8])).toBe(false);
  expect(hasAccidental(notes0[10])).toBe(true);
  expect(hasAccidental(notes0[12])).toBe(false);
  expect(hasAccidental(notes0[14])).toBe(true);
  expect(hasAccidental(notes0[16])).toBe(false);
  expect(hasAccidental(notes0[1])).toBe(false);
  expect(hasAccidental(notes0[3])).toBe(true);
  expect(hasAccidental(notes0[5])).toBe(false);
  expect(hasAccidental(notes0[7])).toBe(true);
  expect(hasAccidental(notes0[9])).toBe(false);
  expect(hasAccidental(notes0[11])).toBe(true);
  expect(hasAccidental(notes0[13])).toBe(false);
  expect(hasAccidental(notes0[15])).toBe(true);
  expect(hasAccidental(notes0[17])).toBe(false);

  new Formatter().joinVoices([voice0]).formatToStave([voice0], stave);

  f.draw();
}

function automaticAccidentalsCornerCases3(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 150);
  const stave = f.Stave().addKeySignature("C#");

  const notes0 = [
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c#/4"], duration: "4", stem_direction: -1 },
    { keys: ["c#/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["cb/4"], duration: "4", stem_direction: -1 },
    { keys: ["cb/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
  ].map(f.StaveNote.bind(f));

  const voice0 = f.Voice().setMode(Voice.Mode.SOFT).addTickables(notes0);

  Accidental.applyAccidentals([voice0], "C#");

  expect(hasAccidental(notes0[0])).toBe(true);
  expect(hasAccidental(notes0[1])).toBe(true);
  expect(hasAccidental(notes0[2])).toBe(false);
  expect(hasAccidental(notes0[3])).toBe(true);
  expect(hasAccidental(notes0[4])).toBe(false);
  expect(hasAccidental(notes0[5])).toBe(true);
  expect(hasAccidental(notes0[6])).toBe(false);
  expect(hasAccidental(notes0[7])).toBe(true);
  expect(hasAccidental(notes0[8])).toBe(false);

  new Formatter().joinVoices([voice0]).formatToStave([voice0], stave);

  f.draw();
}

function automaticAccidentalsCornerCases4(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 150);
  const stave = f.Stave().addKeySignature("C#");

  const notes0 = [
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
    { keys: ["c#/4"], duration: "4", stem_direction: -1 },
    { keys: ["c#/5"], duration: "4", stem_direction: -1 },
    { keys: ["c#/4"], duration: "4", stem_direction: -1 },
    { keys: ["c#/5"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
    { keys: ["cb/4"], duration: "4", stem_direction: -1 },
    { keys: ["cb/5"], duration: "4", stem_direction: -1 },
    { keys: ["cb/4"], duration: "4", stem_direction: -1 },
    { keys: ["cb/5"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
    { keys: ["c/4"], duration: "4", stem_direction: -1 },
    { keys: ["c/5"], duration: "4", stem_direction: -1 },
  ].map(f.StaveNote.bind(f));

  const voice0 = f.Voice().setMode(Voice.Mode.SOFT).addTickables(notes0);

  Accidental.applyAccidentals([voice0], "C#");

  expect(hasAccidental(notes0[0])).toBe(true);
  expect(hasAccidental(notes0[2])).toBe(true);
  expect(hasAccidental(notes0[4])).toBe(false);
  expect(hasAccidental(notes0[6])).toBe(true);
  expect(hasAccidental(notes0[8])).toBe(false);
  expect(hasAccidental(notes0[10])).toBe(true);
  expect(hasAccidental(notes0[12])).toBe(false);
  expect(hasAccidental(notes0[14])).toBe(true);
  expect(hasAccidental(notes0[16])).toBe(false);
  expect(hasAccidental(notes0[1])).toBe(true);
  expect(hasAccidental(notes0[3])).toBe(true);
  expect(hasAccidental(notes0[5])).toBe(false);
  expect(hasAccidental(notes0[7])).toBe(true);
  expect(hasAccidental(notes0[9])).toBe(false);
  expect(hasAccidental(notes0[11])).toBe(true);
  expect(hasAccidental(notes0[13])).toBe(false);
  expect(hasAccidental(notes0[15])).toBe(true);
  expect(hasAccidental(notes0[17])).toBe(false);

  new Formatter().joinVoices([voice0]).formatToStave([voice0], stave);

  f.draw();
}

function factoryAPI(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 700, 240);
  f.Stave({ x: 10, y: 10, width: 550 });

  const accid = makeNewAccid(f);

  const notes = [
    f
      .StaveNote({ keys: ["c/4", "e/4", "a/4"], duration: "w" })
      .addModifier(accid("b"), 0)
      .addModifier(accid("#"), 1),

    f
      .StaveNote({ keys: ["d/4", "e/4", "f/4", "a/4", "c/5", "e/5", "g/5"], duration: "h" })
      .addModifier(accid("##"), 0)
      .addModifier(accid("n"), 1)
      .addModifier(accid("bb"), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("#"), 4)
      .addModifier(accid("n"), 5)
      .addModifier(accid("bb"), 6),

    f
      .StaveNote({ keys: ["f/4", "g/4", "a/4", "b/4", "c/5", "e/5", "g/5"], duration: "16" })
      .addModifier(accid("n"), 0)
      .addModifier(accid("#"), 1)
      .addModifier(accid("#"), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("bb"), 4)
      .addModifier(accid("##"), 5)
      .addModifier(accid("#"), 6),

    f
      .StaveNote({ keys: ["a/3", "c/4", "e/4", "b/4", "d/5", "g/5"], duration: "w" })
      .addModifier(accid("#"), 0)
      .addModifier(accid("##").setAsCautionary(), 1)
      .addModifier(accid("#").setAsCautionary(), 2)
      .addModifier(accid("b"), 3)
      .addModifier(accid("bb").setAsCautionary(), 4)
      .addModifier(accid("b").setAsCautionary(), 5),
  ];

  Formatter.SimpleFormat(notes);

  notes.forEach((n, i) => {
    expect(
      n.getModifiersByType("Accidental").length > 0,
      "Note " + i + " has accidentals",
    ).toBeTruthy();
    n.getModifiersByType("Accidental").forEach((accid: Modifier, i: number) => {
      expect(accid.getWidth() > 0, "Accidental " + i + " has set width").toBeTruthy();
    });
  });

  f.draw();
}
