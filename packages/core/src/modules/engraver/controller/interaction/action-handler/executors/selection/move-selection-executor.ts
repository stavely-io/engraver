import { EngraverOverlayMapper } from "../../../overlay/static/engraver-overlay-mapper";
import { EngraverActionMap } from "../../types/actions/engraver-action";
import { EngraverActionType } from "../../types/actions/engraver-action-type.enum";
import { EngraverPlayableSelectableCoordinates } from "../../types/engraver-coordinates";
import { EngraverMoveSelectionDirection } from "../../types/selection/engraver-move-selected-direction.enum";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor";
import { EngraverStaveVoice } from "@/modules/engraver/model/core/types/engraver-model.types";
import { EngraverChord } from "@/modules/engraver/model/elements/events/engraver-chord";
import { EngraverPlayableSelectableUtils } from "@/modules/engraver/model/helpers/static/engraver-playable-selectable-utils";

export class MoveSelectionExecutor extends EngraverActionExecutor<EngraverActionType.SELECT_MOVE_SELECTION> {
  public execute(payload: EngraverActionMap[EngraverActionType.SELECT_MOVE_SELECTION]): void {
    const direction = payload.direction;

    const baseCoordinates = this.getLastSelectedTickableCoordinates(direction);

    if (!baseCoordinates) {
      this.selectionManager.clearSelection();
      return;
    }

    const adjacentCoordinates = this.getAdjacentCoordinates(baseCoordinates, direction);

    this.selectionManager.clearSelection();
    this.selectionManager.addToSelection(
      EngraverOverlayMapper.coordinatesToID(adjacentCoordinates, this.context.score),
    );

    this.selectionManager.updateMenuSelection();
  }

