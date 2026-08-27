import { useEffect, useRef, useState } from 'react';

// Only elements that are genuinely clickable get the hover reaction --
// deliberately `a[href]`/`button`/`[role="button"]`, not `.card` in general.
// Cards 02-05 have no href and render no CTA at all (FIX ROUND 3, required
// fix 2 -- see build-log.md), so this cursor must not imply they're
// clickable when they aren't. Card 01 (PickTheOdds) IS a real `<a href>`
// wrapping the whole card, so hovering anywhere on it -- not just its CTA --
// correctly triggers the hover state.
const HOVER_SELECTOR = 'a[href], button, [role="button"]';

// CTA GLOW OVERFLOW FIX (build-log.md "CTA GLOW OVERFLOW FIX (second pass)"):
// this sitewide ring is `position:fixed`, so it isn't a descendant of the
// button and no amount of `overflow:hidden` on SpecularButton could ever
// contain it. Card 01/02's whole card is itself the `<a href>`/`Link`
// (see the comment above), so `is-hovering` -- and with it the ring's 1.7x
// enlarge + gold recolor (index.css `.cursor-ring.is-hovering`) -- is
// already active well before the pointer reaches the small "View Case
// Study" pill nested inside. That enlarged ring is 58px across against a
// ~30px-tall pill; centered on the raw pointer position (not the pill's own
// center), it visibly overflows the pill's own border, worst at the right
// edge, and because its hover color is the same gold as the pill's own
// SpecularButton shine, it reads as a second circular button rather than a
// cursor decoration. SpecularButton already renders its own bespoke,
// precisely-clipped proximity shine (its whole purpose), so the enlarged
// sitewide ring is redundant there anyway -- suppressed rather than shrunk,
// falling back to the plain neutral cursor (small dot + default white ring)
// the instant the pointer is over the button, and restored the instant it
// leaves back onto the rest of the card.
const COMPACT_HOVER_SELECTOR = '.specular-button';

// NAV BLACK-BAR FIX (Ryan: "when I hover on text, the nav bar gets these
// black bars inside of it"). Root cause: `.cursor-dot`/`.cursor-ring` sit
// at `mix-blend-mode:difference` at rest (see index.css, "COLOR-ADAPTIVE
// CURSOR" -- this is deliberate, it's what makes the cursor stay visible
// crossing from the dark hero into a light section). `.sitenav` is the one
// persistent, `position:fixed` element on the page using
// `backdrop-filter:blur()` -- a real, documented Chromium/Firefox
// compositing conflict is a `mix-blend-mode` layer overlapping a
// `backdrop-filter` layer that's being repainted every frame (the cursor
// writes a new `transform` on every `mousemove`): the blurred backdrop can
// intermittently resolve as solid black instead of the intended
// translucent blur, because the blend layer above it forces a recomposite
// of the blur layer against a partial/stale backdrop. `.sitenav__link` and
// `.sitenav__mark` are real `a[href]`s, so HOVER_SELECTOR already flips the
// RING to `mix-blend-mode:normal` while directly over one of them -- but
// moving the mouse "on text" across the nav also crosses the pill's own
// padding and the gaps between links/byline, where the target is inside
// `.sitenav` but isn't itself an `a[href]` -- exactly where `difference`
// was still active directly over the blurred pill. Rather than only fixing
// the on-link case, this zone check covers the whole `.sitenav` footprint
// (and both dot + ring, not just the ring, since the dot's `difference`
// blend was never reset by anything before this fix) so the blend-mode
// conflict can never occur anywhere over the nav, regardless of exactly
// what's under the pointer at that pixel.
const GLASS_ZONE_SELECTOR = '.sitenav';

