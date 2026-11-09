import { Tickable } from "./abstract/tickable";
import { type Duration } from "./duration";
export class Rest extends Tickable {
  constructor(duration: Duration) {
    super(duration);
  }
}
