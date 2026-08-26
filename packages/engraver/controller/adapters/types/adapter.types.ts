import { Args } from '@/lib/modules/engraver/model/types/misc.types';

export interface EngraverOneWayAdapter<InputType, OutputType> {
  adapt(input: InputType, ...args: Args): OutputType;
}

export interface EngraverTwoWayAdapter<InputType, OutputType> extends EngraverOneWayAdapter<InputType, OutputType> {
  restore(adaptedData: OutputType, ...args: Args): InputType;
}

export type EngraverAdapter<InputType, OutputType> =
  | EngraverOneWayAdapter<InputType, OutputType>
  | EngraverTwoWayAdapter<InputType, OutputType>;
