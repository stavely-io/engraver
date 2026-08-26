import { describe, expect, it } from 'vitest';
import { EngraverThemeManager } from './engraver-theme-manager';
import { EngraverThemeType } from './theme.types';
import { EngraverThemeConfig } from '../../view/types/config/score/engraver-theme-config';

describe('EngraverThemeManager', () => {
  it('should initialize with provided theme', () => {
    const initial: EngraverThemeConfig = { scoreTheme: '#ff0000' };
    const manager = new EngraverThemeManager(initial);
    expect(manager.currentTheme).toEqual(initial);
  });

  it('should set theme by type', () => {
    const manager = new EngraverThemeManager();
    manager.setTheme(EngraverThemeType.LIGHT);
    expect(manager.currentTheme?.scoreTheme).toBe('#000000');

    manager.setTheme(EngraverThemeType.DARK);
    expect(manager.currentTheme?.scoreTheme).toBe('#FFFFFF');
  });

  it('should set theme by config object and merge', () => {
    const manager = new EngraverThemeManager({ scoreTheme: '#ff0000' });
    manager.setTheme({ selectionTheme: { firstVoice: '#0000ff', secondVoice: '#00ff00' } } as any);

    expect(manager.currentTheme?.scoreTheme).toBe('#ff0000');
    expect(manager.currentTheme?.selectionTheme?.firstVoice).toBe('#0000ff');
  });
});
