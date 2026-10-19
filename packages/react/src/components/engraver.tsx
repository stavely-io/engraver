"use client";
import { EngraverThemeType, type EngraverConfig } from "@engraver/core";

import { type FC, useRef } from "react";

import { EngraverProvider } from "../context/engraver-provider";
import { PlayerProvider } from "../context/player-provider";
import { EngraverMenu } from "./engraver-menu/engraver-menu";
import { EngraverSheet } from "./engraver-sheet/engraver-sheet";

interface EngraverProps {
  config: EngraverConfig;
  theme?: EngraverThemeType;
}

const Engraver: FC<EngraverProps> = ({ config, theme }) => {
  const engraverWrapperRef = useRef<HTMLElement | null>(null);

  return (
    <PlayerProvider>
      <EngraverProvider config={config} theme={theme} engraverWrapperRef={engraverWrapperRef}>
        <section ref={engraverWrapperRef} tabIndex={-1} className="flex w-full flex-col gap-y-3">
          <EngraverMenu isDisabled={config.engraverUIConfig?.isMenuDisabled} />
          <EngraverSheet isDisabled={config.engraverUIConfig?.isSheetDisabled} />
        </section>
      </EngraverProvider>
    </PlayerProvider>
  );
};

export default Engraver;
