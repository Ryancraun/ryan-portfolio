// Wraps a REAL screenshot in a device-bezel shape (Ryan, first: "can we get
// the screens in iphone screens? So it looks more real" -- then, for the
// home-page teaser specifically: "needs to be the BEST looking screen on a
// REAL iphone, not a shitty looking mockup iphone") -- a metal-edge chassis
// + rounded glass. Originally built as the real-screenshot counterpart to
// PhoneFrame.jsx (an honest EMPTY placeholder for content that didn't
// exist yet); PhoneFrame.jsx/VisualPlaceholder.jsx were both deleted once
// real screenshots replaced every placeholder slot on the site, including
// the home-page Copia teaser card that originally justified this bezel
// shape -- this is now the only device-frame component in the codebase.
//
// Deliberately has NO Dynamic Island element of its own -- every one of
// Copia's real captures (iPhone 17 Pro simulator) already has the real
// status bar and island baked into the screenshot itself. Drawing a second
// one on top of the frame would double it up.
export default function PhoneShot({ src, alt, caption, className = '' }) {
  return (
    <figure className={`phone-shot ${className}`}>
      <div className="phone-shot__body">
        <div className="phone-shot__screen">
          <img src={src} alt={alt} loading="lazy" />
        </div>
      </div>
      {caption && <figcaption className="phone-shot__caption">{caption}</figcaption>}
    </figure>
  );
}
