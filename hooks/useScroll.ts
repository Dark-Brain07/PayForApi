"use client";
import { useState, useEffect } from "react";

interface ScrollState {
  /** Current horizontal scroll position in pixels */
  scrollX: number;
  scrollY: number;
  direction: "up" | "down" | null;
  isAtTop: boolean;
  isAtBottom: boolean;
}

/**
 * Tracks window scroll position, direction, and boundary state.
 */
export function useScroll(): ScrollState {
  const [scroll, setScroll] = useState<ScrollState>({
    scrollX: 0,
    scrollY: 0,
    direction: null,
    isAtTop: true,
    isAtBottom: false,
  });

  useEffect(() => {
    let lastY = window.scrollY;

    const handler = () => {
      const y = window.scrollY;
      const x = window.scrollX;
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      setScroll({
        scrollX: x,
        scrollY: y,
        direction: y > lastY ? "down" : y < lastY ? "up" : null,
        isAtTop: y <= 0,
        isAtBottom: y >= maxY - 2,
      });
      lastY = y;
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler(); // init
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return scroll;
}

export default useScroll;
