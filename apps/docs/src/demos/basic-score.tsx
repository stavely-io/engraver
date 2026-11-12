import {
  CLEF_DATA,
  ClefType,
  KEY_SIGNATURES,
  TimeSignature,
  type EngraverConfig,
} from "@engraver/core";
import { Engraver } from "@engraver/react";

const CONFIG: EngraverConfig = {
  engraverScoreConfig: {
    scoreTemplate: {
      measureCount: 4,
      staveConfigs: [
        {
          clef: CLEF_DATA[ClefType.TREBLE],
          timeSignature: TimeSignature.FOUR_FOUR,
          keySignature: KEY_SIGNATURES.C,
        },
      ],
    },
  },
};

export function BasicScore() {
  return (
    <div className="engraver-demo">
      <Engraver config={CONFIG} />
    </div>
  );
}
