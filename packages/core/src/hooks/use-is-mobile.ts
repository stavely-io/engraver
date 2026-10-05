import { useWindowDimensions } from './use-window-dimensions';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const { width } = useWindowDimensions();

  if (!width) return false;

  return width < MOBILE_BREAKPOINT;
}
