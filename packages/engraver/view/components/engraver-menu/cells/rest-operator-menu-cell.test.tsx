import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StoreApi, create } from 'zustand';

import { EngraverStore } from '@/lib/modules/engraver/controller/store/engraver-store';

import { useEngraverActions } from '../../../hooks/use-engraver-actions';
import { useEngraverMenuState } from '../../../hooks/use-engraver-menu-state';
import { EngraverMenuButton } from '../common/engraver-menu-button';
import { RestOperatorMenuCell } from './rest-operator-menu-cell';

vi.mock('../common/engraver-menu-button', () => ({
  EngraverMenuButton: vi.fn(({ children, onClick, selected }) => (
    <button onClick={onClick} data-selected={selected}>
      {children}
    </button>
  )),
}));
vi.mock('../../../hooks/use-engraver-actions');
vi.mock('../../../hooks/use-engraver-menu-state');

let mockEngraverStore: StoreApi<EngraverStore>;
vi.mock('@/lib/modules/engraver/controller/context/hooks/use-engraver-store', () => ({
  useEngraverStore: vi.fn(() => mockEngraverStore),
}));

const mockedUseEngraverActions = vi.mocked(useEngraverActions);
const mockedUseEngraverMenuState = vi.mocked(useEngraverMenuState);
const EngraverMenuButtonMock = vi.mocked(EngraverMenuButton);

const mockToggleActions = {
  restInput: vi.fn(),
};

describe('RestOperatorMenuCell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseEngraverActions.mockReturnValue({
      toggle: mockToggleActions,
    } as any);
  });

  it('renders null if rest is not available', () => {
    mockEngraverStore = create<EngraverStore>(() => ({ isRestAvailable: false }) as any);
    mockedUseEngraverMenuState.mockReturnValue({ isRestInput: false } as unknown as ReturnType<
      typeof useEngraverMenuState
    >);
    const { container } = render(<RestOperatorMenuCell />);
    expect(container.firstChild).toBeNull();
  });

  describe('when rest is available', () => {
    beforeEach(() => {
      mockEngraverStore = create<EngraverStore>(() => ({ isRestAvailable: true }) as any);
    });

    it('renders the rest operator button', () => {
      mockedUseEngraverMenuState.mockReturnValue({ isRestInput: false } as unknown as ReturnType<
        typeof useEngraverMenuState
      >);
      render(<RestOperatorMenuCell />);
      expect(screen.getByTestId('rest-operator')).toBeInTheDocument();
      expect(EngraverMenuButtonMock).toHaveBeenCalled();
    });

    it('calls toggle.restInput on button click', () => {
      mockedUseEngraverMenuState.mockReturnValue({ isRestInput: false } as unknown as ReturnType<
        typeof useEngraverMenuState
      >);
      render(<RestOperatorMenuCell />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockToggleActions.restInput).toHaveBeenCalled();
    });

    it('passes the correct "selected" prop when rest input is active', () => {
      mockedUseEngraverMenuState.mockReturnValue({ isRestInput: true } as unknown as ReturnType<
        typeof useEngraverMenuState
      >);
      render(<RestOperatorMenuCell />);
      expect(screen.getByRole('button').dataset.selected).toBe('true');
    });

    it('passes the correct "selected" prop when rest input is not active', () => {
      mockedUseEngraverMenuState.mockReturnValue({ isRestInput: false } as unknown as ReturnType<
        typeof useEngraverMenuState
      >);
      render(<RestOperatorMenuCell />);
      expect(screen.getByRole('button').dataset.selected).toBe('false');
    });
  });
});
