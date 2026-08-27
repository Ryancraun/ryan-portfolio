import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// The one capped, non-repeating personal touch (brief hard constraint):
// a full-bleed accent-color wash that plays exactly once on load, then is
// removed from the DOM entirely -- it never recurs on scroll or on card
// interaction. Skipped outright under prefers-reduced-motion.
//
// CHROMA GLASS EXPERIMENT, REVERTED (Ryan: "EHH LETS REVERT BACK, MAYBE
// THIS IS TOO MUCH MOVEMENT"): tried a multi-phase pixelated glass-tile
// grid with a chroma wave sweep + name assembly + block dissolve (see
// build-log.md for the full account, including a real performance bug it
// introduced -- its extended runtime overlapped Hero.jsx's own PixelSwap
// intro, and the tile grid itself carried too much simultaneous animation
// cost). Fixed once, then reverted anyway on Ryan's own call once he saw
// it live -- back to this original flat wipe, kept exactly as it was.
export default function LoadWash() {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState(false);
  const [removed, setRemoved] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const play = () => {
      const outTimer = setTimeout(() => setOut(true), 200);
      const removeTimer = setTimeout(() => setRemoved(true), 200 + 950);
      return () => {
        clearTimeout(outTimer);
        clearTimeout(removeTimer);
      };
    };
    if (document.readyState === 'complete') return play();
    window.addEventListener('load', play, { once: true });
    return () => window.removeEventListener('load', play);
  }, [reduced]);

  if (removed) return null;

  return (
    <div className={`wash${out ? ' wash--out' : ''}`} aria-hidden="true">
      <span className="wash__mark">RC</span>
    </div>
  );
}
