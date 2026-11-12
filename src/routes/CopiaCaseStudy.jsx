import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';
import AppStoreBadge from '@/components/AppStoreBadge';
import PhoneFrame, { PhoneFlow } from '@/components/PhoneFrame';
import { setDocumentMeta } from '@/lib/documentMeta';
import copiaHomeDark from '@/assets/copia-home-dark.jpg';
// Process images: real before/after captures from restock-ios docs/shots/
// (each call site cites its source file and the commit or note behind it).
import processRouteBefore from '@/assets/copia-process-route-ax-before.jpg';
import processRouteAfter from '@/assets/copia-process-route-ax-after.jpg';
import processQtyBefore from '@/assets/copia-process-qty-before.jpg';
import processQtyAfter from '@/assets/copia-process-qty-after.jpg';
// Flow screens: raw simulator captures (no bezel baked in), resized to 600px
// wide. Sources, all under ~/Documents/restock-ios/docs/:
//   aisles   audit/2026-10-16/shots/05-list-aisle-order.png
//   trip-1   audit/2026-10-16/shots/05-list.png
//   trip-2   audit/2026-10-16/shots/06-trip-checked-one.png
//   trip-3   audit/2026-10-16/shots/06-trip-mostly-done.png
//   trip-4   audit/2026-10-16/shots/06-trip-all-done.png
//            (order = audit/2026-10-16/flows.md, F4 steps 1, 2, 3 and 6)
//   import-1 shots/social-import/progress.png
//   import-2 shots/social-import/review.png
//   import-3 shots/social-import/only-in-video.png
//            (commit f3d33d4, 4 Oct 2026; 3 is the branch taken instead of
//            2 when the caption has no ingredients)
//   limit-1  audit/2026-10-16/shots/08-scan-chooser-1-left.png
//   limit-2  audit/2026-10-16/shots/08-scan-blocked.png
//   limit-3  audit/2026-10-16/shots/08-scan-blocked-paywall.png
//            (order = flows.md, F7 steps 1 and 9)
import flowAisles from '@/assets/copia-flow-aisles.jpg';
import flowTrip1 from '@/assets/copia-flow-trip-1.jpg';
import flowTrip2 from '@/assets/copia-flow-trip-2.jpg';
import flowTrip3 from '@/assets/copia-flow-trip-3.jpg';
import flowTrip4 from '@/assets/copia-flow-trip-4.jpg';
import flowImport1 from '@/assets/copia-flow-import-1.jpg';
import flowImport2 from '@/assets/copia-flow-import-2.jpg';
import flowImport3 from '@/assets/copia-flow-import-3.jpg';
import flowLimit1 from '@/assets/copia-flow-limit-1.jpg';
import flowLimit2 from '@/assets/copia-flow-limit-2.jpg';
import flowLimit3 from '@/assets/copia-flow-limit-3.jpg';

