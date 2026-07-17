import { useState } from 'react';

/** Hook to manage state synchronized with localStorage */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      try { return item ? (JSON.parse(item) as T) : initialValue; } catch { return initialValue; }
    } catch (error) {
      window.localStorage.removeItem(key);
      return initialValue;
    }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Silent catch
    }
  };
  return [storedValue, setValue] as const;
}