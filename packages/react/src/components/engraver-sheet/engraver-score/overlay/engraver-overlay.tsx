import { type FC, useEffect, useRef } from "react";

import { useEngraverController } from "../../../../hooks/context/use-engraver-controller";
import { useEngraverStore } from "../../../../hooks/store/use-engraver-store";
import EngraverSystemOverlay from "./components/engraver-system-overlay";
import "./engraver-overlay.css";

const EngraverOverlay: FC = () => {
  const engraverController = useEngraverController();
  const engraverOverlayRef = useRef<HTMLDivElement>(null);

  const systemCount = useEngraverStore((state) => state.systemCount);

  useEffect(() => {
    if (!engraverOverlayRef.current) return;
    engraverController.onOverlayMount(engraverOverlayRef.current);
    return () => engraverController.onOverlayUnmount();
  }, [engraverController, engraverOverlayRef]);

  return (
    <div ref={engraverOverlayRef} className="engraver-overlay" data-testid="engraver-overlay">
      {Array.from({ length: systemCount }, (_, index) => (
        <EngraverSystemOverlay key={index} systemIndex={index} />
      ))}
    </div>
  );
};

export default EngraverOverlay;
