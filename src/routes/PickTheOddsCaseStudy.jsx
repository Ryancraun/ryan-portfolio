import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';
import StatNumber from '@/components/StatNumber';
import DataBar from '@/components/DataBar';
import { setDocumentMeta } from '@/lib/documentMeta';
import pickTheOddsScreenshot from '@/assets/picktheodds-crop.png';

// Same format as CopiaCaseStudy.jsx (see its file-top comment). Every fact,
// number and the founder quote come from the original Framer write-up of
// this engagement. The screenshot is a native 647px capture, hence
// `cs-shot--native-res` so it isn't upscaled.
export default function PickTheOddsCaseStudy() {
  useEffect(() => {
    return setDocumentMeta({
      title: 'PickTheOdds | Ryan Craun',
      description:
        'PickTheOdds, modernizing a sports-analytics subscription platform over an eight-month contract: grouped filters, a shorter path from odds to bet, and billing designed in. Daily active users grew from 50 to 500+.',
    });
  }, []);

  return (
    <>
    <main className="cs">
      <section className="cs-hero">
        <Link className="cs-hero__back" to="/" state={{ scrollTo: 'work' }}>
          ← Back to work
        </Link>
        <p className="cs-hero__eyebrow">Case Study: B2B SaaS / Sports Analytics</p>
        <h1 className="cs-hero__title">Built to scale past six links.</h1>
        <p className="cs-hero__line">
          PickTheOdds had real arbitrage math buried under navigation that broke past six links and a filter panel
          nobody could parse. Over an eight-month contract I redesigned the interface, and daily active users grew
          from 50 to 500+.
        </p>
        <div className="cs-hero__frame">
          <span>Role: UX/UI Designer</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Contract, Dec 2023 &ndash; Jul 2024</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Shipped client engagement</span>
        </div>

        <div className="cs-hero__stats">
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={31} suffix="%" />
            </span>
            <span className="stat__label">faster to select a betting category</span>
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
            <span className="stat__label">increase in time on site</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={10} suffix="×" />
            </span>
            <span className="stat__label">daily active users (50 to 500+)</span>
          </div>
        </div>

        <figure className="cs-shot cs-shot--native-res">
          <img src={pickTheOddsScreenshot} alt="PickTheOdds arbitrage dashboard: odds table, grouped filters, dark UI" loading="lazy" />
        </figure>
      </section>

      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">At a glance</h2>
        <dl className="cs-snapshot">
          <div>
            <dt>Problem</dt>
            <dd>
              Good data, but an interface working against it: navigation that couldn&rsquo;t grow, a flat wall of
              filters, too many clicks from the odds to the bet, and no billing flow at all.
            </dd>
          </div>
          <div>
            <dt>Constraint</dt>
            <dd>Interface only. The data and the arbitrage engine underneath stayed as they were.</dd>
          </div>
          <div>
            <dt>My role</dt>
            <dd>
              UX/UI designer: community research, information architecture, wireframes, prototypes, usability
              testing and visual design.
            </dd>
          </div>
        </dl>
      </ScrollReveal>

      <section className="cs-section cs-decisions">
        <h2 className="cs-section__heading">Key decisions</h2>

        <ScrollReveal as="article" className="cs-decision cs-decision--feature">
          <p className="cs-decision__kicker">01</p>
          <h3>Group the filters, don&rsquo;t shrink them</h3>
          <p>
            I polled the product&rsquo;s 700+ member Discord. 68% of users found the filters too slow, and 72% said
            they&rsquo;d pay for better ones. I grouped the filters into categories, then timed users doing the same
            task on the old panel and the new one. The grouped version cut the time to select a betting category by 31%.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>What I didn&rsquo;t do:</strong> shrink every filter to fit. That would have kept the same flat
            hierarchy in less space, and the hierarchy was the real problem.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">02</p>
          <h3>Cut the distance between the odds and the bet</h3>
          <p>
            Every user runs the same loop all day, from the Odds screen to the matching Game screen. I rebuilt the
            navigation around making that path as short as possible. This is the most likely driver of the
            engagement gains: 84% more time on site and 25% higher retention.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>Trade-off:</strong> paths people used less got less attention. That was
            deliberate, because the core loop is where the product earns its money.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">03</p>
          <h3>Design billing in, don&rsquo;t bolt it on</h3>
          <p>
            The product had no subscription flow. Instead of adding a separate settings page, I put plan and billing
            into one central account panel, so paying fit into the same navigation fix happening everywhere else.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>Trade-off:</strong> more account architecture up front than a bolted-on page, before there were any paying users to justify it.
          </p>
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="cs-section cs-outcome">
        <h2 className="cs-section__heading">Outcome</h2>
        <p>
          Daily active users grew tenfold over the engagement. The founder credits the redesign, and the filter
          and navigation fixes were the structural changes behind all three metrics moving together. Every
          wireframe and prototype went back through the same Discord community before any visual design started.
        </p>
        <div className="cs-databar-group">
          <DataBar label="Before" valueLabel="~50 DAU" pct={10} />
          <DataBar label="After" valueLabel="500+ DAU" pct={100} highlight />
        </div>
        <blockquote className="cs-quote">
          <p>&ldquo;The new navigation and filters are a game-changer. Engagement and subscriptions have never been higher.&rdquo;</p>
          <cite>Ken Bean, Founder, PickTheOdds</cite>
        </blockquote>
        <div className="cs-next__cta">
          <Link className="cs-next__back" to="/" state={{ scrollTo: 'work' }}>
            ← Back to work
          </Link>
          <Link className="cs-next__back cs-next__next" to="/work/teneo">
            Next: Teneo →
          </Link>
        </div>
      </ScrollReveal>
    </main>
      <Footer />
    </>
  );
}
