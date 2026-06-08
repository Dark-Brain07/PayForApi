import { useState, useEffect } from 'react';

export function useTheme(defaultTheme = 'light') {
  const [theme, setTheme] = useState(defaultTheme);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  return [theme, setTheme] as const;
}