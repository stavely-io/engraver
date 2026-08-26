import { beforeEach, describe, expect, it } from 'vitest';
import { EngraverFocusManager } from './engraver-focus-manager';

describe('EngraverFocusManager', () => {
  let focusManager: EngraverFocusManager;

  beforeEach(() => {
    focusManager = new EngraverFocusManager();
  });

  it('should throw error when checking focus if not bound', () => {
    expect(() => focusManager.isEngraverFocused).toThrow('engraverWrapper must be bind to EngraverFocusManager');
  });

  it('should return true when the bound wrapper is the active element', () => {
    const wrapper = document.createElement('div');
    wrapper.tabIndex = 0;
    document.body.appendChild(wrapper);
    wrapper.focus();

    focusManager.bind(wrapper);
    expect(focusManager.isEngraverFocused).toBe(true);
    expect(focusManager.engraverWrapper).toBe(wrapper);

    document.body.removeChild(wrapper);
  });

  it('should return false when the bound wrapper is NOT the active element', () => {
    const wrapper = document.createElement('div');
    const other = document.createElement('div');
    other.tabIndex = 0;
    document.body.appendChild(wrapper);
    document.body.appendChild(other);
    other.focus();

    focusManager.bind(wrapper);
    expect(focusManager.isEngraverFocused).toBe(false);

    document.body.removeChild(wrapper);
    document.body.removeChild(other);
  });

  it('should return null wrapper after unbind', () => {
    const wrapper = document.createElement('div');
    focusManager.bind(wrapper);
    focusManager.unBind();
    expect(focusManager.engraverWrapper).toBeNull();
  });
});
