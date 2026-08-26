import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';

import { useEngraverController } from './use-engraver-controller';
import { EngraverContext } from '../engraver-context';

describe('useEngraverController', () => {
  it('should throw EngraverContextMissingError when used outside of EngraverProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useEngraverController())).toThrow('Missing EngraverContext.Provider in the tree');

    consoleSpy.mockRestore();
  });

  it('should return engraverController from context', () => {
    const mockController = { id: 'mock-controller' } as any;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EngraverContext.Provider value={{ engraverController: mockController, engraverStore: {} as any }}>
        {children}
      </EngraverContext.Provider>
    );

    const { result } = renderHook(() => useEngraverController(), { wrapper });

    expect(result.current).toBe(mockController);
  });
});
