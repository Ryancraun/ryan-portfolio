import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import StatNumber from '@/components/StatNumber';
import DataBar from '@/components/DataBar';
import { setDocumentMeta } from '@/lib/documentMeta';
import pickTheOddsScreenshot from '@/assets/picktheodds.png';

// PICKTHEODDS CASE STUDY (Ryan: "can we get picktheodds case study
// translated onto my new portfolio so it doesn't link out?"). Previously
// the only one of the 3 real projects still sending a visitor OFF the
// portfolio -- ProjectCard's `href` pointed at a Framer-hosted writeup
// (ryancraun.framer.website/work/modernization-of-a-subscription-
// management-platform). Built as a real, in-house route on the SAME
// section skeleton CopiaCaseStudy.jsx/VaultCaseStudy.jsx already share
// (Ryan's explicit "keep every case study consistent" instruction): Hero
// (+ impact upfront) -> The Gap -> Key Decisions -> Under the Hood ->
// Real-World Signal -> The Visual System -> Impact, in Detail -> What's
// Next.
//
// SOURCE: every fact, number and the founder quote below came from
// fetching the live Framer page directly (not paraphrased from memory,
// not invented) -- problem statement, research methods (a 700+ member
// Discord poll, A/B testing), the 4 metrics, and Ken Bean's testimonial
// are all real content from that page, ported here rather than summarized
// generically. The one thing NOT ported: the Framer page's own outbound
// link, since removing that is the entire point of this round.
//
// HONEST DISCREPANCY, flagged rather than smoothed over: the Framer page's
// own text describes the redesign as introducing "a light theme, updated
// typography, and a refreshed logo." The one real artifact available --
// pickTheOddsScreenshot, the actual shipped arbitrage dashboard -- is
// dark, not light (confirmed directly: sampled the real PNG's dominant
// pixel colors via canvas getImageData rather than eyeballing it -- see
// "The visual system" below). Rather than assert "light theme" against a
// screenshot that contradicts it, or silently drop the discrepancy, the
// visual-system section describes what the screenshot actually shows (a
// dark, data-dense dashboard with a reserved green accent for positive
// odds) and separately notes the writeup's own broader redesign language
// for the rest of the product. Both things can be true -- a marketing/
// account-facing surface going light while the core trading-style data
// view stays dark is a common, deliberate split for exactly this kind of
// product -- but this page states what's actually verifiable from the one
// real image on hand, not the unverified broader claim.
//
// STATS: the hero/home-card headline numbers (31% / 25% / 84%) are kept
// verbatim from ProjectCard's existing copy for continuity with the home
// page a visitor just scrolled past. The case study's own prose uses the
// source page's more precise framing for the 31% figure specifically
// ("time to select a betting category," not the broader "time to place a
// bet" the card's shorthand implies) -- more accurate without changing
// the headline number itself. A 4th stat (50 -> 500+ daily active users,
// a real 10x) is new here, pulled from the same source page, matching
// Vault's own pattern of showing one more stat in the case study hero
// than the home card has room for.
export default function PickTheOddsCaseStudy() {
  useEffect(() => {
    return setDocumentMeta({
      title: 'PickTheOdds | Ryan Craun',
      description:
        'PickTheOdds, modernizing a sports-analytics subscription platform: grouped filters, a shorter path from odds to bet, and a monetization flow designed in from the start. A one-month case study in research-backed information architecture.',
    });
  }, []);

  return (
    <main className="cs">
      <section className="cs-hero">
        <Link className="cs-hero__back" to="/" state={{ scrollTo: 'work' }}>
          ← Back to work
        </Link>
        <p className="cs-hero__eyebrow">Case Study: B2B SaaS / Sports Analytics</p>
        <h1 className="cs-hero__title">Built to scale past six links.</h1>
        <p className="cs-hero__line">
          PickTheOdds pairs live sports odds with arbitrage math: a real analytical edge, buried behind a navigation
          bar that broke past five or six links and a filter panel nobody could parse at a glance. One month, brought
          in to fix the interface without touching the data underneath it.
        </p>
        <div className="cs-hero__frame">
          <span>Role: UX/UI Designer, 1 month</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>B2B SaaS / Sports Analytics</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Completed client engagement</span>
        </div>

        {/* Impact upfront, same as every other case study on this site --
            a reviewer skims before they read. */}
        <div className="cs-hero__stats">
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={31} suffix="%" />
            </span>
            <span className="stat__label">faster to select a betting category, after grouping filters</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={25} suffix="%" />
            </span>
            <span className="stat__label">increase in user retention</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={84} suffix="%" />
            </span>
            <span className="stat__label">increase in average time on site</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={10} suffix="×" />
            </span>
            <span className="stat__label">growth in daily active users (50 to 500+)</span>
          </div>
        </div>

        {/* RESOLUTION CAP (Ryan: "can we ensure that all pictures are super
            high resolution"): picktheodds.png is a native 647x440 capture --
            no higher-res original exists anywhere on this machine (checked).
            `.cs-shot` alone stretches to its container's full width (up to
            ~1180px here), nearly 2x upscaling this specific image. The
            `cs-shot--native-res` modifier caps the whole figure at the
            image's own native width instead, so it renders centered and
            smaller rather than blown up -- Ryan's choice over sourcing a
            replacement asset. Scoped to this one figure, not `.cs-shot`
            itself, since Vault's own real screenshots use the bare class at
            their real (larger) native resolution and shouldn't shrink. */}
        <figure className="cs-shot cs-shot--native-res">
          <img src={pickTheOddsScreenshot} alt="PickTheOdds arbitrage dashboard: odds table, grouped filters, dark UI" loading="lazy" />
        </figure>
      </section>

      <ScrollReveal as="section" className="cs-section cs-problems">
        <h2 className="cs-section__heading">The gap</h2>
        <p className="cs-section__lede">
          The backend data was genuinely good: real odds, real arbitrage math. The frontend was actively working
          against it. Four real problems, the spine of what follows.
        </p>
        <ol className="cs-problems__list">
          <li>
            <h3>Navigation and filters that couldn&rsquo;t scale</h3>
            <p>
              The nav bar&rsquo;s spacing broke past five or six links, so the product was structurally capped at how
              much it could expose. Filters sat ungrouped and oversized on top of that, so even the categories that
              did fit were hard to browse. Same root cause, two symptoms: nothing had a hierarchy.
            </p>
          </li>
          <li>
            <h3>Too many clicks between the odds and the bet</h3>
            <p>
              Getting from an odds view to the matching game view took more clicks than the decision itself
              warranted. For a product whose whole value is speed to a good line, every extra click was a direct tax
              on the thing users were there for.
            </p>
          </li>
          <li>
            <h3>A visual identity that undersold a real analytical edge</h3>
            <p>
              The interface read as dated, not sophisticated: a mismatch for a product whose actual differentiator
              is data quality. Looking less capable than the backend actually was is its own kind of trust problem.
            </p>
          </li>
          <li>
            <h3>No path to revenue at all</h3>
            <p>
              There was no subscription or billing flow anywhere in the product: a real business with no
              monetization built in yet, not a product decision so much as a missing one.
            </p>
          </li>
        </ol>
      </ScrollReveal>

      <ScrollReveal as="nav" className="cs-section cs-jumplist" aria-label="Key design decisions">
        <h2 className="cs-section__heading">Three decisions, in depth</h2>
        <p className="cs-section__lede">Each one is the decision, the evidence behind it, and what it actually changed.</p>
        <ol className="cs-jumplist__list">
          <li>
            <a href="#decision-1">Group the filters, don&rsquo;t just shrink them</a>
          </li>
          <li>
            <a href="#decision-2">Cut the distance between odds and the bet</a>
          </li>
          <li>
            <a href="#decision-3">Design monetization in, not bolt it on</a>
          </li>
        </ol>
      </ScrollReveal>

      <section className="cs-section cs-decisions">
        <ScrollReveal as="article" className="cs-decision cs-decision--feature" id="decision-1">
          <p className="cs-decision__kicker">Decision 1 of 3: the evidence-backed one</p>
          <h3>Group the filters, don&rsquo;t just shrink them</h3>
          <p>
            The instinct with an oversized filter panel is to make everything smaller. That would have shipped the
            same broken hierarchy in less space. The actual problem was that every filter sat at the same level:
            nothing told a user which ones were related.
          </p>
          <p>
            <strong>What the research said:</strong> a direct poll inside PickTheOdds&rsquo; own 700+ member Discord
            community found 68% of users considered the filter system too slow, and 72% said they&rsquo;d pay for a
            better one: a real, business-relevant signal, not just a usability complaint. That finding shaped the
            fix directly: filters were grouped into categories and A/B tested against the ungrouped version.
          </p>
          <p>
            <strong>What it changed:</strong> grouping filters into categories cut the time to select a betting
            category by 31%: the single most direct before/after number from this engagement, and the one the rest
            of the redesign&rsquo;s case rests on.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-2">
          <p className="cs-decision__kicker">Decision 2 of 3</p>
          <h3>Cut the distance between odds and the bet</h3>
          <p>
            The path from viewing odds to reaching the matching game view had more steps in it than the decision
            itself needed. For a product built around speed to a good line, that gap was a tax on the core loop, not
            a minor friction point.
          </p>
          <p>
            <strong>The decision:</strong> the navigation and information architecture were rebuilt around
            minimizing clicks specifically between the Odds and Game screens: the one workflow every user runs
            constantly, prioritized over polishing paths used less often.
          </p>
          <p>
            <strong>What it changed:</strong> a shorter core loop is the most direct explanation for the two
            engagement numbers that moved most: 84% more time on site and a 25% lift in retention. Users weren&rsquo;t
            spending longer per task; they were completing more of them per visit.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-3">
          <p className="cs-decision__kicker">Decision 3 of 3</p>
          <h3>Design monetization in, not bolt it on</h3>
          <p>
            The product had no subscription or billing flow at all: a real gap for a business that needed one, not
            a feature to skip for scope. Adding one after the fact, as a separate settings page bolted onto the
            existing IA, would have read as an afterthought and fought the same navigation problems Decision 1 and 2
            were already fixing.
          </p>
          <p>
            <strong>The decision:</strong> subscription and billing were designed as part of a single, centralized
            account control panel from the start: one place a user manages their plan, not a scattered set of
            screens.
          </p>
          <p>
            <strong>What it cost:</strong> more upfront account-architecture work than a bolted-on settings page
            would have needed, in a one-month engagement that couldn&rsquo;t really afford it. Worth it against the
            alternative of shipping a monetization flow that undercut the navigation fix happening everywhere else
            on the same product.
          </p>
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="cs-section cs-trust">
        <h2 className="cs-section__heading">Research, then a system</h2>
        <p>
          Nothing here started from a visual redesign. It started with a direct line to the people already using the
          product: the 700+ member Discord community above wasn&rsquo;t polled once and forgotten; it shaped every
          phase that followed.
        </p>
        <div className="cs-pipeline" role="list">
          <div className="cs-pipeline__step" role="listitem">
            <span className="cs-pipeline__num">01</span>
            <h4>Community research</h4>
            <p>Direct polling in the Discord, live feedback sessions on the navigation-to-odds transition specifically.</p>
          </div>
          <span className="cs-pipeline__arrow" aria-hidden="true">→</span>
          <div className="cs-pipeline__step" role="listitem">
            <span className="cs-pipeline__num">02</span>
            <h4>Low-fidelity wireframes</h4>
            <p>Mapped the navigation structure and filter groupings before any visual work started.</p>
          </div>
          <span className="cs-pipeline__arrow" aria-hidden="true">→</span>
          <div className="cs-pipeline__step" role="listitem">
            <span className="cs-pipeline__num">03</span>
            <h4>Community iteration</h4>
            <p>Wireframes went back to the same community that flagged the original discoverability problem.</p>
          </div>
          <span className="cs-pipeline__arrow" aria-hidden="true">→</span>
          <div className="cs-pipeline__step" role="listitem">
            <span className="cs-pipeline__num">04</span>
            <h4>High-fidelity prototypes</h4>
            <p>Interactive prototypes, usability tested before anything shipped.</p>
          </div>
          <span className="cs-pipeline__arrow" aria-hidden="true">→</span>
          <div className="cs-pipeline__step cs-pipeline__step--live" role="listitem">
            <span className="cs-pipeline__num">05</span>
            <h4>Visual language</h4>
            <p>Color, typography and iconography built last, on top of a structure already validated with real users.</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-testers">
        <h2 className="cs-section__heading">The result</h2>
        <p>
          Daily active users grew 10x over the course of this work (50 to 500+) alongside the 25% retention lift
          and 84% increase in time on site above. None of that is attributable to one change in isolation, but the
          filter and navigation fixes were the two structural changes underneath all three numbers moving together.
        </p>
        <blockquote className="cs-quote">
          <p>&ldquo;The new navigation and filters are a game-changer. Engagement and subscriptions have never been higher.&rdquo;</p>
          <cite>Ken Bean, Founder, PickTheOdds</cite>
        </blockquote>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-swatches">
        <h2 className="cs-section__heading">The visual system</h2>
        <p>
          The writeup this case study is built from describes the broader redesign as moving toward a lighter theme,
          updated typography and a refreshed logo. The one real artifact available (the arbitrage dashboard
          screenshot above) tells a more specific story: it&rsquo;s dark, not light. Rather than assert the
          broader claim against evidence that contradicts it, the swatches below are sampled directly from that
          real screenshot&rsquo;s actual pixels, not typed in from memory or invented to match the writeup.
        </p>
        <p>
          A dark, data-dense core view alongside a lighter marketing or account surface is a common, deliberate
          split for this category of product: traders and bettors generally want the working view dark. That may
          well be what happened here; it just isn&rsquo;t what this one screenshot can confirm on its own.
        </p>
        <div className="cs-swatch-grid">
          <div className="cs-swatch" style={{ '--sw-color': '#101020' }}>
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Base background: sampled from the dashboard</span>
          </div>
          <div className="cs-swatch" style={{ '--sw-color': '#102030' }}>
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Panel surface: sampled from the dashboard</span>
          </div>
          <div className="cs-swatch" style={{ '--sw-color': '#609060' }}>
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Positive-odds accent: sampled from the dashboard</span>
          </div>
          <div className="cs-swatch" style={{ '--sw-color': '#505060' }}>
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Border / secondary text: sampled from the dashboard</span>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-impact">
        <h2 className="cs-section__heading">Impact, in detail</h2>
        <p>Every number below is from the same engagement, not a separate analytics pull.</p>
        <div className="cs-stats__row">
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={31} suffix="%" />
            </span>
            <span className="stat__label">faster category selection</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={25} suffix="%" />
            </span>
            <span className="stat__label">retention increase</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={84} suffix="%" />
            </span>
            <span className="stat__label">time-on-site increase</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={68} suffix="%" />
            </span>
            <span className="stat__label">of surveyed users found filters too slow</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={72} suffix="%" />
            </span>
            <span className="stat__label">said they&rsquo;d pay for a better one</span>
          </div>
        </div>

        <h3 className="cs-impact__subhead">Daily active users, before and after</h3>
        <p className="cs-impact__sublede">A real 10x: normalized to the after value below.</p>
        <div className="cs-databar-group">
          <DataBar label="Before" valueLabel="~50 DAU" pct={10} />
          <DataBar label="After" valueLabel="500+ DAU" pct={100} highlight />
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-next">
        <h2 className="cs-section__heading">What&rsquo;s next</h2>
        <p>
          This was a one-month, scoped engagement: there&rsquo;s no ongoing roadmap on this end to report. What
          carried forward from it is a pattern this portfolio keeps returning to: a research-backed information-
          architecture fix (grouping, not just shrinking) outperforming a purely visual redesign, and a monetization
          flow designed alongside the core product instead of bolted on after. Both show up again, in different
          domains, in Copia and Vault.
        </p>
        <div className="cs-next__cta">
          <Link className="cs-next__back" to="/" state={{ scrollTo: 'work' }}>
            ← Back to work
          </Link>
        </div>
      </ScrollReveal>
    </main>
  );
}
