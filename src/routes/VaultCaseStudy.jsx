import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';
import SpecularButton from '@/components/reactbits/SpecularButton/SpecularButton';
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
        <p className="cs-hero__eyebrow">Case study · Responsive web</p>
        <h1 className="cs-hero__title">Get unstuck without getting spoiled.</h1>
        <p className="cs-hero__line">
          Vault is an ad-free gaming guide site built on one idea: being stuck isn&rsquo;t all-or-nothing, so the
          player should choose how much a guide gives away. It reached 4,900 users in its first eight months with
          zero ads.
        </p>
        <div className="cs-hero__frame">
          <span>Solo: product design, content &amp; engineering</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Responsive web</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Live, actively published</span>
        </div>
        <div className="cs-hero__cta">
          <VisitVaultButton />
          <span className="cs-hero__cta-note">252 guides live, zero ads</span>
        </div>

        <div className="cs-hero__stats">
          <div className="stat">
            <span className="stat__num">4,900</span>
            <span className="stat__label">users in its first 8 months</span>
          </div>
          <div className="stat">
            <span className="stat__num">4</span>
            <span className="stat__label">hint levels, set once for the whole guide</span>
          </div>
          <div className="stat">
            <span className="stat__num">252</span>
            <span className="stat__label">guides, each at four levels of detail</span>
          </div>
        </div>

        <figure className="cs-shot">
          <img src={vaultHomeShot} alt="Vault's home page: dark UI, orange accent, a Crimson Desert feature and a games sidebar" loading="lazy" />
        </figure>
      </section>

      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">At a glance</h2>
        <dl className="cs-snapshot cs-snapshot--four">
          <div>
            <dt>Problem</dt>
            <dd>
              A stuck player usually wants a nudge, not the answer. Guide sites only offer the whole answer, and
              bury it under ads, autoplay video and preamble. The player has no say in how much gets spoiled.
            </dd>
          </div>
          <div>
            <dt>Design question</dt>
            <dd>How much should a guide give away, who decides, and how fast can a frustrated player decide it?</dd>
          </div>
          <div>
            <dt>Constraint</dt>
            <dd>
              Solo, no ads by choice, and guides matter most in a game&rsquo;s first few weeks, when
              there&rsquo;s little other coverage.
            </dd>
          </div>
          <div>
            <dt>My role</dt>
            <dd>Everything: the hint model, information architecture, content design and titles, visual design and the front end.</dd>
          </div>
        </dl>
      </ScrollReveal>

      <section className="cs-section cs-decisions">
        <h2 className="cs-section__heading">Key decisions</h2>

        <ScrollReveal as="article" className="cs-decision cs-decision--feature">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 01 · The reversal</p>
              <h3>Progressive detail, not progressive disclosure</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                The first build used progressive disclosure: hints sat behind accordions and blurs you clicked to
                reveal. It shipped, and it was wrong. It treated help as a reward, and at the lowest level the page
                collapsed to an intro paragraph, so a spoiler-averse player got no structure at all. I replaced it with
                progressive detail: every step is always visible, and the hint level changes only how specific each
                step is.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong> Every section exists at four levels.
                Each step&rsquo;s facts are gathered once into a fixed structure, and all four levels are built from
                that one set of facts, so a Nudge can never contradict the Full Guide.
              </p>
            </div>
          </div>
          <HintLevelControl />
          <p className="cs-hint-grid__caption">The same boss phase at all four levels. Same facts, more specific each time.</p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 02</p>
              <h3>One control for the whole page</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                I tried a hint control on every section. It turned one decision into twelve, for someone who was
                already frustrated. Now a single segmented control sets the level for the whole guide and remembers
                each player&rsquo;s choice, so a spoiler-averse player sets it once and is protected on every guide
                after.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong> You can&rsquo;t mix levels across sections. One fast decision is worth more
                than that flexibility to someone stuck mid-fight.
              </p>
              <p>
                <strong>What the data changed:</strong> I designed for phones, but 60% of traffic is desktop, mostly
                people reading on a second monitor while they play. So the control has to stay in reach on a wide
                screen, not just under a thumb.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 03</p>
              <h3>Zero ads, so the hint is the first thing you see</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                Ads, autoplay video and preamble are half of the problem above. With no ads, the page opens on the
                guide and the hint control, with nothing between a stuck player and the level they picked. It&rsquo;s
                also the one thing big guide sites can&rsquo;t
                copy. They could build a hint system, but they can&rsquo;t drop the ads their business runs on.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong> There&rsquo;s no revenue model yet. A supporter tier or sponsorship is the
                likely path. It&rsquo;s the biggest open question about Vault, and I&rsquo;d rather say so than hide it.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 04 · From the data</p>
              <h3>Name guides the way stuck players describe the problem</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                A title is the first piece of content a player reads, usually in a search result. I&rsquo;d been naming
                guides with the game&rsquo;s formal lore names. Four pages that ranked about the same got very different
                click rates: the one named the way people type (&ldquo;Burhum Maze&rdquo;) did best, and the two weakest
                were both named with lore titles alone (&ldquo;Elowen: Witch of Wisdom&rdquo;). New titles lead with the
                player&rsquo;s words.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Caveat</strong> Four pages is a small sample, and one page
                titled with a lore name (Areciel) still did well. It was enough to change how I write titles, not to
                prove the rule.
              </p>
            </div>
          </div>
          <div className="cs-databar-group">
            <DataBar label="Burhum Maze" valueLabel="7.96% clicked · ranked 6.4" pct={100} highlight />
            <DataBar label="Areciel: Witch of Strength" valueLabel="6.02% clicked · ranked 6.2" pct={75.6} />
            <DataBar label="Bari: Witch of Kindness" valueLabel="2.60% clicked · ranked 7.6" pct={32.7} />
            <DataBar label="Elowen: Witch of Wisdom" valueLabel="2.09% clicked · ranked 7.3" pct={26.3} />
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="cs-section cs-outcome">
        <h2 className="cs-section__heading">Outcome</h2>
        <p>
          From January to August 2026: 4,900 users and 252 guides, each at four levels of detail. The launch post
          reached 134 upvotes and 12,000 views. I answered people&rsquo;s questions in the thread first and linked
          the guide only as a follow-up.
        </p>
        <p>
          <strong>What I can&rsquo;t claim yet:</strong> that the hint levels work. I haven&rsquo;t measured which
          level people pick.
        </p>
        <p>
          <strong>Next:</strong> track which level people pick and whether they step up. A 26-second average
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
