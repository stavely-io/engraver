import { render, screen } from '@testing-library/react';
import { FC, useContext } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StoreApi, create } from 'zustand';

import { EngraverStore } from '@/lib/modules/engraver/controller/store/engraver-store';

import { SystemContext } from '../contexts/container-contexts';
import EngraverStaveOverlay from './engraver-stave-overlay';
import EngraverSystemOverlay from './engraver-system-overlay';

let mockEngraverStore: StoreApi<EngraverStore>;
vi.mock('@/lib/modules/engraver/controller/context/hooks/use-engraver-store', () => ({
  useEngraverStore: vi.fn(() => mockEngraverStore),
}));
const ContextSpy: FC = () => {
  const { systemIndex } = useContext(SystemContext);
  return <div data-testid='context-spy' data-system-index={systemIndex} />;
};

vi.mock('./engraver-stave-overlay', () => ({
  default: vi.fn(({ staveIndex }) => (
    <div data-testid='mock-stave-overlay' data-stave-index={staveIndex}>
      <ContextSpy />
    </div>
  )),
}));

const EngraverStaveOverlayMock = vi.mocked<FC<any>>(EngraverStaveOverlay);

describe('EngraverSystemOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEngraverStore = create<EngraverStore>(() => ({ staveCount: 0 }) as unknown as EngraverStore);
  });

  it('renders the main container', () => {
    render(<EngraverSystemOverlay systemIndex={0} />);
    expect(screen.getByTestId('engraver-system-overlay')).toBeInTheDocument();
  });

  it('renders zero stave overlays when staveCount is 0', () => {
    render(<EngraverSystemOverlay systemIndex={0} />);
    expect(screen.queryByTestId('mock-stave-overlay')).not.toBeInTheDocument();
  });

  it('renders the correct number of stave overlays based on staveCount', () => {
    mockEngraverStore.setState({ staveCount: 3 });
    render(<EngraverSystemOverlay systemIndex={0} />);
    expect(screen.getAllByTestId('mock-stave-overlay')).toHaveLength(3);
  });

  it('passes the correct staveIndex prop to each EngraverStaveOverlay', () => {
    mockEngraverStore.setState({ staveCount: 2 });
    render(<EngraverSystemOverlay systemIndex={0} />);
    const mockCalls = EngraverStaveOverlayMock.mock.calls;
    expect(mockCalls[0][0].staveIndex).toBe(0);
    expect(mockCalls[1][0].staveIndex).toBe(1);
  });

  it('provides the correct systemIndex to the SystemContext', () => {
    const systemIndex = 5;
    mockEngraverStore.setState({ staveCount: 1 });
    render(<EngraverSystemOverlay systemIndex={systemIndex} />);
    const spy = screen.getByTestId('context-spy');
    expect(spy.getAttribute('data-system-index')).toBe(String(systemIndex));
  });
});
