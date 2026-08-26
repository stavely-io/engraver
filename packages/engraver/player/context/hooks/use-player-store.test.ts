import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

import { useRequiredContext } from '@/lib/hooks/use-required-context';
import { PlayerContext, PlayerContextMissingError } from '../player-context';
import { usePlayerStore } from './use-player-store';

vi.mock('@/lib/hooks/use-required-context');

const useRequiredContextMock = vi.mocked(useRequiredContext);

describe('usePlayerStore', () => {
  it('should call useRequiredContext with the correct arguments', () => {
    const mockStore = { a: 1 };
    useRequiredContextMock.mockReturnValue({ playerStore: mockStore });

    renderHook(() => usePlayerStore());

    expect(useRequiredContextMock).toHaveBeenCalledTimes(1);
    const [context, error] = useRequiredContextMock.mock.calls[0];
    expect(context).toBe(PlayerContext);
    expect(error).toBeInstanceOf(PlayerContextMissingError);
  });

  it('should return the playerStore from the context', () => {
    const mockStore = { a: 1 };
    useRequiredContextMock.mockReturnValue({ playerStore: mockStore });

    const { result } = renderHook(() => usePlayerStore());

    expect(result.current).toBe(mockStore);
  });

  it('should throw an error if the context is not available', () => {
    const expectedError = new PlayerContextMissingError();
    useRequiredContextMock.mockImplementation(() => {
      throw expectedError;
    });

    expect(() => renderHook(() => usePlayerStore())).toThrow(expectedError);
  });
});
