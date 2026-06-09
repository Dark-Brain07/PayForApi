"use client";
import { useState, useCallback } from "react";

export type ToastType = "info" | "success" | "error" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UseToastReturn {
  toasts: Toast[];
  add: (message: string, type?: ToastType) => void;
  remove: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

/**
 * Toast notification queue with auto-dismiss.
 * Use with a ToastContainer component to render the toasts.
 */
export function useToast(durationMs = 3500): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, durationMs);
    },
    [durationMs]
  );

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return {
    toasts,
    add,
    remove,
    success: useCallback((m: string) => add(m, "success"), [add]),
    error:   useCallback((m: string) => add(m, "error"),   [add]),
    warning: useCallback((m: string) => add(m, "warning"), [add]),
    info:    useCallback((m: string) => add(m, "info"),    [add]),
  };
}

export default useToast;
