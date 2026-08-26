import { useRequiredContext } from '@/lib/hooks/use-required-context';

import { EngraverController } from '../../engraver-controller';
import { EngraverContext, EngraverContextMissingError } from '../engraver-context';

export function useEngraverController(): EngraverController {
  const { engraverController } = useRequiredContext(EngraverContext, new EngraverContextMissingError());
  return engraverController;
}
