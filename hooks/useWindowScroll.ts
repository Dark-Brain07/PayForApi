import { useState, useEffect } from 'react';

export function useWindowScroll() {
  const [state, setState] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = () => setState({ x: window.scrollX, y: window.scrollY });
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return state;
}