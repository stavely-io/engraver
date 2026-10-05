import { useCallback, useState } from 'react';

import { useOnResize } from './use-on-resize';

type WindowDimensions = {
  width: number | undefined;
  height: number | undefined;
};

export function useWindowDimensions(): WindowDimensions {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: undefined,
    height: undefined,
  });

  function getWindowDimensions(): WindowDimensions {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
  }

  const handleDimensionChange = useCallback(() => {
    setWindowDimensions(getWindowDimensions());
  }, []);

  useOnResize(handleDimensionChange);

  return windowDimensions;
}
