import { Tickable } from "./abstract/tickable";
import { Duration } from "./duration";
import { Note } from "./note";
import { Pitch } from "./pitch";

export class Chord extends Tickable {
  public notes: Note[];
  constructor(pitches: Pitch[], duration: Duration) {
    super(duration);
    this.notes = pitches.map((pitch) => new Note(pitch));
    this.notes.sort((noteA, noteB) => Pitch.compareEnharmonically(noteA.pitch, noteB.pitch));
  }

  public addNote(pitch: Pitch) {
    this.notes.push(new Note(pitch));
    this.notes.sort((noteA, noteB) => Pitch.compareEnharmonically(noteA.pitch, noteB.pitch));
  }

  public get pitches(): Pitch[] {
    return this.notes.map((note) => note.pitch);
  }
}
