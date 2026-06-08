import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    const watcher = navigator.geolocation.watchPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => setError(err.message)
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);
  return { location, error };
}