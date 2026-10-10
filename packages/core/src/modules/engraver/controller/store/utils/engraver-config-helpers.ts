import { onlyUnique } from "@/utils/array";

import { Duration } from "../../../../musical-core/models/duration";
import {
  Accidental,
  DEFAULT_ACCIDENTAL_TYPES,
} from "../../../../musical-core/types/accidental.enum";
import {
  BaseDuration,
  DEFAULT_BASE_DURATIONS,
} from "../../../../musical-core/types/base-duration.enum";
import { DEFAULT_DOT_COUNTS } from "../../../../musical-core/types/dot-count.enum";
import type {
  EngraverMenuAccidentalConfig,
  EngraverMenuDotsConfig,
  EngraverMenuDurationsConfig,
} from "../../../view/types/config/engraver-menu-config";

export function createDurationsState(config?: EngraverMenuDurationsConfig): BaseDuration[] {
  return createState(
    config?.durations,
    DEFAULT_BASE_DURATIONS,
    (a, b) => new Duration(b).toFractionValue().value() - new Duration(a).toFractionValue().value(),
  );
}

export function createInitialSelectedDurationState(
  config?: EngraverMenuDurationsConfig,
): BaseDuration {
  if (!config || !config.durations) {
    return BaseDuration.QUARTER;
  }

  const hasQuarterNote = config?.durations?.includes(BaseDuration.QUARTER);

  if (hasQuarterNote) {
    return BaseDuration.QUARTER;
  }

  const durations = createDurationsState(config);
  return durations.length > 0 ? durations[0] : BaseDuration.QUARTER;
}

export function createAccidentalState(config?: EngraverMenuAccidentalConfig): Accidental[] {
  return createState(
    config?.accidentals,
    DEFAULT_ACCIDENTAL_TYPES,
    (a, b) => DEFAULT_ACCIDENTAL_TYPES.indexOf(a) - DEFAULT_ACCIDENTAL_TYPES.indexOf(b),
  );
}

export function createDotCountState(config?: EngraverMenuDotsConfig) {
  return createState(
    config?.dotCounts,
    DEFAULT_DOT_COUNTS,
    (a, b) => DEFAULT_DOT_COUNTS.indexOf(a) - DEFAULT_DOT_COUNTS.indexOf(b),
  );
}

export function createState<T>(
  configValues: T[] | undefined,
  defaultValues: T[],
  sortFn?: (a: T, b: T) => number,
): T[] {
  const values = configValues ?? defaultValues;
  const unique = values.filter(onlyUnique);
  return sortFn ? unique.sort(sortFn) : unique;
}
