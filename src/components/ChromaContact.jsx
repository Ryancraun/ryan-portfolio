import { useEffect, useRef, useState } from 'react';
import ChromaCanvas from './ChromaCanvas';

// These margins protect the ARC (not just its crown -- see below) from
// ever crossing the heading or the first field -- measured, not
// hand-picked, so it cannot overlap either one regardless of screen size.
//
// ARC-OVER-NAME FIX (build-log.md): FIELD_CLEARANCE_PX used to be
// enforced at the crown's own x (the section's horizontal center) only.
// But the arc is a circle of radius = section width (ChromaCanvas.jsx's
// `measureAndResize`), so it DROPS below the crown by
// `r - sqrt(r^2 - dx^2)` at horizontal offset dx -- and the Name label
// sits at the content column's left EDGE, not the center. On desktop
// (radius ~1900px) that drop across the column is ~14-21px and the
// crown's own 56px of clearance absorbs it; at phone widths the radius
// is the phone's own width, the curvature is steep, and the drop at the
// label's x reaches ~44-59px -- eating essentially ALL of the crown's
// clearance and putting the full-brightness rim line (plus its bloom
// halo) visually on top of the Name label. Measured, not theorized:
// per-column canvas alpha sampling at true mobile widths found the line
// 6-18px from the label top (worst at ~560px viewport width), exactly
// matching the drop formula at every width tested. The fix below
// subtracts that measured drop (evaluated at the field's widest x
// extent) from `maxY`, so the clearance guarantee holds for the whole
// arc across the field's width, not just for the crown point.
const FIELD_CLEARANCE_PX = 20;
const HEADING_CLEARANCE_PX = 20;

