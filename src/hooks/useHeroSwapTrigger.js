import { useRef, useState } from 'react';
import { useScrollDriver } from './useScrollDriver';

// Drives PixelSwap's `active` boolean for the hero (Addendum 5, point 20):
// "active = true once the hero has scrolled ~15-25% out of view; active =
// false if scrolled back above that point" -- reversible, not one-shot.
// Reuses the same shared rAF scroll driver useHeroDrift already rides
// (lib/scrollDriver.js) instead of adding a second scroll listener, and the
// same `y / section.offsetHeight` progress formula useHeroDrift.js already
// uses to mean "how far scrolled through the hero's own height" -- so
// "~20% out of view" and useHeroDrift's own progress value are the same
// number, not two independently-invented measures of hero scroll.
//
// `enter`/`exit` are two different thresholds (hysteresis), not one shared
// value, so the swap doesn't flicker back and forth if the user's scroll
// position sits exactly on the boundary (e.g. a trackpad settling, or a
// screen-reader/keyboard scroll landing mid-range).
export function useHeroSwapTrigger(sectionRef, { enter = 0.22, exit = 0.14 } = {}) {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);

  useScrollDriver((y) => {
    const section = sectionRef.current;
    if (!section) return;
    const h = section.offsetHeight || 1;
    const progress = Math.min(1, Math.max(0, y / h));
    if (!activeRef.current && progress >= enter) {
      activeRef.current = true;
      setActive(true);
    } else if (activeRef.current && progress <= exit) {
      activeRef.current = false;
      setActive(false);
    }
  });

  return active;
}
