import {
  BaseDuration,
  CLEF_DATA,
  ClefType,
  KEY_SIGNATURES,
  TimeSignature,
  type EngraverConfig,
  type EngraverMenuConfig,
  type EngraverScoreConfig,
} from "@engraver/core";
import { Engraver } from "@engraver/react";

const ENGRAVER_SCORE_CONFIG: EngraverScoreConfig = {
  allowChordInput: false,
  scoreTemplate: {
    measureCount: 3,
    staveConfigs: [
      {
        clef: CLEF_DATA[ClefType.TREBLE],
        timeSignature: TimeSignature.FOUR_FOUR,
        keySignature: KEY_SIGNATURES.C,
      },
    ],
  },
};

const ENGRAVER_MENU_CONFIG: EngraverMenuConfig = {
  visibleDurations: {
    durations: [BaseDuration.HALF],
  },
  visibleDots: {
    dotCounts: [],
  },
  visibleRest: false,
  visibleMultipleVoices: false,
  visibleTie: false,
  visibleTuplet: false,
  playable: false,
};

const ENGRAVER_CONFIG: EngraverConfig = {
  engraverScoreConfig: ENGRAVER_SCORE_CONFIG,
  engraverMenuConfig: ENGRAVER_MENU_CONFIG,
};

function App() {
  return (
    <div className="app">
      <Engraver config={ENGRAVER_CONFIG} />
    </div>
  );
}

export default App;
