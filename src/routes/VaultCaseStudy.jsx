import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';
import SpecularButton from '@/components/reactbits/SpecularButton/SpecularButton';
import StatNumber from '@/components/StatNumber';
import DataBar from '@/components/DataBar';
import HintLevelControl from '@/components/HintLevelControl';
import { setDocumentMeta } from '@/lib/documentMeta';

import vaultHomeShot from '@/assets/vault-home.jpg';

// Same format as CopiaCaseStudy.jsx (see its file-top comment). Every
// number is Ryan's own GA / Search Console pull (Jan 1 - Aug 25 2026) or
// the Reddit launch post. The hint-level example in decision 01 is Vault's
// own written example, rendered as a working recreation of the live control
// (HintLevelControl.jsx) rather than a screenshot.
function VisitVaultButton() {
  return (
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
  );
}

export default function VaultCaseStudy() {
  useEffect(() => {
    return setDocumentMeta({
      title: 'Vault | Ryan Craun',
      description:
        'Vault, an ad-free gaming guide site built around a progressive hint system: four levels of detail, one control, zero ads. A solo case study with 4,900 users and four design decisions with their trade-offs.',
    });
  }, []);

  return (
    <>
    <main className="cs cs-vault">
      <section className="cs-hero">
        <Link className="cs-hero__back" to="/" state={{ scrollTo: 'work' }}>
          ← Back to work
        </Link>
        <p className="cs-hero__eyebrow">Case Study: Web / Content Platform</p>
        <h1 className="cs-hero__title">Get unstuck without getting spoiled.</h1>
        <p className="cs-hero__line">
          Vault is an ad-free gaming guide site built on one idea: being stuck isn&rsquo;t all-or-nothing, so the
          player should choose how much a guide gives away. It reached 4,900 users in its first eight months with
          zero ads.
        </p>
        <div className="cs-hero__frame">
          <span>Solo: product design, content &amp; engineering</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Web (Next.js, Supabase)</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Live, actively published</span>
        </div>
        <div className="cs-hero__cta">
          <VisitVaultButton />
          <span className="cs-hero__cta-note">252 guides live, zero ads</span>
        </div>

        <div className="cs-hero__stats">
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={4900} />
            </span>
            <span className="stat__label">users in its first 8 months</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={862} />
            </span>
            <span className="stat__label">search clicks (1.68% CTR)</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={252} />
            </span>
            <span className="stat__label">guides published, zero ads</span>
          </div>
        </div>

        <figure className="cs-shot">
          <img src={vaultHomeShot} alt="Vault's home page: dark UI, orange accent, a Crimson Desert feature and a games sidebar" loading="lazy" />
        </figure>
      </section>

      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">At a glance</h2>
        <dl className="cs-snapshot">
          <div>
            <dt>Problem</dt>
            <dd>
              Guide sites give you the whole answer when you wanted a nudge, buried under ads, autoplay video and
              paragraphs of SEO preamble, while you&rsquo;re stuck and frustrated.
            </dd>
          </div>
          <div>
            <dt>Constraint</dt>
            <dd>
              Solo, no ad revenue by choice, and the window that matters is a game&rsquo;s first few weeks, before
              anyone else has coverage.
            </dd>
          </div>
          <div>
            <dt>My role</dt>
            <dd>Everything: product and content design, the publishing pipeline, and the front end.</dd>
          </div>
        </dl>
      </ScrollReveal>

      <section className="cs-section cs-decisions">
        <h2 className="cs-section__heading">Key decisions</h2>

        <ScrollReveal as="article" className="cs-decision cs-decision--feature">
          <p className="cs-decision__kicker">Decision 01 · The reversal</p>
          <h3>Progressive detail, not progressive disclosure</h3>
          <p>
            The first build hid hints behind accordions and blurs you clicked to reveal. It shipped, and it was
            wrong. It treated help as a reward, and at the lowest level the page collapsed to an intro paragraph.
            Now every step is always visible, and the hint level changes only how much each step tells you.
          </p>
          <HintLevelControl />
          <p className="cs-hint-grid__caption">The same boss phase at all four levels. Same facts, more specific each time.</p>
          <p className="cs-decision__tradeoff">
            <strong className="cs-decision__tradeoff-label">Trade-off</strong> Every section has to be written four times, about four times the content.
            That&rsquo;s only affordable because guides come out of a pipeline that pulls the facts from sources
            and writes all four levels from them.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">Decision 02</p>
          <h3>One control for the whole page</h3>
          <p>
            A hint control on every section turned one decision into twelve, for someone who was already
            frustrated. Now a single segmented control sets the level for the whole guide, and it remembers each
            user&rsquo;s choice, so spoiler-averse players are protected by default.
          </p>
          <p className="cs-decision__tradeoff">
            <strong className="cs-decision__tradeoff-label">Trade-off</strong> You can&rsquo;t mix levels across sections. One fast decision is worth more
            than that flexibility to someone stuck mid-fight.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">Decision 03</p>
          <h3>Zero ads, promised publicly</h3>
          <p>
            It&rsquo;s the one advantage the big sites can&rsquo;t copy. IGN or Game8 could build a hint system
            next quarter, but they can&rsquo;t drop the ad stack their business depends on.
          </p>
          <p className="cs-decision__tradeoff">
            <strong className="cs-decision__tradeoff-label">Trade-off</strong> There&rsquo;s no revenue model yet. A supporter tier or sponsorship is the
            likely path. It&rsquo;s the biggest open question about Vault, and I&rsquo;d rather say so than hide it.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">Decision 04 · From the data</p>
          <h3>Title guides the way people search</h3>
          <p>
            Four pages ranking in the same band got very different click-through rates. The top performer was titled the way people type
            (&ldquo;Burhum Maze&rdquo;), and the two weakest used formal lore names alone (&ldquo;Elowen: Witch of
            Wisdom&rdquo;). New titles lead with the search term.
          </p>
          <div className="cs-databar-group">
            <DataBar label="Burhum Maze" valueLabel="7.96% CTR · pos 6.4" pct={100} highlight />
            <DataBar label="Areciel: Witch of Strength" valueLabel="6.02% · pos 6.2" pct={75.6} />
            <DataBar label="Bari: Witch of Kindness" valueLabel="2.60% · pos 7.6" pct={32.7} />
            <DataBar label="Elowen: Witch of Wisdom" valueLabel="2.09% · pos 7.3" pct={26.3} />
          </div>
          <p className="cs-decision__tradeoff">
            <strong className="cs-decision__tradeoff-label">Caveat</strong> This only holds for pages already ranking 6–8. The site-wide 1.68% CTR is
            normal for an average position of 11.7.
          </p>
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="cs-section cs-outcome">
        <h2 className="cs-section__heading">Outcome</h2>
        <p>
          From January to August 2026: 4,900 users, 51.4K search impressions, 862 clicks and 252 guides
          published. The launch post reached 134 upvotes and 12,000 views. I answered people&rsquo;s questions in
          the thread first and linked the guide only as a follow-up.
        </p>
        <p>
          <strong>An assumption the data broke:</strong> I designed for phones, but 60% of traffic is desktop,
          mostly people reading on a second monitor. That makes keeping the hint control in reach on desktop more
          important than I planned for.
        </p>
        <p>
          <strong>Next:</strong> track which hint level people pick and whether they step up. A 26-second average
          session could mean they found the answer fast or gave up, and every future hint decision depends on
          which.
        </p>
        <div className="cs-next__cta">
          <VisitVaultButton />
          <Link className="cs-next__back" to="/" state={{ scrollTo: 'work' }}>
            ← Back to work
          </Link>
          <Link className="cs-next__back cs-next__next" to="/work/picktheodds">
            Next: PickTheOdds →
          </Link>
        </div>
      </ScrollReveal>
    </main>
      <Footer />
    </>
  );
}
