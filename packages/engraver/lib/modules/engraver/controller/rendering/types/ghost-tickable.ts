import { Duration } from "@/lib/modules/musical-core/models/duration";
import { EngraverTickableCoordinates } from "../../interaction/action-handler/types/engraver-coordinates.js";
import { VFMeasureData } from "./vf-data.js";
import { Accidental } from "@/lib/modules/musical-core/types/accidental.enum";
import { DotCount } from "@/lib/modules/musical-core/types/dot-count.enum";

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
