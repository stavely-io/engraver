import { Tickable } from "./abstract/tickable";
import { Duration } from "./duration";
export class Rest extends Tickable {
  constructor(duration: Duration) {
    super(duration);
  }
}
