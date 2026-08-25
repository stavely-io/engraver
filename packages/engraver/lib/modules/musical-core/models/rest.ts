import { Tickable } from './abstract/tickable.js';
import { Duration } from './duration.js';

export class Rest extends Tickable {
  constructor(duration: Duration) {
    super(duration);
  }
}
