import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import ProjectCard from '@/components/ProjectCard';
import WorkSidebar from '@/components/WorkSidebar';
import FreelanceWork from '@/components/FreelanceWork';
import ChromaContact from '@/components/ChromaContact';
import Footer from '@/components/Footer';
import { CopiaTeaserArt, PickTheOddsCardArt } from '@/components/CardArt';
import vaultCardShot from '@/assets/vault-home.jpg';
import { setDocumentMeta } from '@/lib/documentMeta';
import { smoothScrollTo } from '@/lib/smoothScrollTo';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Extra clearance below the nav pill's own measured bottom edge -- same
// convention/value as SiteNav.jsx's SCROLL_MARGIN_BUFFER_PX and
// WorkSidebar.jsx's own offset math (each caller measures the live nav
// bottom and adds this so a scrolled-to section doesn't land tucked
// directly under the fixed pill).
const SCROLL_MARGIN_BUFFER_PX = 24;

// Formerly App.jsx. Renamed/moved to src/routes/Home.jsx as part of the
// COPIA CASE STUDY + ROUTING addition -- the persistent chrome that used to
// render directly here (LoadWash, ScrollProgress, SiteNav, CustomCursor)
// moved up to routes/Layout.jsx, which now wraps this page AND
// /work/copia, so neither duplicates it and neither remounts it on
// navigation. This component keeps only what's actually specific to the
// home page: the hero, the intro, and the work section.
//
// CARD REORDER (Addendum 4): Copia is the new card 01 (a real
// /work/copia route via ProjectCard's `to` prop, no stats -- it's
// pre-launch, no metrics to show). PickTheOdds moves to card 02.
//
// CUT THE CONCEPT CARDS (Ryan: "should we get rid of the empty projects?"
// -> "cut all 3"): Anchorpoint/Wayfare/Ledgerline (fictional, unbuilt
// concept cards that never linked anywhere -- see the deleted
// AnchorpointArt/WayfareArt/LedgerlineArt in CardArt.jsx) removed
// entirely. Three interchangeable "Concept work" dead-ends padded the
// section without adding real depth; the three real, shipped projects
// left (Copia/Vault/PickTheOdds) already span consumer iOS, a content
// platform, and B2B SaaS -- real breadth, real evidence, no dead clicks.
// Solstice (the wellness placeholder, dropped earlier to hold the line at
// 5 cards) was the same category of thing, cut the same way.
//
// PICKTHEODDS CASE STUDY (Ryan: "so it doesn't link out"): was the last of
// the 3 real projects still sending a visitor off the portfolio (an
// external `href` to a Framer-hosted writeup). Now a real in-house
// `to="/work/picktheodds"` route, same `ctaLabel`/`useSpecularCta`
// treatment as Copia/Vault -- see PickTheOddsCaseStudy.jsx.
//
// ATTIO NAV CORRECTION (build-log.md, Addendum 5): each card carries a
// stable `id` (see ProjectCard's `id` prop) that WorkSidebar.jsx's
// scrollspy targets and a sidebar-item click scrolls to. The sidebar and
// the card list now live side by side in `.work__layout` (a two-column
// grid, collapsing to one column with the sidebar re-flowed into a
// horizontal strip at mobile -- see index.css) so the sidebar's own
// `position:sticky` is scoped to that section, not the viewport --
// replaces the deleted WorkTabBar.jsx and its top/footer
// IntersectionObserver sentinels entirely (no longer needed; see
// WorkSidebar.jsx's file-top comment for why). <WorkSidebar/> is rendered
// here, not in routes/Layout.jsx, because it's specific to this page's
// work section -- it has nothing to sit beside on /work/copia.
export default function Home() {
  // WEB QUALITY AUDIT FIX (high priority #4): explicit here too (not just
  // relying on CopiaCaseStudy's unmount cleanup) so the home route's
  // title/description are always correct on a direct load AND after an
  // SPA-internal navigation back from /work/copia.
  useEffect(() => setDocumentMeta(), []);

  // CROSS-ROUTE SCROLL-TO FIX: any cross-route link that needs to land on
  // a specific home-page section navigates here with a `scrollTo` location
  // state carrying that section's element id, instead of relying on a
  // plain hash href (which can't survive a route change -- see
  // SiteNav.jsx's handleContactClick comment). Two callers use this today:
  // SiteNav.jsx's Contact Me link (`scrollTo: 'chroma-contact'`, via a
  // manual `navigate()` call, since it has to branch on same-page vs.
  // cross-page) and every "← Back to work" link across SiteNav.jsx and the
  // 3 case-study routes (`scrollTo: 'work'`, via Link's own `state` prop --
  // always cross-page, so no branching needed there). Generic on the id so
  // either can reuse it. Consume the flag once mounted, run the same
  // smoothScrollTo the home-page Contact Me click already uses, then clear
  // the state via a replace navigation so a later back/forward through
  // history doesn't replay the scroll.
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const scrollTarget = location.state?.scrollTo;
  useEffect(() => {
    if (!scrollTarget) return;
    const target = document.getElementById(scrollTarget);
    if (!target) return;
    const navBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sitenav-safe-top')) || 0;
    smoothScrollTo(target, { offset: navBottom + SCROLL_MARGIN_BUFFER_PX, reducedMotion });
    navigate('.', { replace: true, state: null });
  }, [scrollTarget, reducedMotion, navigate]);

  return (
    <main>
      <Hero />
      <Intro />

      <section className="work" id="work">
        {/* WEB QUALITY AUDIT FIX (high priority #2): heading order previously
            skipped straight from the page's one <h1> to each card's own
            <h3> title with no <h2> anywhere in between. This was already the
            section's visible label ("Selected Work") -- promoted from <p> to
            a real <h2> (same .work__eyebrow class, so no visual change) so
            it's the section heading the card titles nest under, instead of
            just promoting the card titles themselves (which would still
            leave orphaned h2s with no parent heading -- same structural
            problem one level up). */}
        <h2 className="work__eyebrow">Selected Work</h2>
        {/* ATTIO NAV CORRECTION (Addendum 5): sidebar + card list as two
            columns of one grid (`.work__layout`, index.css) -- this is what
            makes the sidebar's own `position:sticky` scoped to THIS
            section's own containing block instead of the viewport. See
            WorkSidebar.jsx / index.css for the full reasoning. */}
        <div className="work__layout">
          <WorkSidebar />
          <ul className="stack">
          <ProjectCard
            id="work-copia"
            index="01"
            client="Copia"
            title="A Grocery List Built for the Aisle, Not the Desk"
            tag="Native iOS / Consumer"
            byline="Solo, launching on the App Store this week"
            to="/work/copia"
            ctaLabel="View case study"
            useSpecularCta
            media={<CopiaTeaserArt />}
          />

          <ProjectCard
            id="work-vault"
            index="02"
            client="Vault"
            title="Get Unstuck Without Getting Spoiled"
            tag="Web / Content Platform"
            byline="Solo: product design, content strategy & engineering"
            to="/work/vault"
            ctaLabel="View case study"
            useSpecularCta
            indexBackdrop
            stats={[
              { num: '4,900', label: 'real users, Jan–Aug 2026' },
              { num: '0', label: 'ads, ever (by design)' },
              { num: '134', label: 'upvotes on r/Borderlands4 launch' },
            ]}
            media={<img src={vaultCardShot} alt="Vault, an ad-free gaming guide site (dark UI, orange accent)" loading="lazy" />}
          />

          <ProjectCard
            id="work-picktheodds"
            index="03"
            client="PickTheOdds"
            title="Modernizing a Subscription Platform"
            tag="B2B SaaS / Sports Analytics"
            byline="Role: UX/UI Designer, 1 Month"
            to="/work/picktheodds"
            ctaLabel="View case study"
            useSpecularCta
            indexBackdrop
            stats={[
              { num: '31%', label: 'decrease in time to place a bet' },
              { num: '25%', label: 'increase in user retention' },
              { num: '84%', label: 'increase in time on site' },
            ]}
            media={<PickTheOddsCardArt />}
          />
          </ul>
        </div>
      </section>

      <FreelanceWork />

      <ChromaContact />
      <Footer />
    </main>
  );
}
