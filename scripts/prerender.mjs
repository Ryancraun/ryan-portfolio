// WEB QUALITY AUDIT FIX (high priority #3): lightweight build-time
// prerender step. This project is a small 2-route SPA launching this week --
// migrating to a full SSR framework (Next.js etc.) was explicitly ruled out
// of scope. Instead: after `vite build` produces `dist/`, serve that exact
// built output locally (Vite's own `preview` server, which already does SPA
// history-fallback -- see main.jsx's routing comment), launch each real
// route in headless Chrome via Puppeteer (already cached locally at
// ~/.cache/puppeteer -- lighter to add than Playwright, which had no cached
// browser binary on this machine), wait for the app to actually render, and
// overwrite that route's `dist/**/index.html` with the live rendered DOM.
// The JS bundle references inside that captured HTML are untouched (they're
// part of the original document, not stripped), so the app still hydrates
// and becomes fully interactive client-side exactly as before -- this is
// prerendering, not a static-only export.
//
// Wired into `npm run build` (see package.json: "vite build && node
// scripts/prerender.mjs && ...").
import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// VERCEL BUILD FIX (first deploy attempt failed: "Failed to launch the
// browser process: Code: 127 / error while loading shared libraries:
// libnspr4.so: cannot open shared object file"). Plain `puppeteer` bundles
// a desktop-oriented Chromium build that needs system libraries Vercel's
// build container doesn't ship -- a well-documented limitation, not
// something fixable by a puppeteer flag. `@sparticuz/chromium` ships a
// Chromium build packaged specifically for serverless/CI build containers
// (Vercel, AWS Lambda) with no missing-library problem, paired with
// `puppeteer-core` (the same launch/page API, no bundled browser of its
// own). Only used when `process.env.VERCEL` is set (Vercel sets this
// automatically in every build and runtime) -- local builds (this
// project's own dev machine, this session's own verification builds) keep
// using plain `puppeteer` unchanged, since `@sparticuz/chromium`'s binary
// is Linux-only and won't run on Windows.
async function launchBrowser() {
  if (process.env.VERCEL) {
    const [{ default: chromium }, { default: puppeteerCore }] = await Promise.all([
      import('@sparticuz/chromium'),
      import('puppeteer-core'),
    ]);
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
  return puppeteer.launch({ headless: 'new' });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Every real route this app serves. `/work/copia` needs its own physical
// `dist/work/copia/index.html` because most static hosts serve a literal
// file for that path before ever consulting an SPA rewrite rule -- a raw,
// non-JS-executing fetch (curl, a share-link unfurler, a crawler that
// doesn't run JS) hits this file directly.
const ROUTES = [
  { path: '/', outFile: 'index.html' },
  { path: '/work/copia', outFile: 'work/copia/index.html' },
  { path: '/work/vault', outFile: 'work/vault/index.html' },
  { path: '/work/picktheodds', outFile: 'work/picktheodds/index.html' },
];

// A selector that only exists once the given route's real content has
// mounted -- used to distinguish "React has rendered this route" from
// "the empty #root div from the static dist/index.html shell is still
// there" (which `domcontentloaded` alone would not tell us).
const READY_SELECTOR = {
  '/': '.work__eyebrow',
  '/work/copia': '.cs-hero__title',
  '/work/vault': '.cs-hero__title',
  '/work/picktheodds': '.cs-hero__title',
};

// Triggers every scroll-linked reveal (ScrollReveal fades, StatNumber
// count-ups, DataBar fills -- all built on `useInView({ once: true })`)
// by actually scrolling through the full page before capturing, then
// returning to the top (matching what a real visitor's own resting
// scroll position looks like on first load) and waiting long enough for
// the slowest animation to fully settle.
//
// Without this: a `once:true` IntersectionObserver for anything below the
// initial viewport never fires while the page sits stationary at scroll
// position 0, so the captured static HTML freezes those elements at
// their PRE-reveal state forever -- not a cosmetic gap. An earlier round
// of this project found StatNumber's initial "0" baked into the actual
// shipped `dist/work/vault/index.html` this way (confirmed by grepping
// the built file directly, not by watching a live browser tab) -- every
// non-JS crawler, share-link unfurler, and a real visitor's own first
// paint before hydration were all seeing zero for every stat on the
// page. `StatNumber`'s animation duration (1100ms) is the longest on the
// page (`DataBar`'s CSS width transition is 1000ms) -- the wait below
// covers both with headroom, so the captured DOM is always the finished,
// correct value, never a mid-animation frame.
async function revealScrollTriggeredContent(page) {
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const steps = Math.max(1, Math.ceil(scrollHeight / Math.max(viewportHeight, 1)));
  for (let i = 0; i <= steps; i++) {
    const y = Math.min(scrollHeight, Math.round((scrollHeight / steps) * i));
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    // Give each intermediate position a real paint/observer tick -- an
    // instant series of scrollTo jumps still triggers IntersectionObserver
    // correctly (it's geometry-based, not scroll-event-based), but each
    // step needs a moment for the observer's callback and the resulting
    // React state update to actually run before the next jump.
    await new Promise((resolve) => setTimeout(resolve, 60));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // 2500ms, not 1400ms: the home route's own Hero.jsx runs a real-DOM
  // animated transition (PixelSwap) on a fixed timer independent of
  // scrolling -- REVEAL_DELAY_MS (1400ms) before it even starts, then its
  // own `duration` (1300ms) to finish -- and PixelSwap renders one DOM
  // copy of the panel content PER GRID CELL (up to MAX_PIXELS=220) while
  // that transition is actively in progress. A wait that lands inside
  // that ~2700ms window captures the mid-transition, 220-cell-duplicated
  // DOM, not the settled final state -- confirmed live by grepping the
  // built dist/index.html and finding the hero tagline repeated ~160
  // times. This wait needs to clear the SLOWEST thing on any page, not
  // just StatNumber/DataBar.
  await new Promise((resolve) => setTimeout(resolve, 2500));
}

async function main() {
  const server = await preview({
    root: projectRoot,
    preview: { port: 4173, strictPort: false, host: '127.0.0.1' },
    logLevel: 'silent',
  });

  const base = server.resolvedUrls?.local?.[0];
  if (!base) {
    throw new Error('Prerender: vite preview server did not resolve a local URL.');
  }
  const origin = new URL(base).origin;

  const browser = await launchBrowser();

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      const url = new URL(route.path, base).toString();

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForSelector(READY_SELECTOR[route.path], { timeout: 20000 });
      // Let the mount-time effects (document.title / meta description via
      // src/lib/documentMeta.js) finish running before capturing -- these
      // run in a useEffect immediately after the selector above appears,
      // but give one more macrotask turn of headroom rather than racing
      // it. Scroll-triggered reveals (see revealScrollTriggeredContent's
      // own comment) get their own, much longer wait below, since a
      // rAF-driven count-up needs real animation-frame time, not just a
      // macrotask turn.
      await new Promise((resolve) => setTimeout(resolve, 300));
      await revealScrollTriggeredContent(page);

      let html = await page.content();
      // BUG FOUND DURING VERIFICATION: Vite's dynamic-import runtime injects
      // <link rel="modulepreload"> tags into <head> with an ABSOLUTE URL
      // (built from `import.meta.url`, i.e. the origin of THIS local
      // preview server) whenever a lazy-loaded chunk (React.lazy'd Home /
      // CopiaCaseStudy, see main.jsx's #6 fix) actually loads during
      // capture. Left as-is, the captured HTML would permanently point at
      // `http://127.0.0.1:PORT/assets/...` -- correct nowhere except this
      // throwaway local server. Strip the preview server's own origin back
      // out so those hrefs become root-relative (`/assets/...`), which is
      // correct on any real deploy origin exactly like every other asset
      // reference in this document already is.
      html = html.split(origin).join('');
      const outPath = path.join(projectRoot, 'dist', route.outFile);
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, html, 'utf8');

      const textLength = await page.evaluate(() => document.body.innerText.length);
      console.log(
        `[prerender] ${route.path} -> dist/${route.outFile} (${html.length} bytes HTML, ${textLength} chars of visible text)`
      );

      await page.close();
    }
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exitCode = 1;
});
