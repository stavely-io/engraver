import { useEffect } from 'react';

export function useOnResize(fn: () => void): void {
  useEffect(() => {
    window.addEventListener('resize', fn);
    fn();

    return () => {
      window.removeEventListener('resize', fn);
    };
  }, [fn]);
}
