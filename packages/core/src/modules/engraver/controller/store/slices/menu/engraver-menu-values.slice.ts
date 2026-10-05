import {
  createAccidentalState,
  createDotCountState,
  createDurationsState,
  createInitialSelectedDurationState,
} from "../../utils/engraver-config-helpers";
import {
  EngraverNoteModifiers,
  EngraverStaveVoice,
} from "@/modules/engraver/model/core/types/engraver-model.types";
import { EngraverMenuConfig } from "@/modules/engraver/view/types/config/engraver-menu-config";
import {
  EngraverInputMode,
  EngraverViewMode,
} from "@/modules/engraver/view/types/engraver-mode.types";
import { Duration } from "@/modules/musical-core/models/duration";
import { Accidental } from "@/modules/musical-core/types/accidental.enum";
import { BaseDuration } from "@/modules/musical-core/types/base-duration.enum";
import { DotCount } from "@/modules/musical-core/types/dot-count.enum";
import { StateCreator } from "zustand";

export interface SelectableEngraverMenuValues {
  selectedViewMode: EngraverViewMode;
  selectedInputMode: EngraverInputMode;

  selectedDotCount: DotCount;
  selectedBaseDuration: BaseDuration;
  selectedAccidental: Accidental;
  selectedVoice: EngraverStaveVoice;
}

export interface EngraverMenuSliceValues extends SelectableEngraverMenuValues {
  availableDurations: BaseDuration[];
  availableAccidentals: Accidental[];
  availableDotCounts: DotCount[];

  isTupletAvailable: boolean;
  isMultipleVoicesAvailable: boolean;
  isTieAvailable: boolean;
  isRestAvailable: boolean;
  isPlayable: boolean;

  isEditable: () => boolean;
  isSelecting: () => boolean;
  getDefaultSelectableMenuValues: () => SelectableEngraverMenuValues;
  getSelectedNoteModifiers: () => EngraverNoteModifiers;
}

export const createEngraverMenuValuesSlice =
  (
    engraverMenuConfig?: EngraverMenuConfig,
  ): StateCreator<EngraverMenuSliceValues, [], [], EngraverMenuSliceValues> =>
  (_, get) => ({
    availableDurations: createDurationsState(engraverMenuConfig?.visibleDurations),
    availableAccidentals: createAccidentalState(engraverMenuConfig?.visibleAccidentals),
    availableDotCounts: createDotCountState(engraverMenuConfig?.visibleDots),

    isTupletAvailable: engraverMenuConfig?.visibleTuplet ?? true,
    isMultipleVoicesAvailable: engraverMenuConfig?.visibleMultipleVoices ?? true,
    isTieAvailable: engraverMenuConfig?.visibleTie ?? true,
    isRestAvailable: engraverMenuConfig?.visibleRest ?? true,
    isPlayable: engraverMenuConfig?.playable ?? true,

    selectedViewMode: engraverMenuConfig?.initialViewMode ?? EngraverViewMode.EDIT,
    selectedInputMode: EngraverInputMode.NOTE,

    selectedDotCount: DotCount.ZERO,
    selectedBaseDuration: createInitialSelectedDurationState(engraverMenuConfig?.visibleDurations),
    selectedAccidental: Accidental.NONE,
    selectedVoice: EngraverStaveVoice.FIRST,

    isEditable: () => get().selectedViewMode === EngraverViewMode.EDIT,
    isSelecting: () => get().selectedViewMode === EngraverViewMode.SELECT,
    getDefaultSelectableMenuValues: () => ({
      selectedViewMode: EngraverViewMode.EDIT,
      selectedInputMode: EngraverInputMode.NOTE,

      selectedDotCount: DotCount.ZERO,
      selectedBaseDuration: createInitialSelectedDurationState(
        engraverMenuConfig?.visibleDurations,
      ),
      selectedAccidental: Accidental.NONE,
      selectedVoice: EngraverStaveVoice.FIRST,
    }),
    getSelectedNoteModifiers: () => ({
      dotCount: get().selectedDotCount,
      accidental: get().selectedAccidental,
      duration: new Duration(get().selectedBaseDuration, get().selectedDotCount),
      inputMode: get().selectedInputMode,
    }),
  });
