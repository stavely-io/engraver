"use client";

import { FC, useEffect, useRef } from "react";
import { useStore } from "zustand";

import { useEngraverController } from "@/lib/modules/engraver/controller/context/hooks/use-engraver-controller";
import { useEngraverStore } from "@/lib/modules/engraver/controller/context/hooks/use-engraver-store";

import EngraverSystemOverlay from "./components/engraver-system-overlay.js";

const EngraverOverlay: FC = () => {
  const engraverController = useEngraverController();
  const engraverOverlayRef = useRef<HTMLDivElement>(null);

  const engraverStore = useEngraverStore();
  const systemCount = useStore(engraverStore, (state) => state.systemCount);

  useEffect(() => {
    if (!engraverOverlayRef.current) return;
    engraverController.onOverlayMount(engraverOverlayRef.current);
    return () => engraverController.onOverlayUnmount();
  }, [engraverController, engraverOverlayRef]);

  return (
    <div
      ref={engraverOverlayRef}
      className="absolute top-0 w-full"
      data-testid="engraver-overlay"
    >
      {Array.from({ length: systemCount }, (_, index) => (
        <EngraverSystemOverlay key={index} systemIndex={index} />
      ))}
    </div>
  );
};

export default EngraverOverlay;
