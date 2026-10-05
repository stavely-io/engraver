import { EngraverActionFactory } from "../../action-handler/engraver-action-factory";
import { EngraverAction } from "../../action-handler/types/actions/engraver-action";
import { EngraverMoveSelectionDirection } from "../../action-handler/types/selection/engraver-move-selected-direction.enum";
import { KeyboardClickContextKeyFactory } from "../factories/keyboard-click-context-key-factory";
import { KeyboardKey } from "./keyboard-keys.enum";
import { EngraverChromaticShiftDirection } from "@/modules/engraver/model/core/types/engraver-model.types";
import { EngraverViewMode } from "@/modules/engraver/view/types/engraver-mode.types";
import { Accidental } from "@/modules/musical-core/types/accidental.enum";
import { BaseDuration } from "@/modules/musical-core/types/base-duration.enum";
import { DotCount } from "@/modules/musical-core/types/dot-count.enum";

export type KeyboardClickContext = ReturnType<typeof KeyboardClickContextKeyFactory.create>;

export type EngraverKeyboardBindingMap = Partial<Record<KeyboardClickContext, EngraverAction>>;

// prettier-ignore
export const ENGRAVER_KEYBOARD_BINDINGS: EngraverKeyboardBindingMap = {
  [KeyboardKey.N]: EngraverActionFactory.createToggleViewModeAction(),
  [KeyboardKey.ESCAPE]: EngraverActionFactory.createChangeViewModeAction(EngraverViewMode.SELECT),
  [KeyboardKey.T]: EngraverActionFactory.createApplyTieAction(),
  [KeyboardKey.DOT]: EngraverActionFactory.createChangeDotCountAction(DotCount.ONE),
  [KeyboardKey.ONE]: EngraverActionFactory.createChangeDurationAction(BaseDuration.WHOLE),
  [KeyboardKey.TWO]: EngraverActionFactory.createChangeDurationAction(BaseDuration.HALF),
  [KeyboardKey.THREE]: EngraverActionFactory.createChangeDurationAction(BaseDuration.QUARTER),
  [KeyboardKey.FOUR]: EngraverActionFactory.createChangeDurationAction(BaseDuration.EIGHTH),
  [KeyboardKey.FIVE]: EngraverActionFactory.createChangeDurationAction(BaseDuration.SIXTEENTH),
  [KeyboardKey.PLUS]: EngraverActionFactory.createChangeAccidentalAction(Accidental.SHARP),
  [KeyboardKey.MINUS]: EngraverActionFactory.createChangeAccidentalAction(Accidental.FLAT),
  [KeyboardKey.EQUAL]: EngraverActionFactory.createChangeAccidentalAction(Accidental.NATURAL),
  [KeyboardKey.ARROW_LEFT]: EngraverActionFactory.createMoveSelectionAction(EngraverMoveSelectionDirection.LEFT),
  [KeyboardKey.ARROW_RIGHT]: EngraverActionFactory.createMoveSelectionAction(EngraverMoveSelectionDirection.RIGHT),
  [KeyboardKey.ARROW_LEFT + KeyboardKey.ALT]: EngraverActionFactory.createMoveSelectionAction(EngraverMoveSelectionDirection.UP),
  [KeyboardKey.ARROW_RIGHT + KeyboardKey.ALT]: EngraverActionFactory.createMoveSelectionAction(EngraverMoveSelectionDirection.DOWN),
  [KeyboardKey.ARROW_UP]: EngraverActionFactory.createApplyChromaticShiftAction(EngraverChromaticShiftDirection.UP),
  [KeyboardKey.ARROW_DOWN]: EngraverActionFactory.createApplyChromaticShiftAction(EngraverChromaticShiftDirection.DOWN),
  [KeyboardKey.DELETE]: EngraverActionFactory.createDeleteNotesAction(),
  [KeyboardKey.BACKSPACE]: EngraverActionFactory.createDeleteNotesAction(),
};
