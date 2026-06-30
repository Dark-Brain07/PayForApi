import { useRef, useEffect, useCallback } from 'react';

/**
 * Returns a callback that safely checks if the component is still mounted.
 * Useful for preventing state updates on unmounted components after async operations.
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return useCallback(() => isMounted.current, []);
}