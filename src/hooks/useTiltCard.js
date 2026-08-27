import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// 3D TILT-ON-HOVER (build-log.md "CURSOR FIX + ... + BORDERGLOW HERO" ->
// WAVES HERO + CARD TILT addendum). Ryan: "when the mouse goes to the left,
// the card should kind of turn to the left a little bit. Give it that 3D
// effect."
//
// Checked reactbits.dev live first (https://reactbits.dev/components/
// tilted-card, real "Tilted Card" component, confirmed via its registry
// JSON at r/TiltedCard-JS-CSS.json) before hand-rolling anything -- its
// technique is exactly right (mouse offset from the element's center ->
// rotateX/rotateY, eased back to flat on mouse-leave), but the component
// itself doesn't fit this project's card DOM: it's built around wrapping a
// single sized `<img>` (`imageSrc`/`imageWidth`/`imageHeight` are the whole
// API) with an optional small overlay node, not a full-bleed WebGL/canvas
// background plus a composited multi-element metadata block (client/title/
// tag/byline/stats/CTA) the way `ProjectCard.jsx` actually renders. It also
// pulls in a brand-new dependency (`motion`, i.e. Framer Motion) this
// project doesn't otherwise use anywhere. Bigger problem: `useCardStack.js`
// already owns `element.style.transform` on the outer `.card` node for the
// scroll-driven pin/peek/recede choreography (translateY + scale, written
// every scroll-driver tick) -- a second system (this one, or Framer
// Motion's) writing `transform` to that SAME node on hover would either
// silently clobber the scroll choreography or get clobbered by it, since
// CSS only keeps one `transform` value per element.
//
// So: adapted the TECHNIQUE, not the literal component -- same judgment
// call this project has made repeatedly for reactbits references that
// don't literally fit (Dot Field -> the original ParticleField engine,
// Waves/DotGrid/Particles/Aurora -> the FIX ROUND 3 canvas-art techniques).
// This hook tracks mousemove on an OUTER element (ideally one already owned
// by another transform system -- e.g. useCardStack's `cardRef` -- reused,
// not re-created, so there's only ever one DOM node and one set of bounds
// for that element) and writes the tilt transform onto a SEPARATE inner
// wrapper that the outer's own transform owner never touches. Two
// different elements, two independent `transform` properties -- they
// compose visually (the whole tilted plane still moves/scales with
// whatever the outer element is doing) without either system ever
// overwriting the other.
//
// TILT MOVED TO HERO CARD (build-log.md): originally wired to all 5 project
// cards; Ryan's correction moved it to the hero's "Ryan Craun" panel
// instead ("I wanted the card tilt on the 'Ryan Craun Card' Not the
// project cards. And tone it down a little.") -- ProjectCard.jsx no longer
// calls this hook at all; Hero.jsx is now the only caller, passing a
// smaller `maxTiltDeg` override (see that file). The hook itself stays
// generic/reusable rather than hard-coded to either use site.
const MAX_TILT_DEG = 6; // default magnitude if no override is passed --
// subtle/premium, not arcade -- reactbits' own TiltedCard default is 14deg.
const HOVER_QUERY = '(hover: hover) and (pointer: fine)';
// A short, near-instant transition while actively tracking the cursor (so
// the tilt reads as responsive 1:1 following, not laggy/rubbery), and a
// longer, graceful ease specifically for the mouse-leave reset back to
// flat -- a single always-on long transition would make tracking itself
// feel sluggish (every incremental mousemove update would restart the same
// long ease), which is the opposite of "premium."
const TRACK_TRANSITION = 'transform 0.15s ease-out';
const RESET_TRANSITION = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';

export function useTiltCard(outerRef, { maxTiltDeg = MAX_TILT_DEG, scale = 1.015 } = {}) {
  const innerRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    // Gated identically to the custom cursor: no listeners, no transform,
    // zero cost on touch/coarse-pointer devices (there's no hover there to
    // react to) and skipped entirely under prefers-reduced-motion.
    if (!outer || !inner || reducedMotion) return undefined;

    const mq = window.matchMedia(HOVER_QUERY);
    let enabled = mq.matches;

    function reset() {
      inner.style.transform = '';
    }
    function onMQChange(e) {
      enabled = e.matches;
      if (!enabled) reset();
    }

    function onMove(e) {
      if (!enabled) return;
      const rect = outer.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      const rotateY = (offsetX / (rect.width / 2)) * maxTiltDeg;
      const rotateX = (offsetY / (rect.height / 2)) * -maxTiltDeg;
      inner.style.transition = TRACK_TRANSITION;
      inner.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale})`;
    }
    function onLeave() {
      inner.style.transition = RESET_TRANSITION;
      reset();
    }

    mq.addEventListener('change', onMQChange);
    outer.addEventListener('mousemove', onMove);
    outer.addEventListener('mouseleave', onLeave);

    return () => {
      mq.removeEventListener('change', onMQChange);
      outer.removeEventListener('mousemove', onMove);
      outer.removeEventListener('mouseleave', onLeave);
      reset();
    };
  }, [outerRef, reducedMotion, maxTiltDeg, scale]);

  return innerRef;
}
