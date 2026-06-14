import { useState, useCallback } from 'react';

/**
 * Provides a boolean state and a toggle function.
 * @param initialValue Initial boolean value (defaults to false)
 */
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}