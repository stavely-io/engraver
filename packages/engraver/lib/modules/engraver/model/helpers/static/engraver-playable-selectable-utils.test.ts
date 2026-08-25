import { describe, expect, it, vi } from "vitest";
import { EngraverPlayableSelectable } from "../../core/types/engraver-model.types.js";
import { EngraverChord } from "../../elements/events/engraver-chord.js";
import { EngraverNote } from "../../elements/events/engraver-note.js";
import { EngraverPlayableSelectableUtils } from "./engraver-playable-selectable-utils.js";

vi.mock("../../elements/events/engraver-note");
vi.mock("../../elements/events/engraver-chord");

describe("EngraverPlayableSelectableUtils", () => {
  describe("sortPlayableSelectablesChronologically", () => {
    const createMockSelectable = (
      staveIndex: number,
      measureIndex: number,
      noteIndex = 0,
      isNote = false,
    ): EngraverPlayableSelectable => {
      const selectable: any = {
        coordinates: { staveIndex, measureIndex, noteIndex },
      };
      if (isNote) {
        Object.setPrototypeOf(selectable, EngraverNote.prototype);
        selectable.parentChord = { isNote: false };
      } else {
        Object.setPrototypeOf(selectable, EngraverChord.prototype);
        selectable.isNote = false;
      }
      return selectable;
    };

    it("should group selectables by stave and measure", () => {
      const selectable1 = createMockSelectable(0, 0);
      const selectable2 = createMockSelectable(1, 0);
      const selectable3 = createMockSelectable(0, 1);
      const selectables = [selectable1, selectable2, selectable3];

      const mockMeasure = {
        mergeVoicesChronologically: () => ({ measurePlacementMap: new Map() }),
      };
      const mockScore: any = {
        staves: [
          { measures: [mockMeasure, mockMeasure] },
          { measures: [mockMeasure, mockMeasure] },
        ],
        measureCount: 2,
      };

      const grouped =
        EngraverPlayableSelectableUtils.sortPlayableSelectablesChronologically(
          mockScore,
          selectables,
        );

      expect(grouped[0][0]).toContain(selectable1);
      expect(grouped[0][1]).toContain(selectable3);
      expect(grouped[1][0]).toContain(selectable2);
      expect(grouped[1][1]).toEqual([]);
    });

    it("should sort selectables based on the measurePlacementMap", () => {
      const selectableA = createMockSelectable(0, 0);
      const selectableB = createMockSelectable(0, 0);
      const selectables = [selectableB, selectableA];

      const placementMap = new Map();
      placementMap.set(selectableA, 1);
      placementMap.set(selectableB, 2);

      const mockMeasure = {
        mergeVoicesChronologically: () => ({
          measurePlacementMap: placementMap,
        }),
      };
      const mockScore: any = {
        staves: [{ measures: [mockMeasure] }],
        measureCount: 1,
      };

      const grouped =
        EngraverPlayableSelectableUtils.sortPlayableSelectablesChronologically(
          mockScore,
          selectables,
        );
      const sortedMeasure = grouped[0][0];

      expect(sortedMeasure[0]).toBe(selectableA);
      expect(sortedMeasure[1]).toBe(selectableB);
    });

    it("should use noteIndex as a tie-breaker for notes within the same chord", () => {
      const parentChord = createMockSelectable(0, 0);
      const noteA = createMockSelectable(0, 0, 1, true);
      const noteB = createMockSelectable(0, 0, 0, true);
      (noteA as any).parentChord = parentChord;
      (noteB as any).parentChord = parentChord;
      const selectables = [noteA, noteB];

      const placementMap = new Map();
      placementMap.set(parentChord, 1);

      const mockMeasure = {
        mergeVoicesChronologically: () => ({
          measurePlacementMap: placementMap,
        }),
      };
      const mockScore: any = {
        staves: [{ measures: [mockMeasure] }],
        measureCount: 1,
      };

      const grouped =
        EngraverPlayableSelectableUtils.sortPlayableSelectablesChronologically(
          mockScore,
          selectables,
        );
      const sortedMeasure = grouped[0][0];

      expect(sortedMeasure).toHaveLength(2);
      expect(sortedMeasure).toContain(noteA);
      expect(sortedMeasure).toContain(noteB);
    });

    it("should throw an error if a selectable is not found in the placement map", () => {
      const selectable1 = createMockSelectable(0, 0);
      const selectable2 = createMockSelectable(0, 0);
      const placementMap = new Map();
      placementMap.set(selectable1, 1);
      const mockMeasure = {
        mergeVoicesChronologically: () => ({
          measurePlacementMap: placementMap,
        }),
      };
      const mockScore: any = {
        staves: [{ measures: [mockMeasure] }],
        measureCount: 1,
      };

      expect(() =>
        EngraverPlayableSelectableUtils.sortPlayableSelectablesChronologically(
          mockScore,
          [selectable1, selectable2],
        ),
      ).toThrow("selectablePlayable Not Found While Sorting");
    });
  });
});
