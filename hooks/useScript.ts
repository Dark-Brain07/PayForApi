"use client";
import { useState, useEffect } from 'react';

export function useScript(src: string) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(src ? 'loading' : 'idle');
  useEffect(() => {
    if (!src) {
      setStatus('idle');
      return;
    }
    let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-status', 'loading');
      document.body.appendChild(script);
      const setAttributeFromEvent = (event: Event) => {
        script.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error');
      };
      script.addEventListener('load', setAttributeFromEvent);
      script.addEventListener('error', setAttributeFromEvent);
    } else {
      setStatus(script.getAttribute('data-status') as 'idle' | 'loading' | 'ready' | 'error');
    }
    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === 'load' ? 'ready' : 'error');
      if (event.type === 'error' && script.parentNode) {
        script.remove();
      }
    };
    script.addEventListener('load', setStateFromEvent);
    script.addEventListener('error', setStateFromEvent);
    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent);
        script.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [src]);
  return status;
}