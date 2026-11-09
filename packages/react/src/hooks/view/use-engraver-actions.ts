import {
  type Pitch,
  type Accidental,
  type BaseDuration,
  type DotCount,
  EngraverActionFactory,
  type EngraverTickableCoordinates,
  type EngraverStaveVoice,
} from "@engraver/core";

import { useEngraverController } from "../context/use-engraver-controller";

export function useEngraverActions() {
  const controller = useEngraverController();

  return {
    click: {
      sheet: () =>
        controller.dispatchAction(EngraverActionFactory.createSelectRemoveSelectionAction()),
      score: (basePitch: Pitch, coordinates: EngraverTickableCoordinates) =>
        controller.dispatchAction(
          EngraverActionFactory.createAddTickableAction(basePitch, coordinates),
        ),
    },
    select: {
      duration: (d: BaseDuration) =>
        controller.dispatchAction(EngraverActionFactory.createChangeDurationAction(d)),
      dotCount: (dot: DotCount) =>
        controller.dispatchAction(EngraverActionFactory.createChangeDotCountAction(dot)),
      voice: (v: EngraverStaveVoice) =>
        controller.dispatchAction(EngraverActionFactory.createChangeVoiceAction(v)),
      accidental: (acc: Accidental) =>
        controller.dispatchAction(EngraverActionFactory.createChangeAccidentalAction(acc)),
    },
    toggle: {
      restInput: () => controller.dispatchAction(EngraverActionFactory.createToggleRestAction()),
      viewMode: () => controller.dispatchAction(EngraverActionFactory.createToggleViewModeAction()),
    },
    apply: {
      tie: () => controller.dispatchAction(EngraverActionFactory.createApplyTieAction()),
      tuplet: () => controller.dispatchAction(EngraverActionFactory.createApplyTupletAction()),
    },
    playback: {
      toggle: () => controller.dispatchAction(EngraverActionFactory.createPlaybackToggleAction()),
      rewind: () => controller.dispatchAction(EngraverActionFactory.createPlaybackRewindAction()),
    },
    overlay: {
      onMouseEnter: controller.onOverlayMouseEnter.bind(controller),
      onMouseExit: controller.onOverlayMouseExit.bind(controller),
    },
  };
}

export type EngraverActions = ReturnType<typeof useEngraverActions>;
