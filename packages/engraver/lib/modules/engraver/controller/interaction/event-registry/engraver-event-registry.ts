import { EngraverActionFactory } from "../action-handler/engraver-action-factory.js";
import { EngraverAction } from "../action-handler/types/actions/engraver-action.js";
import { EngraverFocusManager } from "../focus-manager/engraver-focus-manager.js";
import { EngraverOverlayElement } from "../overlay/types/engraver-overlay-element.js";
import { KeyboardClickContextKeyFactory } from "./factories/keyboard-click-context-key-factory.js";
import { ENGRAVER_KEYBOARD_BINDINGS } from "./types/keyboard-registry.types.js";

export class EngraverEventRegistry {
  private readonly engraverKeyboardListener: (e: KeyboardEvent) => void;
  private readonly engraverFocusClickListener: (e: MouseEvent) => void;

  constructor(
    private readonly dispatch: (action: EngraverAction) => void,
    private readonly _focusManager: EngraverFocusManager,
  ) {
    this.engraverKeyboardListener = (event: KeyboardEvent) => {
      if (this._focusManager.isEngraverFocused) event.preventDefault();
      const keyboardClickContextKey =
        KeyboardClickContextKeyFactory.create(event);
      const action = ENGRAVER_KEYBOARD_BINDINGS[keyboardClickContextKey];
      if (action) this.dispatch(action);
    };

    this.engraverFocusClickListener = (event: MouseEvent) => {
      const wrapper = this._focusManager.engraverWrapper;
      if (wrapper && !event.composedPath().includes(wrapper)) {
        this.dispatch(
          EngraverActionFactory.createSelectRemoveSelectionAction(),
        );
      }
    };
  }

  public registerEngraverFocusClick(): void {
    window.addEventListener("click", this.engraverFocusClickListener);
  }

  public deregisterEngraverFocusClick(): void {
    window.removeEventListener("click", this.engraverFocusClickListener);
  }

  public registerKeyboard(): void {
    window.addEventListener("keydown", this.engraverKeyboardListener);
  }

  public deregisterKeyboard(): void {
    window.removeEventListener("keydown", this.engraverKeyboardListener);
  }

  public registerSVGOverlayClick(elements: EngraverOverlayElement[]): void {
    elements.forEach(({ overlaySVG, engraverOverlayCoordinates }) => {
      overlaySVG.classList.add("cursor-pointer");
      overlaySVG.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation();
        if (event.ctrlKey || event.metaKey) {
          this.dispatch(
            EngraverActionFactory.createSelectAddTickableAction(
              engraverOverlayCoordinates,
            ),
          );
        } else {
          this.dispatch(
            EngraverActionFactory.createSelectChangeTickableAction(
              engraverOverlayCoordinates,
            ),
          );
        }
      });
    });
  }
}
