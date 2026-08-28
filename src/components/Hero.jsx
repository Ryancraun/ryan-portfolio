import { useEffect, useState } from 'react';
import PixelSwap from './reactbits/PixelSwap/PixelSwap';
import { useHeroDrift } from '@/hooks/useHeroDrift';

// HERO REVEAL REBUILD (build-log.md): Ryan's direct feedback on the
// scroll-driven PixelSwap version -- "it's happening too late... I scroll
// right past it without ever seeing my tagline." Replaced with a
// TIME-driven reveal instead of a scroll-driven one: it fires on its own
// shortly after the page loads, so every visitor sees it regardless of
// scroll speed, and scrolling itself is completely decoupled from it.
//
// SECOND ROUND: the first version of this rebuild dropped PixelSwap
// entirely in favor of a plain two-panel opacity crossfade, reasoning that
// a full-screen background-color flip wasn't the shape of problem
// PixelSwap's per-cell mechanic was built for. Ryan's direct correction:
// "The pixel swapping just looks like a black-to-white transition.
// There's no actual pixel swapping like the React component." He wants
// the real pixel-block dissolve back, not a bare crossfade. Re-integrated
// PixelSwap here, but scaled up to cover the WHOLE hero (not just a small
// text box, as the original scroll-driven version had it): `firstContent`/
// `secondContent` are now each a full-bleed panel with its OWN solid
// background baked in (`.hero__panel--intro` black, `.hero__panel--reveal`
// off-white), so the pixel-grid reveal is genuinely dissolving one
// background+content state into the other in visible blocks, not just
// swapping text on a shared backdrop. `pixelSize`/`gap` are tuned larger
// than the old text-only usage (that used 12px for a small box; this
// covers hundreds of thousands of px², so a chunkier grid reads as
// deliberate blocks instead of a near-imperceptible fine dissolve --
// MAX_PIXELS=220 in PixelSwap.jsx auto-scales pixelSize up regardless, so
// an exact count isn't hand-tuned here). Still `trigger="manual"` +
// time-driven `active`, not scroll -- that part of the prior fix stands.
// HERO COPY REWRITE ROUND 2 (Ryan, direct): replaced the philosophy-led
// tagline from the previous round with a plainer role+company statement
// plus a location line.
//
// PROOF STATS REMOVED (Ryan, direct, following round): the PickTheOdds
// stat block below the subline (31% faster to place a bet / 84% more
// time on site / source line) is gone -- Ryan's own call after seeing it
// live, not replaced with anything.
const TAGLINE = 'Full time product designer at FEVO. I design apps, then I build them.';
const SUBLINE = 'Based in Columbus, OH.';

// "Shortly after, maybe even with a time delay" -- Ryan's own words. Long
// enough to actually read "Ryan Craun / Product Designer" first, short
// enough that it still reads as one deliberate opening beat, not a stall.
const REVEAL_DELAY_MS = 1400;

export default function Hero() {
  const { sectionRef, innerRef } = useHeroDrift();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Reduced motion still waits for the same beat (so the two states are
    // read in the same order/timing for every visitor) -- only the
    // animated dissolve itself is skipped, via PixelSwap's own internal
    // prefers-reduced-motion short-circuit (instant swap, no WAAPI).
    const timer = window.setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className={`hero hero--reveal${revealed ? ' is-revealed' : ''}`} id="hero" ref={sectionRef}>
      {/* The real, always-present page heading and tagline -- visually
          hidden (sr-only, not display:none/aria-hidden) so a screen-reader
          user gets both immediately, not on a 1.4s timer, and the
          decorative panels below are aria-hidden so they're never
          announced as separate, out-of-order content. */}
      <div className="sr-only">
        <h1>Ryan Craun</h1>
        <p>{TAGLINE}</p>
        <p>{SUBLINE}</p>
      </div>
      {/* PixelSwap doesn't spread arbitrary props onto its root node (only
          className/style), so `aria-hidden` has to sit on this wrapper
          instead -- it also overrides PixelSwap's own per-layer
          `aria-hidden={!isShown}` (the currently-SHOWN layer gets
          `aria-hidden="false"` from PixelSwap itself, which would expose
          its text as a second, duplicate reading of content the sr-only
          block above already provides). */}
      <div className="hero__stage" ref={innerRef} aria-hidden="true">
        <PixelSwap
          className="hero__pixelswap"
          aspectRatio="auto"
          trigger="manual"
          active={revealed}
          // PERFORMANCE FIX (Ryan: "it lags a bit"): PixelSwap.jsx hard-caps
          // the grid at MAX_PIXELS=220 (see its own file-top comment) --
          // this panel covers the full viewport (`.hero{min-height:100svh}`,
          // full width), so at the previous 56px the NATURAL grid already
          // exceeded 220 on any realistic screen, meaning the library's own
          // auto-scale-up was silently overriding this prop back up to
          // whatever size keeps the grid AT the 220-cell ceiling regardless
          // -- the number that actually mattered for cost was never 56, it
          // was always ~220. Every one of those cells gets its own DOM
          // clone of the incoming panel plus TWO simultaneous Web
          // Animations API animations (the pixel window's own
          // transform/opacity, and a counter-transform on its content so
          // the revealed text doesn't drift) -- up to 440 concurrently
          // animated elements, all created in one synchronous burst the
          // instant the transition starts. Raised to 140px so the grid
          // comes in well under the 220 cap on realistic viewports (roughly
          // 60-110 cells instead of ~220, verified against real hero
          // dimensions, not guessed) -- a real reduction in DOM/animation
          // work, not just a cosmetic prop change, and it reads as an even
          // MORE deliberate chunky block dissolve, not a regression from
          // the "not a near-imperceptible fine dissolve" direction this was
          // already tuned toward.
          pixelSize={140}
          gap={2}
          pixelRadius={0}
          pixelScale={0.5}
          duration={1300}
          pixelDuration={420}
          pattern="diagonal"
          randomness={0.18}
          fade
          easing="cubic-bezier(0.22, 1, 0.36, 1)"
          firstContent={
            <div className="hero__panel hero__panel--intro">
              <p className="hero__name">Ryan Craun</p>
              <p className="hero__role">Product Designer</p>
            </div>
          }
          secondContent={
            <div className="hero__panel hero__panel--reveal">
              <p className="hero__tagline-big">{TAGLINE}</p>
              <p className="hero__tagline-sub">{SUBLINE}</p>
            </div>
          }
        />
      </div>
      <div className="hero__scrollcue">Scroll</div>
    </section>
  );
}
