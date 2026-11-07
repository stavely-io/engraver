import { BasePitchIterator, Pitch } from "@engraver/core";

import clsx from "clsx";
import { type FC, useContext, useMemo } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "../../../../../hooks/context/use-engraver-store";
import { useEngraverActions } from "../../../../../hooks/view/use-engraver-actions";
import { useEngraverMenuState } from "../../../../../hooks/view/use-engraver-menu-state";
import { useMeasureLayout } from "../../../../../hooks/view/use-measure-layout";
import { useStaveLayout } from "../../../../../hooks/view/use-stave-layout";
import { useSystemLayout } from "../../../../../hooks/view/use-system-layout";
import { MeasureContext, StaveContext, SystemContext } from "../contexts/container-contexts";
import MeasureOverlayColumn from "./engraver-measure-overlay-column";

interface MeasureOverlayProps {
  localMeasureIndex: number;
  globalMeasureIndex: number;
}

const MeasureOverlay: FC<MeasureOverlayProps> = ({ localMeasureIndex, globalMeasureIndex }) => {
  const { systemIndex } = useContext(SystemContext);
  const { staveIndex } = useContext(StaveContext);

  const engraverStore = useEngraverStore();
  const { click } = useEngraverActions();
  const { isEditable } = useEngraverMenuState();
  const { measureWidths } = useSystemLayout(systemIndex);
  const { lowestPitch, highestPitch } = useStaveLayout(systemIndex, staveIndex);
  const { voiceSpacings, measureLeftX } = useMeasureLayout(
    systemIndex,
    staveIndex,
    localMeasureIndex,
  );

  const voiceIndex = useStore(engraverStore, (state) => state.selectedVoice);
  const spacings = useMemo(() => voiceSpacings[voiceIndex], [voiceIndex, voiceSpacings]);

  return (
    <MeasureContext.Provider value={{ localMeasureIndex, globalMeasureIndex }}>
      <div
        data-testid="engraver-measure-overlay"
        className={clsx(
          "engraver-measure-overlay",
          !isEditable && "engraver-measure-overlay--inert",
        )}
        style={{
          width: `${measureWidths[localMeasureIndex]}px`,
          left: `${measureLeftX}px`,
        }}
      >
        {spacings.map((spacing, tickableIndex) => (
          <MeasureOverlayColumn
            key={tickableIndex}
            pitches={Array.from(new BasePitchIterator(highestPitch, lowestPitch))}
            width={spacing}
            tickableIndex={tickableIndex}
            handleOnRowClick={(pitch: Pitch) => {
              click.score(pitch, {
                staveIndex,
                measureIndex: globalMeasureIndex,
                voiceIndex,
                tickableIndex,
              });
            }}
          />
        ))}
      </div>
    </MeasureContext.Provider>
  );
};

export default MeasureOverlay;
