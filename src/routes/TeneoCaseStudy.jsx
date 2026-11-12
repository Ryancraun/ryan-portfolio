import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';
import StatNumber from '@/components/StatNumber';
import { setDocumentMeta } from '@/lib/documentMeta';
import teneoPromise from '@/assets/teneo-promise.jpg';
import teneoShotDay from '@/assets/teneo-shot-day.jpg';
import teneoPhotoProtein from '@/assets/teneo-photo-protein.jpg';
import teneoProgress from '@/assets/teneo-progress.jpg';
// Process images: real captures from the vault and the teneo-ios repo (each
// call site cites its source path and the note its caption is drawn from).
import processCheckin from '@/assets/teneo-process-checkin.jpg';
import processFuelBefore from '@/assets/teneo-process-fuel-before.jpg';
import processFuelAfter from '@/assets/teneo-process-fuel-after.jpg';
import iconThreeD from '@/assets/teneo-process-icon-3d.jpg';
import iconCloseup from '@/assets/teneo-process-icon-b-closeup.jpg';
import iconFlex from '@/assets/teneo-process-icon-c-flex.jpg';
import iconDarkTile from '@/assets/teneo-process-icon-d-darktile.jpg';
import iconGlyphDark from '@/assets/teneo-process-icon-a-dark.jpg';
import iconFinal from '@/assets/teneo-process-icon-v3-final.jpg';

// App-icon directions, in the order they were explored. Captions are the
// reasons recorded in brain/Teneo/App Store/Icon/v2/v2.md and v3/v3.md.
const ICON_OPTIONS = [
  { src: iconThreeD, tag: 'Rejected', name: '3D Kettle', why: 'A busy, low-contrast render on a dark home screen' },
  { src: iconCloseup, tag: 'Rejected', name: 'Close-up', why: 'At 60 px, a cream hill with eyes' },
  { src: iconFlex, tag: 'Rejected', name: 'Flex', why: 'Left-heavy and busy at 60 px' },
  { src: iconDarkTile, tag: 'Rejected', name: 'Dark tile', why: 'Drops the cream that makes Kettle warm' },
  { src: iconGlyphDark, tag: 'Picked', name: 'Glyph, dark', why: 'The glyph’s silhouette on a near-black tile' },
  { src: iconFinal, tag: 'Final', name: 'Glyph, refined', why: 'The mascot’s eyes, with subtle depth' },
];

