import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'zustand';

import { usePlayerAPIRegistration } from '../hooks/private/use-player-api-registration';
import { createPlayerStore } from '../store/player-store';
import { PlayerContext } from './player-context';
import { PlayerProvider } from './player-provider';
import { AudioContext as StandarizedAudioContext } from 'standardized-audio-context';
import { SmplrInstrumentType } from '../smplr';

// Mock dependencies
vi.mock('../hooks/private/use-player-api-registration');
vi.mock('../store/player-store');
vi.mock('standardized-audio-context');

const usePlayerAPIRegistrationMock = vi.mocked(usePlayerAPIRegistration);
const createPlayerStoreMock = vi.mocked(createPlayerStore);
const StandarizedAudioContextMock = vi.mocked(StandarizedAudioContext);

describe('PlayerProvider', () => {
  let mockPlayerStore: ReturnType<typeof createStore>;
  let mockSetState: ReturnType<typeof vi.fn>;
  let mockGetState: ReturnType<typeof vi.fn>;
  let mockChangeInstrument: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockChangeInstrument = vi.fn();
    mockGetState = vi.fn(() => ({
      changeInstrument: mockChangeInstrument,
    }));
    mockSetState = vi.fn();

    mockPlayerStore = {
      setState: mockSetState,
      getState: mockGetState,
      subscribe: vi.fn(),
      destroy: vi.fn(),
    } as unknown as ReturnType<typeof createStore>; // Cast to match StoreApi type

    // @ts-ignore
    createPlayerStoreMock.mockReturnValue(mockPlayerStore);
    StandarizedAudioContextMock.mockImplementation(() => ({}) as unknown as StandarizedAudioContext);
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <PlayerProvider>
        <div>Test Child</div>
      </PlayerProvider>,
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should call createPlayerStore and usePlayerAPIRegistration', () => {
    render(
      <PlayerProvider>
        <div />
      </PlayerProvider>,
    );
    expect(createPlayerStoreMock).toHaveBeenCalledTimes(1);
    expect(usePlayerAPIRegistrationMock).toHaveBeenCalledWith(mockPlayerStore);
  });

  it('should initialize instrument on mount', () => {
    render(
      <PlayerProvider>
        <div />
      </PlayerProvider>,
    );

    expect(StandarizedAudioContextMock).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenCalledWith({ audioContext: {} }); // Mocked AudioContext
    expect(mockGetState).toHaveBeenCalled();
    expect(mockChangeInstrument).toHaveBeenCalledWith(SmplrInstrumentType.PIANO);
  });

  it('should provide the playerStore in the context', () => {
    let contextStore;
    const ConsumerComponent = () => {
      // @ts-ignore
      contextStore = PlayerContext._currentValue?.playerStore;
      return null;
    };

    render(
      <PlayerProvider>
        <ConsumerComponent />
      </PlayerProvider>,
    );

    expect(contextStore).toBe(mockPlayerStore);
  });
});
