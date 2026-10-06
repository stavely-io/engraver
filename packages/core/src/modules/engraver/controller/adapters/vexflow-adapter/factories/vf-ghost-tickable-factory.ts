import type { VFGhostVoice, VFMeasureData } from "../../../rendering/types/vf-data";
import { VFChordFactory } from "./core/vf-chord-factory";
import { VFRestFactory } from "./core/vf-rest-factory";
import { EngraverMeasure } from "@/modules/engraver/model/containers/engraver-measure";
import {
  type EngraverNoteModifiers,
  EngraverStaveVoice,
  type EngraverTickable,
} from "@/modules/engraver/model/core/types/engraver-model.types";
import { EngraverChord } from "@/modules/engraver/model/elements/events/engraver-chord";
import { EngraverRest } from "@/modules/engraver/model/elements/events/engraver-rest";
import type { EngraverGhostOverlayTheme } from "@/modules/engraver/view/types/config/score/engraver-theme-config";
import { EngraverInputMode } from "@/modules/engraver/view/types/engraver-mode.types";
import { Duration } from "@/modules/musical-core/models/duration";
import { Pitch } from "@/modules/musical-core/models/pitch";
import {
  Accidental,
  Dot,
  Formatter,
  Stave,
  StaveNote,
  Voice,
  VoiceMode,
} from "@stavely-io/vexflow";

export class VFGhostTickableFactory {
  private static readonly VF_DEFAULT_LINE_COUNT = 5;
  private static readonly DEFAULT_GHOST_THEME: EngraverGhostOverlayTheme = {
    firstVoice: "rgba(0, 117, 149, 0.8)",
    secondVoice: "rgba(165, 0, 54, 0.8)",
  } as const;

  public static create(
    pitch: Pitch,
    modifiers: EngraverNoteModifiers,
    engraverTickable: EngraverTickable,
    scoreMeasureData: VFMeasureData,
    localMeasureIndex: number,
    theme: EngraverGhostOverlayTheme = VFGhostTickableFactory.DEFAULT_GHOST_THEME,
  ): VFGhostVoice {
    const { ghostMeasure, ghostNote, ghostVoice, ghostEngraverTickable } =
      this.buildGhostComponents(
        pitch,
        modifiers,
        engraverTickable,
        scoreMeasureData.vfMeasure,
        localMeasureIndex,
        theme,
      );

    const { tickableIndex, voiceIndex } = ghostEngraverTickable.coordinates;

    return this.formatVFGhostTickable(
      scoreMeasureData.vfVoices[voiceIndex],
      ghostMeasure,
      ghostNote,
      ghostVoice,
      tickableIndex,
      localMeasureIndex,
    );
  }

  private static buildGhostComponents(
    pitch: Pitch,
    modifiers: EngraverNoteModifiers,
    engraverTickable: EngraverTickable,
    scoreVFMeasure: Stave,
    localMeasureIndex: number,
    theme: EngraverGhostOverlayTheme,
  ) {
    const ghostEngraverTickable = this.getGhostEngraverTickable(pitch, modifiers, engraverTickable);
    const ghostMeasure = this.createVFGhostMeasure(
      scoreVFMeasure,
      ghostEngraverTickable.parentVoice.parentMeasure,
      localMeasureIndex,
    );
    const ghostNote = this.createVFGhostNote(ghostEngraverTickable, pitch, theme);
    const ghostVoice = this.createVFGhostVoice(ghostNote);
    return { ghostMeasure, ghostNote, ghostVoice, ghostEngraverTickable };
  }

  private static getGhostEngraverTickable(
    pitch: Pitch,
    modifiers: EngraverNoteModifiers,
    engraverTickable: EngraverTickable,
  ): EngraverTickable {
    const { accidental, duration, dotCount, inputMode } = modifiers;

    pitch.accidental = accidental;
    const dur = new Duration(duration.baseValue, dotCount);

    const { parentVoice, tickableIndex } = engraverTickable;

    return inputMode === EngraverInputMode.REST
      ? new EngraverRest(dur, parentVoice, tickableIndex)
      : new EngraverChord([pitch], dur, parentVoice, tickableIndex);
  }

  private static createVFGhostMeasure(
    scoreVFMeasure: Stave,
    engraverMeasure: EngraverMeasure,
    localMeasureIndex: number,
  ): Stave {
    const ghostMeasure = new Stave(
      scoreVFMeasure.getX(),
      scoreVFMeasure.getY(),
      scoreVFMeasure.getWidth(),
      {
        num_lines: this.VF_DEFAULT_LINE_COUNT,
      },
    );

    if (localMeasureIndex === 0) {
      ghostMeasure.addKeySignature(engraverMeasure.keySignature.name);
      ghostMeasure.addClef(engraverMeasure.clef.type);
    }

    if (engraverMeasure.measureIndex === 0) {
      ghostMeasure.addTimeSignature(engraverMeasure.timeSignature);
    }

    ghostMeasure.setConfigForLines(Array(this.VF_DEFAULT_LINE_COUNT).fill({ visible: false }));

    return ghostMeasure;
  }

  private static createVFGhostNote(
    engraverTickable: EngraverTickable,
    atPitch: Pitch,
    theme: EngraverGhostOverlayTheme,
  ): StaveNote {
    const measureActiveVoiceCount = engraverTickable.parentVoice.parentMeasure.activeVoiceCount;
    const { voiceIndex } = engraverTickable.coordinates;

    const ghostNote =
      engraverTickable instanceof EngraverChord
        ? VFChordFactory.create(engraverTickable, measureActiveVoiceCount)
        : VFRestFactory.create(engraverTickable, measureActiveVoiceCount, atPitch.toString());

    const color = voiceIndex === EngraverStaveVoice.FIRST ? theme.firstVoice : theme.secondVoice;
    ghostNote.setStyle({ fillStyle: color, strokeStyle: color });

    return ghostNote;
  }

  private static createVFGhostVoice(ghostNote: StaveNote): Voice {
    const ghostVoice = new Voice();
    ghostVoice.setMode(VoiceMode.SOFT);
    ghostVoice.addTickable(ghostNote);
    return ghostVoice;
  }

  private static formatVFGhostTickable(
    scoreVFVoice: Voice,
    ghostMeasure: Stave,
    ghostNote: StaveNote,
    ghostVoice: Voice,
    tickableIndex: number,
    localMeasureIndex: number,
  ): VFGhostVoice {
    const refTickable = scoreVFVoice.getTickables()[tickableIndex];

    ghostVoice.setStave(ghostMeasure);
    new Formatter().format([ghostVoice]);

    let shift = refTickable.getX() - ghostNote.getX();

    ghostNote.getModifiers().forEach((modifier, i) => {
      if (modifier instanceof Accidental) {
        if (localMeasureIndex === 0 && scoreVFVoice.getTickables().length === 1) {
          shift += modifier.getWidth();
        }
        modifier.setXShift(-shift);
      } else if (modifier instanceof Dot) {
        modifier.setXShift(modifier.getWidth() * i + modifier.getSpacingFromNextModifier());
      }
    });

    ghostNote.setXShift(shift);

    return ghostVoice;
  }
}
