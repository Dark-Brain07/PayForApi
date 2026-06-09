"use client";
import { useRef, useEffect } from "react";

/**
 * Returns the value from the previous render.
 * Useful for comparing old vs new props/state.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default usePrevious;
