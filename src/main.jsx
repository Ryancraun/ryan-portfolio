import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './routes/Layout.jsx'

// WEB QUALITY AUDIT FIX (medium priority #6): both routes' code (and every
// reactbits WebGL component either one statically imports -- Waves/DotGrid/
// Threads/Particles via CardArt.jsx, Waves/BorderGlow via Hero.jsx) used to
// load together in one 409.5KB bundle regardless of which route a visitor
// actually landed on. React.lazy() + Suspense here is the per-route split:
// visiting `/` no longer downloads/parses CopiaCaseStudy's chunk and vice
// versa. Fallback is `null` rather than a spinner -- both routes render real
// prerendered HTML (see scripts/prerender.mjs) before hydration, and
// Layout's own LoadWash already covers first paint on a fresh load, so a
// visible loading state here would only show up on the (rare, already-fast,
// same-origin) chunk fetch during an in-app navigation between the two
// routes, where a flash of a spinner would read as slower, not faster.
//
// FOLLOW-UP (documented, not done in this pass -- see build-log.md): also
// lazy-loading each reactbits component individually behind its existing
// InViewMount boundary (CardArt.jsx) would trim initial parse cost further
// for off-screen cards, but InViewMount currently receives its reactbits
// child as an already-constructed `children` element from CardArt.jsx --
// making that child itself lazy-loaded is a real (if small) architecture
// change to InViewMount's own contract, not a drop-in prop change. Per-route
// splitting is the clear, low-risk win within this pass's scope.
const Home = lazy(() => import('./routes/Home.jsx'))
const CopiaCaseStudy = lazy(() => import('./routes/CopiaCaseStudy.jsx'))
const VaultCaseStudy = lazy(() => import('./routes/VaultCaseStudy.jsx'))
const PickTheOddsCaseStudy = lazy(() => import('./routes/PickTheOddsCaseStudy.jsx'))

// COPIA CASE STUDY + ROUTING: this app was a single scrolling page with no
// router until this addition. react-router-dom is the standard, well-
// supported choice for a Vite React SPA (per the task's own guidance) --
// added specifically so /work/copia can be a real, deep-linkable route
// rather than another card-stack entry (Addendum 4 reverses the prior
// OUT-OF-SCOPE "no multi-page architecture" line for exactly this reason).
// `Layout` owns every piece of persistent chrome that used to live directly
// in App.jsx (LoadWash, ScrollProgress, SiteNav, CustomCursor) so they
// mount ONCE for the whole app lifetime, not per-route -- critical for
// LoadWash specifically, since the brief's "exactly one capped,
// non-repeating personal touch" constraint would be violated if it replayed
// on every navigation. Vite's dev server and `vite preview` both default to
// SPA history-fallback (appType: 'spa'), so a direct load of /work/copia
// (not just client-side navigation into it) is expected to work without
// extra config -- verified directly in this round's build-log entry rather
// than assumed.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={null}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/work/copia"
            element={
              <Suspense fallback={null}>
                <CopiaCaseStudy />
              </Suspense>
            }
          />
          <Route
            path="/work/vault"
            element={
              <Suspense fallback={null}>
                <VaultCaseStudy />
              </Suspense>
            }
          />
          <Route
            path="/work/picktheodds"
            element={
              <Suspense fallback={null}>
                <PickTheOddsCaseStudy />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
