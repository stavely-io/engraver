import { describe, expect, it } from 'vitest';
import { KeyboardClickContextKeyFactory } from './keyboard-click-context-key-factory';

describe('KeyboardClickContextKeyFactory', () => {
  it('should create key for simple key press', () => {
    const event = { key: 'a' } as KeyboardEvent;
    expect(KeyboardClickContextKeyFactory.create(event)).toBe('a');
  });

  it('should include Alt in the key', () => {
    const event = { key: 'a', altKey: true } as KeyboardEvent;
    expect(KeyboardClickContextKeyFactory.create(event)).toBe('aAlt');
  });

  it('should include Control in the key', () => {
    const event = { key: 'a', ctrlKey: true } as KeyboardEvent;
    expect(KeyboardClickContextKeyFactory.create(event)).toBe('aControl');
  });

  it('should include Control if metaKey is pressed', () => {
    const event = { key: 'a', metaKey: true } as KeyboardEvent;
    expect(KeyboardClickContextKeyFactory.create(event)).toBe('aControl');
  });

  it('should include Shift in the key', () => {
    const event = { key: 'a', shiftKey: true } as KeyboardEvent;
    expect(KeyboardClickContextKeyFactory.create(event)).toBe('aShift');
  });

  it('should handle multiple modifiers', () => {
    const event = { key: 'a', altKey: true, ctrlKey: true, shiftKey: true } as KeyboardEvent;
    expect(KeyboardClickContextKeyFactory.create(event)).toBe('aAltControlShift');
  });
});
