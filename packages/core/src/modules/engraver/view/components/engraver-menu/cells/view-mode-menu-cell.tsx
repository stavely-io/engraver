import { MousePointer, Pencil } from 'lucide-react';
import { FC } from 'react';

import { useEngraverActions } from '../../../hooks/use-engraver-actions';
import { useEngraverMenuState } from '../../../hooks/use-engraver-menu-state';
import { EngraverMenuButton } from '../common/engraver-menu-button';
import { EngraverMenuCell } from '../common/engraver-menu-cell';

export const ViewModeMenuCell: FC = () => {
  const { isEditable } = useEngraverMenuState();
  const { toggle } = useEngraverActions();

  return (
    <EngraverMenuCell data-testid='view-mode-operator'>
      <EngraverMenuButton onClick={toggle.viewMode}>
        {isEditable ? <Pencil className='size-[24px]' /> : <MousePointer className='size-[24px]' />}
      </EngraverMenuButton>
    </EngraverMenuCell>
  );
};