// CURSOR FIX (build-log.md "CURSOR FIX + ..."): the previous version tracked
// "have we ever seen a mousemove" with a one-shot `hasMoved` flag that only
// ever flips false -> true once per mount. `is-visible` was only ever ADDED
// inside that one-time branch. A `mouseleave` on <html> (cursor genuinely
// leaving the viewport -- browser chrome, another monitor, an OS overlay,
// alt-tab) removed `is-visible` on both dot and ring, and because `hasMoved`
// was already `true`, no later mousemove could ever re-add it -- the custom
// cursor was gone for the rest of the session. Compounding this, the CSS
// `cursor:none` on <body> applied UNCONDITIONALLY inside the
// (hover:hover)-and-(pointer:fine) media query, with no tie back to whether
// the custom cursor was actually tracking -- so once that one-shot bug
// fired, the native OS cursor stayed hidden too. Net effect: zero visible
// pointer, permanently, exactly as reported ("the mouse keeps disappearing
// ... so then I lose the cursor entirely").
//
// Fix has two independent layers, per the task's explicit "defensive, not
// just find-the-one-bug" instruction:
//
// 1. Root cause: `is-visible`/active state is now driven by an idempotent
//    `setActive()` that any mousemove can flip back on, not a one-shot latch.
//    mouseleave / window blur / document going hidden all now correctly
//    *deactivate* (not just decorate) the cursor, and the very next real
//    mousemove reactivates it -- there is no longer a path where "active"
//    gets stuck at a stale value.
// 2. Defensive backstop, for bugs neither this fix nor a future regression
//    anticipates: a `cursor-active` class is written onto <body> ONLY while
//    `active` is true, and index.css's `cursor:none` rule is scoped to
//    `body.cursor-active` instead of applying unconditionally -- so even if
//    this component's JS ever gets into a bad state again, the native OS
//    cursor automatically reappears the moment tracking is confirmed lost,
//    instead of both cursors being gone at once. The dot/ring can never be
//    hidden while the native cursor is also hidden, and vice versa -- the
//    two are structurally tied to the same single source of truth
//    (`active`) rather than two independent guesses.
//
//    STILLNESS-FLICKER FIX (build-log.md "CURSOR STILLNESS-FLICKER FIX"):
//    the watchdog originally used a *time-since-last-mousemove* threshold
//    (`STALE_MS`, ~700ms) as its own independent trigger -- if no mousemove
//    had fired recently, it force-deactivated, full stop. That's wrong: a
//    user who simply stops moving the mouse to read a sentence, or pauses
//    before clicking, is completely stationary for far longer than 700ms
//    constantly during normal use, and every one of those pauses made the
//    cursor flicker to the native arrow and back. Stillness alone is not a
//    failure signal -- it's the expected, common case.
//
//    The watchdog now polls the *same boundary truths* the real event
//    listeners already watch for (viewport containment, window focus, tab
//    visibility) instead of inferring trouble from elapsed time. It
//    force-deactivates ONLY if the independently-observable state
//    contradicts `active` being true -- i.e. the document is hidden, the
//    window has lost focus, or the last known pointer position is outside
//    the viewport -- which is exactly the set of real boundary conditions
//    `deactivate()` is already supposed to have caught via mouseleave /
//    blur / visibilitychange. This makes it a genuine backstop for "that
//    listener path silently failed to fire" (event swallowed by a WebGL
//    canvas, a browser quirk, a future regression) rather than a second,
//    competing trigger keyed on mere inactivity. A cursor sitting
//    perfectly still inside the viewport with focus intact now has no
//    signal that can ever deactivate it, no matter how long it sits there.
const WATCHDOG_MS = 250;

