import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EngraverScorePresenter } from './engraver-score-presenter';

vi.mock('../adapters/vexflow-adapter/vexfow-adapter', () => ({
  VexflowAdapter: vi.fn().mockImplementation(() => ({
    adapt: vi.fn().mockReturnValue('vf-data'),
  })),
}));

describe('EngraverScorePresenter', () => {
  let mockRenderer: any;
  let mockThemeManager: any;
  let presenter: EngraverScorePresenter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRenderer = {
      clear: vi.fn(),
      render: vi.fn(),
      setScoreColor: vi.fn(),
      context: {},
      containerWidth: 1000,
    };
    mockThemeManager = { currentTheme: null };
    presenter = new EngraverScorePresenter(mockRenderer, mockThemeManager);
  });

  it('should clear renderer and render new data', () => {
    const mockScore = {} as any;
    const result = presenter.present(mockScore);

    expect(mockRenderer.clear).toHaveBeenCalled();
    expect(mockRenderer.setScoreColor).toHaveBeenCalledWith('rgb(255, 255, 255)');
    expect(mockRenderer.render).toHaveBeenCalledWith('vf-data');
    expect(result).toBe('vf-data');
  });

  it('should use theme from manager if available', () => {
    mockThemeManager.currentTheme = { scoreTheme: 'red', playableSelectablesTheme: new Map() };
    presenter.present({} as any);

    expect(mockRenderer.setScoreColor).toHaveBeenCalledWith('red');
  });
});
