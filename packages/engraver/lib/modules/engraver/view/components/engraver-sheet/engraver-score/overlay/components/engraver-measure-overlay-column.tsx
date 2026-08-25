"use client";
import clsx from "clsx";
import { FC, useContext } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "@/lib/modules/engraver/controller/context/hooks/use-engraver-store";
import { Pitch } from "@/lib/modules/musical-core/models/pitch";

import { useEngraverActions } from "../../../../../hooks/use-engraver-actions.js";
import { useEngraverMenuState } from "../../../../../hooks/use-engraver-menu-state.js";
import { MEASURE_OVERLAY_COLUMN_HEIGHT } from "../constants/layout.js";
import {
  MeasureContext,
  StaveContext,
  SystemContext,
} from "../contexts/container-contexts.js";

interface MeasureOverlayColumnProps {
  pitches: Pitch[];
  width: number;
  handleOnRowClick: (pitch: Pitch) => void;
  tickableIndex: number;
}

const MeasureOverlayColumn: FC<MeasureOverlayColumnProps> = ({
  pitches,
  width,
  handleOnRowClick,
  tickableIndex,
}: MeasureOverlayColumnProps) => {
  const { systemIndex } = useContext(SystemContext);
  const { staveIndex } = useContext(StaveContext);
  const { localMeasureIndex } = useContext(MeasureContext);
  const { isEditable } = useEngraverMenuState();
  const engraverStore = useEngraverStore();
  const voiceIndex = useStore(engraverStore, (state) => state.selectedVoice);
  const { overlay } = useEngraverActions();

  return (
    <div
      data-testid="engraver-measure-overlay-column"
      className={clsx("flex flex-col", !isEditable && "pointer-events-none")}
    >
      {pitches.map((pitch, index) => (
        <div
          data-testid="measure-overlay-row"
          style={{
            width: `${width}px`,
            height: `${MEASURE_OVERLAY_COLUMN_HEIGHT}px`,
          }}
          className={clsx("z-10", !isEditable && "pointer-events-none")}
          key={index}
          onClick={(event) => {
            event.stopPropagation();
            handleOnRowClick(pitch);
          }}
          onMouseEnter={() => {
            overlay.onMouseEnter(pitch, {
              systemIndex,
              staveIndex,
              measureIndex: localMeasureIndex,
              tickableIndex,
              voiceIndex,
            });
          }}
          onMouseLeave={overlay.onMouseExit}
        ></div>
      ))}
    </div>
  );
};

export default MeasureOverlayColumn;
