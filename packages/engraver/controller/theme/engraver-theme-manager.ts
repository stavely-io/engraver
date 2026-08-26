import { EngraverThemeConfig } from '../../view/types/config/score/engraver-theme-config';
import { EngraverThemeType } from './theme.types';

export class EngraverThemeManager {
  private themeConfig: EngraverThemeConfig | undefined;
  private static readonly ENGRAVER_THEMES: Record<EngraverThemeType, EngraverThemeConfig> = {
    [EngraverThemeType.LIGHT]: {
      scoreTheme: '#000000',
    },
    [EngraverThemeType.DARK]: {
      scoreTheme: '#FFFFFF',
    },
  };

  constructor(initialTheme?: EngraverThemeConfig) {
    this.themeConfig = initialTheme;
  }

  public get currentTheme(): EngraverThemeConfig | undefined {
    return this.themeConfig;
  }

  public setTheme(theme: EngraverThemeType | EngraverThemeConfig) {
    if (typeof theme === 'object') {
      this.themeConfig = { scoreTheme: this.themeConfig?.scoreTheme, ...theme };
    } else {
      this.themeConfig = { ...this.themeConfig, ...EngraverThemeManager.ENGRAVER_THEMES[theme] };
    }
  }
}
