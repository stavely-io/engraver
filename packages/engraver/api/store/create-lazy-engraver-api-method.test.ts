import { describe, expect, it } from 'vitest';
import { createLazyEngraverAPIMethod } from './create-lazy-engraver-api-method';

describe('createLazyEngraverAPIMethod', () => {
  it('should throw an error when called', () => {
    expect(() => createLazyEngraverAPIMethod()).toThrow(
      '[EngraverAPIProvider] Attempted to call an Engraver API method before initialization.',
    );
  });
});
