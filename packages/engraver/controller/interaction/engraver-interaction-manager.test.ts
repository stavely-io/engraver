import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EngraverInteractionManager } from './engraver-interaction-manager';

vi.mock('./action-handler/engraver-action-handler', () => ({
  EngraverActionHandler: vi.fn().mockImplementation(() => ({
    handle: vi.fn(),
  })),
}));

vi.mock('./event-registry/engraver-event-registry', () => ({
  EngraverEventRegistry: vi.fn().mockImplementation(() => ({
    registerEngraverFocusClick: vi.fn(),
    deregisterEngraverFocusClick: vi.fn(),
    registerKeyboard: vi.fn(),
    deregisterKeyboard: vi.fn(),
    registerSVGOverlayClick: vi.fn(),
  })),
}));

vi.mock('./overlay/engraver-overlay-manager', () => ({
  EngraverOverlayManager: vi.fn().mockImplementation(() => ({
    refreshOverlay: vi.fn(),
    onScoreMount: vi.fn(),
    onScoreUnmount: vi.fn(),
    onOverlayMount: vi.fn(),
    onOverlayMouseEnter: vi.fn(),
    onOverlayMouseExit: vi.fn(),
  })),
}));

describe('EngraverInteractionManager', () => {
  let mockScore: any;
  let mockStore: any;
  let mockRenderingService: any;
  let mockPlayer: any;
  let mockThemeManager: any;
  let manager: EngraverInteractionManager;

  beforeEach(() => {
    vi.clearAllMocks();
    mockScore = {};
    mockStore = {};
    mockRenderingService = {};
    mockPlayer = {};
    mockThemeManager = {};
    manager = new EngraverInteractionManager(
      mockScore,
      mockStore,
      vi.fn(),
      mockRenderingService,
      mockPlayer,
      mockThemeManager,
    );
  });

  it('should handle engraver action via action handler', () => {
    const action = { type: 'MOCK' } as any;
    manager.handleEngraverAction(action);
    const handler = (manager as any).actionHandler;
    expect(handler.handle).toHaveBeenCalledWith(action);
  });

  it('should register events on component mount', () => {
    const mockElement = document.createElement('div');
    manager.onComponentMount(mockElement);

    const registry = (manager as any).eventRegistry;
    expect(registry.registerEngraverFocusClick).toHaveBeenCalled();
    expect(registry.registerKeyboard).toHaveBeenCalled();
  });

  it('should deregister events on component unmount', () => {
    manager.onComponentUnmount();

    const registry = (manager as any).eventRegistry;
    expect(registry.deregisterEngraverFocusClick).toHaveBeenCalled();
    expect(registry.deregisterKeyboard).toHaveBeenCalled();
  });

  it('should delegate score mount to overlay manager', () => {
    const mockVFData = {} as any;
    manager.onScoreMount(mockVFData);
    const overlay = (manager as any).overlayManager;
    expect(overlay.onScoreMount).toHaveBeenCalledWith(mockVFData);
  });
});
