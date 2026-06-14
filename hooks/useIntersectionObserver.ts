import { useEffect, useState, useRef, RefObject } from 'react';

/**
 * Tracks the intersection of an element with the viewport.
 * @param ref React ref object
 * @param options Intersection observer options
 */
export function useIntersectionObserver(ref: RefObject<Element>, options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [ref, options]);
  return isIntersecting;
}