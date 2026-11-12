import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import StatNumber from '@/components/StatNumber';
import { setDocumentMeta } from '@/lib/documentMeta';
import teneoPromise from '@/assets/teneo-promise.jpg';
import teneoShotDay from '@/assets/teneo-shot-day.jpg';
import teneoPhotoProtein from '@/assets/teneo-photo-protein.jpg';
import teneoProgress from '@/assets/teneo-progress.jpg';

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
// Research/Photo estimate accuracy, the 30% from the shipped Today screen.
export default function TeneoCaseStudy() {
  useEffect(() => {
    return setDocumentMeta({
      title: 'Teneo | Ryan Craun',
      description:
        'Teneo, a native iOS app that helps people on GLP-1 medication keep their muscle while the weight comes off. Designed and built solo, and shaped by four design decisions and their trade-offs.',
    });
  }, []);

  return (
    <main className="cs">
      <section className="cs-hero">
        <Link className="cs-hero__back" to="/" state={{ scrollTo: 'work' }}>
          ← Back to work
        </Link>
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
              <StatNumber value={28} suffix="%" />
            </span>
            <span className="stat__label">protein error on weighed meals, at about a cent a photo</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={30} suffix="%" />
            </span>
            <span className="stat__label">lighter training on the two low-energy days after a shot</span>
          </div>
        </div>

        <figure className="cs-shot cs-shot--phone">
          <img
            src={teneoPromise}
            alt="Teneo App Store screenshot, 'Lose the fat. Keep the muscle.': the Progress screen charting strength up 11% while weight fell 7 lb, with a list of lifts trending up"
            loading="lazy"
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

        <ScrollReveal as="article" className="cs-decision cs-decision--feature">
          <p className="cs-decision__kicker">01: the core idea</p>
          <h3>The plan follows the shot week, and you can overrule it</h3>
          <p>
            Shot day is day one. Days two and three are low-energy days, so training drops 30% and protein is paced
            to a floor instead of a goal. The rest of the week is full strength. A one-tap &ldquo;How do you
            feel?&rdquo; check-in overrides the calendar: &ldquo;Good&rdquo; lifts a low day back to full, and
            &ldquo;Not great&rdquo; lightens any day. Onboarding asks about medication first and branches, so someone
            on a daily pill, or on no medication yet, never gets a weekly-shot plan.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>Trade-off:</strong> a calendar guess will sometimes be wrong for a given body. So the plan only
            ever suggests, and the person&rsquo;s own answer always wins.
          </p>
          <figure className="cs-shot cs-shot--phone">
            <img
              src={teneoShotDay}
              alt="Teneo App Store screenshot, 'Rough shot day? Today adapts.': the Today screen reading 'Ease in today' with a daily check-in and a lighter session card"
              loading="lazy"
            />
          </figure>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">02</p>
          <h3>The photo estimate always gives a guess, and every line is editable</h3>
          <p>
            Wrong photo estimates drew 172 one- and two-star reviews across competitors. The usual fix is to ask
            questions (&ldquo;Cooked in oil or butter?&rdquo;), which adds friction to every meal. Instead, hidden
            oils show up as their own line, and every amount is typed in any unit rather than stepped. I tested it on
            38 weighed meals: 28.3% protein error at $0.0108 a photo.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>Trade-off:</strong> a version that cost about twice as much per photo gave no real gain in
            accuracy, so I shipped the cheaper one. I show the error honestly and make it a one-tap fix.
          </p>
          <figure className="cs-shot cs-shot--phone">
            <img
              src={teneoPhotoProtein}
              alt="Teneo App Store screenshot, 'Snap your plate. Get the protein.': a meal review screen with a photo of pecan halves, 3 g protein, a portion slider, and editable detected items"
              loading="lazy"
            />
          </figure>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">03</p>
          <h3>A free core, and a trust pack written from competitors&rsquo; angriest reviews</h3>
          <p>
            Money was the top complaint: 1,454 of the negative reviews were about paywalls, and 766 were about
            unexpected charges, trials or refunds. So logging, barcode scanning and export are free, with no ads and
            no account required. The trial reminder is on by default, the paywall names the charge date, a
            notification comes 48 hours before it, and a public pricing promise sits on the paywall and the App Store
            page.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>Trade-off:</strong> a reminder before the charge will lose some renewals that a quiet paywall would
            keep. I chose trust instead, because billing is what this category gets punished for.
          </p>
          <figure className="cs-shot cs-shot--phone">
            <img
              src={teneoProgress}
              alt="Teneo App Store screenshot, 'Watch every lift climb.' with the line 'Free to start. Logging stays free.': the Progress screen with a Muscle Score of 85 out of 100"
              loading="lazy"
            />
          </figure>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">04</p>
          <h3>Shot history has to survive every update</h3>
          <p>
            Reviews of a leading shot tracker described losing seven months of history after an update. Teneo keeps
            an append-only shot journal outside the main database and takes a snapshot before every migration. The
            data model has changed six times so far, and each change was tested on a copy of real phone data before it
            shipped.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>Trade-off:</strong> a second copy of the most important data, and more code to keep in sync.
            It&rsquo;s worth it, because lost dose history is the one bug a medication user won&rsquo;t forgive.
          </p>
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="cs-section cs-outcome">
        <h2 className="cs-section__heading">Outcome</h2>
        <p>
          Teneo went from first commit to App Store submission in a week. The first review flagged the screens shown
          before permission requests. I fixed them and resubmitted the next day. Everything above already answers the
          review themes: free logging and barcode scanning, no ads or required account, a trial reminder that&rsquo;s
          on by default, and history that survives updates.
        </p>
        <p>
          <strong>Next:</strong> launch, then clear states for shots that are due, late or skipped, so a missed dose
          never quietly changes the plan.
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
