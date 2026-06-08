import { useState } from 'react';

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };
  return [copiedText, copy] as const;
}