import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';
import { DotCount } from '@/lib/modules/musical-core/types/dot-count.enum';

import { useEngraverController } from '../../controller/context/hooks/use-engraver-controller';
import { EngraverActionFactory } from '../../controller/interaction/action-handler/engraver-action-factory';
import { EngraverTickableCoordinates } from '../../controller/interaction/action-handler/types/engraver-coordinates';
import { EngraverStaveVoice } from '../../model/core/types/engraver-model.types';

export function useEngraverActions() {
  const controller = useEngraverController();

  return {
    click: {
      sheet: () => controller.dispatchAction(EngraverActionFactory.createSelectRemoveSelectionAction()),
      score: (basePitch: Pitch, coordinates: EngraverTickableCoordinates) =>
        controller.dispatchAction(EngraverActionFactory.createAddTickableAction(basePitch, coordinates)),
    },
    select: {
      duration: (d: BaseDuration) => controller.dispatchAction(EngraverActionFactory.createChangeDurationAction(d)),
      dotCount: (dot: DotCount) => controller.dispatchAction(EngraverActionFactory.createChangeDotCountAction(dot)),
      voice: (v: EngraverStaveVoice) => controller.dispatchAction(EngraverActionFactory.createChangeVoiceAction(v)),
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
