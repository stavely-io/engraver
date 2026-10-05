import { Constructor } from '../../../utils/mixin';
import { IDFactory } from '../factories/id-factory';
import { EngraverSelectable } from '../types/engraver-model.types';

export function EngraverSelectableMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements EngraverSelectable {
    public readonly id: number = IDFactory.create();
  };
}
