import { ChordDTO } from "@/lib/api/types/exercises/dto-model-types";

import { Tickable } from "./abstract/tickable.js";
import { Duration } from "./duration.js";
import { Note } from "./note.js";
import { Pitch } from "./pitch.js";

export class Chord extends Tickable {
  public notes: Note[];
  constructor(pitches: Pitch[], duration: Duration) {
    super(duration);
    this.notes = pitches.map((pitch) => new Note(pitch));
    this.notes.sort((noteA, noteB) =>
      Pitch.compareEnharmonically(noteA.pitch, noteB.pitch),
    );
  }

  public static fromDTO(chordDTO: ChordDTO): Chord {
    const duration = Duration.fromDTO(chordDTO.duration);
    const pitches = chordDTO.pitches.map(Pitch.fromString);
    return new Chord(pitches, duration);
  }

  public addNote(pitch: Pitch) {
    this.notes.push(new Note(pitch));
    this.notes.sort((noteA, noteB) =>
      Pitch.compareEnharmonically(noteA.pitch, noteB.pitch),
    );
  }

  public get pitches(): Pitch[] {
    return this.notes.map((note) => note.pitch);
  }
}
