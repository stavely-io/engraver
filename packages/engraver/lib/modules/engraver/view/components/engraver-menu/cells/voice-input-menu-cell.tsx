import { FC } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "@/lib/modules/engraver/controller/context/hooks/use-engraver-store";
import {
  DEFAULT_ENGRAVER_VOICES,
  EngraverStaveVoice,
} from "@/lib/modules/engraver/model/core/types/engraver-model.types";
import Voice1 from "@/lib/modules/icons/engraver/first-voice";
import Voice2 from "@/lib/modules/icons/engraver/second-voice";

import { useEngraverActions } from "../../../hooks/use-engraver-actions.js";
import { useEngraverMenuState } from "../../../hooks/use-engraver-menu-state.js";
import { EngraverOptionCell } from "../generic/engraver-option-cell.js";

const VOICE_ICON_MAP: Record<EngraverStaveVoice, FC> = {
  [EngraverStaveVoice.FIRST]: Voice1,
  [EngraverStaveVoice.SECOND]: Voice2,
};

export const VoiceInputMenuCell: FC = () => {
  const engraverStore = useEngraverStore();
  const { selectedVoice } = useEngraverMenuState();
  const { select } = useEngraverActions();

  const isMultipleVoicesAvailable = useStore(
    engraverStore,
    (state) => state.isMultipleVoicesAvailable,
  );

  if (!isMultipleVoicesAvailable) return null;

  return (
    <EngraverOptionCell<EngraverStaveVoice>
      data-test-id="voice-input-submenu"
      cellOptions={DEFAULT_ENGRAVER_VOICES}
      icons={VOICE_ICON_MAP}
      selectedOption={selectedVoice}
      onOptionClick={select.voice}
    />
  );
};
