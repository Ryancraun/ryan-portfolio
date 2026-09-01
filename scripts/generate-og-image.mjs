// Generates the social share image (Open Graph / Twitter) at
// public/og-image.png, so LinkedIn et al. show a branded card instead of a
// random page screenshot -- and so no image ever has to be hand-made.
//
// It renders an on-brand HTML card in real Chrome (via the same Puppeteer the
// prerender step already uses) and screenshots it at exactly 1200x630 -- the
// size the meta tags in index.html declare. Rendering in a real browser means
// it uses the site's actual system font stack (SF Pro on Apple, etc.), no
// font embedding needed.
//
// Run it with `npm run og`. It is intentionally NOT part of `npm run build`:
// Vercel's build-container Chromium ships without fonts, which would render
// the text as blank boxes. Generating it locally (where the fonts exist) and
// committing the PNG keeps the deployed image correct and dependency-free.
import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const OUT = path.join(projectRoot, 'public', 'og-image.png');

// The card. Same palette/type as the site (index.css): near-black ground,
// off-white ink, one amber accent, SF Pro system stack.
const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ width:1200px; height:630px; overflow:hidden; }
  body{
    font-family:-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background:#0a0a0c;
    color:#f4f2ec;
    position:relative;
    padding:88px 96px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    -webkit-font-smoothing:antialiased;
  }
  /* faint amber depth, top-right */
  .glow{ position:absolute; top:-260px; right:-220px; width:760px; height:760px;
    background:radial-gradient(circle, rgba(226,167,60,0.18), rgba(226,167,60,0) 60%); }
  .mono{ position:absolute; top:84px; left:96px; display:flex; align-items:center; gap:18px; }
  .mono .rc{ font-size:34px; font-weight:800; letter-spacing:0.04em; }
  .mono .bar{ width:2px; height:30px; background:rgba(244,242,236,0.28); }
  .mono .dom{ font-size:24px; color:#a6a39c; letter-spacing:0.01em; }
  .eyebrow{ font-size:24px; letter-spacing:0.30em; text-transform:uppercase; color:#e2a73c; font-weight:600; margin-bottom:30px; }
  h1{ font-size:150px; line-height:0.96; font-weight:700; letter-spacing:-0.025em; }
  .role{ margin-top:26px; font-size:46px; color:#cbc8c1; font-weight:500; }
  .tag{ margin-top:22px; font-size:30px; color:#8f8c86; font-weight:400; }
  .rule{ position:absolute; left:0; right:0; bottom:0; height:7px; background:#e2a73c; }
</style></head>
<body>
  <div class="glow"></div>
  <div class="mono"><span class="rc">RC</span><span class="bar"></span><span class="dom">ryancraun.com</span></div>
  <div class="eyebrow">Portfolio</div>
  <h1>Ryan Craun</h1>
  <div class="role">Product Designer</div>
  <div class="tag">I design apps, then I build them.</div>
  <div class="rule"></div>
</body></html>`;

const browser = await puppeteer.launch({ headless: 'new' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  // Let the system font settle before capture.
  await page.evaluate(() => document.fonts?.ready);
  await new Promise((r) => setTimeout(r, 150));
  await mkdir(path.dirname(OUT), { recursive: true });
  const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await writeFile(OUT, buf);
  console.log(`[og-image] wrote ${OUT} (${buf.length} bytes, 1200x630)`);
} finally {
  await browser.close();
}
