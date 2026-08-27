import { Link } from 'react-router-dom';
import SpecularButton from '@/components/reactbits/SpecularButton/SpecularButton';

// Addendum 2, point 10: the reactbits component IS the card -- full-bleed,
// with metadata composited on top of it -- not a decorative background
// sitting behind a separate horizontal row+metadata layout (Freshman's
// numbered-row pattern, now superseded).
//
// ATTIO-STYLE STICKY TAB BAR + SCROLLSPY (build-log.md, replaces the old
// "Siena-style" stacked-scroll choreography): each card used to live inside
// a tall position:sticky "pin" wrapper driven by `useCardStack` (a rAF loop
// writing scale/opacity/translateY every tick to fake a peek-in/pin/recede
// depth effect, plus a blurred `.card__depth` background plane). Ryan's
// direct, high-conviction reference was Attio's own work section -- verified
// live -- which has NONE of that: a sticky TAB BAR above the content, and
// each category's content sitting in completely normal document flow, one
// after another. So the section-level choreography is gone entirely:
// `useCardStack` is deleted, `.card__depth` is deleted, and this card is now
// a plain full-height flex-centered section (`.stack__item` / `.stack__frame`
// in index.css, both now static, no `position:sticky`, no JS-driven
// transform/opacity). Everything on the card ITSELF -- reactbits background,
// scrim, metadata, CTA -- is unchanged; only the wrapper that used to
// choreograph it is gone. `id` (new prop) is what WorkSidebar.jsx's
// scrollspy targets via IntersectionObserver and what a sidebar-item click
// scrolls to (ATTIO NAV CORRECTION, build-log.md Addendum 5, points 16-17:
// the tab-bar-above-content pattern this comment originally described was
// itself wrong -- Attio's real desktop pattern is a left-side vertical
// sidebar, not a top tab bar; WorkTabBar.jsx was replaced by
// WorkSidebar.jsx, deleted, not left dead alongside it).
//
// CARD DEPTH-LAYER PARALLAX (build-log.md, Addendum 5 points 18-19): the
// card itself still gets ZERO transform, from any mechanism -- it stays
// exactly where normal document flow puts it, same as the paragraph above
// describes. `.card__media` (this card's reactbits background/image,
// rendered below) is the one thing that moves, via a CSS-only,
// compositor-driven scroll-timeline animation defined entirely in
// index.css -- nothing in this file changed to support it.
//
// CTA RELOCATION + COOLER BUTTON (build-log.md "CURSOR FIX + CLEAN CARD
// FONTS + CTA RELOCATION + BORDERGLOW HERO"): the CTA used to be its own
// element, `position:absolute; top/right`, floating over whatever media sits
// behind it -- on the card with a real product screenshot that meant it sat
// on top of the screenshot's own "Online" badge. It's now rendered IN-FLOW
// inside `.card__meta` (`.card__meta-cta`, after the stats), the same
// guaranteed-opaque dark-scrim block that already holds title/tag/byline/
// stats -- structurally, it can never again land on raw media content, on
// this card or any future one, because it's a normal document-flow child of
// the metadata block, not a separately positioned overlay guessing where the
// media's "safe" corner is.
// Also swapped Star Border (still vendored, unused) for the real
// reactbits.dev Specular Button -- a shader-driven specular rim light that
// tracks the cursor and brightens on proximity, checked live against Star
// Border and reactbits' other button-shaped components before choosing it
// (see build-log.md for the comparison). `useStarCta` was renamed
// `useSpecularCta` to match; still opt-in.
//
// COPIA CASE STUDY + CARD REORDER (build-log.md "COPIA CASE STUDY PAGE +
// CARD REORDER"): card 01 is now Copia, a real dedicated /work/copia route
// (Addendum 4) -- it uses the `to` prop (an internal react-router `Link`,
// no new tab, see below) instead of `href`. PickTheOdds moved to card 02;
// it originally kept its external `href` (a Framer-hosted writeup), then
// moved to its own `to="/work/picktheodds"` route in a later round (Ryan:
// "so it doesn't link out") -- see PickTheOddsCaseStudy.jsx. `indexBackdrop`
// (the PickTheOdds-screenshot-logo collision fix two sections below)
// followed PickTheOdds to card 02 -- it's keyed to that specific screenshot
// asset, not to card position or to which link prop is set.
//
// TILT MOVED TO HERO CARD (build-log.md): the 3D tilt-on-hover from the
// "WAVES HERO + CARD TILT" addendum briefly lived here (a `.card__tilt`
// inner wrapper + `useTiltCard(cardRef)`) but Ryan corrected it: "I wanted
// the card tilt on the 'Ryan Craun Card' Not the project cards." Removed
// entirely, including its now-dead CSS scaffolding (`.card__tilt`, and the
// `perspective` that only existed to project that wrapper's 3D rotation) --
// these 5 cards are back to no tilt-on-hover, `.card`'s children are direct
// children of `.card` again, and `useTiltCard` now lives only in Hero.jsx.
export default function ProjectCard({
  id,
  index,
  client,
  title,
  tag,
  byline,
  href,
  to,
  stats,
  media,
  fxTokens,
  ctaLabel = 'View case study',
  useSpecularCta = false,
  indexBackdrop = false,
}) {
  // COPIA CASE STUDY: cards can be "clickable" two ways -- an internal `to`
  // (a real react-router navigation to an in-house case study, no new tab)
  // and an external `href` (opens in a new tab so a visitor never loses
  // this site) for anything that genuinely lives elsewhere. All 3 real
  // projects (Copia, Vault, PickTheOdds) use `to` now -- PickTheOdds moved
  // off its external `href` once it got its own in-house route (Ryan: "so
  // it doesn't link out"); `href` stays supported for any future project
  // that's genuinely hosted somewhere else. Exactly one of the two is ever
  // set per card; cards with neither (the fictional concept placeholders)
  // stay a plain non-interactive `<div>`, unchanged.
  const Tag = to ? Link : href ? 'a' : 'div';
  const linkProps = to ? { to } : href ? { href, target: '_blank', rel: 'noopener' } : {};

  // HIRING-MANAGER REVIEW FIX (independent research + critic review, both
  // flagged this): 3 of the 6 home-page cards are unbuilt concepts, but
  // rendered at identical visual weight to the 3 real, clickable projects
  // -- "a recruiter skimming fast will not register that half the
  // 'selected work' section is unbuilt concepts." The byline already says
  // "Concept work -- case study in progress" as plain text, but it sits
  // low in the meta block, well after a fast skim has already formed an
  // impression. Derived, not a new prop to remember to set -- a card is a
  // concept if and only if it has neither `to` nor `href`, the exact same
  // condition that already hides its CTA below, so there's no way for
  // this badge and the CTA-hiding logic to ever disagree.
  const isConcept = !to && !href;

  return (
    <li className="stack__item" id={id}>
      <div className="stack__frame">
        <Tag className="card" {...linkProps}>
          <div
            className={`card__media${fxTokens ? ' card__media--fx' : ''}`}
            aria-hidden="true"
            style={fxTokens ? { '--fx-a': fxTokens.a, '--fx-b': fxTokens.b } : undefined}
          >
            {media}
          </div>
          <div className="card__scrim" aria-hidden="true" />
          {/* CARD INDEX-NUMBER COLLISION FIX: PickTheOdds's media is a real
              product screenshot with its own "PICKTHEODDS" wordmark baked
              into the top-left corner -- the same corner .card__index sits
              in. It followed PickTheOdds when it moved from card 01 to card
              02 (Copia/Anchorpoint/Wayfare/Ledgerline render generative art
              or a device-frame placeholder, nothing in that corner, so they
              never needed this). indexBackdrop (see .card__index--backdrop
              in index.css) drops the numeral into the screenshot's quiet
              sidebar gap below the logo and adds a small dark glass chip
              (same rgba(10,10,12,*) family as .card__cta's pill) as a second
              line of defense so it stays legible regardless of what's under
              it. Opt-in per card, not a default. */}
          <div className={`card__index${indexBackdrop ? ' card__index--backdrop' : ''}`}>{index}</div>
          {isConcept && (
            <span className="card__badge" aria-hidden="true">
              Concept
            </span>
          )}

          <div className="card__meta">
            <p className="card__client">{client}</p>
            <h3 className="card__title">{title}</h3>
            <p className="card__tag">{tag}</p>
            <p className="card__byline">{byline}</p>
            {stats && (
              <div className="card__stats">
                {stats.map((s) => (
                  <div className="stat" key={s.label}>
                    <span className="stat__num">{s.num}</span>
                    <span className="stat__label">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Addendum 2, point 9: exactly one CTA mechanism per card.
                Copia, Vault and PickTheOdds (all `to` now) standardize on
                the Specular Button -- the more literal reactbits use (see
                comment at the top of this file for why it replaced Star
                Border). FIX ROUND 3, required fix 2: the 3 fictional concept
                cards have neither `to` nor `href` and no real case study to
                send anyone to, so they render no CTA element at all --
                previously they always showed a button-shaped "View case
                study" pill that looked clickable and did nothing. The byline
                ("Concept work — case study in progress") already carries
                that signal as plain text, so nothing on those cards visually
                presents as a working link/button that isn't one.
                CTA RELOCATION: now a normal in-flow child of card__meta
                (below the stats), not a separately absolutely-positioned
                overlay -- see the file-top comment for why. */}
            {href || to ? (
              <div className="card__meta-cta">
                {useSpecularCta ? (
                  <div className="card__cta card__cta--specular">
                    <SpecularButton
                      as="span"
                      size="sm"
                      radius={999}
                      tint="#0a0a0c"
                      tintOpacity={0.55}
                      textColor="#e2a73c"
                      lineColor="#e2a73c"
                      baseColor="#3a2f18"
                      intensity={1.3}
                      shineSize={14}
                      shineFade={46}
                      proximity={260}
                    >
                      {ctaLabel}
                    </SpecularButton>
                  </div>
                ) : (
                  <div className="card__cta">
                    <span>{ctaLabel}</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </Tag>
      </div>
    </li>
  );
}
