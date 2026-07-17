"use client";
import { useState, useEffect } from 'react';

/** 
 * Custom hook to manage light and dark themes and apply them to the document root.
 * @param defaultTheme - The initial theme to use
 */
export function useTheme(defaultTheme = 'light') {
  const [theme, setTheme] = useState<string>(defaultTheme);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  return [theme, setTheme] as const;
}