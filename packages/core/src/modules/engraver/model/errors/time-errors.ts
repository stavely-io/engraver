import { MAX_DOT_MODIFIERS } from "@/modules/engraver/model/constants/limitations";

export class UnknownDurationValueError extends Error {
  constructor(value: unknown) {
    super(`UnknownDurationValue: ${value}`);
  }
}

export class UnknownDurationError extends Error {
  constructor(duration: unknown) {
    super(`UnknownDuration: ${duration}`);
  }
}

export class InvalidDotModifierError extends Error {
  constructor(dots: unknown) {
    super(`InvalidDotModifier: ${dots}. Must be between 0 and ${MAX_DOT_MODIFIERS}.`);
  }
}
