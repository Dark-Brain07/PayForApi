import { useState, useEffect } from 'react';

export function useWindowScroll() {
  const [state, setState] = useState({ x: 0, y: 0, direction: 'none' });
  useEffect(() => {
    let lastY = window.scrollY;
    const handler = () => {
      const y = window.scrollY;
      const direction = y > lastY ? 'down' : y < lastY ? 'up' : 'none';
      lastY = y;
      setState({ x: window.scrollX, y, direction });
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return state;
}