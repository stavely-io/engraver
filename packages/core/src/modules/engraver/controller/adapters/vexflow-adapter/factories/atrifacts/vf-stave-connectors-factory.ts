import { Stave, StaveConnector } from "@engraver/vexflow";

export class VFStaveConnectorFactory {
  public static create(
    upperStave: Stave[],
    lowerStave: Stave[],
    isLastSystem: boolean,
  ): StaveConnector[] {
    if (upperStave.length !== lowerStave.length) {
      throw Error("Connected staves must have the same number of measures!");
    }

    return upperStave
      .map((measure, measureIndex) =>
        this.createStaveConnector(measure, lowerStave[measureIndex], "singleLeft"),
      )
      .concat([
        this.createStaveConnector(
          upperStave[upperStave.length - 1],
          lowerStave[lowerStave.length - 1],
          isLastSystem ? "boldDoubleRight" : "singleRight",
        ),
      ]);
  }

  private static createStaveConnector(
    topMeasure: Stave,
    bottomMeasure: Stave,
    type: keyof typeof StaveConnector.typeString,
  ): StaveConnector {
    return new StaveConnector(topMeasure, bottomMeasure).setType(type);
  }
}
