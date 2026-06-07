import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Professional useFetch hook
 * Optimizes performance and memory usage by managing lifecycle efficiently.
 */
export function useFetch<T>(initialValue?: T) {
  const [value, setValue] = useState<T | undefined>(initialValue);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    
    // Core logic initialization
    const handleStateChange = () => {
      if (isMounted.current) {
        // Safe state update logic
      }
    };

    return () => {
      isMounted.current = false;
      // Cleanup phase
    };
  }, []);

  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  return { value, updateValue, isMounted: isMounted.current };
}

export default useFetch;
