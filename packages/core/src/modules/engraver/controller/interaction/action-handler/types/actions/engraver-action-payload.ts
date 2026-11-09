import { type EngraverChromaticShiftDirection } from "@/modules/engraver/model/core/types/engraver-model.types";
import { type Pitch } from "@/modules/musical-core/models/pitch";

import type {
  EngraverPlayableSelectableCoordinates,
  EngraverTickableCoordinates,
} from "../engraver-coordinates";
import { type EngraverMoveSelectionDirection } from "../selection/engraver-move-selected-direction.enum";

// Toggle actions
export type EngraverToggleActionPayload = Record<PropertyKey, never>;

// Apply actions
export type EngraverApplyActionPayload = Record<PropertyKey, never>;

export type EngraverApplyChromaticShiftActionPayload = {
  direction: EngraverChromaticShiftDirection;
};

// Execute actions
export type EngraverExecuteActionPayload = Record<PropertyKey, never>;

// Change actions
export type EngraverChangeActionPayload<T> = {
  newValue: T;
};

// Select actions
export type EngraverSelectRemoveSelectionActionPayload = Record<PropertyKey, never>;

export type EngraverSelectTickableActionPayload = {
  coordinates: EngraverPlayableSelectableCoordinates;
};

export type EngraverMoveSelectedTickableActionPayload = {
  direction: EngraverMoveSelectionDirection;
};

// Score actions
export type EngraverScoreAddTickableActionPayload = {
  coordinates: EngraverTickableCoordinates;
  // TODO: this should be made optional in rest input
  basePitch: Pitch;
};

export type EngraverScoreDeleteNotesActionPayload = Record<PropertyKey, never>;
