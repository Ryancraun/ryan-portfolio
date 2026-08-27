import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Animated count-up for case-study stat tiles -- a real number, not a
// number-shaped string. Takes the raw numeric `value` plus display
// formatting (decimals/prefix/suffix) rather than parsing a pre-formatted
// string like "51.4K", so the animation always interpolates the actual
// value and the rest-state text is never at risk of drifting out of sync
// with what's displayed mid-count.
//
// Starts on scroll-into-view (existing `useInView` hook, `once: true` --
// counts up exactly one time, doesn't re-fire on scroll back into view)
// and is reduced-motion aware: jumps straight to the final value with no
// animation loop started at all, same pattern ChromaCanvas.jsx and
// smoothScrollTo.js both already use for the same reason.
//
// HISTORY (don't re-delete the animation to "fix" this again -- fix the
// capture step instead): an earlier round of this project removed this
// component's animation entirely, because `display` started at 0 and the
// project's own prerender step (scripts/prerender.mjs) was capturing the
// DOM before the count-up ever ran -- confirmed live by grepping the
// actual shipped `dist/work/vault/index.html`, which had a literal "0"
// baked in for every stat. Ryan asked for the animation back. The
// correct fix is in `scripts/prerender.mjs`, not here: it now scrolls
// through the whole page (triggering every `once:true` IntersectionObserver,
// this one included) and waits long enough for the animation to fully
// settle before capturing, so the static HTML always ships the real,
// finished value regardless of whether this component animates to reach
// it. Re-verify with a grep of the built `dist/` output, not just a live
// browser tab, before trusting either side of this fix again.
export default function StatNumber({ value, decimals = 0, prefix = '', suffix = '', duration = 1100 }) {
  const [ref, inView] = useInView({ once: true, rootMargin: '0px' });
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    let rafId = 0;
    let startTime = null;
    function step(now) {
      if (startTime === null) startTime = now;
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - t) ** 3; // easeOutCubic -- fast start, settles gently, no overshoot
      setDisplay(value * eased);
      if (t < 1) rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, value, duration, reducedMotion]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString('en-US');
  const finalFormatted = decimals > 0 ? value.toFixed(decimals) : value.toLocaleString('en-US');

  return (
    <span ref={ref} className="stat-number" aria-label={`${prefix}${finalFormatted}${suffix}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
