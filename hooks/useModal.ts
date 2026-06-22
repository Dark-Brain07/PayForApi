"use client";
import { useState, useCallback, useEffect } from "react";

interface UseModalReturn {
  /** Whether the modal is currently open */
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Simple modal open/close state with optional ESC key support.
 */
export function useModal(initial = false, closeOnEsc = true): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initial);

  const open   = useCallback((): void => setIsOpen(true), []);
  const close  = useCallback((): void => setIsOpen(false), []);
  const toggle = useCallback((): void => setIsOpen((v) => !v), []);

  useEffect(() => {
    if (!closeOnEsc) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close, closeOnEsc]);

  return { isOpen, open, close, toggle };
}

export default useModal;
