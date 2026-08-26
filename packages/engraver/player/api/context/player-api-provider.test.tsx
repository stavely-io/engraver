import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'zustand';

import { createPlayerAPIStore } from '../store/player-api-store';
import { PlayerAPIContext } from './player-api';
import { PlayerAPIProvider } from './player-api-provider';

// Mock dependencies
vi.mock('../store/player-api-store');

const createPlayerAPIStoreMock = vi.mocked(createPlayerAPIStore);

describe('PlayerAPIProvider', () => {
  let mockPlayerAPIStore: ReturnType<typeof createStore>;

  beforeEach(() => {
    mockPlayerAPIStore = {
      setState: vi.fn(),
      getState: vi.fn(),
      subscribe: vi.fn(),
      destroy: vi.fn(),
    } as unknown as ReturnType<typeof createStore>; // Cast to match StoreApi type
    // @ts-ignore
    createPlayerAPIStoreMock.mockReturnValue(mockPlayerAPIStore);
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <PlayerAPIProvider>
        <div>Test Child</div>
      </PlayerAPIProvider>,
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should call createPlayerAPIStore', () => {
    render(
      <PlayerAPIProvider>
        <div />
      </PlayerAPIProvider>,
    );
    expect(createPlayerAPIStoreMock).toHaveBeenCalledTimes(1);
  });

  it('should provide the playerAPIStore in the context', () => {
    let contextStore;
    const ConsumerComponent = () => {
      // @ts-ignore
      contextStore = PlayerAPIContext._currentValue?.playerAPIStore;
      return null;
    };

    render(
      <PlayerAPIProvider>
        <ConsumerComponent />
      </PlayerAPIProvider>,
    );

    expect(contextStore).toBe(mockPlayerAPIStore);
  });
});
