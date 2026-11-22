import { type FC, useEffect, useRef } from "react";

import { useEngraverController } from "../hooks/context/use-engraver-controller";
import { EngraverMenu } from "./engraver-menu/engraver-menu";
import { EngraverSheet } from "./engraver-sheet/engraver-sheet";
import "./engraver.css";

interface EngraverProps {
  isMenuDisabled?: boolean;
  isSheetDisabled?: boolean;
}

const Engraver: FC<EngraverProps> = ({ isMenuDisabled, isSheetDisabled }) => {
  const engraverController = useEngraverController();
  const engraverWrapperRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!engraverWrapperRef.current) return;
    engraverController.onComponentMount(engraverWrapperRef.current);
    return () => {
      engraverController.onComponentUnmount();
    };
  }, [engraverController]);

  return (
    <section ref={engraverWrapperRef} tabIndex={-1} className="engraver">
      <EngraverMenu isDisabled={isMenuDisabled} />
      <EngraverSheet isDisabled={isSheetDisabled} />
    </section>
  );
};

export default Engraver;
