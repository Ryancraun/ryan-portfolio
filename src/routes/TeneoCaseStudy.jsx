import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';
import PhoneFrame, { PhoneFlow } from '@/components/PhoneFrame';
import { setDocumentMeta } from '@/lib/documentMeta';
import teneoShotDay from '@/assets/teneo-shot-day.jpg';

// Flow screens: raw simulator captures, one file per screen, no bezel baked
// in (PhoneFrame draws it). Each import names where the capture came from.
// Check-in: re-captured 2026-11-12 from the teneo-ios main Debug build on an
// iPhone 17 Pro Simulator (dark, top of Today, 1206 x 2622, scaled to 600 wide
// with ffmpeg). No island baked in, so PhoneFrame draws it. Launch arguments
// set each state (Isolation.swift capture hooks, in-memory demo data):
//   1 -demo (untouched)   2 -demo -feeling wiped (the Not great preset,
//   FeelMapper.swift)     3 and 4 -demo -feelText "sore legs" (FeelReader
//   submits the words; 3 is mid-read, 4 is the result).
import checkin1 from '@/assets/teneo-flow-checkin-1.jpg';
import checkin2 from '@/assets/teneo-flow-checkin-2.jpg';
import checkin3 from '@/assets/teneo-flow-checkin-3.jpg';
import checkin4 from '@/assets/teneo-flow-checkin-4.jpg';
// Onboarding branches: teneo-ios docs/screens/medication-form/ (commit
// 93902d4, 2026-10-31): shot-onboarding-2-dose-day, shot-today,
// pill-onboarding-2-dose-reminder, pill-today-due, pill-today-taken. The
// step-1 picker screens are left out on purpose: they list brand drug
// names, which this page doesn't show (research.md RED FLAG 3).
import shot1 from '@/assets/teneo-flow-shot-1.jpg';
import shot2 from '@/assets/teneo-flow-shot-2.jpg';
import pill1 from '@/assets/teneo-flow-pill-1.jpg';
import pill2 from '@/assets/teneo-flow-pill-2.jpg';
import pill3 from '@/assets/teneo-flow-pill-3.jpg';
// Late shot: teneo-ios branch assets/shot-states, shots/11-late-card-answers,
// 15-day-question, 17-after-skip (shot states shipped in commit 3eedcfe).
import late1 from '@/assets/teneo-flow-late-1.jpg';
import late2 from '@/assets/teneo-flow-late-2.jpg';
import late3 from '@/assets/teneo-flow-late-3.jpg';
// Photo log and paywall: brain/Teneo/App Store/Screenshots/superseded-2026-10-30/
// app-captures/02-fuel.png and 03-photo-estimate.png (the raw captures behind
// an earlier App Store pass), and brain/Teneo/App Store/Review/paywall-review.png.
import photo1 from '@/assets/teneo-flow-photo-1.jpg';
import photo2 from '@/assets/teneo-flow-photo-2.jpg';
import paywall from '@/assets/teneo-flow-paywall.jpg';

import processFuelBefore from '@/assets/teneo-process-fuel-before.jpg';
import processFuelAfter from '@/assets/teneo-process-fuel-after.jpg';
import iconThreeD from '@/assets/teneo-process-icon-3d.jpg';
import iconCloseup from '@/assets/teneo-process-icon-b-closeup.jpg';
import iconFlex from '@/assets/teneo-process-icon-c-flex.jpg';
import iconDarkTile from '@/assets/teneo-process-icon-d-darktile.jpg';
import iconGlyphDark from '@/assets/teneo-process-icon-a-dark.jpg';
import iconFinal from '@/assets/teneo-process-icon-v3-final.jpg';
import systemLibrary from '@/assets/teneo-system-library.jpg';
import systemFlow from '@/assets/teneo-system-flow-section.jpg';

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

