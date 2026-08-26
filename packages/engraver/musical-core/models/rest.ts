import { RestDTO } from '@/lib/api/types/exercises/dto-model-types';

import { Tickable } from './abstract/tickable';
import { Duration } from './duration';

export class Rest extends Tickable {
  constructor(duration: Duration) {
    super(duration);
  }

  public static fromDTO(restDTO: RestDTO): Rest {
    const duration = Duration.fromDTO(restDTO.duration);
    return new Rest(duration);
  }
}
