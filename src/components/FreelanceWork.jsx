import StatNumber from '@/components/StatNumber';
import upworkLogo from '@/assets/upwork-logo.png';

// FREELANCE & CLIENT WORK -- ROUND 2 (Ryan, on the first version's Ebony
// Hair Revival screenshot: "I hate that, that is one of my worst designs.
// How about just having the upwork logo in black and white, a quick stat
// board of my freelance success and maybe a couple of quotes"). Dropped the
// screenshot entirely -- his own taste call on his own work, no argument to
// make there. Replaced with three real, verifiable things instead of one
// visual: the real Upwork wordmark (traced from the live SVG on
// upwork.com/press, recolored to this site's own ink tone -- not a
// recreation, and monochrome, not Upwork's brand green, so it sits quietly
// next to the site's own hoarded accent instead of competing with it), a
// stat row of his real profile numbers, and the same two real client
// quotes kept from the first version (see FreelanceWork.jsx git history --
// still sourced from his actual Upwork job history, still no fabricated
// destinations/content).
//
// Stats picked deliberately: 100% Job Success, a genuine 5.0 average across
// every rated job (8 of 8 -- confirmed by reading every review on his
// profile, not assumed), and 15 completed jobs. Total earnings ($2K+) and
// total hours (19) are also real but left out on purpose -- they're the
// two numbers that undersell scale without adding credibility, and the
// three shown all speak to consistency/quality, which is the actually
// honest, flattering story a small-but-flawless freelance record tells.
export default function FreelanceWork() {
  return (
    <section className="freelance" id="freelance">
      <h2 className="freelance__eyebrow">Freelance &amp; Client Work</h2>
      <p className="freelance__lede">
        Ongoing freelance design work outside the day job, since 2018: landing pages and brand sites for small
        businesses, most of it sourced and delivered through Upwork.
      </p>

      <div className="freelance__proof-row">
        <img className="freelance__upwork-logo" src={upworkLogo} alt="Upwork" loading="lazy" />
        <span className="freelance__badge">Top Rated</span>
      </div>

      <div className="freelance__stats">
        <div className="stat">
          <span className="stat__num">
            <StatNumber value={100} suffix="%" />
          </span>
          <span className="stat__label">Job Success score</span>
        </div>
        <div className="stat">
          <span className="stat__num">
            <StatNumber value={5} decimals={1} />
          </span>
          <span className="stat__label">average rating (8 of 8 rated jobs)</span>
        </div>
        <div className="stat">
          <span className="stat__num">
            <StatNumber value={15} />
          </span>
          <span className="stat__label">jobs completed on Upwork</span>
        </div>
      </div>

      <div className="freelance__quotes">
        <blockquote className="cs-quote">
          <p>
            &ldquo;He understood my vision, made all the changes I requested and delivered a website that looks
            professional, modern and exactly how I imagined it.&rdquo;
          </p>
          <cite>Client, Ebony Hair Revival landing page</cite>
        </blockquote>
        <blockquote className="cs-quote">
          <p>
            &ldquo;It truly felt like he approached the project as if he owned the company himself... Without
            question, Ryan will be the very first person I contact for any future work.&rdquo;
          </p>
          <cite>Client, website optimization project</cite>
        </blockquote>
      </div>

      <p className="freelance__proof">
        Verify on{' '}
        <a href="https://www.upwork.com/freelancers/~01a5cfc3560d541aed" target="_blank" rel="noopener">
          Upwork
        </a>
      </p>
    </section>
  );
}
