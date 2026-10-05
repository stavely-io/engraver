'use client';

import { FC, useRef } from 'react';

import { PlayerProvider } from '../../player';
import { EngraverProvider } from '../controller/context/engraver-provider';
import { EngraverThemeType } from '../controller/theme/theme.types';
import { EngraverMenu } from './components/engraver-menu/engraver-menu';
import { EngraverSheet } from './components/engraver-sheet/engraver-sheet';
import { EngraverConfig } from './types/config/engraver-config';

interface EngraverProps {
  config: EngraverConfig;
  theme?: EngraverThemeType;
}

const Engraver: FC<EngraverProps> = ({ config, theme }) => {
  const engraverWrapperRef = useRef<HTMLElement | null>(null);

  return (
    <PlayerProvider>
      <EngraverProvider config={config} theme={theme} engraverWrapperRef={engraverWrapperRef}>
        <section ref={engraverWrapperRef} tabIndex={-1} className='flex w-full flex-col gap-y-3'>
          <EngraverMenu isDisabled={config.engraverUIConfig?.isMenuDisabled} />
          <EngraverSheet isDisabled={config.engraverUIConfig?.isSheetDisabled} />
        </section>
      </EngraverProvider>
    </PlayerProvider>
  );
};

export default Engraver;
