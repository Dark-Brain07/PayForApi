import { useState, useRef, useEffect } from 'react';

export function useHover<T extends HTMLElement>() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const enter = () => setIsHovered(true);
    const leave = () => setIsHovered(false);
    node.addEventListener('mouseenter', enter);
    node.addEventListener('mouseleave', leave);
    return () => {
      node.removeEventListener('mouseenter', enter);
      node.removeEventListener('mouseleave', leave);
    };
  }, []);
  return [ref, isHovered] as const;
}