// Sitewide custom cursor: a small dot that tracks the real pointer 1:1, and
// a ring that trails it with a touch of easing (reads as more premium than
// 1:1 tracking). Both scale/recolor on hover of a real interactive element.
// Gated entirely behind `(hover:hover) and (pointer:fine)` -- on any
// touch/coarse-pointer device this component mounts nothing at all (no
// listeners, no DOM nodes), so there's zero risk of a phantom cursor or
// event-handling cost on mobile, and the native cursor is simply never
// touched there. Position/scale are written directly to refs' inline
// styles every frame (position) or via a toggled class (hover state) --
// never through React state per-move -- so this never re-renders the app
// while the mouse moves, which matters given it now runs alongside a
// continuously-animating WebGL hero (Liquid Chrome) and card-stack scroll
// choreography.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = (e) => setEnabled(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    // Guarantee <body> never gets stuck with cursor:none when this effect
    // is disabled or torn down for any reason -- the native cursor is the
    // safe default state, always.
    if (!enabled) {
      document.body.classList.remove('cursor-active');
      return undefined;
    }
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = null;
    let active = false;

    const place = (el, x, y) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    // Single source of truth for "is the custom cursor confirmed visible."
    // Everything -- dot/ring opacity AND the native cursor's cursor:none
    // rule (via body.cursor-active in index.css) -- reads off this same
    // flag, so the two can never disagree/desync again.
    const setActive = (next) => {
      if (next === active) return;
      active = next;
      dot.classList.toggle('is-visible', active);
      ring.classList.toggle('is-visible', active);
      document.body.classList.toggle('cursor-active', active);
      if (!active) {
        dot.classList.remove('is-hovering');
        ring.classList.remove('is-hovering');
        dot.classList.remove('is-over-glass');
        ring.classList.remove('is-over-glass');
      }
    };

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!active) {
        // Snap the ring straight to the pointer on (re)activation so it
        // never visibly animates in from a stale position left over from
        // before the cursor was last hidden.
        ringX = mouseX;
        ringY = mouseY;
        place(ring, ringX, ringY);
      } else if (reducedMotion) {
        // No rAF easing loop runs under reduced motion (see below), so the
        // ring needs its own per-move placement to track at all.
        place(ring, mouseX, mouseY);
      }
      place(dot, mouseX, mouseY);
      setActive(true);
    }

    // CTA CURSOR-RING LAG FIX (build-log.md "CTA CURSOR-RING LAG FIX (third
    // pass)"): tracks whether the pointer is currently over a compact
    // target so a crossing INTO or OUT OF one can be detected below.
    let compactActive = false;

    function onOver(e) {
      // Recomputed fresh on every element-boundary crossing (mouseover
      // bubbles for each one) rather than only ever added -- this is what
      // lets card -> button and button -> card both react, not just the
      // very first entry into the card. See COMPACT_HOVER_SELECTOR above.
      const interactive = !!e.target.closest?.(HOVER_SELECTOR);
      const compact = !!e.target.closest?.(COMPACT_HOVER_SELECTOR);
      const hovering = interactive && !compact;
      if (compact !== compactActive) {
        // The ring's SIZE/COLOR flip instantly on the class toggle below,
        // but its POSITION is deliberately lerp-smoothed every frame (see
        // `tick()`'s EASE below) and has no snap logic tied to a
        // hover-target change -- only to full activate/deactivate (see the
        // `if (!active)` branch in onMove). Crossing into or out of a
        // compact target (the nested "View Case Study" pill) is the one
        // place that residual lag becomes visible: on fast, continuous real
        // mouse movement, the ring can render already-resized/recolored for
        // the new target while still rendering at a position that's several
        // frames behind, overlapping the pill's own border and reading as
        // two overlapping shapes. A single discrete hover-then-screenshot
        // test can't catch this -- the position lag only shows up across
        // multiple real animation frames of continuous motion, and has
        // already fully settled by the time a static screenshot is taken.
        // Snapping the ring's raw position to the exact crossing point the
        // instant a compact boundary is crossed removes the gap the
        // SIZE/COLOR transition would otherwise have to render across --
        // same snap-on-transition pattern already used for full
        // activate/deactivate, just scoped to this one boundary instead of
        // applied sitewide (the general card-to-card trailing/lerp feel is
        // untouched).
        ringX = e.clientX;
        ringY = e.clientY;
        place(ring, ringX, ringY);
        compactActive = compact;
      }
      dot.classList.toggle('is-hovering', hovering);
      ring.classList.toggle('is-hovering', hovering);

      // See GLASS_ZONE_SELECTOR above -- recomputed fresh on every
      // boundary crossing exactly like `hovering`, so it stays correct
      // whether the pointer is over a link inside the nav or just the
      // pill's own background/padding.
      const overGlass = !!e.target.closest?.(GLASS_ZONE_SELECTOR);
      dot.classList.toggle('is-over-glass', overGlass);
      ring.classList.toggle('is-over-glass', overGlass);
    }
    function onOut(e) {
      // Mirrors the HOVER_SELECTOR exit check below, but for the glass
      // zone -- clears the blend-mode override the instant the pointer
      // truly leaves `.sitenav` (not just crossing between two children
      // inside it, which `relatedTarget` already distinguishes).
      if (e.target.closest?.(GLASS_ZONE_SELECTOR)) {
        const to = e.relatedTarget;
        if (!to || !to.closest?.(GLASS_ZONE_SELECTOR)) {
          dot.classList.remove('is-over-glass');
          ring.classList.remove('is-over-glass');
        }
      }
      if (!e.target.closest?.(HOVER_SELECTOR)) return;
      const to = e.relatedTarget;
      if (to && to.closest?.(HOVER_SELECTOR)) return;
      compactActive = false;
      dot.classList.remove('is-hovering');
      ring.classList.remove('is-hovering');
    }

    // Any of these mean "we can no longer trust the last known pointer
    // position" -- leaving the viewport, losing window focus, or the tab
    // going backgrounded. All three now correctly hand the pointer back to
    // the OS instead of leaving a stale custom cursor (or nothing) on
    // screen.
    function deactivate() {
      setActive(false);
    }
    function onVisibilityChange() {
      if (document.hidden) deactivate();
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.documentElement.addEventListener('mouseleave', deactivate);
    window.addEventListener('blur', deactivate);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Watchdog (defensive layer 2, see the top-of-file note): a periodic
    // poll that independently re-derives the same boundary truths the real
    // listeners above are supposed to be catching -- NOT a timer keyed on
    // stillness. It only force-deactivates when the actual, currently-
    // observable state contradicts `active` being true: the tab is
    // backgrounded, the window doesn't have focus, or the last known
    // pointer position is outside the viewport. Any of those means a
    // mouseleave/blur/visibilitychange listener should have fired already
    // and, for whatever reason, didn't -- a genuine, confirmed failure, not
    // mere inactivity. A cursor that's active with focus intact and the
    // pointer inside the viewport has no condition here that can ever trip,
    // no matter how long the mouse sits still.
    const watchdog = setInterval(() => {
      if (!active) return;
      const outsideViewport =
        mouseX < 0 || mouseY < 0 || mouseX > window.innerWidth || mouseY > window.innerHeight;
      if (document.hidden || !document.hasFocus() || outsideViewport) {
        deactivate();
      }
    }, WATCHDOG_MS);

    if (!reducedMotion) {
      // A touch of lag on the ring only -- the dot stays glued to the real
      // pointer (never disorienting), the ring trails via lerp toward it.
      const EASE = 0.18;
      const tick = () => {
        ringX += (mouseX - ringX) * EASE;
        ringY += (mouseY - ringY) * EASE;
        place(ring, ringX, ringY);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.removeEventListener('mouseleave', deactivate);
      window.removeEventListener('blur', deactivate);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearInterval(watchdog);
      if (raf) cancelAnimationFrame(raf);
      document.body.classList.remove('cursor-active');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span className="cursor-ring__shape" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true">
        <span className="cursor-dot__shape" />
      </div>
    </>
  );
}
