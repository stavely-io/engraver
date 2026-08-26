import { FC } from 'react';
import { useStore } from 'zustand';

import { useEngraverStore } from '@/lib/modules/engraver/controller/context/hooks/use-engraver-store';

import { SystemContext } from '../contexts/container-contexts';
import EngraverStaveOverlay from './engraver-stave-overlay';

interface EngraverSystemOverlayProps {
  systemIndex: number;
}

const EngraverSystemOverlay: FC<EngraverSystemOverlayProps> = ({ systemIndex }) => {
  const engraverStore = useEngraverStore();
  const staveCount = useStore(engraverStore, (state) => state.staveCount);

  return (
    <SystemContext.Provider value={{ systemIndex }}>
      <div data-testid='engraver-system-overlay'>
        {Array.from({ length: staveCount }, (_, index) => (
          <EngraverStaveOverlay key={index} staveIndex={index} />
        ))}
      </div>
    </SystemContext.Provider>
  );
};

export default EngraverSystemOverlay;
