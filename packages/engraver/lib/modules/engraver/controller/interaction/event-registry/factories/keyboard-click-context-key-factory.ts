import { KeyboardKey } from "../types/keyboard-keys.enum.js";

export class KeyboardClickContextKeyFactory {
  public static create(event: KeyboardEvent) {
    const {
      key: clickedKey,
      altKey: isAltClicked,
      ctrlKey: isCtrlClicked,
      shiftKey: isShiftClicked,
      metaKey: isMetaClicked,
    } = event;
    let mapKey = clickedKey;
    if (isAltClicked) mapKey += KeyboardKey.ALT;
    if (isCtrlClicked || isMetaClicked) mapKey += KeyboardKey.CTRL;
    if (isShiftClicked) mapKey += KeyboardKey.SHIFT;
    return mapKey;
  }
}
