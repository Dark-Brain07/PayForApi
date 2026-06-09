"use client";
import { useState, useRef, useEffect, RefObject } from "react";

/**
 * Tracks whether an element is currently focused.
 * Returns [ref, isFocused].
 */
export function useFocus<T extends HTMLElement>(): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onFocus = () => setFocused(true);
    const onBlur  = () => setFocused(false);
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    return () => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    };
  }, []);

  return [ref, focused];
}

export default useFocus;