// Same CASE STUDY FORMAT as CopiaCaseStudy.jsx (hero + stats -> at a glance
// -> decisions with trade-offs -> outcome), with two deviations backed by
// agent-team/projects/portfolio-teneo/research.md:
//  - the at-a-glance block has a Constraint line, since NN/g's hiring
//    survey flags side projects with made-up constraints as weak, so a solo
//    app has to show its real ones;
//  - Teneo isn't live yet (in App Review), so the hero says so and the
//    outcome shows shipping proof instead of post-launch numbers.
// When it goes live: swap the status line and add the App Store badge.
//
// Every number is real and comes from the agent-team vault (brain/Teneo/):
// review figures from Research/App Store reviews, the photo eval from
// Research/Photo estimate accuracy, the migration count from the shipped data model.
export default function TeneoCaseStudy() {
  useEffect(() => {
    return setDocumentMeta({
      title: 'Teneo | Ryan Craun',
      description:
        'Teneo, a native iOS app that helps people on GLP-1 medication keep their muscle while the weight comes off. Designed and built solo, and shaped by four design decisions and their trade-offs.',
    });
  }, []);

  return (
    <>
    <main className="cs cs--teneo">
      <section className="cs-hero cs-hero--split">
        <Link className="cs-hero__back" to="/" state={{ scrollTo: 'work' }}>
          ← Back to work
        </Link>
        <div className="cs-hero__copy">
          <p className="cs-hero__eyebrow">Case Study: Native iOS</p>
          <h1 className="cs-hero__title">Built around the shot week.</h1>
          <p className="cs-hero__line">
            Teneo helps people on GLP-1 medication keep their muscle while the weight comes off, with protein,
            strength training, and a plan that changes with the days of the shot week. I designed and built it solo,
            and it&rsquo;s in App Review for a November 2026 launch.
          </p>
          <div className="cs-hero__frame">
            <span>Solo: research, design &amp; engineering</span>
            <span className="cs-hero__dot" aria-hidden="true" />
            <span>Native iOS (SwiftUI)</span>
            <span className="cs-hero__dot" aria-hidden="true" />
            <span>In App Review</span>
          </div>
          <div className="cs-hero__stats">
            <div className="stat">
              <span className="stat__num">
                <StatNumber value={21452} />
              </span>
              <span className="stat__label">competitor App Store reviews mined to set what&rsquo;s free and what&rsquo;s fixed</span>
            </div>
            <div className="stat">
              <span className="stat__num">
                <StatNumber value={0.01} decimals={2} prefix="$" />
              </span>
              <span className="stat__label">a photo, at the same protein accuracy as a version costing 2×</span>
            </div>
            <div className="stat">
              <span className="stat__num">
                <StatNumber value={6} />
              </span>
              <span className="stat__label">data-model changes shipped, each behind a pre-migration snapshot</span>
            </div>
          </div>
        </div>

        <figure className="cs-shot cs-shot--phone cs-hero__shot">
          <img
            src={teneoPromise}
            alt="Teneo App Store screenshot, 'Lose the fat. Keep the muscle.': the Progress screen charting strength up 11% while weight fell 7 lb, with a list of lifts trending up"
          />
        </figure>

      </section>

      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">At a glance</h2>
        <dl className="cs-snapshot cs-snapshot--four">
          <div>
            <dt>Problem</dt>
            <dd>
              GLP-1 users lose weight fast and are afraid of losing muscle along with it. The apps split the job: shot
              trackers ignore training, strength apps ignore the medication, and calorie apps bury protein.
            </dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>
              In 4,974 one- and two-star reviews across 33 competing apps, 29% were about paywalls and surprise
              charges and 26% were about bugs and lost data.
            </dd>
          </div>
          <div>
            <dt>Constraint</dt>
            <dd>
              One person, no support team, health history that can never be lost, AI paid for per photo, and no
              medical claims.
            </dd>
          </div>
          <div>
            <dt>My role</dt>
            <dd>
              Everything: research, interaction and visual design, the SwiftUI build and backend, and the App Store
              submission.
            </dd>
          </div>
        </dl>
      </ScrollReveal>

      <section className="cs-section cs-decisions">
        <h2 className="cs-section__heading">Key decisions</h2>

        <ScrollReveal as="article" className="cs-decision cs-decision--split cs-decision--feature">
          <div className="cs-decision__body">
            <p className="cs-decision__kicker">Decision 01 · The core idea</p>
            <h3>The plan follows the shot week, and you can overrule it</h3>
            <p>
              Shot day is day one. Days two and three are low-energy days, so training drops 30% and protein is paced
              to a floor instead of a goal. The rest of the week is full strength. A one-tap &ldquo;How do you
              feel?&rdquo; check-in overrides the calendar: &ldquo;Good&rdquo; lifts a low day back to full, and
              &ldquo;Not great&rdquo; lightens any day. Onboarding asks about medication first and branches, so someone
              on a daily pill, or on no medication yet, never gets a weekly-shot plan.
            </p>
            <p className="cs-decision__tradeoff">
              <strong className="cs-decision__tradeoff-label">Trade-off</strong>A calendar guess will sometimes be wrong for a given body. So the plan only
              ever suggests, and the person&rsquo;s own answer always wins.
            </p>
          </div>
          <figure className="cs-shot cs-shot--phone">
            <img
              src={teneoShotDay}
              alt="Teneo App Store screenshot, 'Rough shot day? Today adapts.': the Today screen reading 'Ease in today' with a daily check-in and a lighter session card"
              loading="lazy"
            />
          </figure>

          {/* Source: teneo-ios branch assets/feel-checkin, checkin-light.png.
              Caption facts: brain/Teneo/Design/feel-checkin.md (old 2x2 grid of
              four feelings; "Not well" rejected because it reads as ill). */}
          <div className="cs-process">
            <p className="cs-process__label">Process · The check-in, as built</p>
            <figure className="cs-process__item">
              <div className="cs-process__scroll" tabIndex={0} role="region" aria-label="Check-in screens, scroll sideways">
                <img
                  src={processCheckin}
                  alt="Four raw Teneo screens: the daily check-in with Good and Not great; Not great selected; 'sore legs' typed in; then Today's headline rewritten to 'Rest your legs today'"
                  loading="lazy"
                />
              </div>
              <figcaption>
                Raw screens: open, &ldquo;Not great&rdquo;, your own words, and the plan after it reads them
                (&ldquo;sore legs&rdquo; becomes &ldquo;Rest your legs today&rdquo;). It replaced a 2×2 grid of four
                fixed feelings.{' '}
                <span className="cs-process__tag cs-process__tag--rejected">Rejected</span> &ldquo;Not well&rdquo;
                as the second button, because it reads as ill. &ldquo;Not great&rdquo; is what people say.
              </figcaption>
            </figure>
          </div>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision cs-decision--split">
          <div className="cs-decision__body">
            <p className="cs-decision__kicker">Decision 02</p>
            <h3>The photo estimate always gives a guess, and every line is editable</h3>
            <p>
              Wrong photo estimates drew 172 one- and two-star reviews across competitors. The usual fix is to ask
              questions (&ldquo;Cooked in oil or butter?&rdquo;), which adds friction to every meal. Instead, hidden
              oils show up as their own line, and every amount is typed in any unit rather than stepped. I tested it on
              38 weighed meals: 28.3% protein error at $0.0108 a photo.
            </p>
            <p className="cs-decision__tradeoff">
              <strong className="cs-decision__tradeoff-label">Trade-off</strong>A version that cost about twice as much per photo gave no real gain in
              accuracy, so I shipped the cheaper one. I show the error honestly and make it a one-tap fix.
            </p>
          </div>
          <figure className="cs-shot cs-shot--phone">
            <img
              src={teneoPhotoProtein}
              alt="Teneo App Store screenshot, 'Snap your plate. Get the protein.': a meal review screen with a photo of pecan halves, 3 g protein, a portion slider, and editable detected items"
              loading="lazy"
            />
          </figure>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision cs-decision--split">
          <div className="cs-decision__body">
            <p className="cs-decision__kicker">Decision 03</p>
            <h3>A free core, and a trust pack written from competitors&rsquo; angriest reviews</h3>
            <p>
              Money was the top complaint: 1,454 of the negative reviews were about paywalls and pricing, 766 of them
              about surprise charges, trials or refunds. So logging, barcode scanning and export are free, with no ads and
              no account required. The trial reminder is on by default, the paywall names the charge date, a
              notification comes 48 hours before it, and a public pricing promise sits on the paywall and the App Store
              page.
            </p>
            <p className="cs-decision__tradeoff">
              <strong className="cs-decision__tradeoff-label">Trade-off</strong>A reminder before the charge will lose some renewals that a quiet paywall would
              keep. I chose trust instead, because billing is what this category gets punished for.
            </p>
          </div>
          <figure className="cs-shot cs-shot--phone">
            <img
              src={teneoProgress}
              alt="Teneo App Store screenshot, 'Watch every lift climb.' with the line 'Free to start. Logging stays free.': the Progress screen with a Muscle Score of 85 out of 100"
              loading="lazy"
            />
          </figure>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body">
            <p className="cs-decision__kicker">Decision 04</p>
            <h3>Shot history has to survive every update</h3>
            <p>
              Two reviews of a leading shot tracker described losing months of history after an update. Teneo keeps
              an append-only shot journal outside the main database and takes a snapshot before every migration. The
              data model has changed six times so far, and the major ones were tested on a copy of real phone data before they
              shipped.
            </p>
            <p className="cs-decision__tradeoff">
              <strong className="cs-decision__tradeoff-label">Trade-off</strong>A second copy of the most important data, and more code to keep in sync.
              It&rsquo;s worth it, because lost dose history is the one bug a medication user won&rsquo;t forgive.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">Iterations</h2>

        {/* Source: teneo-ios branch assets/fuel-redesign, top-light.png (a
            before | after composite, split into two files). Caption facts:
            brain/Teneo/Design/fuel.md (PR #99): the feedback quote, pace logic,
            and why a 7-day sparkline was rejected. */}
        <div className="cs-process cs-process--flush">
          <div className="cs-process__pair">
            <figure className="cs-process__item">
              <span className="cs-process__tag">Before</span>
              <img
                src={processFuelBefore}
                alt="Teneo Fuel screen before: protein ring on the left, '2 meals today' and '640 calories' on the right with empty space"
                loading="lazy"
              />
            </figure>
            <figure className="cs-process__item">
              <span className="cs-process__tag cs-process__tag--after">After</span>
              <img
                src={processFuelAfter}
                alt="Teneo Fuel screen after: protein ring on the left; on the right 'To the 105 g floor, About 25 g a meal, next 2 meals', meals and calories, and a fiber bar"
                loading="lazy"
              />
            </figure>
            <div className="cs-process__note">
              <h3>Fuel&rsquo;s protein card</h3>
              <p>
                In my own design review, the right half was two loose numbers and empty space, and it looked unfinished. It now shows
                pace: the grams left to today&rsquo;s floor, split across your usual remaining meals, plus fiber.
              </p>
              <p>
                <span className="cs-process__tag cs-process__tag--rejected">Rejected</span> A 7-day sparkline, because
                the Last 7 days chart is already on the same screen. Pace is the number that changes what you eat
                next.
              </p>
            </div>
          </div>
        </div>

        {/* Sources: brain/Teneo/App Store/Icon/icon-flex-1024.png (the 3D
            candidate), Icon/v2/teneo-icon-{B-closeup,C-flex,D-darktile,
            A-glyph-dark}-1024.png, Icon/v3/teneo-icon-v3-any-1024.png. Reasons
            from Icon/v2/v2.md and Icon/v3/v3.md. */}
        <div className="cs-process">
          <div className="cs-process__note cs-process__note--lead">
            <h3>The app icon: one render, four flat directions, one refinement</h3>
            <p>
              Users disliked the first, 3D icon, so I drew four flat ones and judged each at true home-screen size
              (120 and 60 px) on dark and light wallpapers.
            </p>
          </div>
          <ol className="cs-process__options">
            {ICON_OPTIONS.map((o) => (
              <li key={o.name} className="cs-process__option">
                <img src={o.src} alt={`${o.name} app icon option`} loading="lazy" width="256" height="256" />
                <span
                  className={`cs-process__tag${
                    o.tag === 'Rejected' ? ' cs-process__tag--rejected' : ' cs-process__tag--after'
                  }`}
                >
                  {o.tag}
                </span>
                <span className="cs-process__option-name">{o.name}</span>
                <span className="cs-process__option-why">{o.why}</span>
              </li>
            ))}
          </ol>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-outcome">
        <h2 className="cs-section__heading">Outcome</h2>
        <p>
          Teneo went from first commit to App Store submission in a week. Apple&rsquo;s first review flagged two things: the screen shown
          before the Apple Health permission request, and an account sign-up that failed for the reviewer. I fixed both
          and resubmitted the next day.
        </p>
        <p>
          <strong>Next:</strong> launch, then clear states for shots that are due, late or skipped, so a missed dose
          never quietly changes the plan.
        </p>
        <div className="cs-next__cta">
          <Link className="cs-next__back" to="/" state={{ scrollTo: 'work' }}>
            ← Back to work
          </Link>
          <Link className="cs-next__back cs-next__next" to="/work/copia">
            Next: Copia →
          </Link>
        </div>
      </ScrollReveal>
    </main>
      <Footer />
    </>
  );
}
