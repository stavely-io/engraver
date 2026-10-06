import type { SelectableEngraverMenuValues } from "../../../store/slices/menu/engraver-menu-values.slice";
import type { EngraverOverlayElement } from "../../overlay/types/engraver-overlay-element";
import type { EngraverActionExecutorContext } from "../executors/types/engraver-action-executor-context";
import type {
  EngraverPlayableSelectable,
  EngraverSelectable,
} from "@/modules/engraver/model/core/types/engraver-model.types";
import { EngraverNote } from "@/modules/engraver/model/elements/events/engraver-note";
import { EngraverRest } from "@/modules/engraver/model/elements/events/engraver-rest";
import { EngraverInputMode } from "@/modules/engraver/view/types/engraver-mode.types";
import { Duration } from "@/modules/musical-core/models/duration";
import { BaseDuration } from "@/modules/musical-core/types/base-duration.enum";
import { commonElementProperty } from "@/utils/array";

export class SelectionManager {
  constructor(private readonly context: EngraverActionExecutorContext) {}

  public get selectedSelectables() {
    const state = this.context.store.getState();
    const selectables = [...state.selectedSelectablesIDs]
      .map((id) => state.IDToEngraverSelectableMap.get(id))
      .filter((s): s is EngraverOverlayElement => !!s)
      .map((s) => s.engraverSelectable);

    return {
      all: selectables,
      notes: selectables.filter((s) => s instanceof EngraverNote) as EngraverNote[],
      rests: selectables.filter((s) => s instanceof EngraverRest) as EngraverRest[],
      playable: selectables.filter(
        (s) => s instanceof EngraverNote || s instanceof EngraverRest,
      ) as EngraverPlayableSelectable[],
    };
  }

  public get selectedSelectablesIDs(): Set<number> {
    return this.context.store.getState().selectedSelectablesIDs;
  }

  public isSelected(id: number) {
    return this.context.store.getState().selectedSelectablesIDs.has(id);
  }

  public addToSelection(...ids: number[]): void {
    this.context.store.setState((state) => {
      const newSet = new Set<number>(state.selectedSelectablesIDs);
      ids.forEach((id) => newSet.add(id));
      return {
        selectedSelectablesIDs: newSet,
      };
    });
  }

  public removeFromSelection(id: number): void {
    this.context.store.setState((state) => {
      const newSet = new Set<number>(state.selectedSelectablesIDs);
      newSet.delete(id);

      return {
        selectedSelectablesIDs: newSet,
      };
    });
  }

  public clearSelection(): void {
    this.context.store.setState({ selectedSelectablesIDs: new Set<number>() });
  }

  public updateMenuSelection(): void {
    const newState: Partial<SelectableEngraverMenuValues> = this.getSelectedSharedProperties();

    const fallbackValues = this.context.store.getState().getDefaultSelectableMenuValues();

    for (const key of Object.keys(fallbackValues) as (keyof SelectableEngraverMenuValues)[]) {
      if (newState[key] === undefined) {
        (newState[key] as unknown as SelectableEngraverMenuValues[typeof key]) =
          fallbackValues[key];
      }
    }

    this.context.store.setState(newState);
  }

  public getSelectedSharedProperties(): Partial<SelectableEngraverMenuValues> {
    const state = this.context.store.getState();
    const result: Partial<SelectableEngraverMenuValues> = {
      selectedViewMode: state.selectedViewMode,
      selectedVoice: state.selectedVoice,
    };
    const selected = this.selectedSelectables.all;

    if (!selected.length) {
      return {
        selectedAccidental: undefined,
        selectedDotCount: undefined,
        ...result,
      };
    }

    const playable = selected.filter(
      (s: EngraverSelectable): s is EngraverPlayableSelectable =>
        s instanceof EngraverNote || s instanceof EngraverRest,
    );

    const commonBaseDuration = commonElementProperty(playable, (e) => e.duration.baseValue);
    result.selectedVoice = commonElementProperty(playable, (e) => e.coordinates.voiceIndex);
    result.selectedDotCount = commonElementProperty(playable, (e) => e.duration.dotCount);
    result.selectedBaseDuration =
      commonBaseDuration && Duration.isBaseDuration(commonBaseDuration)
        ? (commonBaseDuration as BaseDuration)
        : undefined;

    const allNotes = playable.every((t) => t instanceof EngraverNote);
    const allRests = playable.every((t) => t instanceof EngraverRest);

    if (allNotes) {
      result.selectedAccidental = commonElementProperty(playable, (t) => t.pitch.accidental);
      result.selectedInputMode = EngraverInputMode.NOTE;
    } else if (allRests) {
      result.selectedInputMode = EngraverInputMode.REST;
    }

    return result;
  }
}
