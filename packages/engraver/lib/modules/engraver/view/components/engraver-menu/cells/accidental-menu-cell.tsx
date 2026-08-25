import { FC } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "@/lib/modules/engraver/controller/context/hooks/use-engraver-store";
import DoubleFlat from "@/lib/modules/icons/common/double-flat";
import DoubleSharp from "@/lib/modules/icons/common/double-sharp";
import Flat from "@/lib/modules/icons/common/flat";
import Natural from "@/lib/modules/icons/common/natural";
import Sharp from "@/lib/modules/icons/common/sharp";
import { Accidental } from "@/lib/modules/musical-core/types/accidental.enum";

import { useEngraverActions } from "../../../hooks/use-engraver-actions.js";
import { useEngraverMenuState } from "../../../hooks/use-engraver-menu-state.js";
import { EngraverOptionCell } from "../generic/engraver-option-cell.js";

const ACCIDENTAL_TYPE_ICON_MAP: Record<Accidental, FC | null> = {
  [Accidental.NONE]: null,
  [Accidental.DOUBLE_SHARP]: DoubleSharp,
  [Accidental.SHARP]: Sharp,
  [Accidental.NATURAL]: Natural,
  [Accidental.FLAT]: Flat,
  [Accidental.DOUBLE_FLAT]: DoubleFlat,
};

export const AccidentalMenuCell: FC = () => {
  const engraverStore = useEngraverStore();

  const { selectedAccidental } = useEngraverMenuState();
  const availableAccidentals = useStore(
    engraverStore,
    (state) => state.availableAccidentals,
  );

  const { select } = useEngraverActions();

  if (!availableAccidentals.length) return null;

  return (
    <EngraverOptionCell<Accidental>
      data-test-id="accidental-submenu"
      cellOptions={availableAccidentals}
      icons={ACCIDENTAL_TYPE_ICON_MAP}
      selectedOption={selectedAccidental}
      onOptionClick={select.accidental}
    />
  );
};
