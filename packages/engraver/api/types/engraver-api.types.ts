import { Tickable } from '@/lib/modules/musical-core/models/abstract/tickable';
import { Tie } from '@/lib/modules/musical-core/models/tie';

export type EngraverStaveData = Tickable[][][];

export type ScoreData = {
  staveData: EngraverStaveData[];
  ties?: Tie[];
};

export type EngraverAPIGet<T> = () => T;
