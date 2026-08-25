"use client";

import clsx from "clsx";
import { FC, useContext } from "react";

import { useEngraverMenuState } from "../../../../../hooks/use-engraver-menu-state.js";
import { useStaveLayout } from "../../../../../hooks/use-stave-layout.js";
import { useSystemLayout } from "../../../../../hooks/use-system-layout.js";
import { StaveContext, SystemContext } from "../contexts/container-contexts.js";
import MeasureOverlay from "./engraver-measure-overlay.js";

interface EngraverStaveOverlayProps {
  staveIndex: number;
}

const EngraverStaveOverlay: FC<EngraverStaveOverlayProps> = ({
  staveIndex,
}) => {
  const { systemIndex } = useContext(SystemContext);
  const { isEditable } = useEngraverMenuState();
  const { measureWidths, globalMeasureIndices, systemWidth } =
    useSystemLayout(systemIndex);
  const { topPitchRangeStaveOffset } = useStaveLayout(systemIndex, staveIndex);

  return (
    <StaveContext.Provider value={{ staveIndex }}>
      <div
        data-testid="engraver-stave-overlay"
        className={clsx(
          `absolute flex flex-row`,
          !isEditable && "pointer-events-none",
        )}
        style={{
          width: `${systemWidth}px`,
          top: `${topPitchRangeStaveOffset}px`,
        }}
      >
        {Array.from({ length: measureWidths.length }).map((_, index) => (
          <MeasureOverlay
            key={index}
            localMeasureIndex={index}
            globalMeasureIndex={globalMeasureIndices[index]}
          />
        ))}
      </div>
    </StaveContext.Provider>
  );
};

export default EngraverStaveOverlay;
