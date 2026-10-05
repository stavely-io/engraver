import { VFScoreCoreData } from "../../../rendering/types/vf-data";
import { EngraverPlayableSelectableCoordinates } from "../../action-handler/types/engraver-coordinates";
import { EngraverOverlayElement } from "../types/engraver-overlay-element";
import { EngraverSelectable } from "@/modules/engraver/model/core/types/engraver-model.types";
import { EngraverRest } from "@/modules/engraver/model/elements/events/engraver-rest";
import { EngraverScore } from "@/modules/engraver/model/score/engraver-score";
import { StaveNote } from "@stavely-io/vexflow";

export class EngraverOverlayMapper {
  private static readonly VF_NOTEHEAD_CLASS = ".vf-notehead";

  public static map(
    data: VFScoreCoreData,
    score: EngraverScore,
  ): Map<number, EngraverOverlayElement> {
    const IDToEngraverSelectableMap = new Map<number, EngraverOverlayElement>();

    data.systems.forEach((system) => {
      system.staves.forEach((staveData, staveIndex) => {
        staveData.measuresData.forEach((measureData, measureIndex) => {
          measureData.vfVoices.forEach((vfVoice, voiceIndex) => {
            vfVoice
              .getTickables()
              .filter((t): t is StaveNote => t instanceof StaveNote)
              .forEach((tickable, tickableIndex) => {
                const element = tickable.getSVGElement();
                if (!element) {
                  return;
                }
                const noteheads = this.getElementNoteheads(element);

                tickable.keys.forEach((_, noteIndex) => {
                  const coordinates = {
                    staveIndex,
                    measureIndex: system.globalMeasureIndices[measureIndex],
                    voiceIndex,
                    tickableIndex,
                    noteIndex,
                  };

                  IDToEngraverSelectableMap.set(this.coordinatesToID(coordinates, score), {
                    engraverOverlayCoordinates: coordinates,
                    engraverSelectable: this.coordinatesToEngraverSelectable(coordinates, score),
                    overlaySVG: this.createOverlayForElement(element, noteIndex),
                    vfSVG: noteheads[noteIndex],
                  });
                });
              });
          });
        });
      });
    });

    return IDToEngraverSelectableMap;
  }

  private static createOverlayForElement(element: SVGElement, noteIndex: number): SVGRectElement {
    const notehead = this.getElementNoteheads(element)[noteIndex];

    const bbox = notehead.getBBox();

    const overlay = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    overlay.setAttribute("x", `${bbox.x}`);
    overlay.setAttribute("y", `${bbox.y}`);
    overlay.setAttribute("width", `${bbox.width}`);
    overlay.setAttribute("height", `${bbox.height}`);
    overlay.setAttribute("fill", "transparent");
    overlay.setAttribute("stroke", "transparent");
    overlay.style.pointerEvents = "all";

    return overlay;
  }

  private static getElementNoteheads(element: SVGElement) {
    return element.querySelectorAll<SVGGElement>(EngraverOverlayMapper.VF_NOTEHEAD_CLASS);
  }

  public static coordinatesToID(
    coordinates: EngraverPlayableSelectableCoordinates,
    score: EngraverScore,
  ): number {
    const selectable = this.coordinatesToEngraverSelectable(coordinates, score);
    return selectable.id;
  }

  public static coordinatesToEngraverSelectable(
    coordinates: EngraverPlayableSelectableCoordinates,
    score: EngraverScore,
  ): EngraverSelectable {
    const tickable =
      score.staves[coordinates.staveIndex].measures[coordinates.measureIndex].voices[
        coordinates.voiceIndex
      ].tickables[coordinates.tickableIndex];
    return tickable instanceof EngraverRest ? tickable : tickable.notes[coordinates.noteIndex];
  }
}
