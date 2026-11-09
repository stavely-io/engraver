import type { PlayerStore } from "@/modules/player/store/player-store";

import type { StoreApi } from "zustand";

import { type EngraverScore } from "../../../model/score/engraver-score";
import type { EngraverStoreAPI } from "../../store/types/store-api";
import { type EngraverActionExecutor } from "./executors/abstract/engraver-action-executor";
import { ApplyChromaticShiftExecutor } from "./executors/apply/apply-chromatic-shift-executor";
import { ApplyTieExecutor } from "./executors/apply/apply-tie-executor";
import { ApplyTupletExecutor } from "./executors/apply/apply-tuplet-executor";
import { ChangeAccidentalExecutor } from "./executors/change/change-accidental-executor";
import { ChangeDotCountExecutor } from "./executors/change/change-dot-count-executor";
import { ChangeDurationExecutor } from "./executors/change/change-duration-executor";
import { ChangeViewModeExecutor } from "./executors/change/change-view-mode-executor";
import { ChangeVoiceExecutor } from "./executors/change/change-voice-executor";
import { PlaybackRewindExecutor } from "./executors/playback/playback-rewind-executor";
import { PlaybackTogglePlayExecutor } from "./executors/playback/playback-toggle-play-executor";
import { ScoreAddTickableExecutor } from "./executors/score/score-add-tickable-executor";
import { ScoreDeleteNotesExecutor } from "./executors/score/score-delete-notes-executor";
import { AddTickableToSelectedExecutor } from "./executors/selection/add-tickable-to-selected-executor";
import { ChangeSelectedTickableExecutor } from "./executors/selection/change-selected-tickable-executor";
import { MoveSelectionExecutor } from "./executors/selection/move-selection-executor";
import { RemoveSelectionExecutor } from "./executors/selection/remove-selection-executor";
import { ToggleInputModeExecutor } from "./executors/toggle/toggle-input-mode-executor";
import { ToggleViewModeExecutor } from "./executors/toggle/toggle-view-mode-executor";
import type { EngraverActionExecutorContext } from "./executors/types/engraver-action-executor-context";
import type { EngraverAction, EngraverActionMap } from "./types/actions/engraver-action";
import { EngraverActionType } from "./types/actions/engraver-action-type.enum";

export class EngraverActionHandler {
  private executors: Record<EngraverActionType, EngraverActionExecutor<keyof EngraverActionMap>>;
  constructor(
    score: EngraverScore,
    store: EngraverStoreAPI,
    player: StoreApi<PlayerStore>,
    refreshCallback: () => void,
  ) {
    this.executors = this.createEngraverActionExecutorRegistry({
      score,
      store,
      player,
      refreshCallback,
    });
  }

  public handle(action: EngraverAction) {
    const executor = this.executors[action.type];
    if (!executor) throw new Error(`No executor registered for action: ${action.type}`);
    executor.execute(action.payload);
  }

  private createEngraverActionExecutorRegistry(
    context: EngraverActionExecutorContext,
  ): Record<EngraverActionType, EngraverActionExecutor<keyof EngraverActionMap>> {
    return {
      [EngraverActionType.SCORE_ADD_TICKABLE]: new ScoreAddTickableExecutor(context),
      [EngraverActionType.SCORE_DELETE_NOTES]: new ScoreDeleteNotesExecutor(context),
      [EngraverActionType.SELECT_ADD_TICKABLE]: new AddTickableToSelectedExecutor(context),
      [EngraverActionType.SELECT_CHANGE_TICKABLE]: new ChangeSelectedTickableExecutor(context),
      [EngraverActionType.SELECT_MOVE_SELECTION]: new MoveSelectionExecutor(context),
      [EngraverActionType.SELECT_REMOVE_SELECTION]: new RemoveSelectionExecutor(context),
      [EngraverActionType.CHANGE_DURATION]: new ChangeDurationExecutor(context),
      [EngraverActionType.CHANGE_DOT_COUNT]: new ChangeDotCountExecutor(context),
      [EngraverActionType.CHANGE_ACCIDENTAL]: new ChangeAccidentalExecutor(context),
      [EngraverActionType.CHANGE_VOICE]: new ChangeVoiceExecutor(context),
      [EngraverActionType.TOGGLE_REST]: new ToggleInputModeExecutor(context),
      [EngraverActionType.TOGGLE_VIEW_MODE]: new ToggleViewModeExecutor(context),
      [EngraverActionType.CHANGE_VIEW_MODE]: new ChangeViewModeExecutor(context),
      [EngraverActionType.APPLY_TIE]: new ApplyTieExecutor(context),
      [EngraverActionType.APPLY_TUPLET]: new ApplyTupletExecutor(context),
      [EngraverActionType.APPLY_CHROMATIC_SHIFT]: new ApplyChromaticShiftExecutor(context),
      [EngraverActionType.PLAYBACK_TOGGLE]: new PlaybackTogglePlayExecutor(context),
      [EngraverActionType.PLAYBACK_REWIND]: new PlaybackRewindExecutor(context),
    };
  }
}
