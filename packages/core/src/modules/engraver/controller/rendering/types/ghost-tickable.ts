import { Duration } from "@/modules/musical-core/models/duration";
import { Accidental } from "@/modules/musical-core/types/accidental.enum";
import { DotCount } from "@/modules/musical-core/types/dot-count.enum";

import type { EngraverTickableCoordinates } from "../../interaction/action-handler/types/engraver-coordinates";
import type { VFMeasureData } from "./vf-data";

export type EngraverGhostStaveProps = {
  coordinates: EngraverTickableCoordinates;
  vfMeasureData: VFMeasureData;
  tickableOptions: GhostTickableOptions;
};

export type GhostTickableOptions = {
  duration: Duration;
  accidental: Accidental;
  dotCount: DotCount;
};
