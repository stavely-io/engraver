import { EngraverNote } from "@/lib/modules/engraver/model/elements/events/engraver-note";

import { BlockedManager } from "../../managers/blocked-manager.js";
import { SelectionManager } from "../../managers/selection-manager.js";
import { EngraverActionMap } from "../../types/actions/engraver-action.js";
import { EngraverActionExecutorContext } from "../types/engraver-action-executor-context.js";

export abstract class EngraverActionExecutor<
  T extends keyof EngraverActionMap,
> {
  public readonly selectionManager = new SelectionManager(this.context);
  public readonly blockedManager = new BlockedManager(this.context);
  constructor(protected readonly context: EngraverActionExecutorContext) {}

  public abstract execute(payload: EngraverActionMap[T]): void;

  public getNotBlockedNotes(): EngraverNote[] {
    return this.selectionManager.selectedSelectables.notes.filter((n) =>
      this.blockedManager.isNotBlocked(n),
    );
  }
}
