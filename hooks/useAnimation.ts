import { useState, useEffect } from 'react';

export function useAnimation(duration = 500) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let start = performance.now();
    let frame = requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      setProgress(timeFraction);
      if (timeFraction < 1) frame = requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(frame);
  }, [duration]);
  return progress;
}