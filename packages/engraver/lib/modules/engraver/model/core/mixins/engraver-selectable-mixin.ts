import { Constructor } from "../../../utils/mixin.js";
import { IDFactory } from "../factories/id-factory.js";
import { EngraverSelectable } from "../types/engraver-model.types.js";

export function EngraverSelectableMixin<TBase extends Constructor>(
  Base: TBase,
) {
  return class extends Base implements EngraverSelectable {
    public readonly id: number = IDFactory.create();
  };
}
