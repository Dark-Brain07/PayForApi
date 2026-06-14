import { useState, useEffect } from 'react';

const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];

export function useIdle(ms: number = 60000, events: string[] = defaultEvents) {
  const [isIdle, setIsIdle] = useState(false);
  useEffect(() => {
    let timeout = setTimeout(() => setIsIdle(true), ms);
    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsIdle(true), ms);
    };
    events.forEach(event => document.addEventListener(event, handleActivity));
    return () => {
      events.forEach(event => document.removeEventListener(event, handleActivity));
      clearTimeout(timeout);
    };
  }, [ms, events]);
  return isIdle;
}