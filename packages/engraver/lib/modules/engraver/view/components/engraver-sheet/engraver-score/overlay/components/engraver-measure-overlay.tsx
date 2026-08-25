"use client";
import clsx from "clsx";
import { FC, useContext, useMemo } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "@/lib/modules/engraver/controller/context/hooks/use-engraver-store";
import { BasePitchIterator } from "@/lib/modules/musical-core/iterators/base-pitch-iterator";
import { Pitch } from "@/lib/modules/musical-core/models/pitch";

import { useEngraverActions } from "../../../../../hooks/use-engraver-actions.js";
import { useEngraverMenuState } from "../../../../../hooks/use-engraver-menu-state.js";
import { useMeasureLayout } from "../../../../../hooks/use-measure-layout.js";
import { useStaveLayout } from "../../../../../hooks/use-stave-layout.js";
import { useSystemLayout } from "../../../../../hooks/use-system-layout.js";
import {
  MeasureContext,
  StaveContext,
  SystemContext,
} from "../contexts/container-contexts.js";
import MeasureOverlayColumn from "./engraver-measure-overlay-column.js";

interface MeasureOverlayProps {
  localMeasureIndex: number;
  globalMeasureIndex: number;
}

const MeasureOverlay: FC<MeasureOverlayProps> = ({
  localMeasureIndex,
  globalMeasureIndex,
}) => {
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
  const spacings = useMemo(
    () => voiceSpacings[voiceIndex],
    [voiceIndex, voiceSpacings],
  );

  return (
    <MeasureContext.Provider value={{ localMeasureIndex, globalMeasureIndex }}>
      <div
        data-testid="engraver-measure-overlay"
        className={clsx("absolute flex", !isEditable && "pointer-events-none")}
        style={{
          width: `${measureWidths[localMeasureIndex]}px`,
          left: `${measureLeftX}px`,
        }}
      >
        {spacings.map((spacing, tickableIndex) => (
          <MeasureOverlayColumn
            key={tickableIndex}
            pitches={Array.from(
              new BasePitchIterator(highestPitch, lowestPitch),
            )}
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
