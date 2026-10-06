export class EngraverFocusManager {
  private _engraverWrapper: HTMLElement | null = null;

  public get isEngraverFocused(): boolean {
    if (this._engraverWrapper === null)
      throw new Error("engraverWrapper must be bind to EngraverFocusManager");
    return this._engraverWrapper === document.activeElement;
  }

  public bind(engraverWrapper: HTMLElement): void {
    this._engraverWrapper = engraverWrapper;
  }

  public unBind(): void {
    this._engraverWrapper = null;
  }

  public get engraverWrapper(): HTMLElement | null {
    return this._engraverWrapper;
  }
}
