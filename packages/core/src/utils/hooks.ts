import { useEffect, useState } from 'react';

type WindowDimensions = {
  width: number | undefined;
  height: number | undefined;
};

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function getWindowDimensions(): WindowDimensions {
      const { innerWidth: width, innerHeight: height } = window;
      return { width, height };
    }

    setWindowDimensions(getWindowDimensions());

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
