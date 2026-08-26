import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EngraverOverlayManager } from './engraver-overlay-manager';
import { EngraverOverlayMapper } from './static/engraver-overlay-mapper';
import { EngraverViewOverlayLayoutFactory } from './static/engraver-view-overlay-factory';
import { VFGhostTickableFactory } from '../../adapters/vexflow-adapter/factories/vf-ghost-tickable-factory';

vi.mock('./static/engraver-overlay-mapper', () => ({
  EngraverOverlayMapper: {
    map: vi.fn().mockReturnValue(new Map()),
  },
}));

vi.mock('./static/engraver-view-overlay-factory', () => ({
  EngraverViewOverlayLayoutFactory: {
    create: vi.fn().mockReturnValue({}),
  },
}));

vi.mock('../../adapters/vexflow-adapter/factories/vf-ghost-tickable-factory', () => ({
  VFGhostTickableFactory: {
    create: vi.fn(),
  },
}));

vi.mock('./observer/engraver-selection-highlighter', () => ({
  EngraverSelectionHighlighter: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
  })),
}));

describe('EngraverOverlayManager', () => {
  let mockScore: any;
  let mockStore: any;
  let mockRenderingService: any;
  let mockRegisterClick: any;
  let mockThemeManager: any;
  let manager: EngraverOverlayManager;

  beforeEach(() => {
    vi.clearAllMocks();
    mockScore = {};
    mockStore = {
      getState: vi.fn().mockReturnValue({ isEditable: () => false }),
      setState: vi.fn(),
    };
    mockRenderingService = {
      selectionOverlay: { updateRendererContext: vi.fn(), render: vi.fn() },
      ghostOverlay: { updateRendererContext: vi.fn(), clear: vi.fn(), render: vi.fn() },
    };
    mockRegisterClick = vi.fn();
    mockThemeManager = { currentTheme: {} };
    manager = new EngraverOverlayManager(
      mockScore,
      mockStore,
      mockRenderingService,
      mockRegisterClick,
      mockThemeManager,
    );
  });

  it('should refresh overlay and update store', () => {
    const mockVFData = { vfScoreCoreData: {}, scoreHeight: 100, scoreWidth: 200 } as any;
    manager.refreshOverlay(mockVFData);

    expect(EngraverOverlayMapper.map).toHaveBeenCalledWith(mockVFData.vfScoreCoreData, mockScore);
    expect(mockRenderingService.selectionOverlay.updateRendererContext).toHaveBeenCalledWith(100, 200);
    expect(mockStore.setState).toHaveBeenCalled();
    expect(mockRegisterClick).toHaveBeenCalled();
  });

  it('should start selection highlighter on score mount', () => {
    const mockVFData = { vfScoreCoreData: {}, scoreHeight: 100, scoreWidth: 200 } as any;
    manager.onScoreMount(mockVFData);

    const highlighter = (manager as any).selectionHighlighter;
    expect(highlighter.start).toHaveBeenCalled();
  });

  it('should render ghost note on overlay mouse enter if NOT blocked', () => {
    const mockPitch = {};
    const coords = { systemIndex: 0, staveIndex: 0, measureIndex: 0, tickableIndex: 0, voiceIndex: 0 };
    const mockVFData = {
      vfScoreCoreData: {
        systems: [
          {
            staves: [{ measuresData: [{}] }],
            globalMeasureIndices: [0],
          },
        ],
      },
      scoreHeight: 100,
      scoreWidth: 200,
    } as any;

    manager.refreshOverlay(mockVFData);

    mockScore.staves = [
      {
        isBlocked: false,
        measures: [
          {
            voices: [
              {
                tickables: [{ isBlocked: false, coordinates: {} }],
              },
            ],
          },
        ],
      },
    ];

    mockStore.getState.mockReturnValue({
      getSelectedNoteModifiers: () => ({}),
      isEditable: () => true,
    });

    manager.onOverlayMouseEnter(mockPitch as any, coords as any);

    expect(VFGhostTickableFactory.create).toHaveBeenCalled();
    expect(mockRenderingService.ghostOverlay.render).toHaveBeenCalled();
  });
});
