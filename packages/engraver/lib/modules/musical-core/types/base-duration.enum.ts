import { enumValues } from '../../../utils/enum';

export enum BaseDuration {
  WHOLE = 'w',
  HALF = 'h',
  QUARTER = 'q',
  EIGHTH = '8',
  SIXTEENTH = '16',
}

export const DEFAULT_BASE_DURATIONS: BaseDuration[] = enumValues(BaseDuration);
