import { useEffect, useRef } from 'react';
import { subscribeScroll } from '@/lib/scrollDriver';

// Subscribes a callback to the shared scroll driver (see lib/scrollDriver.js)
// without re-subscribing on every render.
export function useScrollDriver(callback) {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  useEffect(() => subscribeScroll((y) => cbRef.current(y)), []);
}
