import { Fraction } from "@engraver/vexflow";

import { Tickable } from "../models/abstract/tickable";
import { Chord } from "../models/chord";
import { Note } from "../models/note";
import { Rest } from "../models/rest";

export function calculateNoteTotalDuration(
  note: Note,
  mergedVoiceTickables: Tickable[],
  tickableIndex: number,
): Fraction {
  if (tickableIndex >= mergedVoiceTickables.length) {
    throw new Error("Given tickableIndex ${tickableIndex} is out of bonds");
  }
  const tickable = mergedVoiceTickables[tickableIndex];
  if (!(tickable instanceof Chord)) {
    throw new Error(`Tickable on given tickableIndex ${tickableIndex} must be a chord`);
  }

  if (!tickable.notes.includes(note)) {
    throw new Error(
      `Given note does not belond to a chord found on tickableIndex ${tickableIndex}`,
    );
  }

  const totalDuration = new Fraction(0);
  let currentNote = note;
  let currentTickableIndex = tickableIndex;
  while (currentNote) {
    const currentTickable = mergedVoiceTickables[currentTickableIndex] ?? null;
    if (!currentTickable) break;
    totalDuration.add(currentTickable.duration.toFractionValue());
    currentTickableIndex++;
    const rightTie = currentNote.rightTie;
    if (!rightTie) break;
    currentNote = rightTie.rightNote;
  }
  return totalDuration;
}

export function calculateRestTotalDuration(
  mergedVoiceTickables: Tickable[],
  tickableIndex: number,
) {
  const totalDuration = new Fraction(0);
  let currentRest = mergedVoiceTickables[tickableIndex];
  if (!(currentRest instanceof Rest)) {
    throw Error(`Found a Chord instead of a Rest on ${tickableIndex}`);
  }
  let currentRestIndex = tickableIndex;
  while (currentRest instanceof Rest) {
    totalDuration.add(currentRest.duration.toFractionValue());
    currentRestIndex++;
    currentRest = mergedVoiceTickables[currentRestIndex] ?? null;
  }
  return totalDuration;
}
