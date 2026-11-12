import { useLayoutEffect, useRef, useState } from 'react';

// Working recreation of Vault's hint-level control (Decision 01 on the Vault
// case study). One step, four levels of detail: the segmented radio group
// swaps the step text in place. The copy is Vault's own written example,
// verbatim -- do not edit it here without editing the guide it came from.
//
// A11y: a real radiogroup with a roving tabindex (Tab lands on the checked
// level, arrow keys / Home / End move and select, as native radios do). The
// step body is a stable polite live region; its text node is swapped, so a
// level change is announced. The
// outgoing text is an aria-hidden ghost that only exists for the crossfade.
// Motion (crossfade + height ease) is CSS-only and switched off under
// prefers-reduced-motion in index.css.
const LEVELS = [
  {
    id: 'none',
    label: 'None',
    text: 'The fight changes significantly at 50% health. Figure out what triggers it and how to respond.',
  },
  {
    id: 'nudge',
    label: 'Nudge',
    text: 'At 50% he teleports to center. Something spawns that you need to deal with before focusing him again.',
  },
  {
    id: 'bigger',
    label: 'Bigger Hint',
    short: 'Bigger',
    text: 'At 50% he teleports center and summons four clockwork minions. Kill the minions first or they’ll heal him.',
  },
  {
    id: 'full',
    label: 'Full Guide',
    short: 'Full',
    text:
      'At 50% he teleports center and spawns four clockwork minions. Kill them within 10 seconds: they heal him ' +
      'at 2% per second. His pattern also switches from targeted shots to a radial sweep. Stay in melee range ' +
      'during this phase.',
  },
];

export default function HintLevelControl({ defaultLevel = 1 }) {
  const [active, setActive] = useState(defaultLevel);
  const [ghost, setGhost] = useState(null); // index of the text fading out
  const radios = useRef([]);
  const body = useRef(null);
  const live = useRef(null);

  // Ease the card's height between levels: pin the body to the live text's
  // measured height, and keep it in sync if the width (and so wrapping) changes.
  useLayoutEffect(() => {
    const el = live.current;
    const box = body.current;
    if (!el || !box) return undefined;
    const sync = () => { box.style.height = `${el.offsetHeight}px`; };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  const select = (i, focus) => {
    if (i === active) return;
    setGhost(active);
    setActive(i);
    if (focus) radios.current[i]?.focus();
  };

  const onKeyDown = (e) => {
    const last = LEVELS.length - 1;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  };

  return (
    <div className="cs-hint" data-level={LEVELS[active].id}>
      <div className="cs-hint__bar">
        <span className="cs-hint__eyebrow" id="cs-hint-label">Hint level</span>
        <div className="cs-hint__seg" role="radiogroup" aria-labelledby="cs-hint-label" onKeyDown={onKeyDown}>
          {LEVELS.map((lvl, i) => (
            <button
              key={lvl.id}
              ref={(n) => { radios.current[i] = n; }}
              type="button"
              role="radio"
              aria-checked={i === active}
              tabIndex={i === active ? 0 : -1}
              className="cs-hint__opt"
              onClick={() => select(i, false)}
            >
              <span className="cs-hint__ticks" aria-hidden="true">
                {LEVELS.map((_, t) => (
                  <i key={t} className={t <= i ? 'is-on' : undefined} />
                ))}
              </span>
              {lvl.short ? (
                <>
                  <span className="cs-hint__name cs-hint__name--long">{lvl.label}</span>
                  <span className="cs-hint__name cs-hint__name--short" aria-hidden="true">{lvl.short}</span>
                </>
              ) : (
                <span className="cs-hint__name">{lvl.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="cs-hint__step">
        <div className="cs-hint__body" ref={body} aria-live="polite" aria-atomic="true">
          <p key={`live-${active}`} ref={live} className="cs-hint__text">
            {LEVELS[active].text}
          </p>
          {ghost !== null && ghost !== active && (
            <p
              key={`ghost-${ghost}-${active}`}
              className="cs-hint__text cs-hint__text--ghost"
              aria-hidden="true"
              onAnimationEnd={() => setGhost(null)}
            >
              {LEVELS[ghost].text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
