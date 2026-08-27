import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import PhoneShot from '@/components/PhoneShot';
import AppStoreBadge from '@/components/AppStoreBadge';
import StatNumber from '@/components/StatNumber';
import { setDocumentMeta } from '@/lib/documentMeta';
import copiaHomeDark from '@/assets/copia-home-dark.jpg';
import copiaHomeLight from '@/assets/copia-home-light.jpg';
import copiaRouteDark from '@/assets/copia-route-dark.jpg';
import copiaScanPages from '@/assets/copia-scan-pages.jpg';
import copiaScanReview from '@/assets/copia-scan-review.jpg';
import copiaRecipes from '@/assets/copia-recipes.jpg';
import copiaRecipeDetail from '@/assets/copia-recipe-detail.jpg';
import copiaListFromRecipe from '@/assets/copia-list-from-recipe.jpg';
import copiaOnboarding from '@/assets/copia-onboarding.jpg';
import copiaPaywall from '@/assets/copia-paywall.jpg';

// COPIA CASE STUDY (Addendum 4): a real, dedicated case-study route built
// directly from projects/ryan-portfolio-immersive/copia-source-document.md
// -- not a summary or a paraphrase. Structure follows the source doc's own
// §11 recommendation (hook -> brief problem framing -> deep decisions ->
// technical/trust -> tester-driven fixes -> what's next), validated rather
// than reordered by the researcher's direct inspection of current (2026)
// case-study format precedent -- see build-log.md's "COPIA CASE STUDY PAGE
// + CARD REORDER" entry for the citations. One structural addition beyond
// the source doc's own draft: the scannable decision jump-list right after
// the problems, so a 10-15-second skim already shows there are 8 real,
// named tradeoffs before committing to read any one of them.
//
// No fabricated metrics anywhere on this page -- every number here is
// either a real pre-launch fact (TestFlight build count, test counts) or a
// PickTheOdds-style stat tile this project deliberately does NOT have,
// because Copia doesn't have one yet.
//
// REAL SCREENSHOTS (Ryan: "apply the copia screenshots in the case study
// where it makes sense, and show off the features"): 10 real iPhone 17 Pro
// simulator captures (source: Copia-Portfolio-Screenshots.zip, Ryan's own
// Downloads folder), downscaled from their native 1206x2622 PNGs to
// 860px-wide JPEGs (matching the size these render at in a phone-mock
// figure -- the originals ran 100KB-3MB each, mostly photo-heavy recipe
// screens that compress far better as JPEG than PNG) via a one-off
// Puppeteer canvas script, the same tool already in this project's
// dependency tree for scripts/prerender.mjs, so no new dependency was
// added just to resize 10 images. PhoneFrame/VisualPlaceholder (the
// honest-placeholder components from when nothing existed to show) are
// gone from every spot a real screenshot now covers -- Decisions 3, 4, 6
// and 7 stay text-only because no real capture applies to that specific
// micro-decision (6 explicitly because it isn't built yet), which is the
// same honesty rule as before, just with far less left to placeholder.
//
// DEVICE-FRAME ROUND (Ryan: "can we get the screens in iphone screens? So
// it looks more real?"): every screenshot below moved from a plain
// bordered rectangle (`.cs-shot`) to `PhoneShot.jsx` -- the same bezel/
// glass treatment already proven on the home page's Copia teaser card,
// just sized for a readable case-study figure instead of a small card
// preview. No second Dynamic Island drawn on top -- every capture already
// has its own real one baked in from the simulator.
//
// AUDIENCE PASS (Ryan: "these seem engineering heavy... optimized for
// PRODUCT designers / UX / UI designers"): "Building for trust" and "What
// testers changed" were rewritten to drop implementation-level detail a
// design hiring manager doesn't need to evaluate the work -- schema/column
// names, sync-resolution mechanics, coverage percentages, and an entire
// paragraph about the AI-assisted build tooling (off-topic for a design
// case study, not cut for being untrue) -- while keeping every story that
// actually demonstrates design judgment (the Lists-header accessibility
// bug is a genuine UX insight -- "the tests were checking the wrong
// thing" -- so it stayed, just without the raw assertion-percentage
// language around it). No `<code>` spans left anywhere on this page for
// the same reason; database field names read as engineering, not design.
export default function CopiaCaseStudy() {
  useEffect(() => {
    // WEB QUALITY AUDIT FIX (high priority #4): was title-only; now also
    // sets a real per-route meta description + og:title/og:description
    // instead of leaving the site-wide default in place for every route.
    return setDocumentMeta({
      title: 'Copia | Ryan Craun',
      description:
        'Copia, a native iOS grocery and recipe app built for the aisle, not the desk. A solo case study: multi-page recipe scanning, offline-first sync, and eight named design decisions with their real costs.',
    });
  }, []);

  return (
    <main className="cs">
      <section className="cs-hero">
        <Link className="cs-hero__back" to="/" state={{ scrollTo: 'work' }}>
          ← Back to work
        </Link>
        <p className="cs-hero__eyebrow">Case Study: Native iOS</p>
        <h1 className="cs-hero__title">Built for the aisle, not the desk.</h1>
        <p className="cs-hero__line">
          Copia is a native iOS grocery and recipe app built around the moment that matters (standing in the
          aisle, phone in one hand), not the moment of writing the list down.
        </p>
        <div className="cs-hero__frame">
          <span>Solo: design, interaction &amp; engineering</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Native iOS (SwiftUI) + Supabase</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Launching on the App Store this week</span>
        </div>
        <div className="cs-hero__cta">
          <AppStoreBadge />
          <span className="cs-hero__cta-note">Coming soon (pre-launch)</span>
        </div>

        {/* Impact upfront, even pre-launch -- a portfolio piece is skimmed
            before it's read, so the real numbers belong in the hero, not
            buried in "Building for trust" further down. Copia has no
            adoption impact yet (pre-launch, honestly stated above) -- these
            are real status/rigor numbers instead of invented usage stats,
            same "no fabricated metrics" rule this page follows everywhere
            else, just pulled forward rather than left where they were
            written. */}
        <div className="cs-hero__stats">
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={12} />
            </span>
            <span className="stat__label">TestFlight build, feature-complete for 1.0</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={242} />
            </span>
            <span className="stat__label">automated tests (149 unit, 93 UI)</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={3} />
            </span>
            <span className="stat__label">shipped fixes from 2 live testers</span>
          </div>
        </div>

        <PhoneShot
          src={copiaHomeDark}
          alt="Copia's home screen: an active-trip hero card with a route progress dial, a pinned quick-top-up list, and category rows"
        />
      </section>

      <ScrollReveal as="section" className="cs-section cs-problems">
        <h2 className="cs-section__heading">The gap</h2>
        <p className="cs-section__lede">
          Almost every grocery app optimizes the writing experience, then ships the same dense interface into the
          aisle. Five real problems (from watching someone shop, a tester report, or a friction hit personally)
          are the spine of what follows.
        </p>
        <ol className="cs-problems__list">
          <li>
            <h3>Desk vs. aisle</h3>
            <p>
              At a desk you have both hands and full attention. In an aisle you have one hand, a cart, and roughly a
              second per glance. The shopping surface had to be a genuinely different interface, not the same list
              with a checkbox.
            </p>
          </li>
          <li>
            <h3>Recipes trapped in formats a list can&rsquo;t reach</h3>
            <p>
              Getting ingredients from a cookbook page onto a list means typing them one at a time, book held open,
              for a real nine-page cooking session. Scanning had to work at that length, trustworthy enough that no
              one proofreads every line.
            </p>
          </li>
          <li>
            <h3>Shared lists break on the household model</h3>
            <p>
              The obvious model (a household with shared lists inside it) fails immediately: weekly groceries go
              to a partner, party supplies to three friends, the hardware list to nobody. Invites had to belong to a
              list, not a household.
            </p>
          </li>
          <li>
            <h3>A list that loses data once is dead</h3>
            <p>
              Groceries are low-stakes individually, high-stakes as a habit. One silent sync failure permanently
              ends the app&rsquo;s usefulness: the list can no longer be trusted. Correctness under concurrency
              isn&rsquo;t a nicety here; it&rsquo;s the entire product promise.
            </p>
          </li>
          <li>
            <h3>The first screen teaches the user what the app is</h3>
            <p>
              A first-run tester typed their entire shopping list into the list-name field. Not user error: the
              field asked &ldquo;What&rsquo;s this list for?&rdquo;, a question about contents, with no label at
              all.
            </p>
          </li>
        </ol>
      </ScrollReveal>

      <ScrollReveal as="nav" className="cs-section cs-jumplist" aria-label="Key design decisions">
        <h2 className="cs-section__heading">Eight decisions, in depth</h2>
        <p className="cs-section__lede">
          Each one below is the decision, the reasoning, and what it honestly cost: the cost is what makes it a
          case study rather than a feature tour.
        </p>
        <ol className="cs-jumplist__list">
          <li>
            <a href="#decision-1">Removing the quantity number</a>
          </li>
          <li>
            <a href="#decision-2">Two timestamps for &ldquo;the current trip&rdquo;</a>
          </li>
          <li>
            <a href="#decision-3">Per-list invites, not household accounts</a>
          </li>
          <li>
            <a href="#decision-4">&ldquo;Who got this&rdquo; attribution</a>
          </li>
          <li>
            <a href="#decision-5">Multi-page scanning as a designed flow</a>
          </li>
          <li>
            <a href="#decision-6">Learning the store&rsquo;s aisle order on-device</a>
          </li>
          <li>
            <a href="#decision-7">Labeling the list-name field</a>
          </li>
          <li>
            <a href="#decision-8">Monetization: cap by lifetime, not by day</a>
          </li>
        </ol>
      </ScrollReveal>

      <section className="cs-section cs-decisions">
        <ScrollReveal as="article" className="cs-decision cs-decision--feature" id="decision-1">
          <p className="cs-decision__kicker">Decision 1 of 8: the reversal</p>
          <h3>Removed the quantity number from the shopping row</h3>
          <p>
            The decision: delete the quantity display from the item row and its VoiceOver label. This{' '}
            <em>reversed</em> an earlier, explicit decision to keep it: &ldquo;two onions means put two in the
            basket.&rdquo;
          </p>
          <p>
            <strong>Why it reversed:</strong> watching someone actually shop. At arm&rsquo;s length, &ldquo;eggs
            3&rdquo; doesn&rsquo;t read as a count; it reads as a measure, like a size or a weight. The number
            degraded the scan rather than helping it.
          </p>
          <p>
            <strong>What was kept:</strong> quantity is still stored, still merged, still what deduplication keys
            on. Only the display changed: three tests assert on digits rather than an exact string, so re-rendering
            it as &ldquo;×3&rdquo; would still fail the suite. The decision is pinned, not just implemented.
          </p>
          <p>
            <strong>The cost, named honestly:</strong> real information loss for the small number of items where
            count actually matters. Accepted, because the failure mode of a misread number is worse than the
            failure mode of a missing one. A designer documenting they changed their own mind after watching a real
            person shop is the most persuasive thing on this page.
          </p>
          <PhoneShot
            src={copiaRouteDark}
            alt="Copia's shopping screen: aisle stations with item rows (Carrots, Bananas, Ground beef, Cheddar cheese), no quantity number on any row"
            caption={
              <>
                The shipped row, no quantity display: the earlier &ldquo;eggs 3&rdquo; version this decision
                reversed was never captured, since it no longer exists to screenshot; the reasoning above is the
                record of it.
              </>
            }
          />
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-2">
          <p className="cs-decision__kicker">Decision 2 of 8</p>
          <h3>Two timestamps for &ldquo;the current trip&rdquo;</h3>
          <p>
            The home screen promotes one list to a hero card as the active trip. Promoting by most-recent-use meant
            any new list instantly seized the hero; filtering empty lists out fixed that, but then &ldquo;make this
            the trip&rdquo; couldn&rsquo;t be offered on an empty list, exactly when you&rsquo;d want it.
          </p>
          <p>
            <strong>The decision:</strong> two separate timestamps: one that tracks ordinary use and promotes
            automatically, one that&rsquo;s written only by the explicit &ldquo;make this the trip&rdquo; action.
            The bug looked like a broken menu; the real cause was one concept doing two jobs, not a broken control.
          </p>
          <PhoneShot
            src={copiaHomeLight}
            alt="Copia's home screen, light appearance: the Weekly hero card is the one currently promoted as the active trip"
            caption={
              <>
                The hero card in question: &ldquo;Weekly&rdquo; is promoted here because of the second, explicit
                timestamp, not just because it was touched most recently.
              </>
            }
          />
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-3">
          <p className="cs-decision__kicker">Decision 3 of 8</p>
          <h3>Per-list invites, flat membership, list survives its creator</h3>
          <p>
            Invite people to a specific list by email. Flat membership for v1: no owner/editor/viewer hierarchy. The
            structural call: <em>membership</em> owns the list&rsquo;s persistence, not a user; a list exists as
            long as it has one member, so deleting your account removes your membership, not the list. The
            alternative, a single owner, means the household loses the shared list the moment one person leaves.
          </p>
          <p>
            <strong>The cost, named:</strong> auto-grant on claim means anyone who knows your email can put a list on
            your phone with no confirmation step: a lightweight confirmation screen is the fix, scoped as a
            follow-up rather than a blocker.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-4">
          <p className="cs-decision__kicker">Decision 4 of 8</p>
          <h3>&ldquo;Who got this&rdquo; attribution</h3>
          <p>
            Checked items surface who checked them. In a two-person trip this is the highest-value piece of
            shared-list information: the difference between &ldquo;is this done?&rdquo; and &ldquo;do I need to go
            back for it?&rdquo; Attribution is stamped at push time, not toggle time, keeping user identity out of
            the model layer entirely.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-5">
          <p className="cs-decision__kicker">Decision 5 of 8</p>
          <h3>Multi-page scanning as a designed flow, not a feature</h3>
          <p>
            Scanning nine cookbook pages is a genuinely long wait. The flow was designed as an experience, not a
            spinner: a multi-select picker, a reorder strip, a progress rail, photo cycling, rotating copy, haptics.
          </p>
          <p>
            <strong>The engineering decision that made it work:</strong> one model request per page, merged and
            deduplicated at the end, instead of one combined request: a bad page now costs one page, not the whole
            scan.
          </p>
          <div className="cs-decision__visual">
            <PhoneShot
              src={copiaScanPages}
              alt="Copia's multi-page scan picker: 3 pages queued, reorderable, 'Read 3 pages'"
              caption="The multi-select picker: pages queued, reorderable before reading starts."
            />
            <PhoneShot
              src={copiaScanReview}
              alt="Copia's scan review screen: six parsed ingredients with amounts, ready to add to the Weekly list"
              caption={
                <>
                  The review step: parsed lines with their real measures, one tap from &ldquo;Add 8 items.&rdquo;
                  The &ldquo;Apple Intelligence is still downloading&rdquo; line is the simulator&rsquo;s own honest
                  fallback to its on-device parser, not a bug, just absent on a real device.
                </>
              }
            />
          </div>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-6">
          <p className="cs-decision__kicker">Decision 6 of 8: planned, not yet built</p>
          <h3>Learning the store&rsquo;s aisle order on-device</h3>
          <p>
            Infer a store&rsquo;s walk-order by watching the sequence items get checked off in shopping mode, and
            apply it confidently after roughly three trips, with undo and manual reorder as the fallback.
          </p>
          <p>
            <strong>The decision that matters:</strong> fully on-device, zero data collection: deliberately not a
            retailer API returning &ldquo;real&rdquo; aisle numbers, which would need an account and a network call.
            The inferred order is slightly worse and belongs entirely to the user; for a household utility, that
            trade is correct.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-7">
          <p className="cs-decision__kicker">Decision 7 of 8</p>
          <h3>Labeling the list-name field</h3>
          <p>
            The fix for the first-run problem above: an actual label reading &ldquo;List name,&rdquo; and a
            placeholder reading &ldquo;Name your list&rdquo;: an instruction, not a question about contents. Small
            change, and the best single example in the project of a bug report that was really a design report.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-8">
          <p className="cs-decision__kicker">Decision 8 of 8</p>
          <h3>Monetization: gate the sticky feature, cap by lifetime not by day</h3>
          <p>
            <strong>Initial proposal:</strong> three page-scans per day, then a one-time unlock.{' '}
            <strong>Pushback:</strong> de-emphasizing scanning was wrong: it&rsquo;s the stickiest thing in the app
            and the reason people come back. If anything is worth paying for, it&rsquo;s that.
          </p>
          <p>
            <strong>Landed on:</strong> a subscription plus a lifetime option, with a <em>lifetime</em> free-scan cap
            rather than a daily reset: a daily reset trains people to ration; a lifetime cap lets them experience
            the feature properly, then decide.
          </p>
          <PhoneShot
            src={copiaPaywall}
            alt="Copia Pro paywall: Monthly $3.99, Annual $24.99 (best value, selected), Lifetime $49.99, 14-day free trial"
            caption="The shipped paywall: three tiers, annual pre-selected as best value, lifetime alongside it."
          />
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="cs-section cs-trust">
        <h2 className="cs-section__heading">Building for trust</h2>
        <p>
          Groceries are low-stakes individually, high-stakes as a habit: one silent sync failure and the list can
          no longer be trusted, which ends the app&rsquo;s usefulness outright. So the app works fully offline by
          design, never blocking on a connection, and every rule underneath it exists to protect that one promise
          rather than to be clever.
        </p>
        <p>
          One bug is worth telling in full, because it&rsquo;s a design bug wearing an engineering costume: the
          Lists header rendered completely empty on a real device, and every automated check still passed, because
          the underlying accessibility description claimed a heading that was never actually painted on screen. The
          checks were confirming the wrong thing: what the code claimed to show, not what a person would actually
          see. The fix was a check that looks at real pixels instead.
        </p>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-testers">
        <h2 className="cs-section__heading">What testers changed</h2>
        <p>
          Copia shipped to TestFlight through Build 12, feature-complete for 1.0. Two live external testers produced
          three shipped fixes directly from their reports: the quantity-display reversal above, the invisible Lists
          header, and the list-name field. Independent of tester reports, three more sync failures surfaced under
          real concurrent use that automated testing alone could never catch, because none of them constructed the
          real-world condition: a hidden cap on how many items would load at once, edits that silently failed to
          register as changed, and a batch save that reported success while quietly dropping items. The app is
          pre-launch, so no adoption numbers here, and none invented: the evidence is decision quality and the
          failures caught before a real user hit them.
        </p>
      </ScrollReveal>

      {/* MORE OF THE APP (Ryan: "show off the features and all of that").
          Recipes and onboarding never had a visual anywhere on this page --
          the decisions above are about the shopping/scanning flow
          specifically, not the recipe browsing side of "recipes trapped in
          formats a list can't reach" (problem 2). Four real captures, a
          short narrative arc rather than a dump of all 10: browse a recipe,
          open it, add it to a list, first run. */}
      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">More of the app</h2>
        <p className="cs-section__lede">
          The recipe side of the same problem, and the first thing a new user sees.
        </p>
        <div className="cs-gallery">
          <PhoneShot
            src={copiaRecipes}
            alt="Copia's recipe browser: search, quick filters (Under 30 min, Low effort), featured recipes with real photos"
            caption="Browsing: search, quick filters, real photography."
          />
          <PhoneShot
            src={copiaRecipeDetail}
            alt="A recipe detail screen: Flan, 7 ingredients, numbered steps with measures folded directly into the instruction text"
            caption="Recipe detail: measures folded into the method, not a separate list to cross-reference."
          />
          <PhoneShot
            src={copiaListFromRecipe}
            alt="A shopping list with a 'Recipes on this list' rail showing the Flan recipe, sitting directly above the aisle-station item rows"
            caption="The loop closes: the recipe now lives on the list it was scanned into."
          />
          <PhoneShot
            src={copiaOnboarding}
            alt="Copia's first-run onboarding: 'The list writes itself,' a custom illustration of a checklist card"
            caption="First run: custom illustrations, not stock icons, from screen one."
          />
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-swatches">
        <h2 className="cs-section__heading">The visual system</h2>
        <p>
          The organizing metaphor is navigation, not inventory: a grocery trip is a route with stops on it, so
          aisles read as stations. SF Pro stayed the typeface on purpose: the app&rsquo;s differentiation is
          legibility at arm&rsquo;s length, and a custom face would have bought brand recognition at the direct
          expense of that claim. Branding came from a warm color-token system instead. Light and dark appearance
          are both first-class throughout, not a system default left unstyled: every screen above exists in both.
        </p>
        <div className="cs-swatch-grid">
          <div className="cs-swatch" style={{ '--sw-color': '#302020' }}>
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Warm off-black: sampled from the shipped app</span>
          </div>
          <div className="cs-swatch" style={{ '--sw-color': '#d04020' }}>
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Coral / persimmon: sampled from the shipped app</span>
          </div>
          <div className="cs-swatch" style={{ '--sw-color': '#24603c' }}>
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Green: sampled from the shipped app</span>
          </div>
          <div className="cs-swatch" style={{ '--sw-color': '#f0f0e0' }}>
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Warm neutral: sampled from the shipped app</span>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-next">
        <h2 className="cs-section__heading">What&rsquo;s next</h2>
        <p>
          App Store submission: screenshots, store listing, in-app purchase products. Siri App Intent and a
          WidgetKit widget, gated on the App Group migration landing. Retailer cart integration: match list items to
          real products with a confirm/swap step, then hand off to the retailer&rsquo;s own app for checkout. Copia
          never touches payment. The learned aisle-order feature above, once there&rsquo;s enough real usage to
          learn from. A lightweight invite-confirmation screen. A VoiceOver pass on the multi-page scan picker.
        </p>
        <div className="cs-next__cta">
          <AppStoreBadge />
          <Link className="cs-next__back" to="/" state={{ scrollTo: 'work' }}>
            ← Back to work
          </Link>
        </div>
      </ScrollReveal>
    </main>
  );
}
