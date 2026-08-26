import { describe, it, expect } from 'vitest';
import { PlayerContext, PlayerContextMissingError } from './player-context';

describe('PlayerContextMissingError', () => {
  it('should be an instance of Error', () => {
    const error = new PlayerContextMissingError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct message', () => {
    const error = new PlayerContextMissingError();
    expect(error.message).toBe('Missing PlayerContext.Provider in the tree');
  });

  it('should have the correct name', () => {
    const error = new PlayerContextMissingError();
    expect(error.name).toBe('Error');
  });
});

describe('PlayerContext', () => {
  it('should be created with a default value of null', () => {
    expect(PlayerContext).toBeDefined();
    expect(PlayerContext._currentValue).toBeNull();
  });
});
