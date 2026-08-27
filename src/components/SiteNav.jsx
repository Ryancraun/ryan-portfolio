import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { smoothScrollTo } from '@/lib/smoothScrollTo';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Extra clearance (CSS px) below the nav pill's own measured bottom edge,
// so a scrolled-to section doesn't land tucked directly under it.
const SCROLL_MARGIN_BUFFER_PX = 24;

// ADDENDUM 3, item 3: persistent frosted-glass top nav. Folds the old
// standalone .brandmark fixed div into this bar (Ryan's "avoid two things
// doing similar jobs awkwardly" call) instead of running two separate
// fixed-position elements.
//
// LINKEDIN ADDED (job-search gap pass): a real, resume-confirmed URL
// (linkedin.com/in/ryancraun, from Ryan_Craun_Resume_Master.pdf), not a
// fabricated destination -- the "no fabricated destinations" rule from the
// original two-link build still holds, this just reflects that a third real
// link now exists.
//
// MOBILE DECLUTTER (Ryan, screenshot: "header looks flooded on mobile"):
// three links plus the byline in one small pill read as crowded at narrow
// widths in a way they don't at tablet/desktop. `.sitenav__link--linkedin`
// is hidden below the existing 640px breakpoint rather than shrinking
// everything further -- LinkedIn is still one tap away in the footer
// (Footer.jsx, present at every width), so nothing becomes unreachable,
// the mobile pill just goes back to the same two-link density it had
// before LinkedIn was added.
//
// COPIA CASE STUDY + ROUTING: the "RC" mark used to be a same-page `#hero`
// anchor, which only makes sense while already on the home page -- on
// /work/copia there's no `#hero` element, so it would silently do nothing.
// It's now a real react-router `Link` to `/`, so it always does the same
// job ("take me back to the top of the site") regardless of route. On the
// home page itself it still lands at the top (react-router's default
// scroll-to-0 behavior on a same-target navigation, reinforced by
// routes/ScrollToTop.jsx).
export default function SiteNav() {
  const { pathname } = useLocation();
  // NAV BACK-BUTTON FIX (Ryan: "back to work back button only appears on
  // some case studies"): was hardcoded to the single route that existed
  // when this nav was first built (`/work/copia`), so Vault and
  // PickTheOdds never got it once they shipped their own case-study
  // routes. `startsWith('/work/')` covers every case study by shape, not
  // by name -- a future case study route gets this for free, no second
  // hardcoded check to remember to add.
  const onCaseStudy = pathname.startsWith('/work/');
  const onHome = pathname === '/';
  const navRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const navigate = useNavigate();

  // Exposes the pill's own rendered bottom edge (viewport px) as a global
  // CSS var so any section, on any route, can reserve enough
  // `scroll-margin-top` to land clear of the nav rather than tucked under
  // it -- measured, not guessed, since `.sitenav`'s own top offset and
  // height both come from clamp()/vw values that shift with viewport
  // width (see index.css). Same convention this codebase already uses for
  // `--scrim-anchor-y` (ChromaContact.jsx) -- a JS measurement exposed as
  // a CSS custom property rather than a hand-picked constant.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const update = () => {
      const bottom = nav.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty('--sitenav-safe-top', `${Math.round(bottom)}px`);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Contact Me -- smooth-scrolls to the Chroma contact section (custom
  // rAF easing, see smoothScrollTo.js; deliberately not
  // `scroll-behavior:smooth`). The section only exists on the home route.
  //
  // CROSS-ROUTE FIX (Ryan: "when I'm in a case study and I click Contact
  // Me, it just takes me back to the home page"): the old comment above
  // this one described the plain `href="/#chroma-contact"` falling through
  // to a default anchor jump from a case-study route as *intentional* --
  // it wasn't actually landing on Contact at all. React Router intercepts
  // that href as a client-side nav to `/`, and ScrollToTop.jsx (keyed only
  // on pathname, not hash) unconditionally resets scroll to (0,0) on that
  // route mount, discarding the hash target before it could ever be
  // honored. Fixed by handling the cross-route case explicitly instead of
  // relying on anchor/hash behavior surviving a route change: navigate to
  // `/` with a `scrollTo` state flag, and let Home.jsx pick it up post-
  // mount and run the same smoothScrollTo/`--sitenav-safe-top` mechanism
  // used below for the same-page case.
  function handleContactClick(event) {
    // Let a modified click (open in new tab/window, middle-click) or a
    // non-primary button through untouched -- only a plain left-click
    // hijacks the default anchor jump.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!onHome) {
      navigate('/', { state: { scrollTo: 'chroma-contact' } });
      return;
    }
    const target = document.getElementById('chroma-contact');
    if (!target) return;
    const navBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sitenav-safe-top')) || 0;
    smoothScrollTo(target, { offset: navBottom + SCROLL_MARGIN_BUFFER_PX, reducedMotion });
  }

  return (
    <nav className="sitenav" aria-label="Primary" ref={navRef}>
      {/* POSITION FIX (Ryan: "this needs to be the left most button on the
          top nav right now it is in the middle"): rendered as the very
          first child of `.sitenav` itself, ahead of the "RC" mark, so
          normal flex document order alone makes it the leftmost element --
          no absolute positioning or reordering needed. Only rendered on a
          case-study route (`onCaseStudy` above), so the home page's nav is
          unchanged -- RC stays leftmost there, same as before this fix. */}
      {/* LINK AUDIT (Ryan: "click through everything... make sure that no
          one ever gets stuck"): was a plain `to="/"`, landing on the hero
          -- not the Selected Work section the label promises. `state`
          reuses the same scrollTo mechanism Home.jsx already consumes for
          the Contact Me cross-route fix above (generic on the target id,
          not hardcoded to Contact). Link's own `state` prop is the
          declarative form of `navigate(to, {state})`, so this keeps all of
          Link's native click handling (modifier keys, open-in-new-tab)
          for free -- no custom onClick needed here, unlike Contact Me
          (which has to branch on same-page vs. cross-page). */}
      {onCaseStudy && (
        <Link className="sitenav__link" to="/" state={{ scrollTo: 'work' }}>
          ← Back to work
        </Link>
      )}
      {/* WEB QUALITY AUDIT FIX (low priority #9): the aria-label previously
          didn't contain the visible "RC" text at all (WCAG 2.5.3 Label in
          Name) -- a voice-control user saying "click RC" would fail to
          match. Now leads with the visible text. */}
      <Link className="sitenav__mark" to="/" aria-label="RC (Ryan Craun), back to top">
        RC
      </Link>
      {/* PERSISTENT BYLINE (moved here from Hero.jsx -- Ryan: "add it in
          the global top nav bar so it is always there"). SiteNav is
          mounted once at the app root (see App.jsx/main.jsx), not inside
          any one route, so putting the byline here -- instead of the
          hero-only floating chip the previous round built -- makes it
          genuinely sitewide: visible on /work/copia and /work/vault too,
          not just the home route, and with no separate floating element or
          collision math to maintain against this same nav pill. Real,
          non-decorative text (not aria-hidden) -- this is the one place
          that actually states the current employer, so it reaches screen
          readers too. */}
      <div className="sitenav__byline">
        <span className="sitenav__byline-name">Ryan Craun</span>
        <span className="sitenav__byline-dot" aria-hidden="true" />
        <span className="sitenav__byline-role">Product Designer at FEVO</span>
      </div>
      <div className="sitenav__links">
        <a className="sitenav__link" href="/#chroma-contact" onClick={handleContactClick}>
          Contact Me
        </a>
        <a
          className="sitenav__link sitenav__link--linkedin"
          href="https://linkedin.com/in/ryancraun"
          target="_blank"
          rel="noopener"
        >
          LinkedIn
        </a>
        {/* HIRING-MANAGER REVIEW FIX: was `href="#"`, a dead link -- the
            site's single hoarded-accent primary CTA, on every page, doing
            nothing. `/ryan-craun-resume.pdf` lives in `public/` (a real
            file Ryan chose, not a fabricated one), served as a static
            asset so this is a real download, not another anchor jump.
            External-file convention matches PickTheOdds' own link
            elsewhere on this site: new tab, `rel="noopener"`. */}
        <a
          className="sitenav__link sitenav__link--resume"
          href="/ryan-craun-resume.pdf"
          target="_blank"
          rel="noopener"
        >
          View Resume
        </a>
      </div>
    </nav>
  );
}
