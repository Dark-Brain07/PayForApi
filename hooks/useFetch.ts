import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => { if (isMounted) setData(data); })
      .catch(err => { if (isMounted) setError(err); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [url]);
  return { data, error, loading };
}