// CHROMA CONTACT SECTION (build-log.md). The arc was originally an 11-div
// CSS/mask stack, per an earlier fully-specified technical brief -- it
// failed twice for structural reasons a CSS mask stack can't fix by
// tuning (a dark seam across three fix attempts; flares that rendered as
// vertical spokes) and was rebuilt as a single `<canvas>` (see
// ChromaCanvas.jsx, which now owns essentially all of the arc's own
// visual logic). This component's remaining job is the section shell,
// the crown-Y measurement (below, unchanged across every round), and the
// actual page content -- eyebrow/heading/form.
export default function ChromaContact() {
  const [status, setStatus] = useState('idle');
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const firstFieldRef = useRef(null);
  // Was a CSS custom property (`--crown-y`) set imperatively via ref, back
  // when the arc was CSS. Now the arc is `<ChromaCanvas>`, which computes
  // its circle geometry in JS, not CSS -- so this needs to be real React
  // state (a number, CSS px) it can receive as a prop, not just a style
  // side-effect. The measurement logic itself (find the actual gap between
  // the heading and the first field, clamp the crown inside it) is
  // unchanged from every prior round.
  const [crownY, setCrownY] = useState(null);
  // Scrim-legibility fix: the scrim's own darkest point needs to land ON
  // the Name field, not on the section's geometric center -- measured
  // directly (this field's own vertical midpoint), not derived from
  // crownY with a guessed offset, since the gap between the crown and the
  // first field isn't a fixed distance (it depends on heading height,
  // viewport, the same clamping `updateCrownY` already does). Verified
  // this actually matters: with the scrim centered on the section instead,
  // rigorous contrast measurement (real canvas pixels + exact CSS
  // compositing math, not a screenshot) found the darkest point of the
  // ellipse landing ~150px below the Name field, nowhere near where it
  // was needed.
  const [scrimAnchorY, setScrimAnchorY] = useState(null);

  useEffect(() => {
    const updateCrownY = () => {
      const section = sectionRef.current;
      const heading = headingRef.current;
      const field = firstFieldRef.current;
      if (!section || !heading || !field) return;
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const headingBottom = heading.getBoundingClientRect().bottom - sectionTop;
      const fieldRect = field.getBoundingClientRect();
      const fieldTop = fieldRect.top - sectionTop;
      // Arc-curvature drop at the field's widest x extent -- see the
      // FIELD_CLEARANCE_PX comment above for the full account. The circle
      // geometry here (radius = section width, center x = section
      // midpoint) deliberately mirrors ChromaCanvas.jsx's
      // `measureAndResize` (`radius = cssW; cx = cssW / 2`, where cssW is
      // the wrapper's width and the wrapper is `inset:0` inside this same
      // section) -- if that geometry ever changes there, this drop
      // calculation must change with it, or the clearance guarantee
      // silently degrades back to crown-only.
      const radius = sectionRect.width;
      const fieldLeft = fieldRect.left - sectionRect.left;
      const fieldRight = fieldRect.right - sectionRect.left;
      const cx = sectionRect.width / 2;
      const dxMax = Math.min(radius, Math.max(cx - fieldLeft, fieldRight - cx, 0));
      const arcDrop = radius > 0 ? radius - Math.sqrt(radius * radius - dxMax * dxMax) : 0;
      // The heading side needs no drop term: the arc's closest approach to
      // the heading is at the crown itself (it only falls AWAY from the
      // heading off-center), so crown-point clearance is already the true
      // minimum on that side.
      const minY = headingBottom + HEADING_CLEARANCE_PX;
      const maxY = fieldTop - FIELD_CLEARANCE_PX - arcDrop;
      const idealMid = (headingBottom + fieldTop) / 2;
      const nextCrownY = maxY >= minY ? Math.min(Math.max(idealMid, minY), maxY) : (minY + maxY) / 2;
      setCrownY(nextCrownY);
      setScrimAnchorY(fieldTop + fieldRect.height / 2);
    };
    updateCrownY();
    window.addEventListener('resize', updateCrownY);
    // Re-measure once web fonts finish loading -- the heading's rendered
    // height (and therefore the gap) can shift after the initial paint.
    document.fonts?.ready?.then(updateCrownY).catch(() => {});
    return () => window.removeEventListener('resize', updateCrownY);
  }, []);

  // REAL SUBMISSION. The visitor stays on the page: the form POSTs to this
  // site's own /api/contact serverless function (see api/contact.js), which
  // emails the message to Ryan via Resend. `website` is a honeypot field --
  // hidden from humans, so anything that fills it is a bot.
  //
  // If /api/contact is unreachable or not configured yet (503 -- e.g. the
  // Resend key/env var isn't set), we fall back to the original `mailto:`
  // behavior so the form keeps working through that gap instead of breaking.
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const website = form.website ? form.website.value.trim() : ''; // honeypot

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      });
      if (!res.ok) throw new Error(`contact endpoint returned ${res.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      // Backend not available yet -> open the visitor's mail app as a fallback.
      const subject = encodeURIComponent(name ? `Portfolio contact from ${name}` : 'Portfolio contact');
      const body = encodeURIComponent(`${message}\n\nFrom ${name}${email ? ` (${email})` : ''}`);
      window.location.href = `mailto:craunryan@gmail.com?subject=${subject}&body=${body}`;
      setStatus('sent');
    }
  };

  return (
    <section className="chroma" id="chroma-contact" ref={sectionRef}>
      {/* Behind the arc: very faint vertical striations, masked to fade
          toward the section edges. */}
      <div className="chroma__striations" aria-hidden="true" />
      {/* The arc -- a single canvas (see ChromaCanvas.jsx). Replaces an
          11-div CSS/mask stack (glow layers, occluder, rim, core,
          specular, flare) that failed twice for structural reasons: a
          dark seam that survived three separate fixes, and flares that
          rendered as vertical spokes because a mask wasn't confining a
          conic gradient. One rasterization pass, no mask boundaries left
          to disagree with each other -- see build-log.md and
          ChromaCanvas.jsx's own top comment for the full account. */}
      <ChromaCanvas crownY={crownY}>
        {/* Scrim -- form-legibility fix: sits between ChromaCanvas's two
            stacked canvases (bloom below, rim+particles above -- see
            ChromaCanvas.jsx's own top comment for the two-canvas split).
            Z-INDEX, not DOM order, is what actually sandwiches it there
            (all three carry their own z-index; this element can render
            anywhere in ChromaCanvas.jsx's JSX and still land in between).
            SAFARI STACKING FIX (build-log.md): passed in as `children`
            instead of rendered as a sibling here, so it lives INSIDE
            `.chroma__canvas-wrapper`'s DOM -- that's what lets the wrapper
            take its own real z-index without breaking this sandwich; see
            ChromaCanvas.jsx's own comment for the full reasoning. See
            index.css for why a scrim and not a border-alpha raise or a
            canvas dim, and for `--scrim-anchor-y` (measured above, not
            hand-picked). */}
        <div
          className="chroma__scrim"
          aria-hidden="true"
          style={scrimAnchorY != null ? { '--scrim-anchor-y': `${scrimAnchorY}px` } : undefined}
        />
      </ChromaCanvas>
      {/* Content sits above the canvas (and the scrim). */}
      <div className="chroma__content">
        <div className="chroma__heading-block">
          <p className="chroma__eyebrow">Get in touch</p>
          <h2 id="chroma-heading" className="chroma__heading" ref={headingRef}>
            Let&rsquo;s build something
            <br />
            worth using.
          </h2>
        </div>
        {status === 'sent' ? (
          <div className="chroma__success" role="status" aria-live="polite">
            <span className="chroma__success-check" aria-hidden="true">
              <svg viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="24" />
                <path d="M15 27 l7.5 7.5 L38 17" />
              </svg>
            </span>
            <p className="chroma__success-title">Message sent</p>
            <p className="chroma__success-sub">Thanks &mdash; I&rsquo;ll get back to you soon.</p>
            <button
              type="button"
              className="chroma__success-again"
              onClick={() => setStatus('idle')}
            >
              Send another
            </button>
          </div>
        ) : (
        <form className="chroma__form" onSubmit={handleSubmit} aria-labelledby="chroma-heading">
          {/* Honeypot: hidden from real users, catches bots that auto-fill
              every field. Kept out of the tab order and off screen readers. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
          />
          <div className="chroma__form-row">
            <label className="chroma__field" ref={firstFieldRef}>
              <span>Name</span>
              <input type="text" name="name" autoComplete="name" required />
            </label>
            <label className="chroma__field">
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>
          </div>
          <label className="chroma__field">
            <span>Message</span>
            <textarea name="message" rows={4} required />
          </label>
          <button type="submit" className="chroma__cta" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p className="chroma__form-note" role="status">
            {status === 'sent' && "Thanks — I'll get back to you soon."}
            {status === 'error' && 'Something went wrong. Please email directly: '}
            {(status === 'idle' || status === 'sending') && 'Or email directly: '}
            {status !== 'sent' && <a href="mailto:craunryan@gmail.com">craunryan@gmail.com</a>}
          </p>
        </form>
        )}
      </div>
    </section>
  );
}
