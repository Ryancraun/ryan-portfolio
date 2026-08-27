// WEB QUALITY AUDIT FIX (low priority #12): public/harness.html is an
// explicit dev-only mobile-QA tool (per its own header comment) that Vite
// copies straight into dist/harness.html by default, since anything in
// public/ ships as-is. It's actively used by this project's own
// verification workflow (a fixed-width iframe technique for checking true
// mobile widths), so it must NOT be deleted or moved out of public/ --
// removing it there would break local `npm run dev` / `npm run preview`.
// Instead: keep it in public/ for local dev, and remove ONLY the built copy
// from the final dist/ output, post-build, so a real production deploy from
// a clean dist/ folder never serves it publicly.
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// bisect.html: same reasoning as harness.html above -- a dev-only
// diagnostic tool (Chroma rim seam bisector) that must stay in public/
// for local use but never ship in a production dist/.
const targets = ['harness.html', 'bisect.html'];

for (const name of targets) {
  await rm(path.join(projectRoot, 'dist', name), { force: true });
  console.log(`[strip-dev-only-files] removed dist/${name} (public/${name} untouched)`);
}