// Shape: hero -> at a glance -> five design decisions, each with the flow
// that shows it -> iterations -> outcome. Rules from
// agent-team/projects/portfolio-teneo/research.md (RED FLAGS): no brand drug
// names, no muscle-preservation or medical claims, don't imply Ryan takes
// GLP-1 medication, and Teneo is not live yet (say "launching soon").
//
// The problem and the evidence are paired on purpose: the problem is about
// the medication week and protein, so the evidence is about side effects and
// protein (brain/Teneo/Research/GLP1-Pain-Points.md) and GLP-1 tracker
// reviews. The billing numbers only appear on the decision they drove (05).
export default function TeneoCaseStudy() {
  useEffect(() => {
    return setDocumentMeta({
      title: 'Teneo | Ryan Craun',
      description:
        'Teneo, a native iOS app for people on GLP-1 medication: protein, strength training, and a plan that follows the shot week. Designed and built solo. Five design decisions, shown as the flows that carry them.',
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
          <p className="cs-hero__eyebrow">Case study · Native iOS</p>
          <h1 className="cs-hero__title">Built around the shot week.</h1>
          <p className="cs-hero__line">
            Teneo is a protein and strength app for people on GLP-1 medication. Its plan changes with the days of
            the shot week, and a one-tap check-in lets you overrule it. I designed and built it solo, and it&rsquo;s
            launching on the App Store soon.
          </p>
          <div className="cs-hero__frame">
            <span>Solo: research, design &amp; engineering</span>
            <span className="cs-hero__dot" aria-hidden="true" />
            <span>Native iOS (SwiftUI)</span>
            <span className="cs-hero__dot" aria-hidden="true" />
            <span>Launching soon</span>
          </div>
          {/* Plain numbers, no count-up. Each is a research benchmark the design
              answers, not a feature count.
              34%: brain/Teneo/Research/GLP1-Needs-Fit-2026.md section 1, job 1
              (share of 2,782 reviews of 14 GLP-1 apps, 2025-2026, all ratings).
              43%: GLP1-Pain-Points.md, Frontiers in Nutrition 2025, n=69 (75%
              believed they ate more protein; 43% reached 1.2 g/kg).
              29%: Research/App Store reviews/Index.md (1,454 of 4,974 one- and
              two-star reviews across 33 apps; 766 unexpected charge, trial or
              refund). */}
          <div className="cs-hero__stats">
            <div className="stat">
              <span className="stat__num">34%</span>
              <span className="stat__label">of GLP-1 app reviews are about one job: log every dose and never miss the next</span>
            </div>
            <div className="stat">
              <span className="stat__num">43%</span>
              <span className="stat__label">of people on these drugs reach the protein minimum, though 75% think they eat more</span>
            </div>
            <div className="stat">
              <span className="stat__num">29%</span>
              <span className="stat__label">of negative reviews across 33 competing apps are about billing, the top complaint</span>
            </div>
          </div>
        </div>

        {/* App Store panel 02 (brain/Teneo/App Store/Screenshots/6.9/), the
            one marketing image on the page; everything below is raw screens. */}
        <figure className="cs-shot cs-shot--phone cs-hero__shot">
          <img
            src={teneoShotDay}
            alt="Teneo App Store screenshot, 'Rough shot day? Today adapts.': the Today screen reading 'Ease in today' with a daily check-in and a lighter session card"
          />
        </figure>
      </section>

      {/* Problem statement. Quotes: App Store reviews/raw/6499510249.json
          (Shotsy, 3 stars, 2026-08-14) and raw/6744178534.json (MeAgain,
          5 stars, 2025-09-14). 43%: Frontiers in Nutrition 2025, n=69.
          43.5%: Sehgal et al., medRxiv 2026, n=67,008 (GLP1-Pain-Points.md).
          Split across apps: GLP1-Needs-Fit-2026.md jobs 1, 6, 12 and the
          competitor landscape below. */}
      <ScrollReveal as="section" className="cs-section cs-problem">
        <h2 className="cs-section__heading">The problem</h2>
        <p className="cs-problem__statement">
          People on GLP-1 medication have no single place to manage the three things that decide how a week goes: the
          dose, the food and the training. So they split them across a shot tracker, a calorie app and a gym app, and
          each plan ignores the other two.
        </p>
        <div className="cs-problem__grid">
          <div>
            <p className="cs-problem__k">What people do instead</p>
            <p>
              They copy numbers between apps by hand. &ldquo;I still have to use the MFP app as well. It would be a
              lot better if &hellip; I only needed one app.&rdquo;
            </p>
          </div>
          <div>
            <p className="cs-problem__k">What it costs them</p>
            <p>
              Only 43% reach the protein minimum, though 75% think they eat more. The calorie app doesn&rsquo;t know
              it&rsquo;s a low-appetite day.
            </p>
          </div>
          <div>
            <p className="cs-problem__k">What no app does</p>
            <p>
              43.5% report side effects, led by nausea and fatigue. The gym app still asks for a full session the day
              after the shot.
            </p>
          </div>
        </div>
        <p className="cs-problem__hmw">
          <strong>So the design question became:</strong> how might one plan follow the dose week, set protein and
          training for the day someone is actually having, and still be easier than the apps it replaces?
        </p>
        <ul className="cs-problem__answers">
          <li><strong>One plan, not three trackers.</strong> Dose, food and training on one Today screen that reads the shot week (decision 01).</li>
          <li><strong>The medication comes first.</strong> Everything else is set from the dose and schedule, weekly shot or daily pill (decision 02).</li>
          <li><strong>Easier than copying numbers.</strong> A one-tap check-in, a photo for meals, free logging (decisions 01, 04, 05).</li>
        </ul>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">At a glance</h2>
        <dl className="cs-snapshot cs-snapshot--four">
          {/* Problem: GLP1-Pain-Points.md #2 (side effects wreck eating and
              training days), #3 (protein shortfall); UX competitiveness plan
              section 1 ("GLP-1 apps are thin on protein, water and fiber...
              strength apps ignore the medication"). */}
          <div>
            <dt>Problem</dt>
            <dd>
              The dose, the food and the training affect each other, but each lives in a different app. No app plans
              the week around the dose, so people stitch it together themselves.
            </dd>
          </div>
          {/* Evidence: App Store reviews/Index.md (21,452 reviews, 33 apps,
              4,974 one- and two-star, 17 themes); GLP1-Needs-Fit-2026.md (2,782
              reviews of 14 GLP-1 apps, all ratings, 2025-2026); GLP1-Pain-Points.md:
              Sehgal et al., medRxiv 2026 (67,008 users, 43.5% any side effect;
              nausea 36.9%, fatigue 16.7%) and Frontiers in Nutrition 2025, n=69. */}
          <div>
            <dt>Evidence</dt>
            <dd>
              Three sources. 21,452 App Store reviews of 33 competing apps, with the 4,974 one- and two-star ones sorted
              into 17 complaint themes. 2,782 reviews of 14 GLP-1 apps at every star rating, to see what people praise and
              pay for, not only what they hate. And published studies: 43.5% of 67,008 people on these drugs reported
              side effects, led by nausea and fatigue.
            </dd>
          </div>
          {/* research.md RED FLAG 2: Ryan doesn't take GLP-1 medication. Timing
              caveat: GLP1-Pain-Points.md section 2 ("treat the exact timing as
              soft"). */}
          <div>
            <dt>Constraint</dt>
            <dd>
              One person, no medical claims and no dose advice. I don&rsquo;t take these drugs, so the insight came
              from published studies and competitor reviews. The studies count how often side effects happen, not
              which day they hit, so the shot-week plan is a starting guess the check-in can overrule.
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

      {/* Research. Landscape rows:
          Shot trackers: GLP1-Needs-Fit-2026.md (Shotsy 34,135 and MeAgain 39,206
          ratings; pill job 10: "Five of the 12 say the app doesn't support the
          pill"); quote from App Store reviews/GLP-1 and shot tracking.md
          (MeAgain, 2 stars, 2026-10-11).
          Calorie and macro: Index.md (Paywall 1,454, hit hardest Cal AI,
          MyFitnessPal, Noom; Ads 397) and Opportunities.md item 1 (102
          barcode paywalled).
          AI photo: Index.md (AI photo estimates 172; Portions 164);
          Opportunities.md item 8 (Lifesum: "I do not see a way to edit").
          Strength: Opportunities.md item 5 (Fitbod review quote) and item 14
          (Watch sync the top complaint for Strong, Hevy, Fitbod, JEFIT).
          Muscle-first GLP-1: GLP1-Needs-Fit-2026.md short answer and job 12
          (about 15 launched in 2026, none with more than 8 ratings; 3% mention
          muscle or workouts) and job 6 (about 17% mention protein, water or fiber).
          "What the research changed": Needs-Fit short answer and jobs 1, 10, 12;
          Index.md theme counts (1,454 billing vs 413 food logging). */}
      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">Research</h2>
        <p className="cs-section__lede">
          I don&rsquo;t take these drugs, so I studied the people who do: what they hate in today&rsquo;s apps, what they
          praise and pay for, and what each kind of app leaves out.
        </p>

        {/* Ranked themes: Research/App Store reviews/Index.md, "Top 10
            complaint themes" plus AI photo 172, GLP-1 and shot tracking 169,
            Portions 164 from "All feature notes". 1- and 2-star counts of 4,974. */}
        <h3 className="cs-subhead">What people complain about most</h3>
        <p className="cs-findings__note">One- and two-star reviews by theme, out of 4,974 across 33 apps. A review can raise more than one theme.</p>
        <ol className="cs-findings">
          {[
            ['Billing: surprise charges, trials, refunds', 1454, 'Decision 05'],
            ['Sync, bugs and data loss', 1302, 'Decision 05'],
            ['Apple Health integration', 577, ''],
            ['Customer support', 422, ''],
            ['Food logging and database accuracy', 413, ''],
            ['Ads', 397, ''],
            ['Workout logging', 338, ''],
            ['Barcode scanning', 318, ''],
            ['Progress and charts', 293, ''],
            ['Performance and clutter', 285, ''],
            ['AI photo estimates', 172, 'Decision 04'],
            ['GLP-1 and shot tracking', 169, 'Decisions 02, 03'],
            ['Portions and serving units', 164, 'Decision 04'],
          ].map(([label, n, tag]) => (
            <li key={label} className={tag ? 'is-answered' : undefined}>
              <span className="cs-findings__label">{label}</span>
              <span className="cs-findings__bar" aria-hidden="true"><span style={{ width: `${(n / 1454) * 100}%` }} /></span>
              <span className="cs-findings__num">{n.toLocaleString('en-US')}</span>
              <span className="cs-findings__tag">{tag}</span>
            </li>
          ))}
        </ol>

        <h3 className="cs-subhead">What competitors miss</h3>
        <div className="cs-landscape">
          <div className="cs-landscape__row">
            <p className="cs-landscape__kind">Shot trackers<span>Shotsy, MeAgain: 34,000 and 39,000 ratings</span></p>
            <p><strong>Strong on</strong> the dose log, reminders and history.</p>
            <p>
              <strong>Miss</strong> the food: &ldquo;I&rsquo;m not sure if I&rsquo;m really meeting protein and
              fiber.&rdquo; And they assume a weekly shot: 5 of 12 reviews from daily-pill users said their app
              didn&rsquo;t support the pill.
            </p>
          </div>
          <div className="cs-landscape__row">
            <p className="cs-landscape__kind">Calorie and macro apps<span>MyFitnessPal, Lose It!, Noom and 8 more</span></p>
            <p><strong>Strong on</strong> the food database and barcode scanning.</p>
            <p>
              <strong>Miss</strong> trust: billing is the top complaint across all 33 apps (1,454 reviews), then ads
              (397) and barcode scanning moved behind a paywall (102).
            </p>
          </div>
          <div className="cs-landscape__row">
            <p className="cs-landscape__kind">AI photo apps<span>Cal AI, Foodvisor, SnapCalorie</span></p>
            <p><strong>Strong on</strong> speed: one photo, one number.</p>
            <p>
              <strong>Miss</strong> a way to fix the guess: 172 reviews say the estimate is wrong, 164 more fight the
              portions, and &ldquo;I do not see a way to edit.&rdquo;
            </p>
          </div>
          <div className="cs-landscape__row">
            <p className="cs-landscape__kind">Strength apps<span>Strong, Hevy, Fitbod, JEFIT and 5 more</span></p>
            <p><strong>Strong on</strong> logging sets and building routines.</p>
            <p>
              <strong>Miss</strong> progress that means strength: they &ldquo;emphasize activity totals while overlooking
              meaningful strength progression,&rdquo; and Watch sync is their top complaint.
            </p>
          </div>
          <div className="cs-landscape__row">
            <p className="cs-landscape__kind">Muscle-first GLP-1 apps<span>About 15 launched in 2026</span></p>
            <p><strong>Strong on</strong> the pitch Teneo started with.</p>
            <p>
              <strong>Miss</strong> the audience: none has more than 8 ratings. Muscle came up in 3% of GLP-1 app
              reviews; protein, water or fiber in about 17%.
            </p>
          </div>
        </div>
        <p className="cs-landscape__gap">
          The gap: each kind of app owns one part of the week. The dose, the food and the training live in different
          apps, and the anger in all of them is about money and lost data. Teneo joins the three around the dose week,
          and keeps logging free.
        </p>

        <h3 className="cs-subhead">What the research changed</h3>
        <ol className="cs-shifts">
          <li>
            <strong>I led with muscle. The reviews said lead with the medication.</strong> Logging the dose came up in
            34% of GLP-1 app reviews, muscle in 3%. People act on the muscle worry by eating protein, not by asking for
            a training plan. So the plan is built on the dose week, and strength is the payoff, not the pitch.
          </li>
          <li>
            <strong>I built for a weekly shot. Pill users were already leaving apps like that.</strong> Daily pills
            launched in 2026, and the first reviews from pill users were about apps that didn&rsquo;t fit them.
            Onboarding now asks how you take it before anything else (decision 02).
          </li>
          <li>
            <strong>Money anger outweighed every missing feature.</strong> Billing drew 1,454 negative reviews, more
            than three times food logging (413). So a free core and a paywall that names the
            charge date are product decisions, not marketing (decision 05).
          </li>
        </ol>
      </ScrollReveal>

      {/* Benchmarks. Teneo is pre-launch: no usage data exists, so the
          "After launch" column is the plan, not results.
          Dose: Needs-Fit job 1 (34%); GLP-1 and shot tracking.md (Shotsy 40%
          of its 1-2 star reviews). Protein: Frontiers 2025 (43% at 1.2 g/kg).
          Low days: Sehgal 2026 (43.5%). Photo: Index.md (172) and Photo
          estimate accuracy.md (protein 28.3% WAPE, n=38 weighed meals).
          Billing: Index.md (1,454 of 4,974 = 29%; 766). Onboarding:
          Opportunities.md item 7 (71 "paywall before trying"). The last two
          "After launch" items come from the Outcome note (check-in on low days,
          onboarding drop-off); the rest were proposed 2026-11-24 and need Ryan's OK. */}
      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">Benchmarks, and what I&rsquo;ll measure</h2>
        <p className="cs-section__lede">
          Teneo isn&rsquo;t live yet, so there are no usage numbers to show. Each design starts from a benchmark in the
          research, and each has the metric I&rsquo;ll watch after launch.
        </p>
        <div className="cs-bench">
          {[
            ['Logging the dose', '34% of GLP-1 app reviews are about it. At Shotsy, it’s 40% of one- and two-star reviews.', 'A shot nobody logged never changes the plan. The card asks instead (decision 03).', 'Shots logged by the end of shot day, and late-shot cards answered.'],
            ['Protein', 'Only 43% of people on these drugs reach 1.2 g per kg, though 75% think they eat more.', 'A lower floor on low days, and the grams left split across your usual meals.', 'Share of days at or above the floor.'],
            ['Low days', '43.5% report side effects, led by nausea and fatigue. Studies don’t say which day they hit.', 'A one-tap check-in that overrules the calendar (decision 01).', 'Low days with a check-in answer.'],
            ['Photo estimates', '172 reviews say competitors’ estimates are wrong. Teneo’s own test: protein off by 28% on 38 weighed meals.', 'A guess with its confidence shown, fixed in one tap (decision 04).', 'Estimates edited before saving, and the weighed-meal error, re-tested.'],
            ['Billing trust', '29% of negative reviews, 766 of them about surprise charges, trials and refunds.', 'The trial reminder is on by default, the charge date is named, and Continue free is always there (decision 05).', 'Refund requests, and trials that keep the reminder on.'],
            ['Onboarding', '71 reviews complain about a paywall before trying the app.', 'Free to use, no account, and the medication question first (decision 02).', 'Drop-off at each onboarding step.'],
          ].map(([area, bench, answer, measure]) => (
            <div className="cs-bench__row" key={area}>
              <p className="cs-bench__area">{area}</p>
              <div><p className="cs-bench__k">Benchmark</p><p>{bench}</p></div>
              <div><p className="cs-bench__k">Teneo&rsquo;s answer</p><p>{answer}</p></div>
              <div><p className="cs-bench__k">After launch</p><p>{measure}</p></div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <section className="cs-section cs-decisions">
        <h2 className="cs-section__heading">Key decisions</h2>

        {/* Decision 01. Cycle numbers: UX competitiveness plan 2.1 ("days 2 and
            3 are Low energy (training volume down 30%, protein paced to the
            floor)") and Engines.swift ShotCycle. Check-in design, the 2x2 grid
            it replaced, "Not well" rejected, and the safety copy:
            brain/Teneo/Design/feel-checkin.md. Two presets losing Queasy / No
            appetite: same note ("Older answers: Queasy and No appetite...
            show as typed words"). */}
        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 01 · The core idea</p>
              <h3>The plan follows the shot week, and you can overrule it</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                Shot day is day one. Days two and three are low-energy days: training volume drops 30% and protein
                counts toward a lower floor instead of the full goal. The rest of the week is full strength. But a
                calendar can&rsquo;t know how one person feels on a given Tuesday.
              </p>
              <p>
                The first version asked through a 2&times;2 grid of four fixed feelings. I cut it to two answers, Good
                and Not great, plus Other, for your own words. Good lifts a low day back to full. Not great lightens
                any day. Typed words are read by a model and the headline rewrites itself, while words like
                &ldquo;chest pain&rdquo; skip the model and get fixed care copy.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong>
                Two buttons lose detail the four had, like queasy versus no appetite. Other gets it back for anyone
                who wants to say more, and the common path stays one tap.
              </p>
            </div>
          </div>
          <PhoneFlow label="The daily check-in, four screens" className="phone-flow--4">
            <PhoneFrame src={checkin1} caption="1 · Today's plan, with the check-in under it"
              alt="Teneo Today screen, day 3 of the shot week: the headline 'Ease in today', 'Check in below and today adjusts to how you feel.', then the daily check-in asking 'How do you feel?' with Good, Not great and Other" />
            <PhoneFrame src={checkin2} caption="2 · One tap on Not great lightens the day"
              alt="After tapping Not great: the line under the headline now reads 'Lighter training today. Protein still matters most.', and the check-in has folded to 'Feeling not great'" />
            <PhoneFrame src={checkin3} caption="3 · Or say it in your own words"
              alt="The check-in's third button now holds the words 'sore legs', and the line under the headline reads 'Reading how you feel'" />
            <PhoneFrame src={checkin4} caption="4 · Today rewrites itself"
              alt="Today's headline now reads 'Rest your legs today', with 'Lighter training today. Protein still matters most.', and the check-in folded to 'Feeling: sore legs'" />
          </PhoneFlow>
          <p className="cs-decision__aside">
            <strong>Rejected</strong> &ldquo;Not well&rdquo; as the second button. It reads as ill. &ldquo;Not
            great&rdquo; is what people say.
          </p>
        </ScrollReveal>

        {/* Decision 02. Evidence quotes: App Store reviews/GLP-1 and shot
            tracking.md (MeAgain, 3 stars, 2025-12-06; DreamMe, 2 stars,
            2026-08-08). "Ryan declined this on 2026-10-27": UX competitiveness
            plan 2.2 item 9 and Opportunities item 9. Built 2026-10-31 in
            teneo-ios commit 93902d4 ("Onboarding asks How do you take it?
            first... Today: a daily dose logs in one tap with a short Undo");
            daily injection added in 16f4754. Daily copy: Engines.swift ("No
            fixed low days. Check in when you feel off and today eases."). */}
        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 02</p>
              <h3>Ask about the medication first, and let onboarding branch</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                The first build assumed a weekly shot on a fixed weekday. Reviews of competing trackers showed who that
                leaves out: &ldquo;Everything is geared towards a shot&rdquo; and &ldquo;Definitely not set up for the
                pill.&rdquo; I said no to other schedules at first, to keep scope tight. The reviews changed my mind.
              </p>
              <p>
                Onboarding now opens with how you take it, and builds one of three plans. A weekly shot gets a dose, a
                shot day and the shot-week plan. A daily pill or daily shot gets a dose and a reminder time, with no
                fixed low days: the check-in sets the easy days instead. No medication means training and protein only.
                A daily pill logs in one tap, with Undo.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong>
                One more question before anything personal, and daily-dose users get no calendar help, so the check-in
                does all the adapting for them. Asking once beats handing someone a plan built for a shot they
                don&rsquo;t take.
              </p>
            </div>
          </div>
          <div className="cs-branches">
            <PhoneFlow label="Weekly shot branch, two screens" title="Weekly shot" className="phone-flow--2">
              <PhoneFrame src={shot1} island={false} caption="1 · Dose and shot day"
                alt="Onboarding step 'Your dose and shot day': a weekly dose wheel set to 1 mg and injection-day chips, with the line 'We log what your prescriber decided. We never suggest a dose.'" />
              <PhoneFrame src={shot2} island={false} caption="2 · Today, day 3: low energy"
                alt="Today with the Shot cycle card: 'Low-energy day, Day 3 of 7', a week strip, and 'Appetite and energy dip today. Volume is down 30%. Small, protein-dense meals.'" />
            </PhoneFlow>
            <PhoneFlow label="Daily pill branch, three screens" title="Daily pill" className="phone-flow--3">
              <PhoneFrame src={pill1} island={false} caption="1 · Dose and reminder"
                alt="Onboarding step 'Your dose and reminder': a typed daily dose of 3 mg and a 9:00 AM reminder" />
              <PhoneFrame src={pill2} island={false} caption="2 · Due, no fixed low days"
                alt="Today with a Daily pill card: 'Due today. No fixed low days. Check in when you feel off and today eases.' and a Log today's pill button" />
              <PhoneFrame src={pill3} island={false} caption="3 · Logged in one tap"
                alt="The Daily pill card now reads 'Taken today'" />
            </PhoneFlow>
          </div>
        </ScrollReveal>

        {/* Decision 03. The finding ("A shot that isn't logged is treated as
            taken... training eases and protein drops to the floor for a dose
            that never happened"; 34% of GLP-1 app reviews about logging every
            dose) and the chosen design (three answers, full strength until
            answered, "missed" never appears, leaflet/prescriber footer, "Just
            this time" / "Move to Friday"): UX competitiveness plan 2.2 item 1
            and 2.3 A. Shipped: teneo-ios 3eedcfe; copy in TodayView.swift and
            ShotSheet.swift. */}
        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 03</p>
              <h3>A late shot never quietly changes the plan</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                Reviewing the build, I found that a shot nobody logged was treated as taken. The next morning the plan
                eased training and dropped protein to the floor for a dose that never happened. Logging every dose is
                what a third of GLP-1 app reviews are about, so the screen was wrong about the one thing it most needed
                to get right.
              </p>
              <p>
                I could assume the shot was taken, mark it missed, or ask. I chose to ask. The card says the shot
                isn&rsquo;t logged yet and offers I took it, Not yet, or Skipping this one. Until you answer, the plan
                stays at full strength. The word &ldquo;missed&rdquo; never appears. A shot logged on another day asks
                once: just this time, or move your shot day.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong>
                Some people want to be told what to do about a late dose. Teneo won&rsquo;t, because that&rsquo;s medical
                advice, so the card points to the medication leaflet or the prescriber instead.
              </p>
            </div>
          </div>
          <PhoneFlow label="A late shot, three screens" className="phone-flow--3">
            <PhoneFrame src={late1} caption="1 · Due date passed: three answers"
              alt="Shot cycle card: 'Shot not logged yet. It was due Wednesday. Until you log it, training and protein stay at full strength.' with I took it, Not yet, and Skipping this one" />
            <PhoneFrame src={late2} caption="2 · Logged a day late: one question"
              alt="The Log shot sheet with dose, time and optional site, ending 'Wednesday is your usual shot day.' with Just this time and Move to Friday" />
            <PhoneFrame src={late3} caption="3 · Skipped: full strength all week"
              alt="Shot cycle card: 'Full-strength day. Skipped, so full strength. No shot this week, so the plan runs at full strength.'" />
          </PhoneFlow>
        </ScrollReveal>

        {/* Decision 04. 172 photo complaints: App Store reviews/AI photo
            estimates.md and Index.md; 164 portions: Index.md. "Cooked in oil or
            butter?" rejected (Ryan, 2026-10-30, "crazy annoying"), hidden oils
            as their own lines, 38-meal weighed eval, protein 28.3% WAPE:
            Research/Photo estimate accuracy.md. Always a guess: teneo-ios
            b1a35f3. Confidence on the review and editable lines: PR #143
            (dc12481). One camera for meals and barcodes: Design/fuel.md round 3
            (PR #117). Typed amounts in any unit: Design/Macros and portions
            research.md. */}
        <ScrollReveal as="article" className="cs-decision cs-decision--split cs-decision--split-wide">
          <div className="cs-decision__body">
            <p className="cs-decision__kicker">Decision 04</p>
            <h3>The photo estimate always gives a guess you can fix</h3>
            <p>
              Wrong photo estimates drew 172 one- and two-star reviews across competitors, and portions drew 164
              more. The usual fix is a follow-up question, like &ldquo;Cooked in oil or butter?&rdquo; I rejected it,
              because a question on every meal adds friction to the task people repeat most.
            </p>
            <p>
              Instead the estimate always lands, with its confidence shown and a plain &ldquo;Check the amounts before
              saving.&rdquo; Hidden oils show up as their own line. Every item opens to a typed amount in any unit,
              and a slider scales the whole meal. Barcodes use the same camera, so there&rsquo;s one button to find.
            </p>
            <p className="cs-decision__tradeoff">
              <strong className="cs-decision__tradeoff-label">Trade-off</strong>
              A guess is sometimes wrong. On 38 meals with weighed ingredients, protein was off by 28% on average. I
              show the confidence and make the fix one tap, rather than pretend the number is exact.
            </p>
          </div>
          <PhoneFlow label="Logging a meal by photo, two screens" className="phone-flow--2">
            <PhoneFrame src={photo1} caption="1 · One camera for meals and barcodes"
              alt="Teneo Fuel screen: '51 g to today's floor', the protein ring with floor 105 and goal 140, and one primary button, 'Snap a meal or scan a barcode'" />
            <PhoneFrame src={photo2} caption="2 · The guess, ready to check"
              alt="Review meal: a photo of roast chicken, lentil rice and broccoli, 'Medium confidence. Check the amounts before saving.', about 36 g protein, a whole-meal slider, and detected items you tap to change" />
          </PhoneFlow>
        </ScrollReveal>

        {/* Decision 05. 1,454 of 4,974 (29%), 766 surprise charges: App Store
            reviews/Index.md and Opportunities items 1-2. Free logging,
            barcode, export, no ads, no account: Opportunities "Copy Teneo can
            use now". Reminder on by default and dated terms line: UX
            competitiveness plan section 7 item 6 and the paywall capture.
            Shot journal: Process/Data safety.md (PR #140), prompted by Shotsy
            reviews reporting months of history lost. */}
        <ScrollReveal as="article" className="cs-decision cs-decision--split">
          <div className="cs-decision__body">
            <p className="cs-decision__kicker">Decision 05</p>
            <h3>A free core, and a paywall that names the charge date</h3>
            <p>
              Money was the top complaint in competitor reviews: 1,454 of 4,974 negative reviews, 766 of them about
              surprise charges, trials or refunds. So logging, barcode scanning and export are free, with no ads and
              no account required.
            </p>
            <p>
              On the paywall, &ldquo;Remind me before my trial ends&rdquo; is on by default, the terms line names both
              the charge date and the reminder date, and Continue free is always there.
            </p>
            <p>
              Billing wasn&rsquo;t the only trust problem. The same reviews told of months of shot history lost in
              updates, so dose history also lives in a separate journal an update can&rsquo;t wipe.
            </p>
            <p className="cs-decision__tradeoff">
              <strong className="cs-decision__tradeoff-label">Trade-off</strong>
              A reminder before the charge will lose some renewals a quiet paywall would keep. I chose trust, because
              billing is what this category gets punished for.
            </p>
          </div>
          <PhoneFrame src={paywall} className="phone--solo" caption="The paywall, reminder on"
            alt="Teneo paywall: annual and monthly plans, a 'Remind me before my trial ends' switch turned on, a Start 7-day free trial button, a terms line naming the charge date and the reminder date, and Continue free" />
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
                In my own design review, the right half was two loose numbers and empty space, and it looked
                unfinished. It now shows pace: the grams left to today&rsquo;s floor, split across your usual
                remaining meals, plus fiber.
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
              <li key={o.name} className={`cs-process__option${o.tag === 'Rejected' ? '' : ' is-kept'}`}>
                <img src={o.src} alt={`${o.name} app icon option`} loading="lazy" width="256" height="256" />
                <span className="cs-process__option-name">{o.name}</span>
                <span className="cs-process__option-why">
                  <span className="cs-process__option-tag">{o.tag}.</span> {o.why}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </ScrollReveal>

      {/* Status: built, submitted, launching soon. Source-notes claim:
          brain/Teneo/App Store/Review 2026-11-18 (citations shipped in build 14). */}
      {/* The system: Figma file 306y3w44sU8GhSBxqn9ozE. Counts from the file
          on 2026-11-18 (projects/teneo-case-study/audit.md section 4):
          70 components and sets, 35 icons, 65 variables, 18 app text styles,
          29 screens, 636 instances, 0 detached. Drift: code-audit.md section 3
          (174 hard-coded spacings; 748 raw text calls vs 162 named styles).
          Images: Case Study slide 11 library sample (173:2921) and Screens page
          section "05 Medication · Late shot" (182:2578). */}
      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">The system</h2>
        <p className="cs-section__lede">
          I rebuilt the app in Figma from the code, so the file and the shipped app use the same tokens and the same
          parts. Every screen is made of library components, and the screens are filed by flow, so anyone can find the
          late-shot path or the pill branch without asking me.
        </p>
        <div className="cs-hero__stats cs-system__stats">
          <div className="stat"><span className="stat__num">70</span><span className="stat__label">components, each with its real states, plus 35 icons</span></div>
          <div className="stat"><span className="stat__num">65</span><span className="stat__label">variables that mirror the app&rsquo;s Swift tokens, dark and light</span></div>
          <div className="stat"><span className="stat__num">29</span><span className="stat__label">screens built only from instances, with 0 detached</span></div>
        </div>
        <div className="cs-system__pair">
          <figure className="cs-shot">
            <img src={systemFlow} alt="A Figma section titled 'Medication · Late shot' holding three screens in order: the shot card with three answers, the log-shot sheet asking about the usual shot day, and the full-strength week after a skip" loading="lazy" />
            <figcaption>Screens are filed by flow, in the order a person meets them.</figcaption>
          </figure>
          <figure className="cs-shot">
            <img src={systemLibrary} alt="Teneo library components: the daily check-in card, the shot cycle card, the daily pill card, the protein day summary, a choice row and the tab bar" loading="lazy" />
            <figcaption>Library components carry their states as variants and properties.</figcaption>
          </figure>
        </div>
        <p className="cs-system__note">
          The audit also kept the drift visible instead of hiding it. The app still has 174 hard-coded spacing values,
          and 748 raw text calls against 162 that use named styles. Those are the next cleanup, in code.
        </p>
      </ScrollReveal>

      <ScrollReveal as="section" className="cs-section cs-outcome">
        <h2 className="cs-section__heading">Outcome</h2>
        <p>
          Teneo is built, submitted to the App Store, and launching soon. Every health number in the app opens a short
          note on how Teneo sets it and the source behind it, so the plan never asks to be taken on faith.
        </p>
        <p>
          <strong>Next:</strong> launch, then track the metrics above, starting with whether people answer the
          check-in on low days and where onboarding loses them.
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
