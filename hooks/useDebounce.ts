import { useState, useEffect } from 'react';

/**
 * Delays the update of a value until a specified time has passed without further updates.
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 */
export const getDebounceDelay = (delay: number): NonNullable<number> => delay;

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, getDebounceDelay(delay));
    return (): void => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}