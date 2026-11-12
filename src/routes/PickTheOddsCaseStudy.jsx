import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';
import DataBar from '@/components/DataBar';
import { setDocumentMeta } from '@/lib/documentMeta';
import pickTheOddsScreenshot from '@/assets/picktheodds-crop2.png';

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
        <p className="cs-hero__eyebrow">Case study · Web app, contract</p>
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
            <span className="stat__num">31%</span>
            <span className="stat__label">faster to choose a betting category in a timed test, old panel against new</span>
          </div>
          <div className="stat">
            <span className="stat__num">68%</span>
            <span className="stat__label">of a 700+ member Discord poll said the filters were too slow</span>
          </div>
          <div className="stat">
            <span className="stat__num">3</span>
            <span className="stat__label">structural fixes: grouped filters, the navigation, and billing</span>
          </div>
        </div>

        <figure className="cs-shot cs-shot--native-res">
          <img src={pickTheOddsScreenshot} alt="PickTheOdds odds table: NFL games with over and under lines, odds and wager columns, dark UI" loading="lazy" />
        </figure>
      </section>

      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">At a glance</h2>
        <dl className="cs-snapshot cs-snapshot--four">
          <div>
            <dt>Problem</dt>
            <dd>
              Bettors run the same loop all day: pick a category, compare odds, open the game. The interface slowed
              every step. The filters were one flat wall, the navigation broke past six links, the odds sat too many
              clicks from the game, and there was no way to pay.
            </dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>
              In a poll of the product&rsquo;s 700+ member Discord, 68% found the filters too slow and 72% said
              they&rsquo;d pay for better ones.
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
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 01</p>
              <h3>Group the filters, don&rsquo;t shrink them</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                68% of the Discord poll found the filters too slow. Every filter sat at the same level, so finding one
                meant reading all of them. I grouped them into categories, then timed users doing the same task on the
                old panel and the new one. The grouped version cut the time to select a betting category by 31%.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">What I didn&rsquo;t do</strong> Shrink every filter to fit. That would have kept the same flat
                hierarchy in less space, and the hierarchy was the real problem.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 02</p>
              <h3>Structure the navigation around the core loop</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                The top navigation broke past six links, and every new feature needed a place. Squeezing in a seventh
                link would have fixed the symptom. Instead I rebuilt the structure around the path every user runs all
                day, from the Odds screen to the matching Game screen, and made that path as short as possible.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong> Paths people used less got less attention. That was
                deliberate, because the core loop is where the product earns its money.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 03</p>
              <h3>Design billing in, don&rsquo;t bolt it on</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                There was no way to subscribe, yet 72% of the Discord poll said they&rsquo;d pay for better filters. The
                quick option was a separate billing page. Instead I put plan and billing into one central account panel,
                inside the new navigation, so paying sat in the same structure as everything else.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong> More account structure to design up front than a standalone page.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="cs-section cs-outcome">
        <h2 className="cs-section__heading">Outcome</h2>
        <p>
          Over the eight months, daily active users grew from about 50 to 500+, retention rose 25% and time on site
          rose 84%. The founder credits the redesign. Only the 31% comes from a controlled test, so I treat the
          rest as the redesign&rsquo;s context, not its proof. Every wireframe and prototype went back through the
          same Discord community before any visual design started.
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
