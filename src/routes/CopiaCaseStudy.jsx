import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import AppStoreBadge from '@/components/AppStoreBadge';
import StatNumber from '@/components/StatNumber';
import { setDocumentMeta } from '@/lib/documentMeta';
import copiaHomeDark from '@/assets/copia-home-dark.jpg';
import copiaRouteDark from '@/assets/copia-route-dark.jpg';
import copiaScanPages from '@/assets/copia-scan-pages.jpg';
import copiaScanReview from '@/assets/copia-scan-review.jpg';
import copiaPaywall from '@/assets/copia-paywall.jpg';

// CASE STUDY FORMAT (shared by all three case studies): hero with impact
// stats -> "at a glance" (problem / constraint-or-evidence / role) -> 3-4
// key decisions, each "what and why" plus one trade-off line naming what
// was given up or rejected -> outcome. Cut to roughly a five-minute read,
// per hiring-manager guidance that a first pass is 60-90 seconds and the
// decisions section is what earns a callback.
//
// Every number here is real: the competitor-review figures come from
// restock-ios docs/research/competitor-reviews-2026-09-28.md, the release
// history from the App Store listing (1.0 on Sep 8 2026, 1.6 on Oct 18).
export default function CopiaCaseStudy() {
  useEffect(() => {
    return setDocumentMeta({
      title: 'Copia | Ryan Craun',
      description:
        'Copia, a native iOS app that turns recipes into grocery lists sorted the way you walk the store. Designed and built solo, live on the App Store, and shaped by four design decisions and their trade-offs.',
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
          Copia turns a recipe into a grocery list sorted the way you walk the store. I designed and built it
          solo, launched it in September 2026, and shipped six updates in the six weeks after, each one aimed at
          what users and competitor reviews said.
        </p>
        <div className="cs-hero__frame">
          <span>Solo: research, design &amp; engineering</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Native iOS (SwiftUI)</span>
          <span className="cs-hero__dot" aria-hidden="true" />
          <span>Live on the App Store</span>
        </div>
        <div className="cs-hero__cta">
          <AppStoreBadge />
          <span className="cs-hero__cta-note">Free on iPhone</span>
        </div>

        <div className="cs-hero__stats">
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={6} />
            </span>
            <span className="stat__label">updates shipped in the first six weeks</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={3052} />
            </span>
            <span className="stat__label">competitor reviews analyzed to set the roadmap</span>
          </div>
          <div className="stat">
            <span className="stat__num">
              <StatNumber value={20} />
            </span>
            <span className="stat__label">cookbook pages read as one recipe in a single scan</span>
          </div>
        </div>

        <figure className="cs-shot cs-shot--phone">
          <img
            src={copiaHomeDark}
            alt="Copia App Store screenshot, 'Every list, one place': the Lists screen with an active-trip hero card, a route progress dial, a pinned quick-top-up list, and category rows"
            loading="lazy"
          />
        </figure>
      </section>

      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">At a glance</h2>
        <dl className="cs-snapshot">
          <div>
            <dt>Problem</dt>
            <dd>
              Grocery apps are designed for writing the list at a desk, then ship the same dense screen into the
              aisle, where you have one hand, a cart, and about a second per glance.
            </dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>
              In 687 one-to-three-star reviews of the top ten grocery apps, 25% blamed sync and sharing, 23% blamed
              aisles that weren&rsquo;t remembered, and 21% blamed paywalls.
            </dd>
          </div>
          <div>
            <dt>My role</dt>
            <dd>Everything: research, interaction and visual design, the SwiftUI build, and the App Store release.</dd>
          </div>
        </dl>
      </ScrollReveal>

      <section className="cs-section cs-decisions">
        <h2 className="cs-section__heading">Key decisions</h2>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">01</p>
          <h3>Sort the list by the walk, not by when you typed it</h3>
          <p>
            Items file into aisles automatically, and the shopping view reads as a route: aisles are stations,
            tap targets are sized for one thumb, and the screen stays awake. When you move an item to a different
            aisle, Copia remembers it on every list, and you can set your own aisle order.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>Trade-off:</strong> I didn&rsquo;t use a retailer API for &ldquo;real&rdquo; aisle numbers,
            because it would need an account and a network call. The on-device order is a little rougher, and it
            stays entirely on the user&rsquo;s phone.
          </p>
          <figure className="cs-shot cs-shot--phone">
            <img
              src={copiaRouteDark}
              alt="Copia's shopping screen: aisle stations with item rows (Carrots, Bananas, Ground beef, Cheddar cheese)"
              loading="lazy"
            />
          </figure>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision cs-decision--feature">
          <p className="cs-decision__kicker">02: the reversal, reversed</p>
          <h3>Removed the quantity, then brought it back</h3>
          <p>
            Watching someone shop, I saw that &ldquo;eggs 3&rdquo; read as a measure, not a count, so 1.0 shipped
            with no numbers on the row. After launch, several users asked to set how many of an item to buy. That
            meant my assumption was wrong, not their reading. In 1.2.1, counts came back as &ldquo;×3&rdquo; (read
            aloud by VoiceOver as &ldquo;3 of them&rdquo;), with a stepper in the add field.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>Trade-off:</strong> the most-glanced row gets one more element. The &ldquo;×&rdquo; keeps a
            count from reading as a weight, and recipe measures still stay off the row.
          </p>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">03</p>
          <h3>Make a nine-page scan feel like progress, not a spinner</h3>
          <p>
            Each page is read on its own and the results are merged at the end, so one bad page costs one page,
            not the whole scan. Ingredients stream in as each page lands. Since 1.6, every import ends in a single
            review step where you can edit, untick or move items before they reach the list.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>Trade-off:</strong> every import gets an extra screen. That&rsquo;s worth it, because a wrong
            ingredient costs a tap at home but a second trip once you&rsquo;re in the store.
          </p>
          <div className="cs-decision__visual">
            <figure className="cs-shot cs-shot--phone">
              <img
                src={copiaScanPages}
                alt="Copia App Store screenshot, 'Stop retyping ingredients': camera framing a cookbook page, 'Reading page 4 of 9,' ingredients streaming in below"
                loading="lazy"
              />
            </figure>
            <figure className="cs-shot cs-shot--phone">
              <img
                src={copiaScanReview}
                alt="Copia's scan review screen: parsed ingredients with amounts, ready to add to the Weekly list"
                loading="lazy"
              />
            </figure>
          </div>
        </ScrollReveal>

        <ScrollReveal as="article" className="cs-decision">
          <p className="cs-decision__kicker">04</p>
          <h3>Charge for the habit, never for the household</h3>
          <p>
            Free scans are capped over your lifetime, not per day. A daily reset teaches people to ration, while a
            lifetime cap lets them use the feature properly before deciding. After launch I raised the free tier
            (from 5 to 10 scans, from 2 to 4 lists) and made sharing free. Sharing is the action that puts Copia on
            a second phone, and paywalls were a top-five complaint about competitors.
          </p>
          <p className="cs-decision__tradeoff">
            <strong>Trade-off:</strong> Pro has less to sell. In return, sharing is free, and sharing is the one
            way a solo app spreads without an ad budget.
          </p>
          <figure className="cs-shot cs-shot--phone">
            <img
              src={copiaPaywall}
              alt="Copia Pro paywall: Monthly, Annual (selected as best value) and Lifetime options with a free trial"
              loading="lazy"
            />
          </figure>
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="cs-section cs-outcome">
        <h2 className="cs-section__heading">Outcome</h2>
        <p>
          Copia has been live on the App Store since September 8, 2026, and went from 1.0 to 1.6 in six weeks.
          Every update answers one of the complaint themes above. Shared-list sync bugs are fixed, and lists show who
          checked what. Aisles are remembered, and you can set your own order. Imports get one review step, and
          there are no surprise paywalls. Widgets, Siri and Apple Watch arrived along the way.
        </p>
        <p>
          <strong>Next:</strong> a much larger recipe library, so finding a recipe is as fast as scanning one.
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
