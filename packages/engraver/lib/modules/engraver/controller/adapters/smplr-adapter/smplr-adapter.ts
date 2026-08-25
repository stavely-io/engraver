import { Fraction } from "@stavely-io/vexflow";

import { EngraverMeasure } from "@/lib/modules/engraver/model/containers/engraver-measure";
import { EngraverStave } from "@/lib/modules/engraver/model/containers/engraver-stave";
import { EngraverStaveVoice } from "@/lib/modules/engraver/model/core/types/engraver-model.types";
import { EngraverNote } from "@/lib/modules/engraver/model/elements/events/engraver-note";
import { EngraverRest } from "@/lib/modules/engraver/model/elements/events/engraver-rest";
import { EngraverScore } from "@/lib/modules/engraver/model/score/engraver-score";
import {
  SmplrNote,
  SmplrScoreData,
} from "@/lib/modules/player/smplr/types/smplr";

import { EngraverOneWayAdapter } from "../types/adapter.types.js";
import { SmplrNoteFactory } from "./factories/smplr-note-factory.js";

export class SmplrAdapter implements EngraverOneWayAdapter<
  EngraverScore,
  SmplrScoreData
> {
  public adapt(input: EngraverScore): SmplrScoreData {
    return input.staves.map((stave) => this.adaptStave(stave));
  }

  private adaptStave(stave: EngraverStave): SmplrNote[][] {
    return Object.values(EngraverStaveVoice)
      .filter((v): v is EngraverStaveVoice => typeof v === "number")
      .map((voice) => this.adaptVoiceMeasures(stave.measures, voice));
  }

  private adaptVoiceMeasures(
    measures: EngraverMeasure[],
    voice: EngraverStaveVoice,
  ): SmplrNote[] {
    const voiceTickables = measures.flatMap(
      (measure) => measure.voices[voice].tickables,
    );

    const ticksOffset = new Fraction(0);

    return voiceTickables.flatMap((tickable) => {
      if (tickable instanceof EngraverRest) {
        const rest = [SmplrNoteFactory.create(tickable.value, ticksOffset)];
        ticksOffset.add(tickable.value);
        return rest;
      }

      const notes = tickable.notes.flatMap((note) => {
        if (note.isTied && !note.beginsTie) return [];
        const duration = note.beginsTie
          ? this.calculateTotalDuration(note)
          : note.duration.toFractionValue();
        // TODO: can be optimized with asTickables for faster effectivePitch
        return [
          SmplrNoteFactory.create(duration, ticksOffset, note.effectivePitch),
        ];
      });

      ticksOffset.add(tickable.value);
      return notes;
    });
  }

  private calculateTotalDuration(note: EngraverNote): Fraction {
    const total = note.duration.toFractionValue();
    let currentNote = note;
    while (currentNote.rightTie) {
      currentNote = currentNote.rightTie.rightNote;
      total.add(currentNote.duration.toFractionValue());
    }
    return total;
  }
}
