import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [pointer, setPointer] = useState(0);
  const current = history[pointer];
  const set = useCallback((newState: T) => {
    setHistory(prev => [...prev.slice(0, pointer + 1), newState]);
    setPointer(prev => prev + 1);
  }, [pointer]);
  const undo = useCallback(() => setPointer(prev => Math.max(0, prev - 1)), []);
  const redo = useCallback(() => setPointer(prev => Math.min(history.length - 1, prev + 1)), [history.length]);
  return { state: current, set, undo, redo, history, pointer };
}