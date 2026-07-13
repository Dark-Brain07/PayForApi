"use client";
import { useEffect, RefObject } from "react";

/**
 * Fires handler when a click or touch happens outside the given element.
 * Useful for closing dropdowns, modals, tooltips.
 * @param ref - Reference to the target DOM element
 * @param handler - Callback fired on outside click
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
): void {
  useEffect(() => {
    /** Internal listener for mouse and touch events */
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

/** Default export for useClickOutside */
export default useClickOutside;
