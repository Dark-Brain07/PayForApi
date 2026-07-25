"use client";
import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        try {
          savedCallback.current();
        } catch (e) {
          console.warn("useInterval callback execution error:", e);
        }
      }, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}