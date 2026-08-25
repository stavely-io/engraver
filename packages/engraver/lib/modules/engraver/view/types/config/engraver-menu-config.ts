import { Accidental } from "@/lib/modules/musical-core/types/accidental.enum";
import { BaseDuration } from "@/lib/modules/musical-core/types/base-duration.enum";
import { DotCount } from "@/lib/modules/musical-core/types/dot-count.enum";
import { EngraverViewMode } from "../engraver-mode.types.js";

/**
 * Configuration options for the Engraver menu component.
 *
 * @interface EngraverMenuConfig
 * @member {EngraverMenuDurationsConfig} [visibleDurations] - Configuration for visible note durations in the menu.
 * @member {EngraverMenuDotsConfig} [visibleDots] - Configuration for visible augmentation dots in the menu.
 * @member {boolean} [visibleRest] - Enables or disables the rest option.
 * @member {boolean} [visibleMultipleVoices] - Enables or disables support for multiple voices.
 * @member {boolean} [visibleTie] - Enables or disables the tie option.
 * @member {boolean} [visibleTuplet] - Enables or disables the tuplet option.
 * @member {EngraverMenuAccidentalConfig} [visibleAccidentals] - Configuration for visible accidentals in the menu.
 * @member {boolean} [playable] - Enables or disables playback functionality.
 */
export interface EngraverMenuConfig {
  initialViewMode?: EngraverViewMode;
  visibleDurations?: EngraverMenuDurationsConfig;
  visibleDots?: EngraverMenuDotsConfig;
  visibleRest?: boolean;
  visibleMultipleVoices?: boolean;
  visibleTie?: boolean;
  visibleTuplet?: boolean;
  visibleAccidentals?: EngraverMenuAccidentalConfig;
  playable?: boolean;
}

export interface EngraverMenuButtonProps {
  visible?: boolean;
}

/**
 * Configuration options for displaying accidentals in the engraver menu.
 *
 * @interface EngraverMenuAccidentalConfig
 * @member {Accidental[]} [accidentals] - Optional array specifying which accidentals are available in the menu.
 */
export interface EngraverMenuAccidentalConfig extends EngraverMenuButtonProps {
  accidentals?: Accidental[];
}

/**
 * Configuration options for the Engraver menu notes.
 *
 * @interface EngraverMenuDurationsConfig
 * @member {Duration[]} [durations] Optional array of note durations to display in the menu.
 */
export interface EngraverMenuDurationsConfig extends EngraverMenuButtonProps {
  durations?: BaseDuration[];
}

/**
 * Configuration options for displaying dots (augmentation dots) in the engraver menu.
 *
 * @interface EngraverMenuDotsConfig
 * @member {DotCount[]} [dotCounts] - Optional array specifying which dot counts are available in the menu.
 */
export interface EngraverMenuDotsConfig extends EngraverMenuButtonProps {
  dotCounts?: DotCount[];
}
