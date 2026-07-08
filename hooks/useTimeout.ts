/**
 * useTimeout Hook
 * React hook for declarative timeouts.
 */
"use client";
import { useEffect, useRef } from 'react';

/** Custom hook for handling timeouts in functional components */
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => savedCallback.current(), delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
}