// CASE STUDY FORMAT (shared by all case studies): hero with stats -> "at a
// glance" (problem / evidence / role) -> key decisions, each "what and why"
// plus one trade-off line naming what was given up -> outcome.
//
// Round 4 (Ryan: "this looks like an engineering portfolio; the problem and
// the evidence should correlate; show flows as separate iPhone screens"):
// engineering stats cut (pages-per-scan cap, update cadence), the problem
// restated as the one the review research actually measures, each decision
// told as user problem -> choice -> trade-off -> screens.
//
// Sources for every fact on this page (paths under ~/Documents/restock-ios
// unless noted):
//   R  docs/research/competitor-reviews-2026-09-28.md (3,052 reviews, 687
//      one-to-three-star, 2,003 five-star, theme shares)
//   M  agent-team/projects/shopping-mode-merge/brief.md (rev 4) and
//      agent-team/brain/projects/shopping-mode-merge.md
//   C  agent-team/brain/clients/GroceryApp.md (ratified conventions, keep-out)
//   Q  docs/references/item-quantity.md, GroceryItem.swift displayAmount
//      comment, commit 3c8b396 "Three things a live user hit"
//   A  docs/audit/2026-10-16/ (ux-audit-sources.md UX-SRC-1,
//      ux-audit-activation.md UX-ACT-2, flows.md)
//   V  commits 927e329 "One review step for every import" and 926e752
//      "no surprise paywall" (both merged into 1.6, 17 Oct 2026)
export default function CopiaCaseStudy() {
  useEffect(() => {
    return setDocumentMeta({
      title: 'Copia | Ryan Craun',
      description:
        'Copia, a native iOS app that turns recipes into grocery lists sorted by aisle. Designed and built solo, live on the App Store. Five design decisions, the evidence behind each, and the screens that show them.',
    });
  }, []);

  return (
    <>
    <main className="cs cs--copia">
      <section className="cs-hero cs-hero--split">
        <Link className="cs-hero__back" to="/" state={{ scrollTo: 'work' }}>
          ← Back to work
        </Link>
        <div className="cs-hero__copy">
        <p className="cs-hero__eyebrow">Case study · Native iOS</p>
        <h1 className="cs-hero__title">Built for the aisle, not the desk.</h1>
        {/* Launch date: App Store listing (1.0, 8 Sep 2026). "Watching people
            use it": commit 3c8b396 (someone shopping from the list; a
            first-run user naming a list). */}
        <p className="cs-hero__line">
          Copia turns a recipe into a grocery list sorted by aisle. I designed and built it solo, and it has been
          on the App Store since September 2026. Most of what changed after launch came from three places:
          competitor reviews, a full audit of my own app, and watching people use it.
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

        {/* Source R. Two research numbers, no engineering numbers: the
            "20 pages per scan" (a code cap) and "6 updates in six weeks"
            (shipping cadence) stats were cut in round 4. Plain numbers, no
            count-up (matches Teneo; Round 4 fix 14). */}
        <div className="cs-hero__stats">
          <div className="stat">
            <span className="stat__num">3,052</span>
            <span className="stat__label">reviews of the top ten grocery list apps, analyzed to set the post-launch roadmap</span>
          </div>
          <div className="stat">
            <span className="stat__num">23%</span>
            <span className="stat__label">of the bad reviews were about aisles: not remembered, or impossible to reorder</span>
          </div>
        </div>
        </div>

        <figure className="cs-shot cs-shot--phone cs-hero__shot">
          <img
            src={copiaHomeDark}
            alt="Copia App Store screenshot, 'Every list, one place': the Lists screen with an active-trip hero card, a route progress dial, a pinned quick-top-up list, and category rows"
          />
        </figure>
      </section>

      {/* Source R: 23% of 687 one-to-three-star reviews = "Categories and
          aisles (not remembered, cannot reorder)"; 16% of 2,003 five-star
          reviews = "Categories and aisle order". The problem is stated as the
          thing those two numbers measure, so the evidence supports it
          directly. Rank (Round 4 fix 6): R's theme table, 31% updates broke
          things, 26% crashes, 25% sync and sharing, 23% aisles. */}
      <ScrollReveal as="section" className="cs-section">
        <h2 className="cs-section__heading">At a glance</h2>
        <dl className="cs-snapshot">
          <div>
            <dt>Problem</dt>
            <dd>
              People sort their grocery list by aisle in their heads, every trip. The apps they already use keep
              losing that work: an item lands in the wrong aisle, the fix isn&rsquo;t remembered next week, or the
              aisles can&rsquo;t be put in their store&rsquo;s order. So they double back.
            </dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>
              I analyzed 3,052 App Store reviews of the ten top grocery list apps. In the 687 one-to-three-star
              reviews, 23% were about categories and aisles that weren&rsquo;t remembered or couldn&rsquo;t be
              reordered. That was the fourth-largest complaint, behind updates that broke things (31%), crashes
              (26%) and sync (25%), and the largest about how a list is organised. In the 2,003 five-star reviews, 16% praised aisle order. People notice when it works, and
              they leave when it doesn&rsquo;t.
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

        {/* Sources: R (the aisle themes); C ("Store maps or drawn floor
            plans" on the keep-out list; "The rail may not claim to depict a
            walk through a store"); commit e6fb3d5 "aisle memory everywhere,
            per-list order". Screen copy is from the capture itself. */}
        <ScrollReveal as="article" className="cs-decision cs-decision--split">
          <div className="cs-decision__body">
          <p className="cs-decision__kicker">Decision 01 · The core idea</p>
          <h3>Sort the list by aisle, and remember every correction</h3>
          <p>
            Every item files itself into an aisle, and the list reads top to bottom in the order you shop. The
            reviews told me exactly where this breaks in other apps, so those are the two places I put the work.
            When you move an item to a different aisle, Copia remembers it on every list. And the aisle order is
            yours: it learns from the trips you finish, and you can drag it into your own store&rsquo;s layout.
          </p>
          <p className="cs-decision__tradeoff">
            <strong className="cs-decision__tradeoff-label">Trade-off</strong>No store map. Copia
            doesn&rsquo;t know your store&rsquo;s floor plan, so a map would be a guess drawn as a fact. The list
            shows order and where you are in it, and doesn&rsquo;t pretend to know more.
          </p>
          </div>
          <PhoneFrame island={false}
            className="cs-shot--phone"
            src={flowAisles}
            alt="Copia's Aisle order sheet: Produce, Bakery, Meat & Seafood, Dairy & Eggs, Frozen, Pantry, Snacks, Beverages, Household and Other, each with a drag handle. Footer: 'Sorted automatically. Copia learns the order from the trips you finish. Drag an aisle to set your own.'"
            caption="Aisle order: learned from your trips, changed with one drag"
          />
        </ScrollReveal>

        {/* Sources: M (Ryan's three findings from real trips; the planning
            row already toggled items; options incl. Walmart's removed
            In-Store Mode and automatic entry, which C lists as keep-out;
            the ~64pt row and "costs ~2 visible rows"; mis-checks "surface at
            the till"; the route as a contiguous prefix). Built 2 Aug 2026,
            before the 1.0 launch. */}
        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 02 · Found on my own trips</p>
              <h3>Delete shopping mode, so the list is the shopping screen</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                Early builds split planning and shopping into two modes, with a &ldquo;Start shopping&rdquo; button
                between them. Using it in real stores, I hit three problems. There was no way to check everything off
                at once. Starting a trip felt like a pointless switch. And checking items off out of order broke the
                route line into coral, grey, coral, so it no longer showed where I was.
              </p>
              <p>
                The planning screen could already check items off, so the purpose-built shopping screen was losing to
                the general one. I weighed improving the mode, starting it automatically at the store, or removing
                it. I removed it. The list kept the shopping ergonomics instead: one taller row for every state,
                about 64&nbsp;pt, and a route line that only fills as one unbroken run from the top, so out-of-order
                shopping can&rsquo;t break it.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong>Taller rows mean about two fewer
                items on screen. I took that, because a mis-tap in the aisle checks off the wrong thing, and you only
                find out at the till.
              </p>
            </div>
          </div>

          <div className="cs-process">
            <p className="cs-process__label">Flow · One trip, start to finish</p>
            <PhoneFlow label="One shopping trip in Copia, in four screens" className="phone-flow--4">
              <PhoneFrame island={false}
                src={flowTrip1}
                alt="Weekly list in aisle order: Produce (Carrots, Bananas), Meat & Seafood (Ground beef), Dairy & Eggs (Cheddar cheese, Whole milk, Eggs checked), each row with a ×1 count"
                caption="1 · Open the list. It's already in aisle order"
              />
              <PhoneFrame island={false}
                src={flowTrip2}
                alt="The same list after tapping Carrots: Carrots is struck through, and Produce now reads 1 item"
                caption="2 · Tap to check off. There's no mode to enter"
              />
              <PhoneFrame island={false}
                src={flowTrip3}
                alt="Mid-trip, out of order: Bananas is still open in Produce, while Meat & Seafood is done and folded to '1 done'. The coral route line stays at Produce and does not jump ahead"
                caption="3 · Out of order: the aisle folds, the line doesn't jump"
              />
              <PhoneFrame island={false}
                src={flowTrip4}
                alt="Every aisle folded to its done count, with a footer reading 'Trip complete, Weekly, 11 items, 8 aisles' above a Done button"
                caption="4 · The last item closes the trip out"
              />
            </PhoneFlow>
          </div>

          {/* Source: restock-ios docs/shots/list/before-list-ax.png and
              after-list-ax.png (top of screen, cropped). Caption facts: commit
              b7e133e "List detail: a route that scales with the type ramp, and a
              count that stops spending coral" (12pt station, 1.75x cap). */}
          <div className="cs-process">
            <p className="cs-process__label">Process · The route at the largest text size</p>
            <div className="cs-process__pair">
              <figure className="cs-process__item">
                <span className="cs-process__tag">Before</span>
                <img
                  src={processRouteBefore}
                  alt="Copia list at an accessibility text size, before: 'Produce' renders very large while its route dot stays tiny, and '2 items' is coral"
                  loading="lazy"
                />
              </figure>
              <figure className="cs-process__item">
                <span className="cs-process__tag cs-process__tag--after">After</span>
                <img
                  src={processRouteAfter}
                  alt="Copia list at the same text size, after: the Produce route dot is scaled up to match the text, and '2 items' is in plain ink"
                  loading="lazy"
                />
              </figure>
              <div className="cs-process__note">
                <p>
                  With the largest text, aisle names grew but the station dot stayed a 12&nbsp;pt speck. The one mark
                  that says &ldquo;you are here&rdquo; was the one a low-vision shopper couldn&rsquo;t see.
                </p>
                <p>
                  Now the route scales with the text, capped at 1.75× so it never runs into the words. The count
                  dropped its coral, so the dot is the aisle&rsquo;s only accent.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Source Q. "Watching someone shop": GroceryItem.swift ("Reversed
            after watching somebody shop from the list: 'eggs 3' reads as a
            measure") and commit 3c8b396. "Several users asked":
            item-quantity.md ("Asked for by several people") and
            ListRowShowsNoNumberTests.swift. */}
        <ScrollReveal as="article" className="cs-decision cs-decision--feature">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 03 · Reversed after launch</p>
              <h3>Removed the quantity, then brought it back</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                Watching someone shop from the list, I saw that &ldquo;eggs 3&rdquo; read as a measure, not a count,
                so 1.0 shipped with no numbers on the row. After launch, several users asked to set how many of an
                item to buy. That meant my assumption was wrong, not their reading. In 1.2.1, counts came back as
                &ldquo;×3&rdquo; (read aloud by VoiceOver as &ldquo;3 of them&rdquo;), first with a stepper in the add
                field, then as a dropdown on every row.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong>The most-glanced row gets one more
                element. The &ldquo;×&rdquo; keeps a count from reading as a weight, and recipe measures still stay
                off the row.
              </p>
            </div>
          </div>

          {/* Sources: restock-ios docs/shots/09-list-light.png (pre-launch
              capture, commit 3be6a0a, Aug 12 2026) and
              docs/shots/quantity/rows-light.png (commit 72c82ab, Sep 29 2026).
              Caption facts: docs/references/item-quantity.md (stepper in the
              add field rejected; dropdown is its own button). */}
          <div className="cs-process">
            <p className="cs-process__label">Process · The row, before and after</p>
            <div className="cs-process__pair">
              <figure className="cs-process__item">
                <span className="cs-process__tag">Before · Aug 2026</span>
                <img
                  src={processQtyBefore}
                  alt="Copia Weekly list from a pre-launch build: rows show only item names, with no count"
                  loading="lazy"
                />
              </figure>
              <figure className="cs-process__item">
                <span className="cs-process__tag cs-process__tag--after">After · Sep 2026</span>
                <img
                  src={processQtyAfter}
                  alt="Copia Weekly list after: every row ends in a small count dropdown, '×1' in grey and '×2' on Basil in full ink"
                  loading="lazy"
                />
              </figure>
              <div className="cs-process__note">
                <p>
                  <span className="cs-process__tag cs-process__tag--rejected">Replaced</span> The stepper inside the
                  add field. It shipped first and read as odd straight away, and a second pass through references (Target, Walmart,
                  Cherrypick) found no list app that does it.
                </p>
                <p>
                  The count moved to a dropdown on every row, quiet at ×1. It&rsquo;s its own button, so setting an
                  amount can&rsquo;t check the item off.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Sources: A, UX-SRC-1 ("Scan, paste and video import all end on an
            editable review. The two highest-traffic paths do not. One tap on
            'Add all ingredients to a list' can drop three recipes' worth of
            lines, salt and oil included, onto a list the user never saw.");
            V, 927e329 (same review on Recipes and Ask; untick, rename, change
            amounts; "Staples start unticked"). The flow screens are the video
            import, which already had the review; 1.6 extended that pattern to
            every path. */}
        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 04 · From my October audit</p>
              <h3>Nothing reaches the list without you seeing it</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                Scanning a page, pasting a list and importing a video all ended on a review screen. My October audit
                of the app found that the two busiest paths skipped it. Adding a recipe, or asking Copia for one, wrote
                straight to the list: one tap could drop three recipes&rsquo; worth of lines, salt and oil included,
                onto a list you never saw. In 1.6 every path ends on the same review, where you can untick, rename or
                change an amount, and staples like salt start unticked.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong>One-tap adding is gone, so every
                recipe costs one more screen. A wrong ingredient costs a tap at home, but a wasted trip once
                you&rsquo;re in the store.
              </p>
            </div>
          </div>

          <div className="cs-process">
            <p className="cs-process__label">Flow · Importing a recipe from a video</p>
            <PhoneFlow label="Importing a recipe from a shared video, in three screens" className="phone-flow--3">
              <PhoneFrame island={false}
                src={flowImport1}
                alt="A sheet over the Lists screen with a progress rail and the line 'Reading the recipe from the video…'"
                caption="1 · Share a video. Copia reads its caption"
              />
              <PhoneFrame island={false}
                src={flowImport2}
                alt="Review screen for Apple Fritter Loaf Cake: Add to Weekly, a note that the method comes with it (14 steps), the Instagram source, and ticked lines from the caption (apples, granulated sugar, cinnamon, brown sugar, softened butter) above an 'Add 15 items' button"
                caption="2 · Review all 15 lines before any of them land"
              />
              <PhoneFrame island={false}
                src={flowImport3}
                alt="A sheet titled 'This recipe's only in the video': the caption doesn't list the ingredients, so there's nothing to read without guessing. Two options follow: Paste the recipe text, or Scan a screenshot"
                caption="2b · No ingredients? It says so instead of guessing"
              />
            </PhoneFlow>
          </div>
        </ScrollReveal>

        {/* Sources: free-tier numbers and sharing free = commit 6750a51
            "Double the free tier and make sharing free" (21 Sep 2026, before
            the 28 Sep review research, so no causal claim is made) and its
            "invite was blocked at the moment of most enthusiasm"; the
            lifetime-cap argument carried from earlier rounds; "only opens
            when you tap" = ScanFlowView.swift showPaywall ("Every call site
            of this is a tap");
            R (subscriptions and paywalls, 21% of one-to-three-star reviews);
            A, UX-ACT-2 (paywall rose 1.2 s into the review after every free
            scan, ten times, first session included); V, 926e752 "no surprise
            paywall". flows.md F13: "sharing is never gated". */}
        <ScrollReveal as="article" className="cs-decision">
          <div className="cs-decision__body cs-decision__body--wide">
            <header className="cs-decision__head">
              <p className="cs-decision__kicker">Decision 05</p>
              <h3>Charge for the habit, never for the household</h3>
            </header>
            <div className="cs-decision__text">
              <p>
                Free scans are capped over your lifetime, not per day. A daily reset teaches people to ration, while a
                lifetime cap lets them use the feature properly before deciding. Two weeks after launch I doubled the
                free tier (from 5 to 10 scans, from 2 to 4 lists) and made sharing free. Sharing had been the one gate
                on a second person, so the invite was blocked at the moment someone was most excited to send it.
              </p>
              <p>
                Paywalls turned out to be a top-five complaint about other grocery apps, at 21% of the bad reviews.
                Then my audit caught Copia doing the same thing: the paywall rose by itself after every free scan, over
                the review you were still checking, ten times in a row. Since 1.6 it only opens when you tap for it.
              </p>
              <p className="cs-decision__tradeoff">
                <strong className="cs-decision__tradeoff-label">Trade-off</strong>Pro has less to sell, and fewer
                people see the offer. In return, sharing is free, and sharing is the one way a solo app spreads
                without an ad budget.
              </p>
            </div>
          </div>

          <div className="cs-process">
            <p className="cs-process__label">Flow · Reaching the free limit</p>
            <PhoneFlow label="Reaching the free scan limit, in three screens" className="phone-flow--3">
              <PhoneFrame island={false}
                src={flowLimit1}
                alt="Scan a recipe screen: 'Add a recipe by camera', with '1 free scan left' above Take Photo and Choose from Library"
                caption="1 · The count is for life, and stated plainly"
              />
              <PhoneFrame island={false}
                src={flowLimit2}
                alt="'You've used your 10 free scans. Copia Pro makes scanning unlimited. Everything you've already scanned stays on your lists.' with See Copia Pro and Back"
                caption="2 · At ten, everything you scanned stays put"
              />
              <PhoneFrame island={false}
                src={flowLimit3}
                alt="Copia Pro sheet: 'Keep every recipe on the list', Monthly $3.99, Annual $24.99 selected, Lifetime $49.99, and a Start 14-day free trial button, with Not now at the top"
                caption="3 · Pro appears when you ask"
              />
            </PhoneFlow>
          </div>
        </ScrollReveal>
      </section>

      {/* Outcome sources: App Store listing (live since 8 Sep 2026); the three
          answered themes = commits 381f01c (sharing: unchecks sync, leave
          instead of delete), e6fb3d5 (aisle memory, per-list order),
          927e329 and 926e752 (one review step; no surprise paywall). */}
      <ScrollReveal as="section" className="cs-section cs-outcome">
        <h2 className="cs-section__heading">Outcome</h2>
        <p>
          Copia has been live on the App Store since September 8, 2026. The updates since went after three of the
          complaint themes from the reviews: aisles, sync and sharing, and paywalls. Aisles are remembered everywhere, and every list can have its own
          order. Shared lists stay in sync and show who checked what. And there are no surprise paywalls.
        </p>
        <p>
          <strong>Next:</strong> a much larger recipe library, so finding a recipe is as fast as scanning one.
        </p>
        <div className="cs-next__cta">
          <AppStoreBadge />
          <Link className="cs-next__back" to="/" state={{ scrollTo: 'work' }}>
            ← Back to work
          </Link>
          <Link className="cs-next__back cs-next__next" to="/work/vault">
            Next: Vault →
          </Link>
        </div>
      </ScrollReveal>
    </main>
      <Footer />
    </>
  );
}
