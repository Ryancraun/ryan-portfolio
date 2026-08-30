import Particles from '@/components/reactbits/Particles/Particles';
import InViewMount from './InViewMount';
import PhoneShot from './PhoneShot';
import copiaTeaserScreen from '@/assets/copia-teaser-screen.jpg';
import pickTheOddsScreenshot from '@/assets/picktheodds.png';

// 03 PickTheOdds -- RESOLUTION CAP (Ryan: "can we ensure that all pictures
// are super high resolution" -> this is the one real screenshot on the site
// that isn't: the only copy of picktheodds.png anywhere (checked this
// project, an older sibling `code/` folder, Downloads, Desktop) is a native
// 647x440 capture, but the plain `<img>` this used to be sat inside
// `.card__media`'s full-bleed `object-fit:cover` treatment, stretching it
// to the card's full size (up to ~1180px wide on desktop) -- close to 2x
// upscaled, visibly soft next to every other screenshot on the site.
// Ryan's call, given the choice between sourcing a higher-res original (not
// available) or capping the display size: cap it. This never renders the
// image past its own native pixel size (`max-width:min(100%,647px)` in
// index.css) -- smaller and centered instead of full-bleed, on a solid
// backdrop colored `#101020`, the real base-background hex this case
// study's own "visual system" section already sampled directly from this
// exact screenshot (PickTheOddsCaseStudy.jsx) -- not a new invented color.
export function PickTheOddsCardArt() {
  return (
    <div className="picktheodds-teaser" aria-hidden="true">
      <img src={pickTheOddsScreenshot} alt="PickTheOdds arbitrage dashboard screenshot" loading="lazy" />
    </div>
  );
}

// CUT THE CONCEPT CARDS (Ryan: "should we get rid of the empty projects?"
// -> "cut all 3"): AnchorpointArt/WayfareArt/LedgerlineArt (each a distinct
// reactbits.dev background -- Waves/DotGrid/Threads respectively -- for the
// three fictional, never-linked "Concept work" cards) deleted outright,
// along with their now-unused Waves/DotGrid/Threads imports and the
// hexToRgb01 helper that only LedgerlineArt called. Unlike Solstice below
// (dropped from the page earlier but deliberately kept, "trivially
// reversible"), this is a real removal, not a toggle-off -- Ryan's own
// call was to cut the padding, not hide it. Copia (card 01) gets its own,
// deliberately different treatment -- see CopiaTeaserArt above.
//
// THUMBNAIL ROUND (Ryan: "needs to be the BEST looking screen on a REAL
// iphone, not a shitty looking mockup iphone"): CopiaTeaserArt used to
// center an empty PhoneFrame placeholder (deleted, along with
// VisualPlaceholder.jsx -- both fully unused once real screenshots existed
// everywhere they were standing in). Now centers a real screenshot in
// PhoneShot's device-bezel component.
//
// THUMBNAIL ROUND 2 (Ryan: "the thumbnail image for Copia should be the
// home screen so it doesn't look like a recipe app"): swapped off
// copia-recipes.jpg -- correct call. The card is this site's one shot at
// representing the whole product in a single frame, and Copia's actual
// pitch (this case study's own title: "A Grocery List Built for the Aisle,
// Not the Desk") is the grocery-list/route experience, not recipes --
// recipes are one feature among several, not the thing being sold. Now
// shows the same Lists screen already used to open the case study's own
// hero, so the card and the page it links to lead with the same screen
// rather than two different first impressions of the app.
//
// DOUBLE-BEZEL FIX (Ryan: "take the marketing photo out of the iphone frame
// since there is an iphone frame in the picture already"): the case study's
// hero later switched from a screen-only crop to the actual App Store
// marketing frame (its own coral background + headline + device bezel
// baked in) -- since this teaser shares that same "Lists screen" intent but
// still wraps its image in PhoneShot's OWN bezel, reusing that same
// full-frame asset here double-framed it (PhoneShot's metal chassis drawn
// around an image that already has a bezel drawn into it). This teaser now
// points at `copia-teaser-screen.jpg` -- a dedicated screen-content-only
// crop of the same Lists screen, no baked-in frame -- so PhoneShot's bezel
// is the only one. Keep these two assets separate: don't repoint this at
// copia-home-dark.jpg again.

// 01 Copia (grocery/recipe iOS app) -- COPIA CASE STUDY (Addendum 4):
// deliberately NOT another live reactbits.dev canvas. This card's whole
// point is that it carries the site's first REAL, deep content -- more
// visual noise on top of it would be the exact "content-vs-craft imbalance"
// the audit that triggered this addition already flagged.
//
// ANTI-SLOP PASS, ROUND 3 -- flat on purpose. Three decorative treatments
// were tried and rejected here (a two-blob radial-gradient mesh; a quieter
// single-corner glow; a route-and-stations motif lifted from the app's own
// UI). Every one of them was an invented background layer, and every one
// read as slop regardless of composition. The fix isn't a fourth motif --
// it's no motif. `.copia-teaser` is a flat solid base plus the grain
// texture (below, unchanged); the real phone screenshot is this card's
// entire visual interest.
export function CopiaTeaserArt() {
  return (
    <div className="copia-teaser" aria-hidden="true">
      <div className="copia-teaser__grain" />
      <PhoneShot src={copiaTeaserScreen} alt="" />
    </div>
  );
}

// 05 Solstice (wellness) -- Particles: a soft, slow particle "cosmos" dance.
// https://reactbits.dev/backgrounds/particles
// FIX ROUND 3, required fix 1: at the old particleSpread=7 / default
// cameraDistance=20, the shader's own z-multiplier (see Particles.jsx)
// pushed most particles outside the visible frustum or shrank them to
// near-invisible -- confirmed by direct math (frustum half-width at
// cameraDistance vs. spread) and by the critic's live spoofed-visibility
// test, not just assumed. Fixed on both sides of the same problem:
// softened the shader's z-multiplier (10x -> 3x, see Particles.jsx) AND
// re-tuned these props together as one system -- pulled particleSpread in
// (7 -> 2.4) and pushed cameraDistance out (default 20 -> 30) so the
// field's x/y extent actually fits the camera's narrow 15deg FOV, and
// bumped particleBaseSize (85 -> 150) to compensate for the larger
// average camera distance so the dots read at the same weight as before,
// not smaller. Net result: nearly all 260 particles now render in-frame
// at a consistent size, instead of a thin scatter of the ~20-30% that
// used to land inside the visible cone.
export function SolsticeArt() {
  return (
    <InViewMount rootMargin="150px 0px">
      <Particles
        className=""
        particleColors={['#3f6b57', '#7fae94', '#c8e6d4']}
        particleCount={260}
        particleSpread={2.4}
        particleBaseSize={150}
        cameraDistance={30}
        speed={0.08}
        alphaParticles
        disableRotation={false}
        pixelRatio={Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)}
      />
    </InViewMount>
  );
}