  private getAdjacentCoordinates(
    coordinates: EngraverPlayableSelectableCoordinates,
    direction: EngraverMoveSelectionDirection,
  ): EngraverPlayableSelectableCoordinates {
    const { staveIndex, measureIndex, voiceIndex, tickableIndex, noteIndex } = coordinates;
    const staves = this.context.score.staves;

    const currentStave = staves[staveIndex];
    const currentMeasure = currentStave.measures[measureIndex];
    const currentTickable = currentMeasure.voices[voiceIndex].tickables[tickableIndex];

    switch (direction) {
      case EngraverMoveSelectionDirection.RIGHT: {
        // Within current measure
        const tickables = currentMeasure.voices[voiceIndex].tickables;
        if (tickableIndex + 1 < tickables.length) {
          const nextTickable = tickables[tickableIndex + 1];
          return {
            staveIndex,
            measureIndex,
            voiceIndex,
            tickableIndex: tickableIndex + 1,
            noteIndex:
              nextTickable instanceof EngraverChord ? nextTickable.notes.length - 1 : noteIndex,
          };
        }

        const nextMeasureIndex = measureIndex + 1;

        // Next measure in current stave and
        if (nextMeasureIndex < staves[staveIndex].measures.length) {
          // Current voice is not empty in the next measure or current voice is the first voice
          if (
            !staves[staveIndex].measures[nextMeasureIndex].voices[voiceIndex].isEmpty ||
            voiceIndex === EngraverStaveVoice.FIRST
          ) {
            const nextTickable =
              staves[staveIndex].measures[nextMeasureIndex].voices[voiceIndex].tickables[0];
            return {
              staveIndex,
              measureIndex: measureIndex + 1,
              voiceIndex,
              tickableIndex: 0,
              noteIndex:
                nextTickable instanceof EngraverChord ? nextTickable.notes.length - 1 : noteIndex,
            };
          }
        }

        // No move possible
        return coordinates;
      }

      case EngraverMoveSelectionDirection.LEFT: {
        // Within current measure
        if (tickableIndex > 0) {
          const previousTickable =
            staves[staveIndex].measures[measureIndex].voices[voiceIndex].tickables[
              tickableIndex - 1
            ];
          return {
            staveIndex,
            measureIndex,
            voiceIndex,
            tickableIndex: tickableIndex - 1,
            noteIndex:
              previousTickable instanceof EngraverChord
                ? previousTickable.notes.length - 1
                : noteIndex,
          };
        }

        // Previous measure in current stave
        if (measureIndex > 0) {
          const prevMeasure = staves[staveIndex].measures[measureIndex - 1];
          const lastTickableIndex = prevMeasure.voices[voiceIndex].tickables.length - 1;

          // Current voice is not empty in the previous measure or current voice is the first voice
          if (!prevMeasure.voices[voiceIndex].isEmpty || voiceIndex === EngraverStaveVoice.FIRST) {
            const previousTickable = prevMeasure.voices[voiceIndex].tickables[lastTickableIndex];
            return {
              staveIndex,
              measureIndex: measureIndex - 1,
              voiceIndex,
              tickableIndex: lastTickableIndex,
              noteIndex:
                previousTickable instanceof EngraverChord
                  ? previousTickable.notes.length - 1
                  : noteIndex,
            };
          }
        }

        // No move possible
        return coordinates;
      }

      case EngraverMoveSelectionDirection.DOWN: {
        if (currentTickable instanceof EngraverChord && noteIndex > 0)
          return {
            staveIndex,
            measureIndex,
            voiceIndex,
            tickableIndex,
            noteIndex: noteIndex - 1,
          };

        if (tickableIndex + 1 < currentMeasure.voices[voiceIndex].tickables.length) {
          const nextTickable = currentMeasure.voices[voiceIndex].tickables[tickableIndex + 1];

          return {
            staveIndex,
            measureIndex,
            voiceIndex,
            tickableIndex: tickableIndex + 1,
            noteIndex: nextTickable instanceof EngraverChord ? nextTickable.notes.length - 1 : 0,
          };
        }

        if (measureIndex + 1 < currentStave.measures.length) {
          const nextMeasure = currentStave.measures[measureIndex + 1];
          if (!nextMeasure.voices[voiceIndex].isEmpty || voiceIndex === EngraverStaveVoice.FIRST) {
            const firstTickable = nextMeasure.voices[voiceIndex].tickables[0];
            return {
              staveIndex,
              measureIndex: measureIndex + 1,
              voiceIndex,
              tickableIndex: 0,
              noteIndex:
                firstTickable instanceof EngraverChord ? firstTickable.notes.length - 1 : 0,
            };
          }
        }

        return coordinates;
      }

      case EngraverMoveSelectionDirection.UP: {
        if (
          currentTickable instanceof EngraverChord &&
          noteIndex + 1 < currentTickable.notes.length
        )
          return {
            staveIndex,
            measureIndex,
            voiceIndex,
            tickableIndex,
            noteIndex: noteIndex + 1,
          };

        if (tickableIndex > 0) {
          return {
            staveIndex,
            measureIndex,
            voiceIndex,
            tickableIndex: tickableIndex - 1,
            noteIndex: 0,
          };
        }

        if (measureIndex > 0) {
          const previousMeasure = currentStave.measures[measureIndex - 1];
          if (
            !previousMeasure.voices[voiceIndex].isEmpty ||
            voiceIndex === EngraverStaveVoice.FIRST
          ) {
            const lastTickableIndex = previousMeasure.voices[voiceIndex].tickables.length - 1;
            return {
              staveIndex,
              measureIndex: measureIndex - 1,
              voiceIndex,
              tickableIndex: lastTickableIndex,
              noteIndex: 0,
            };
          }
        }
        return coordinates;
      }
    }
  }

  private getLastSelectedTickableCoordinates = (
    direction: EngraverMoveSelectionDirection,
  ): EngraverPlayableSelectableCoordinates | undefined => {
    const selectables = this.selectionManager.selectedSelectables.playable;
    if (selectables.length === 0) return undefined;
    const sortedPlayableSelectablesDepth = 3;
    const sortedPlayableSelectables =
      EngraverPlayableSelectableUtils.sortPlayableSelectablesChronologically(
        this.context.score,
        selectables,
      ).flat(sortedPlayableSelectablesDepth);
    const lastSelectable =
      direction === EngraverMoveSelectionDirection.LEFT
        ? sortedPlayableSelectables[0]
        : sortedPlayableSelectables[sortedPlayableSelectables.length - 1];
    return lastSelectable.coordinates;
  };
}
