import {
  CLEF_DATA,
  ClefType,
  KEY_SIGNATURES,
  EngraverThemeType,
  TimeSignature,
  type EngraverConfig,
} from "@engraver/core";
import { Engraver } from "@engraver/react";

import { useEffect, useState } from "react";

import "./engraver-demo.css";

// Selection and ghost notes use the Flat Gold accent in both themes.
const GOLD = "#bb8b41";

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
  engraverThemeConfig: {
    selectionTheme: { firstVoice: GOLD, secondVoice: GOLD },
    ghostOverlayTheme: { firstVoice: GOLD, secondVoice: GOLD },
  },
};

const readTheme = (): EngraverThemeType =>
  document.documentElement.dataset.theme === "light"
    ? EngraverThemeType.LIGHT
    : EngraverThemeType.DARK;

/** Follows Starlight's theme switch, which sets `data-theme` on <html>. */
function useDocsTheme(): EngraverThemeType {
  const [theme, setTheme] = useState(readTheme);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

// The theme prop only re-inks the score; changing the config object would rebuild the editor and lose its notes.
export function BasicScore() {
  const theme = useDocsTheme();
  return (
    <div className="engraver-demo">
      <Engraver config={CONFIG} theme={theme} />
    </div>
  );
}
