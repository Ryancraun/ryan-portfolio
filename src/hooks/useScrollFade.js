import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { subscribeScroll } from '@/lib/scrollDriver';

// Ports the original build's `data-fade` behavior: an element starts at low
// opacity (set in CSS) and crosses to `.is-visible` once, permanently, as it
// enters the viewport.
//
// Verified directly against this build's own automation harness (a
// backgrounded/hidden document -- the exact browser condition the original
// single-file build documented for its rAF loop) that plain
// IntersectionObserver callbacks can be throttled indefinitely under that
// same condition, alongside rAF and CSS transitions. The shared scroll
// driver (lib/scrollDriver.js) already carries a proven, time-gated
// fallback for this -- confirmed live in this session to keep tracking
// scroll correctly even while `document.hidden` is true -- so the
// visibility check here rides that same driver via getBoundingClientRect
// instead of depending on IntersectionObserver alone, matching the fix the
// original build made for its own IO-dependent visibility gating.
export function useScrollFade({ threshold = 0.2 } = {}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.classList.add('is-visible');
      return;
    }
    let done = false;
    const reveal = () => {
      done = true;
      el.classList.add('is-visible');
      // Belt-and-suspenders against the same hidden-document class of
      // stall affecting the CSS `transition` itself (confirmed live: the
      // cascade is correct -- opacity resolves to 1 immediately once the
      // transition is disabled -- it's the compositor clock that stalls
      // under a backgrounded tab). setTimeout still fires on a
      // backgrounded tab and guarantees the end state.
      setTimeout(() => {
        el.style.opacity = '1';
      }, 650);
    };
    const checkVisible = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      const visibleAmount = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const ratio = rect.height > 0 ? visibleAmount / rect.height : 0;
      return ratio >= threshold;
    };
    // COPIA CASE STUDY CRASH FIX: `subscribeScroll` (lib/scrollDriver.js)
    // invokes its callback SYNCHRONOUSLY once, immediately, as part of
    // subscribing -- before it has returned the unsubscribe function. The
    // original code below called that same `unsubscribe` from inside the
    // callback, which is fine for every LATER scroll tick but is a real
    // temporal-dead-zone crash ("Cannot access 'unsubscribe' before
    // initialization") on that very first synchronous call, if the element
    // already clears `threshold` at mount time. Intro.jsx never hit this
    // because its own elements sit below a full-viewport-height hero, so
    // they're never already visible on mount -- but the Copia case-study
    // page's first ScrollReveal section sits close enough to a
    // shorter, natural-height hero that it can be, which is exactly what
    // surfaced this. Fixed by checking visibility ONCE, synchronously,
    // before ever calling subscribeScroll: if the element is already
    // visible at mount, reveal it immediately and never subscribe at all --
    // no unsubscribe reference to race. Only elements NOT already visible
    // at mount go through the scroll-driven subscription path below, where
    // `unsubscribe` is safely fully initialized by the time any tick (all
    // of which happen asynchronously, on a later rAF/scroll event) can
    // call it.
    if (checkVisible()) {
      reveal();
      return;
    }
    const unsubscribe = subscribeScroll(() => {
      if (done) return;
      if (checkVisible()) {
        reveal();
        unsubscribe();
      }
    });
    return unsubscribe;
  }, [threshold, reduced]);

  return ref;
}
