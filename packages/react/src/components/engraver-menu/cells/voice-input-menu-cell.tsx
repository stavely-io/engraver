import { DEFAULT_ENGRAVER_VOICES, EngraverStaveVoice } from "@engraver/core";

import { type FC } from "react";

import { useEngraverStore } from "../../../hooks/store/use-engraver-store";
import { useEngraverActions } from "../../../hooks/view/use-engraver-actions";
import { useEngraverMenuState } from "../../../hooks/view/use-engraver-menu-state";
import { FirstVoice, SecondVoice } from "../../icons";
import { EngraverOptionCell } from "../generic/engraver-option-cell";

const VOICE_ICON_MAP: Record<EngraverStaveVoice, FC> = {
  [EngraverStaveVoice.FIRST]: FirstVoice,
  [EngraverStaveVoice.SECOND]: SecondVoice,
};

export const VoiceInputMenuCell: FC = () => {
  const { selectedVoice } = useEngraverMenuState();
  const { select } = useEngraverActions();

  const isMultipleVoicesAvailable = useEngraverStore((state) => state.isMultipleVoicesAvailable);

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
