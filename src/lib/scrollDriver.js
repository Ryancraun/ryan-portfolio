// One shared scroll-progress driver for the whole page instead of one rAF
// loop per animated element. Primary path is a single requestAnimationFrame
// loop; a secondary, time-gated (~16ms floor, never raw/unthrottled) scroll
// listener acts as a fallback for the case the single-file build actually
// hit and fixed: some browser tabs/WebViews report `document.hidden` and
// silently stop firing rAF callbacks, which would otherwise leave every
// scroll-linked animation on the page inert. Every subscriber only ever
// receives a scrollY number and is expected to write transform/opacity —
// never layout-affecting properties — back to the DOM itself.
const subscribers = new Set();
let rafId = null;
let scrollFallbackBound = false;
let lastY = -1;

function tick() {
  const y = window.scrollY || window.pageYOffset || 0;
  if (y !== lastY) {
    lastY = y;
    for (const fn of subscribers) fn(y);
  }
  rafId = requestAnimationFrame(tick);
}

function ensureScrollFallback() {
  if (scrollFallbackBound) return;
  scrollFallbackBound = true;
  let last = 0;
  window.addEventListener(
    'scroll',
    () => {
      const now = performance.now();
      if (now - last < 16) return;
      last = now;
      if (document.hidden) {
        const y = window.scrollY || window.pageYOffset || 0;
        lastY = y;
        for (const fn of subscribers) fn(y);
      }
    },
    { passive: true }
  );
}

export function subscribeScroll(fn) {
  subscribers.add(fn);
  if (rafId === null) {
    rafId = requestAnimationFrame(tick);
  }
  ensureScrollFallback();
  fn(window.scrollY || window.pageYOffset || 0);
  return () => {
    subscribers.delete(fn);
  };
}
