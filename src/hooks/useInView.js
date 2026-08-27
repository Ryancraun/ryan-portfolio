import { useEffect, useRef, useState } from 'react';

// IntersectionObserver-gated visibility. Used to mount/unmount the live
// reactbits.dev canvas/WebGL backgrounds only while their card or section is
// actually on screen (or about to be), so a page with 6 simultaneous
// animated backgrounds never actually runs 6 at once on a real device.
export function useInView({ rootMargin = '200px 0px', once = false } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once]);

  return [ref, inView];
}
