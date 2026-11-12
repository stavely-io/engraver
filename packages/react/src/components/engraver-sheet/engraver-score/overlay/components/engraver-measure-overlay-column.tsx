import { type Pitch, MEASURE_OVERLAY_COLUMN_HEIGHT } from "@engraver/core";

import clsx from "clsx";
import { type FC, useContext } from "react";

import { useEngraverStore } from "../../../../../hooks/store/use-engraver-store";
import { useEngraverActions } from "../../../../../hooks/view/use-engraver-actions";
import { useEngraverMenuState } from "../../../../../hooks/view/use-engraver-menu-state";
import { MeasureContext, StaveContext, SystemContext } from "../contexts/container-contexts";

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
  const voiceIndex = useEngraverStore((state) => state.selectedVoice);
  const { overlay } = useEngraverActions();

  return (
    <div
      data-testid="engraver-measure-overlay-column"
      className={clsx(
        "engraver-measure-overlay-column",
        !isEditable && "engraver-measure-overlay-column--inert",
      )}
    >
      {pitches.map((pitch, index) => (
        <div
          data-testid="measure-overlay-row"
          style={{ width: `${width}px`, height: `${MEASURE_OVERLAY_COLUMN_HEIGHT}px` }}
          className={clsx(
            "engraver-measure-overlay-row",
            !isEditable && "engraver-measure-overlay-row--inert",
          )}
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
