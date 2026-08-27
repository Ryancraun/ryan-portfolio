import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import SpecularButton from '@/components/reactbits/SpecularButton/SpecularButton';
import StatNumber from '@/components/StatNumber';
import DataBar from '@/components/DataBar';
import { setDocumentMeta } from '@/lib/documentMeta';
import vaultGuideShot from '@/assets/vault-guide-bloomreaper.jpg';
import vaultHomeShot from '@/assets/vault-home.jpg';
import vaultHubShot from '@/assets/vault-game-hub.jpg';

// VAULT CASE STUDY -- built from projects/ryan-portfolio-immersive/
// vault-source-document.md, then restructured (Facilitator, direct,
// "CASE STUDY STRUCTURE STANDARDIZATION" round) onto the SAME section
// skeleton CopiaCaseStudy.jsx already uses, per Ryan's explicit
// instruction to keep every case study consistent rather than each one
// finding its own shape: Hero (+ impact upfront) -> The Gap -> Key
// Decisions -> Under the Hood -> Real-World Signal -> The Visual System
// -> Impact, in Detail (only where a project actually has one) -> What's
// Next. Copia's existing order (its decisions -> "Building for trust" ->
// "What testers changed" -> "The visual system" -> "What's next") is the
// template this page was conformed TO, not the other way around --
// Copia was built first and Ryan never flagged its order as wrong, so
// that's the one worth standardizing on. This round also pulled Vault's
// pipeline out of the "Key Decisions" jumplist into its own "Under the
// Hood" section (it's systems/engineering depth, not a product decision --
// same structural role Copia's sync/testing section already plays) and
// replaced the plain data table + static numbers with two real, reusable
// data components (StatNumber.jsx, DataBar.jsx) researched against how
// case studies that actually get designers hired are structured (impact
// stated early, evidence shown visually, not just typed) rather than
// dumped in as a generic table -- see build-log.md for the research notes
// and the "not vibe-coded" mandate this round was built against.
//
// Three screenshots below (vault-guide-bloomreaper.jpg, vault-home.jpg,
// vault-game-hub.jpg) are REAL captures of the live site at vaultgg.app,
// taken directly rather than mocked up -- Vault is live, unlike Copia,
// so this page gets to skip the honest-placeholder convention
// (PhoneFrame/VisualPlaceholder) for anything a screenshot can cover.
// One exception, flagged here rather than glossed: the source doc
// describes a segmented None/Nudge/Bigger Hint/Full Guide control at the
// top of every guide (§5.1-5.2). A live walkthrough of several guides,
// including a 3-phase raid boss, found no trace of that control or any of
// its label text in the rendered page -- possibly a signed-in-only
// feature (the doc says the choice persists to `profiles.default_hint_level`),
// possibly not yet wired to every guide row. Decision 1 below uses the
// doc's own worked example verbatim (Ryan's real written content, not
// invented) laid out as a four-way comparison, honestly presented as that
// -- Vault's own example text -- not as a screenshot of a control this
// walkthrough couldn't find.
//
// Every number on this page is the real GA/Search Console pull Ryan
// supplied directly (property G-MFXTWZHWEZ + Search Console, Jan 1 - Aug
// 25 2026) or the source doc's own Reddit-launch numbers, none invented.
// Hint-level distribution specifically is still NOT instrumented (no
// events exist yet to report) -- see "Instrument before deciding" below,
// which is itself about that gap, not a stat filled in around it.
//
// Three write-ups in "What the data said" are Ryan's own explicit picks
// from the numbers ("decisions 1, 4 and 5 are the ones worth writing up")
// out of 8 findings the full pull produced -- the other 5 (impressions x
// CTR-gap prioritization, consolidate-don't-expand, UTM-tag Reddit links,
// structure for AI citation, mine the query list) are real and useful but
// scoped out of the page on his instruction, not dropped by omission.
//
// AUDIENCE PASS (Ryan: "these seem engineering heavy... optimized for
// PRODUCT designers / UX / UI designers"): dropped every literal schema/
// event/CSS-property name (`hint_none` columns, `profiles.default_hint_level`,
// `.vault-main { overflow: clip }`, analytics event names) in favor of
// plain-language descriptions of the same facts -- a hiring designer needs
// to know a bug existed and what it revealed, not the exact CSS property
// that caused it. "Distribution" also lost its growth-hacking mechanics
// (subreddit participation ratios, the SEO-title paragraph that duplicated
// "What the data said" §1) -- kept the positioning insight and the honest
// self-assessment, which are the parts that actually demonstrate product
// judgment. The pipeline diagram and the AI-content-tension paragraph
// stayed as-is: both are systems-thinking, not code, and both directly
// explain why Decision 1 was affordable -- cutting them would remove the
// causal link the whole "reversal" story depends on.
export default function VaultCaseStudy() {
  useEffect(() => {
    return setDocumentMeta({
      title: 'Vault | Ryan Craun',
      description:
        'Vault, an ad-free gaming guide site built around a progressive hint system: four levels of detail, one control, zero ads, ever. A solo case study in content strategy, pipeline engineering, and a reversal from reward mechanic to help mechanic.',
    });
  }, []);

  return (
    <main className="cs cs-vault">
      <section className="cs-hero">
        <Link className="cs-hero__back" to="/" state={{ scrollTo: 'work' }}>
          ← Back to work
        </Link>
        <p className="cs-hero__eyebrow">Case Study: Web / Content Platform</p>
        <h1 className="cs-hero__title">Get unstuck without getting spoiled.</h1>
        <p className="cs-hero__line">
          Vault is an ad-free gaming guide site (boss fights, missions, builds and weapons across Borderlands 4,
          Crimson Desert, Resident Evil Requiem, Elden Ring and Diablo IV) built around one idea: being stuck in a
          game isn&rsquo;t a single state, and a guide site shouldn&rsquo;t force the maximum-spoiler answer every
          time someone just wants a nudge.
        </p>
        <div className="cs-hero__frame">
          <span>Solo: product design, content strategy &amp; engineering</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Next.js 14, Supabase, Vercel</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Live: multi-game, actively published</span>
        </div>
        <div className="cs-hero__cta">
          <a className="cs-hero__live-link" href="https://vaultgg.app" target="_blank" rel="noopener">
            <SpecularButton
              as="span"
              size="md"
              radius={999}
              tint="#0a0a0c"
              tintOpacity={0.55}
              textColor="#ff8a3d"
              lineColor="#ff8a3d"
              baseColor="#3a2210"
              intensity={1.3}
              shineSize={14}
              shineFade={46}
              proximity={260}
            >
              Visit vaultgg.app →
            </SpecularButton>
          </a>
          <span className="cs-hero__cta-note">252 guides live, zero ads</span>
        </div>

        {/* Impact upfront -- a design portfolio piece is skimmed before it's
            read; a reviewer deciding whether to keep going needs the real
            numbers before the narrative, not after it. Same real GA/Search
            Console pull "Impact, in detail" (further down) breaks out in
            full -- this is the headline read, not a second data set. */}
        <div className="cs-hero__stats">
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={4900} />
            </span>
            <span className="stat__label">users, Jan–Aug 2026</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={252} />
            </span>
            <span className="stat__label">guides published, ad-free</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={51.4} decimals={1} suffix="K" />
            </span>
            <span className="stat__label">Search Console impressions</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={134} />
            </span>
            <span className="stat__label">upvotes, r/Borderlands4 launch post</span>
          </div>
        </div>

        <figure className="cs-shot">
          <img src={vaultHomeShot} alt="Vault's home page: dark UI, orange accent, a Crimson Desert feature and a games sidebar" loading="lazy" />
        </figure>
      </section>

      <ScrollReveal as="section" className="cs-section cs-problems">
        <h2 className="cs-section__heading">The gap</h2>
        <p className="cs-section__lede">
          Every guide site treats the answer as one unit: you either read it or you don&rsquo;t. But being stuck in a
          game is a spectrum, not a binary: sometimes you want to know a mechanic exists, sometimes you want the
          exact numbers. Four real problems, named plainly, are the spine of what follows.
        </p>
        <ol className="cs-problems__list">
          <li>
            <h3>Spoilers are binary, and that&rsquo;s the actual product gap</h3>
            <p>
              Existing sites force the maximum-spoiler option every time. You go looking for a small push and get
              the whole fight handed to you, and the discovery you were enjoying is gone. The unit of a guide
              isn&rsquo;t the guide; it&rsquo;s the level of detail, and the player should choose it.
            </p>
          </li>
          <li>
            <h3>Guide sites are hostile to read</h3>
            <p>
              Interstitials, autoplay video, cookie walls, six ad slots a screen, and 800 words of SEO preamble
              before the answer, while the reader is stuck, frustrated, and often on a phone next to a console. No
              ads isn&rsquo;t a preference here; it&rsquo;s the differentiator, which means the business model has to
              be solved some other way, or not at all.
            </p>
          </li>
          <li>
            <h3>The launch window is when guides are needed and when they don&rsquo;t exist</h3>
            <p>
              A game ships and for two or three weeks nobody has coverage, exactly when the most players are stuck
              on the same handful of encounters. Traditional guide sites are staffed by writers and can&rsquo;t move
              faster than people can play and write. Speed to publish at launch is a real advantage, and it&rsquo;s
              an operations problem, not a design one.
            </p>
          </li>
          <li>
            <h3>Coverage is fragmented across sites with different formats</h3>
            <p>
              Boss guides on one site, builds on another, weapon rolls on a third, each with its own structure and
              quality bar: players tab between five sources for one encounter. One consistent format across guide
              types is worth more than depth in any single one.
            </p>
          </li>
        </ol>
      </ScrollReveal>

      <ScrollReveal as="nav" className="cs-section cs-jumplist" aria-label="Key design decisions">
        <h2 className="cs-section__heading">Three decisions, in depth</h2>
        <p className="cs-section__lede">
          Each one is the decision, the reasoning, and what it honestly cost: including the one with no good answer
          yet.
        </p>
        <ol className="cs-jumplist__list">
          <li>
            <a href="#decision-1">Progressive detail, not progressive disclosure</a>
          </li>
          <li>
            <a href="#decision-2">One control for the whole page</a>
          </li>
          <li>
            <a href="#decision-3">Zero ads, and what it costs</a>
          </li>
        </ol>
      </ScrollReveal>

      <section className="cs-section cs-decisions">
        <ScrollReveal as="article" className="cs-decision cs-decision--feature" id="decision-1">
          <p className="cs-decision__kicker">Decision 1 of 3: the reversal</p>
          <h3>Progressive detail, not progressive disclosure</h3>
          <p>
            The first build treated hints as hidden content to unlock: collapsed accordions and blurred sections
            you clicked to reveal, tier by tier. It shipped, and it was wrong.
          </p>
          <p>
            <strong>Why it was wrong:</strong> it treated hints as a reward mechanic. A player stuck on a boss
            doesn&rsquo;t want to play a guessing game with collapsible drawers; they want direct help at exactly
            the level they need. There was a structural failure too: the guide read fine at &ldquo;Full Guide&rdquo;
            and was nearly useless at &ldquo;None,&rdquo; where it collapsed to an intro paragraph and some callouts.
            That isn&rsquo;t a hint level, it&rsquo;s a broken page.
          </p>
          <p>
            <strong>What replaced it:</strong> the guide always shows every step. What changes is how much each step
            tells you: same skeleton, four resolutions, the structure of the encounter never hidden, only the
            specificity changing.
          </p>
          <div className="cs-hint-grid">
            <div className="cs-hint-card">
              <span className="cs-hint-card__label">None</span>
              <p>The fight changes significantly at 50% health. Figure out what triggers it and how to respond.</p>
            </div>
            <div className="cs-hint-card">
              <span className="cs-hint-card__label">Nudge</span>
              <p>At 50% he teleports to center. Something spawns that you need to deal with before focusing him again.</p>
            </div>
            <div className="cs-hint-card">
              <span className="cs-hint-card__label">Bigger Hint</span>
              <p>At 50% he teleports center and summons four clockwork minions. Kill the minions first or they&rsquo;ll heal him.</p>
            </div>
            <div className="cs-hint-card cs-hint-card--full">
              <span className="cs-hint-card__label">Full Guide</span>
              <p>
                At 50% he teleports center and spawns four clockwork minions. Kill them within 10 seconds: they
                heal him at 2% per second. His pattern also switches from targeted shots to a radial sweep. Stay in
                melee range during this phase.
              </p>
            </div>
          </div>
          <p className="cs-hint-grid__caption">
            Vault&rsquo;s own worked example: the same boss phase, written at all four hint levels. Same fact set
            every time, only the specificity changes.
          </p>
          <p>
            <strong>What it cost:</strong> every guide now needs four full versions of every section, written and
            stored separately. Roughly 4× the content per guide, only viable because of the pipeline described in
            &ldquo;Under the hood&rdquo; below. The disclosure version would have been a quarter of the work and a
            fraction of the product.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-2">
          <p className="cs-decision__kicker">Decision 2 of 3</p>
          <h3>One control for the whole page, not a choice per section</h3>
          <p>
            The original design put a hint control on each section: also wrong, because it turned one decision into
            twelve. The moment someone reaches a guide, they&rsquo;re already frustrated; that&rsquo;s the worst
            possible time to ask them to make repeated micro-decisions.
          </p>
          <p>
            <strong>The decision:</strong> a single segmented control at the top of the guide sets the mode for the
            entire page: choose Nudge once, the whole guide renders at Nudge. It persists per user, so someone who
            always wants full detail sets it once and never thinks about it again, and someone who plays
            spoiler-averse gets that respected by default.
          </p>
          <figure className="cs-shot cs-shot--boss">
            <img
              src={vaultGuideShot}
              alt="A Bloomreaper The Invincible boss guide on Vault: phase badge, difficulty rating and a green PRO TIP callout"
              loading="lazy"
            />
            <figcaption>
              A live guide page: phased structure, an in-flow tip callout, ALL CAPS section labels reserved for UI
              chrome so they&rsquo;re never mistaken for guide content.
            </figcaption>
          </figure>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision" id="decision-3">
          <p className="cs-decision__kicker">Decision 3 of 3: no good answer yet</p>
          <h3>Zero ads, and what it costs</h3>
          <p>
            No ads, permanently, stated publicly as a brand promise, and the only thing on the list competitors
            can&rsquo;t copy, because their entire revenue model is the thing being removed. IGN, Fandom and Game8
            could build a hint system next quarter. None of them can remove their ad stack.
          </p>
          <p>
            <strong>The honest cost, and it&rsquo;s real:</strong> there is no revenue model. The site runs on
            hosting costs with no offsetting income, and the most obvious monetization path has been deliberately
            eliminated. Any future model has to be something else: a supporter tier, sponsorship, or the site
            staying a portfolio and community project. This is the single biggest open question about Vault, said
            plainly rather than omitted.
          </p>
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="cs-section cs-trust">
        <h2 className="cs-section__heading">Under the hood</h2>
        <p>
          Vault&rsquo;s real asset isn&rsquo;t the site, it&rsquo;s the publishing system behind it. A four-level
          hint system is four times the writing, which is unaffordable by hand and routine through a pipeline: the
          design decision above was only affordable because of the systems decision below.
        </p>
        <div className="cs-pipeline" role="list">
          <div className="cs-pipeline__step" role="listitem">
            <span className="cs-pipeline__num">01</span>
            <h4>Source scrapers</h4>
            <p>Per guide type: bosses, missions, builds via a real headless browser, weapon rolls, YouTube companion content.</p>
          </div>
          <span className="cs-pipeline__arrow" aria-hidden="true">→</span>
          <div className="cs-pipeline__step" role="listitem">
            <span className="cs-pipeline__num">02</span>
            <h4>Fact extraction</h4>
            <p>An LLM pass pulls structured facts from prose: phases, triggers, thresholds, resistances, drop rates.</p>
          </div>
          <span className="cs-pipeline__arrow" aria-hidden="true">→</span>
          <div className="cs-pipeline__step" role="listitem">
            <span className="cs-pipeline__num">03</span>
            <h4>Guide writing</h4>
            <p>A second pass, per-type prompts, writes all four hint levels in Vault&rsquo;s voice from the extracted facts.</p>
          </div>
          <span className="cs-pipeline__arrow" aria-hidden="true">→</span>
          <div className="cs-pipeline__step" role="listitem">
            <span className="cs-pipeline__num">04</span>
            <h4>Export</h4>
            <p>Finished guides write to the database, ready to serve.</p>
          </div>
          <span className="cs-pipeline__arrow" aria-hidden="true">→</span>
          <div className="cs-pipeline__step cs-pipeline__step--live" role="listitem">
            <span className="cs-pipeline__num">05</span>
            <h4>Live</h4>
            <p>Thumbnails assigned, guide published, during a game&rsquo;s launch window, when demand is highest.</p>
          </div>
        </div>
        <p>
          <strong>The honest tension:</strong> the guides are AI-assisted, built from scraped public sources and
          fact-checked against game data. That raises a real quality-and-trust question, and the answer isn&rsquo;t
          &ldquo;AI is fine&rdquo;; it&rsquo;s that the pipeline extracts facts from human-authored sources rather
          than generating claims, and quality control is a per-guide review problem that scales worse than the
          writing does.
        </p>
        <p>
          A worthwhile debugging story from the same system: the sticky hint bar silently stopped sticking, and the
          actual cause turned out to be three layers away from the symptom: a scroll setting on a completely
          different element than the one that visibly broke. It turns out to matter more than it looked at the time
          (see &ldquo;desktop-first&rdquo; under Impact, below).
        </p>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-testers">
        <h2 className="cs-section__heading">Distribution: the real bottleneck</h2>
        <p>
          Launch was a single post to r/Borderlands4: <strong>134 upvotes, 12,000 views.</strong> What actually
          worked wasn&rsquo;t promotion, it was answering people&rsquo;s real questions in threads first and
          mentioning the guide only as a follow-up: earn the moment of use before asking for anything back.
        </p>
        <p>
          The bigger lesson was a positioning call, not a design one: pick a game by competition, not popularity. A
          new game with a small, hungry community and no coverage yet is a better bet than a huge one where a solo
          project is invisible against sites with years of head start.
        </p>
        <p>
          <strong>The honest conclusion:</strong> the product is good. Distribution is the constraint, not quality:
          a solo builder can produce a better guide experience than IGN and still lose on reach. That&rsquo;s worth
          saying plainly rather than implying the site&rsquo;s a hit it isn&rsquo;t yet.
        </p>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-swatches">
        <h2 className="cs-section__heading">The visual system</h2>
        <p>
          Dark theme only, not a toggle: the reading context is a dim room next to a TV. One accent, used only for
          the active hint level, badges and primary actions, so it always reads as <em>the</em> interactive element
          on the page. ALL CAPS for section labels and badges, sentence case for content, so interface chrome never
          gets mistaken for guide text. Semantic colors are reserved and never decorative: a red callout always
          means &ldquo;this will kill you.&rdquo; Callout rhythm is an authoring rule, not a styling fix: one to two
          callouts per phase, never adjacent; callouts are interruptions to the flow, and if they <em>are</em> the
          flow, they&rsquo;ve stopped meaning anything.
        </p>
        <div className="cs-swatch-grid">
          <div className="cs-swatch" style={{ '--sw-color': '#ff8a3d' }}>
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Accent: active hint level, badges, primary actions</span>
          </div>
          <div className="cs-swatch" style={{ '--sw-color': '#3ddb85' }}>
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Success: reserved, semantic only</span>
          </div>
          <div className="cs-swatch cs-swatch--outline">
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Warning: reserved, exact value pending</span>
          </div>
          <div className="cs-swatch cs-swatch--outline">
            <span className="cs-swatch__chip" />
            <span className="cs-swatch__label">Danger: reserved, exact value pending</span>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-impact">
        <h2 className="cs-section__heading">Impact, in detail</h2>
        <p>
          Google Analytics and Search Console, Jan 1 – Aug 25, 2026. Real pull, not a snapshot picked to flatter:
          site-wide CTR and average position are ordinary for a young, thin-coverage site; the interesting signal is
          in the findings below, not the headline row.
        </p>
        <div className="cs-stats__row">
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={4900} />
            </span>
            <span className="stat__label">users</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={11} suffix="K" />
            </span>
            <span className="stat__label">page views</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={5800} />
            </span>
            <span className="stat__label">sessions</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={26} suffix="s" />
            </span>
            <span className="stat__label">avg engagement time</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={51.4} decimals={1} suffix="K" />
            </span>
            <span className="stat__label">Search Console impressions</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={862} />
            </span>
            <span className="stat__label">clicks (1.68% CTR)</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={11.67} decimals={2} />
            </span>
            <span className="stat__label">average search position</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={252} />
            </span>
            <span className="stat__label">guides published</span>
          </div>
        </div>
        <p className="cs-stats__note">
          Acquisition: Direct 3,400 · Organic Search 1,300 · AI Assistant 114 · Organic Social 64 · Referral 16. 539
          landing pages answering 2,287 distinct queries.
        </p>

        <h3 className="cs-impact__subhead">Device split</h3>
        <p className="cs-impact__sublede">
          The design assumed phone-first. The real split says otherwise: see &ldquo;desktop-first&rdquo; below.
        </p>
        <div className="cs-databar-group">
          <DataBar label="Desktop" valueLabel="60.1%" pct={60.1} highlight />
          <DataBar label="Mobile" valueLabel="39.5%" pct={39.5} />
          <DataBar label="Tablet" valueLabel="0.4%" pct={0.4} />
        </div>

        <h3 className="cs-impact__subhead">CTR by guide, same content register vs. lore register</h3>
        <p className="cs-impact__sublede">
          Sorted by CTR, normalized to the strongest performer. Burhum and Areciel are titled the way people search;
          the bottom four are titled the way the wiki would.
        </p>
        <div className="cs-databar-group">
          <DataBar label="Burhum Maze" valueLabel="7.96% · pos 6.38" pct={100} highlight />
          <DataBar label="Areciel: Witch of Strength" valueLabel="6.02% · pos 6.22" pct={75.6} highlight />
          <DataBar label="Smoking Lands Desert Mouth" valueLabel="3.59% · pos 8.48" pct={45.1} />
          <DataBar label="Lyselia: Witch of Humility" valueLabel="3.56% · pos 7.28" pct={44.7} />
          <DataBar label="Bari: Witch of Kindness" valueLabel="2.60% · pos 7.60" pct={32.7} />
          <DataBar label="Elowen: Witch of Wisdom" valueLabel="2.09% · pos 7.28" pct={26.3} />
        </div>

        <figure className="cs-shot">
          <img
            src={vaultHubShot}
            alt="Vault's Borderlands 4 guide hub: 46 bosses, difficulty ratings and category tabs for bosses, missions, weapons and builds"
            loading="lazy"
          />
          <figcaption>252 guides across bosses, missions, weapons and builds, one consistent format per game.</figcaption>
        </figure>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-decisions cs-data-findings">
        <h2 className="cs-section__heading">What the data said</h2>
        <p className="cs-section__lede">
          Three findings out of the pull above, picked because each one changes what gets built or written next:
          not a full analytics readout.
        </p>

        <article className="cs-decision">
          <p className="cs-decision__kicker">What the data said: 1 of 3, a measurable finding</p>
          <h3>Titles should be the query, not the entity&rsquo;s formal name</h3>
          <p>
            <strong>Burhum Maze</strong> converts at 7.96% CTR from an average position of 6.38.{' '}
            <strong>Elowen: Witch of Wisdom location</strong> converts at 2.09% from a <em>better</em> position,
            7.28. Position doesn&rsquo;t explain a 4× gap. The title does. The winners match how people actually
            type (the top queries behind them are &ldquo;burhum puzzle,&rdquo; &ldquo;smoking lands puzzle,&rdquo;
            &ldquo;areciel&rdquo;); the losers are titled in lore register: &ldquo;Elowen, Witch of Wisdom,
            location&rdquo;, when the real search was &ldquo;crimson desert elowen.&rdquo; Lead with the search
            term, drop the epithet, use the verb people used. (See the chart above, &ldquo;Impact, in detail.&rdquo;)
          </p>
          <p>
            <strong>The honest caveat:</strong> the site-wide 1.68% CTR is not evidence of broken titles: at an
            average position of 11.67 that&rsquo;s roughly normal. This finding only holds for the pages already
            ranking 6–8, where CTR still varies 4× at the same position.
          </p>
        </article>

        <article className="cs-decision">
          <p className="cs-decision__kicker">What the data said: 2 of 3, an open question</p>
          <h3>Instrument before deciding anything else about the hint system</h3>
          <p>
            26 seconds of average engagement and 0.38 engaged sessions per user reads two opposite ways: people find
            their answer fast and leave (the product working exactly as intended for someone mid-game) or they
            aren&rsquo;t finding it. The data as it stands can&rsquo;t tell those apart, and every future decision
            about the core feature depends on knowing which.
          </p>
          <p>
            <strong>The fix:</strong> add analytics events that record which hint level someone picks and whether
            they escalate to a deeper one, plus scroll depth per tier. This is the highest-value build on the
            roadmap right now (higher than any new game, any new guide type) because it&rsquo;s the one piece of
            missing information that every other product decision about the hint system is currently a guess
            without.
          </p>
        </article>

        <article className="cs-decision">
          <p className="cs-decision__kicker">What the data said: 3 of 3, an assumption proven wrong</p>
          <h3>Desktop-first for the hint control</h3>
          <p>
            The design assumed phone-first: someone stuck mid-game, one hand free, next to a console. The real
            split is <strong>60.1% desktop, 39.5% mobile</strong> (see the device-split chart above). Desktop use
            here reads as second-monitor, alt-tabbed-out-of-the-game use: a different posture, with longer sessions
            and more scrolling than the phone-first assumption was designed around.
          </p>
          <p>
            That retroactively makes the sticky-hint-bar bug from &ldquo;Under the hood&rdquo; more consequential
            than it looked at the time: the segmented control&rsquo;s position matters <em>more</em> on desktop
            than assumed, not less. Worth revisiting whether it needs a persistent, compact state on desktop rather
            than the same treatment mobile gets.
          </p>
        </article>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-next">
        <h2 className="cs-section__heading">What&rsquo;s next</h2>
        <p>
          The hint-instrumentation build above is first: every other product decision on the core feature is
          downstream of it. Coverage keeps expanding by the same competition-over-popularity logic that picked
          Borderlands 4 first, concentrated rather than spread thin, per the same data. And the open question from
          Decision 3 stays open: some version of a supporter tier or sponsorship is the most likely path, evaluated
          against the same zero-ads promise that makes the site worth building in the first place.
        </p>
        <p>
          Copia&rsquo;s headline moment was removing a quantity number after watching someone shop. Vault&rsquo;s is
          rewriting the hint system after realizing it was a reward mechanic instead of a help mechanic; and, per
          the data above, possibly about to be rewritten again once instrumentation says which. Same instinct,
          different domain.
        </p>
        <div className="cs-next__cta">
          <a className="cs-hero__live-link" href="https://vaultgg.app" target="_blank" rel="noopener">
            <SpecularButton
              as="span"
              size="md"
              radius={999}
              tint="#0a0a0c"
              tintOpacity={0.55}
              textColor="#ff8a3d"
              lineColor="#ff8a3d"
              baseColor="#3a2210"
              intensity={1.3}
              shineSize={14}
              shineFade={46}
              proximity={260}
            >
              Visit vaultgg.app →
            </SpecularButton>
          </a>
          <Link className="cs-next__back" to="/" state={{ scrollTo: 'work' }}>
            ← Back to work
          </Link>
        </div>
      </ScrollReveal>
    </main>
  );
}
