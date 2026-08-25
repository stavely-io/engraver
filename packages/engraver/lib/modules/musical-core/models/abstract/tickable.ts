import { Fraction } from "@stavely-io/vexflow";

import { Duration } from "../duration.js";

export abstract class Tickable {
  private readonly _duration: Duration;
  constructor(duration: Duration) {
    this._duration = duration;
  }

  public get duration(): Duration {
    return this._duration;
  }

  public get value(): Fraction {
    return this.duration.toFractionValue();
  }
}
