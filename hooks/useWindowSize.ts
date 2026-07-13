import { useState, useEffect } from 'react';

/**
 * Returns the current window width and height.
 */
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window?.innerWidth ?? 0,
        height: window?.innerHeight ?? 0,
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
}

/** Default export for the useWindowSize hook */
export default useWindowSize;