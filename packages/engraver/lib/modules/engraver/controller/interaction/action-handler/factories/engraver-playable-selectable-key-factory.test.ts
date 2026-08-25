import { describe, expect, it } from "vitest";
import { EngraverPlayableSelectableCoordinatesKeyFactory } from "./engraver-playable-selectable-key-factory.js";
import { EngraverStaveVoice } from "@/lib/modules/engraver/model/core/types/engraver-model.types";

describe("EngraverPlayableSelectableCoordinatesKeyFactory", () => {
  it("should create a string key from coordinates", () => {
    const coords = {
      staveIndex: 1,
      measureIndex: 2,
      voiceIndex: EngraverStaveVoice.SECOND,
      tickableIndex: 3,
      noteIndex: 4,
    };
    const key = EngraverPlayableSelectableCoordinatesKeyFactory.create(coords);
    expect(key).toBe("1-2-1-3-4");
  });
});
