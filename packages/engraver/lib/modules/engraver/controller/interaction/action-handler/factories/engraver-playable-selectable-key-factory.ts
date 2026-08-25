import { EngraverPlayableSelectableCoordinates } from "../types/engraver-coordinates.js";

export class EngraverPlayableSelectableCoordinatesKeyFactory {
  public static create(
    coordinates: EngraverPlayableSelectableCoordinates,
  ): string {
    const { staveIndex, measureIndex, voiceIndex, tickableIndex, noteIndex } =
      coordinates;
    return `${staveIndex}-${measureIndex}-${voiceIndex}-${tickableIndex}-${noteIndex}`;
  }
}
