import { BlockedManager } from "../../managers/blocked-manager";
import { SelectionManager } from "../../managers/selection-manager";
import type { EngraverActionMap } from "../../types/actions/engraver-action";
import type { EngraverActionExecutorContext } from "../types/engraver-action-executor-context";
import { EngraverNote } from "@/modules/engraver/model/elements/events/engraver-note";

export abstract class EngraverActionExecutor<T extends keyof EngraverActionMap> {
  public readonly selectionManager: SelectionManager;
  public readonly blockedManager: BlockedManager;
  constructor(protected readonly context: EngraverActionExecutorContext) {
    this.selectionManager = new SelectionManager(this.context);
    this.blockedManager = new BlockedManager(this.context);
  }

  public abstract execute(payload: EngraverActionMap[T]): void;

  public getNotBlockedNotes(): EngraverNote[] {
    return this.selectionManager.selectedSelectables.notes.filter((n) =>
      this.blockedManager.isNotBlocked(n),
    );
  }
}
