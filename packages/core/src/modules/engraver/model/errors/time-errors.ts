import { MAX_DOT_MODIFIERS } from "@/modules/engraver/model/constants/limitations";

import { stringifyUnknown } from "./utils";

export class UnknownDurationValueError extends Error {
  constructor(value: unknown) {
    super(`UnknownDurationValue: ${stringifyUnknown(value)}`);
  }
}

export class UnknownDurationError extends Error {
  constructor(duration: unknown) {
    super(`UnknownDuration: ${stringifyUnknown(duration)}`);
  }
}

export class InvalidDotModifierError extends Error {
  constructor(dots: unknown) {
    super(
      `InvalidDotModifier: ${stringifyUnknown(dots)}. Must be between 0 and ${MAX_DOT_MODIFIERS}.`,
    );
  }
}
