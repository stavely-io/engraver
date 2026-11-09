import clsx from "clsx";
import { type FC, useContext } from "react";

import { useEngraverMenuState } from "../../../../../hooks/view/use-engraver-menu-state";
import { useStaveLayout } from "../../../../../hooks/view/use-stave-layout";
import { useSystemLayout } from "../../../../../hooks/view/use-system-layout";
import { StaveContext, SystemContext } from "../contexts/container-contexts";
import MeasureOverlay from "./engraver-measure-overlay";

interface EngraverStaveOverlayProps {
  staveIndex: number;
}

const EngraverStaveOverlay: FC<EngraverStaveOverlayProps> = ({ staveIndex }) => {
  const { systemIndex } = useContext(SystemContext);
  const { isEditable } = useEngraverMenuState();
  const { measureWidths, globalMeasureIndices, systemWidth } = useSystemLayout(systemIndex);
  const { topPitchRangeStaveOffset } = useStaveLayout(systemIndex, staveIndex);

  return (
    <StaveContext.Provider value={{ staveIndex }}>
      <div
        data-testid="engraver-stave-overlay"
        className={clsx("engraver-stave-overlay", !isEditable && "engraver-stave-overlay--inert")}
        style={{ width: `${systemWidth}px`, top: `${topPitchRangeStaveOffset}px` }}
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
