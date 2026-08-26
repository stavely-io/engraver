'use client';
import { FC, useEffect, useRef } from 'react';

import { useEngraverController } from '@/lib/modules/engraver/controller/context/hooks/use-engraver-controller';

import { useEngraverMenuState } from '../../../hooks/use-engraver-menu-state';
import EngraverOverlay from './overlay/engraver-overlay';

const EngraverScore: FC = () => {
  const engraverScoreRef = useRef<HTMLDivElement>(null);

  const engraverController = useEngraverController();

  useEffect(() => {
    if (!engraverScoreRef.current) return;
    engraverController.onScoreMount(engraverScoreRef.current);
    return () => engraverController.onScoreUnmount();
  }, [engraverController, engraverScoreRef]);

  const { isEditable } = useEngraverMenuState();

  return (
    <div className='relative flex w-[90%] items-center justify-center'>
      <div ref={engraverScoreRef} id='engraver' className='h-full w-full bg-inherit' />
      {isEditable && <EngraverOverlay />}
    </div>
  );
};

export default EngraverScore;
