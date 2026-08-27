import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// ATTIO NAV CORRECTION (build-log.md, Addendum 5 points 16-17) -- replaces
// WorkTabBar.jsx (the earlier "sticky horizontal tab bar" build, deleted
// entirely, not left dead alongside this). That build was based on a
// re-check of Attio.com capped at a ~958px automation viewport, which
// happened to render Attio's own narrow/collapsed responsive layout, not
// its real desktop pattern -- confirmed by re-inspecting live at a genuine
// 1568px width: Attio's actual desktop work-section nav is a LEFT-SIDE
// VERTICAL list, sitting in its own column beside the section's content,
// `position:sticky` *scoped to that section* (not `position:fixed` to the
// viewport). Labels here stay this portfolio's real project names --
// Attio's own copy ("Build pipeline," etc.) was only ever a format
// reference, not literal copy to reuse.
//
// CONTINUOUS-LINE INDICATOR (follow-up round): the first build's active
// marker was a separate 2px `::before` bar per link, color/opacity-toggled
// on activate -- discrete, not what Ryan asked for. His words: "I want the
// side nav to be like a continuous line, like Attio does, then it smoothly
// animates to the next section as you scroll." Replaced with one always-
// visible full-height track (`.work__sidebar-rail`) plus a single indicator
// segment (`.work__sidebar-indicator`) that's measured against the current
// active link's own position/height and slides to it via a CSS transform
// transition -- one continuous line with a segment that travels, not five
// independent bars swapping color.
// CUT THE CONCEPT CARDS (Ryan: "cut all 3" -- Anchorpoint/Wayfare/
// Ledgerline never linked anywhere, see Home.jsx): three fewer entries,
// same mechanism, nothing else about the scrollspy/indicator changes.
const TABS = [
  { id: 'work-copia', label: 'Copia' },
  { id: 'work-vault', label: 'Vault' },
  { id: 'work-picktheodds', label: 'PickTheOdds' },
];

export default function WorkSidebar() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const [indicator, setIndicator] = useState(null);
  const railRef = useRef(null);
  const linkRefs = useRef({});
  const reduced = usePrefersReducedMotion();

  // Scrollspy: whichever card section currently occupies a thin horizontal
  // band around the vertical center of the viewport is "active" -- the
  // standard IntersectionObserver rootMargin-band trick, ported unchanged
  // from the deleted WorkTabBar.jsx (this part of that build was correct
  // and already verified live; only the visual/structural nav pattern
  // around it was wrong).
  useEffect(() => {
    const sections = TABS.map((t) => document.getElementById(t.id)).filter(Boolean);
    if (!sections.length) return;
    const visibility = {};
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility[entry.target.id] = entry.isIntersecting;
        });
        const current = TABS.find((t) => visibility[t.id]);
        if (current) setActiveId(current.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // CONTINUOUS-LINE INDICATOR: measure the active link's position relative
  // to the rail on every activeId change and on resize (layout can reflow
  // -- e.g. a font/zoom change -- without activeId itself changing).
  // getBoundingClientRect on both and subtracting is viewport-scroll-
  // agnostic (no window.scrollY term needed) since both elements move
  // together with the page.
  const measure = useCallback(() => {
    const rail = railRef.current;
    const link = linkRefs.current[activeId];
    if (!rail || !link) return;
    const railRect = rail.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setIndicator({ top: linkRect.top - railRect.top, height: linkRect.height });
  }, [activeId]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // Click-to-scroll: offset measured live off SiteNav's own rendered
  // bottom edge (not a hardcoded constant) so it stays correct across
  // every breakpoint and if SiteNav's own sizing ever changes -- the
  // sidebar itself no longer needs an offset (it sits beside the cards,
  // in its own column, never overlapping their top edge on desktop), but
  // the target card's top can still land partly under SiteNav's fixed
  // pill without this.
  const scrollToTab = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const nav = document.querySelector('.sitenav');
      const navBottom = nav ? nav.getBoundingClientRect().bottom : 72;
      const offset = Math.max(navBottom, 0) + 24;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    },
    [reduced]
  );

  return (
    <nav className="work__sidebar" aria-label="Selected work">
      <div className="work__sidebar-rail" ref={railRef} aria-hidden="true">
        {indicator && (
          <span
            className="work__sidebar-indicator"
            style={{
              transform: `translateY(${indicator.top}px)`,
              height: `${indicator.height}px`,
              transitionDuration: reduced ? '0s' : undefined,
            }}
          />
        )}
      </div>
      <ul className="work__sidebar-list">
        {TABS.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              ref={(el) => {
                linkRefs.current[tab.id] = el;
              }}
              className={`work__sidebar-link${tab.id === activeId ? ' is-active' : ''}`}
              onClick={() => scrollToTab(tab.id)}
              aria-current={tab.id === activeId ? 'true' : undefined}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
