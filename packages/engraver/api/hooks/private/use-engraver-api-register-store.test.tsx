import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useEngraverPrivateAPIStore } from './use-engraver-api-register-store';
import { EngraverAPIContext } from '../../context/engraver-api';

describe('useEngraverPrivateAPIStore', () => {
  it('should return undefined if context is missing', () => {
    const { result } = renderHook(() => useEngraverPrivateAPIStore());
    expect(result.current).toBeUndefined();
  });

  it('should return store from context', () => {
    const mockStore = { getState: vi.fn() } as any;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EngraverAPIContext.Provider value={{ engraverAPIStore: mockStore }}>{children}</EngraverAPIContext.Provider>
    );

    const { result } = renderHook(() => useEngraverPrivateAPIStore(), { wrapper });
    expect(result.current).toBe(mockStore);
  });
});
