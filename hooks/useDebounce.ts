import { useState, useEffect } from 'react';

/**
 * Custom React hook that delays updating a value until a specified delay has elapsed.
 * Useful for rate-limiting expensive side-effects like auto-search API queries.
 * @template T - The generic type of the target debounced value
 * @param {T} value - The dynamic state value to debounce
 * @param {number} delay - The delay interval duration in milliseconds
 * @returns {T} The debounced value matching the input state after delay
 */
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