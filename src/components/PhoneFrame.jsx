// A plain iPhone mockup for raw simulator captures: titanium-dark bezel,
// screen corner radius, Dynamic Island. Pure CSS (see .phone in index.css),
// so a screenshot reads as a real separate screen rather than a flat crop.
//
// <PhoneFrame src={img} alt="..." caption="1 · Pick your medication" />
// <PhoneFlow> wraps several frames as a numbered, horizontally ordered flow.
// Pass island={false} when the capture already has the Dynamic Island baked
// in, so the frame doesn't draw a second one over it.
export default function PhoneFrame({ src, alt, caption, island = true, className = '' }) {
  return (
    <figure className={`phone ${className}`.trim()}>
      <div className="phone__body">
        <div className="phone__screen">
          <img src={src} alt={alt} loading="lazy" decoding="async" />
          {island && <span className="phone__island" aria-hidden="true" />}
        </div>
      </div>
      {caption && <figcaption className="phone__caption">{caption}</figcaption>}
    </figure>
  );
}

// `label` names the group for assistive tech. `title` (optional) also shows a
// short visible heading above the row, e.g. one branch of a flow ("Weekly
// shot"). `className` always lands on the .phone-flow grid itself.
export function PhoneFlow({ label, title, className = '', children }) {
  // 3- and 4-screen flows scroll sideways on phones (index.css, Round 4 fix
  // 17), so they take keyboard focus to be scrollable with the arrow keys.
  const scrolls = /\bphone-flow--[34]\b/.test(className);
  const flow = (
    <div className={`phone-flow ${className}`.trim()} role="group" aria-label={label} tabIndex={scrolls ? 0 : undefined}>
      {children}
    </div>
  );
  if (!title) return flow;
  return (
    <div className="phone-flow-block">
      <p className="phone-flow__title" aria-hidden="true">{title}</p>
      {flow}
    </div>
  );
}
