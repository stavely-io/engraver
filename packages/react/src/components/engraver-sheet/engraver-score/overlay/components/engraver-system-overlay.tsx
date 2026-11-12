import { type FC } from "react";

import { useEngraverStore } from "../../../../../hooks/store/use-engraver-store";
import { SystemContext } from "../contexts/container-contexts";
import EngraverStaveOverlay from "./engraver-stave-overlay";

interface EngraverSystemOverlayProps {
  systemIndex: number;
}

const EngraverSystemOverlay: FC<EngraverSystemOverlayProps> = ({ systemIndex }) => {
  const staveCount = useEngraverStore((state) => state.staveCount);

  return (
    <SystemContext.Provider value={{ systemIndex }}>
      <div data-testid="engraver-system-overlay">
        {Array.from({ length: staveCount }, (_, index) => (
          <EngraverStaveOverlay key={index} staveIndex={index} />
        ))}
      </div>
    </SystemContext.Provider>
  );
};

export default EngraverSystemOverlay;
