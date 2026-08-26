import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DisabledOverlay } from './disabled-overlay';

describe('DisabledOverlay', () => {
  it('should render', () => {
    render(<DisabledOverlay data-testid='overlay' />);
    expect(screen.getByTestId('overlay')).toBeDefined();
  });

  it('should apply custom className', () => {
    render(<DisabledOverlay data-testid='overlay' className='custom-class' />);
    expect(screen.getByTestId('overlay').className).toContain('custom-class');
  });
});
