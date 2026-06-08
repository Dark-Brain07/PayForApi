import { useState, useEffect } from 'react';

export function useIdle(ms: number = 60000) {
  const [isIdle, setIsIdle] = useState(false);
  useEffect(() => {
    let timeout = setTimeout(() => setIsIdle(true), ms);
    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsIdle(true), ms);
    };
    const events = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];
    events.forEach(event => document.addEventListener(event, handleActivity));
    return () => {
      events.forEach(event => document.removeEventListener(event, handleActivity));
      clearTimeout(timeout);
    };
  }, [ms]);
  return isIdle;
}