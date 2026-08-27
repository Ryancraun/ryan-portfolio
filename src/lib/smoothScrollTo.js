// Custom rAF-driven smooth scroll (SiteNav.jsx's "Contact Me" link). NOT
// `scroll-behavior:smooth` -- that CSS property gives no control over
// duration or easing (a fixed-speed scroll that stops abruptly), and is
// deliberately never set anywhere in this codebase, including on <html>,
// since that would silently also apply to every other anchor jump and the
// browser's own scroll-restoration behavior sitewide, not just this one
// link. This function is scoped to exactly the caller that invokes it.

const MIN_DURATION_MS = 700;
const MAX_DURATION_MS = 1400;
const MS_PER_PX = 0.55;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// t < 0.5 ? 8*t^4 : 1 - 8*(t-1)^4 -- long, gentle ease at both ends (a
// quartic, not the cubic most `ease-in-out` presets use), which is what
// makes the glide read as deliberate rather than mechanical.
function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t ** 4 : 1 - 8 * (t - 1) ** 4;
}

// `offset`: extra space (CSS px) to stop short of the target's own top --
// keeps the destination clear of a fixed nav sitting over the viewport's
// own top edge. `reducedMotion`: jumps instantly, no rAF loop started at
// all (not started-then-immediately-finished -- see usePrefersReducedMotion
// callers elsewhere in this codebase for the same pattern).
export function smoothScrollTo(targetEl, { offset = 0, reducedMotion = false } = {}) {
  if (!targetEl) return;

  const targetY = targetEl.getBoundingClientRect().top + window.scrollY - offset;

  if (reducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  const durationMs = clamp(Math.abs(distance) * MS_PER_PX, MIN_DURATION_MS, MAX_DURATION_MS);

  let rafId = 0;
  let startTime = null;
  let done = false;

  // Cancel-on-user-interaction: a scroll that fights the user is worse
  // than no animation at all. Any of wheel/touchstart/a scroll-relevant
  // key hands control back immediately, mid-flight -- no attempt to finish
  // or resume the glide afterward. Passive listeners (never call
  // preventDefault, so the browser's own scroll handling is never blocked
  // for a moment even while these are attached).
  const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
  function onKeyDown(event) {
    if (SCROLL_KEYS.has(event.key)) stop();
  }
  function stop() {
    if (done) return;
    done = true;
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('wheel', stop);
    window.removeEventListener('touchstart', stop);
    window.removeEventListener('keydown', onKeyDown);
  }

  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  window.addEventListener('keydown', onKeyDown, { passive: true });

  function step(now) {
    if (done) return;
    if (startTime === null) startTime = now;
    const t = clamp((now - startTime) / durationMs, 0, 1);
    window.scrollTo(0, startY + distance * easeInOutQuart(t));
    if (t < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      stop(); // finished, not cancelled -- same teardown either way
    }
  }
  rafId = requestAnimationFrame(step);
}
