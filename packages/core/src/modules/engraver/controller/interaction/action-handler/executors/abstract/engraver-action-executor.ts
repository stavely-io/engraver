import { BlockedManager } from "../../managers/blocked-manager";
import { SelectionManager } from "../../managers/selection-manager";
import { EngraverActionMap } from "../../types/actions/engraver-action";
import { EngraverActionExecutorContext } from "../types/engraver-action-executor-context";
import { EngraverNote } from "@/modules/engraver/model/elements/events/engraver-note";

export abstract class EngraverActionExecutor<T extends keyof EngraverActionMap> {
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
