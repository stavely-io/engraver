import { type FC, useEffect, useRef } from "react";

import { useEngraverController } from "../../../hooks/context/use-engraver-controller";
import { useEngraverMenuState } from "../../../hooks/view/use-engraver-menu-state";
import EngraverOverlay from "./overlay/engraver-overlay";
import "./engraver-score.css";

const EngraverScore: FC = () => {
  const engraverScoreRef = useRef<HTMLDivElement>(null);

  const engraverController = useEngraverController();

  useEffect(() => {
    if (!engraverScoreRef.current) return;
    engraverController.onScoreMount(engraverScoreRef.current);
    return () => engraverController.onScoreUnmount();
  }, [engraverController, engraverScoreRef]);

  const { isEditable } = useEngraverMenuState();

  return (
    <div className="engraver-score">
      <div ref={engraverScoreRef} id="engraver" className="engraver-score__canvas" />
      {isEditable && <EngraverOverlay />}
    </div>
  );
};

export default EngraverScore;
