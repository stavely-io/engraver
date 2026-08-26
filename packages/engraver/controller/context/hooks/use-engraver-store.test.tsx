import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';

import { useEngraverStore } from './use-engraver-store';
import { EngraverContext } from '../engraver-context';

describe('useEngraverStore', () => {
  it('should throw EngraverContextMissingError when used outside of EngraverProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useEngraverStore())).toThrow('Missing EngraverContext.Provider in the tree');

    consoleSpy.mockRestore();
  });

  it('should return engraverStore from context', () => {
    const mockStore = { getState: vi.fn() } as any;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EngraverContext.Provider value={{ engraverController: {} as any, engraverStore: mockStore }}>
        {children}
      </EngraverContext.Provider>
    );

    const { result } = renderHook(() => useEngraverStore(), { wrapper });

    expect(result.current).toBe(mockStore);
  });
});
