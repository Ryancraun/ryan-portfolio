import { useRef } from 'react';
import { useScrollDriver } from './useScrollDriver';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// The hero's own scroll-linked "wow" layer, independent of whatever
// background sits behind it: as the user scrolls through the hero's own
// height, the heading/eyebrow/line drift up and fade out on transform +
// opacity only (never a layout property), matching the hard constraint's
// "real, scroll-linked... not decorative entrance animation" bar.
export function useHeroDrift() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useScrollDriver((y) => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;
    if (reduced) {
      inner.style.transform = '';
      inner.style.opacity = '';
      return;
    }
    const h = section.offsetHeight || 1;
    const progress = Math.min(1, Math.max(0, y / h));
    inner.style.transform = `translateY(${progress * -60}px)`;
    inner.style.opacity = String(1 - progress * 1.15);
  });

  return { sectionRef, innerRef };
}
