import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Engraver from './engraver';
import { EngraverConfig } from './types/config/engraver-config';
import { EngraverThemeType } from '../controller/theme/theme.types';

vi.mock('../../player', () => ({
  PlayerProvider: vi.fn(({ children }) =>
    React.createElement('div', { 'data-testid': 'mock-player-provider' }, children),
  ),
}));

vi.mock('../controller/context/engraver-provider', () => ({
  EngraverProvider: vi.fn(({ children, config, theme, engraverWrapperRef }) =>
    React.createElement(
      'div',
      {
        'data-testid': 'mock-engraver-provider',
        'data-config': JSON.stringify(config),
        'data-theme': theme,
        ref: engraverWrapperRef,
      },
      children,
    ),
  ),
}));

vi.mock('./components/engraver-menu/engraver-menu', () => ({
  EngraverMenu: vi.fn(({ isDisabled }) =>
    React.createElement('div', { 'data-testid': 'mock-engraver-menu', 'data-is-disabled': isDisabled }),
  ),
}));

vi.mock('./components/engraver-sheet/engraver-sheet', () => ({
  EngraverSheet: vi.fn(({ isDisabled }) =>
    React.createElement('div', { 'data-testid': 'mock-engraver-sheet', 'data-is-disabled': isDisabled }),
  ),
}));

describe('Engraver', () => {
  const mockConfig: EngraverConfig = {
    engraverUIConfig: { isMenuDisabled: true, isSheetDisabled: false },
    engraverScoreConfig: {
      scoreTemplate: {
        measureCount: 0,
        staveConfigs: [],
      },
    },
  };
  const mockTheme = EngraverThemeType.LIGHT;

  it('should render PlayerProvider, EngraverProvider, EngraverMenu, and EngraverSheet', () => {
    render(<Engraver config={mockConfig} theme={mockTheme} />);

    expect(screen.getByTestId('mock-player-provider')).toBeInTheDocument();
    expect(screen.getByTestId('mock-engraver-provider')).toBeInTheDocument();
    expect(screen.getByTestId('mock-engraver-menu')).toBeInTheDocument();
    expect(screen.getByTestId('mock-engraver-sheet')).toBeInTheDocument();
  });

  it('should pass config and theme to EngraverProvider', () => {
    render(<Engraver config={mockConfig} theme={mockTheme} />);

    const engraverProvider = screen.getByTestId('mock-engraver-provider');
    expect(engraverProvider).toHaveAttribute('data-config', JSON.stringify(mockConfig));
    expect(engraverProvider).toHaveAttribute('data-theme', mockTheme);
  });

  it('should pass isDisabled prop to EngraverMenu based on config', () => {
    render(<Engraver config={mockConfig} theme={mockTheme} />);
    const engraverMenu = screen.getByTestId('mock-engraver-menu');
    expect(engraverMenu).toHaveAttribute('data-is-disabled', 'true');
  });

  it('should pass isDisabled prop to EngraverSheet based on config', () => {
    render(<Engraver config={mockConfig} theme={mockTheme} />);
    const engraverSheet = screen.getByTestId('mock-engraver-sheet');
    expect(engraverSheet).toHaveAttribute('data-is-disabled', 'false');
  });

  it('should correctly set tabIndex and className on the section element', () => {
    const { container } = render(<Engraver config={mockConfig} theme={mockTheme} />);
    const sectionElement = container.querySelector('section');
    expect(sectionElement).toHaveAttribute('tabindex', '-1');
    expect(sectionElement).toHaveClass('flex w-full flex-col gap-y-3');
  });
  it('should forward the engraverWrapperRef to the section element and EngraverProvider', () => {
    const { container } = render(<Engraver config={mockConfig} theme={mockTheme} />);

    const sectionElement = container.querySelector('section');
    expect(sectionElement).toBeInTheDocument();

    const engraverProvider = screen.getByTestId('mock-engraver-provider');

    expect(sectionElement).toBe(engraverProvider.firstChild);
  });
});
