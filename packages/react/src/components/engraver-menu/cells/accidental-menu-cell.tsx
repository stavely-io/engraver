import { Accidental } from "@engraver/core";

import { type FC } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "../../../hooks/context/use-engraver-store";
import { useEngraverActions } from "../../../hooks/view/use-engraver-actions";
import { useEngraverMenuState } from "../../../hooks/view/use-engraver-menu-state";
import { DoubleFlat } from "../../icons";
import { DoubleSharp } from "../../icons";
import { Flat } from "../../icons";
import { Natural } from "../../icons";
import { Sharp } from "../../icons";
import { EngraverOptionCell } from "../generic/engraver-option-cell";

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
  const availableAccidentals = useStore(engraverStore, (state) => state.availableAccidentals);

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
