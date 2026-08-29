import { useEffect, useRef } from 'react';
import { createNoise2D } from '../lib/simplexNoise';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// CHROMA ARC -- FULL CANVAS REBUILD (build-log.md, "CANVAS REBUILD" round).
// Replaces an 11-layer CSS/mask stack that failed twice for structural
// reasons (a dark seam across three fix attempts, flares that rendered as
// vertical spokes because a mask wasn't confining a conic gradient). Ryan's
// own diagnosis: too many independently-antialiased mask edges composited
// across separate divs. One canvas, one rasterization pass, no mask
// boundaries to disagree with each other.
//
// Angle convention: every angle below is in the SAME "from -78deg" frame
// the original CSS `--rim` conic-gradient used (a stop at gradient-angle G
// sits at G degrees clockwise from `RIM_FROM_DEG`, which itself is
// clockwise from 12 o'clock/top -- CSS's own convention). Canvas's
// `createConicGradient`/`arc()` angle convention is different (0 = due
// east/3 o'clock, clockwise-positive) -- `gToCanvasRad()` is the one
// conversion point; every other function works in gradient-angle degrees
// and calls it at the point of actually touching the canvas API, so there
// is exactly one place this can be gotten wrong, not several.
const RIM_FROM_DEG = -78;
const RIM_SPAN_DEG = 90;
const RIM_APEX_DEG = 77;
// l/c/h (not a pre-built color string) so buffer A2's boosted-chroma
// gradient (see CHROMA_BOOST) can be built from the exact same stops
// without a second hand-maintained list -- one source of truth for hue,
// two renderings of it.
const HUE_STOPS = [
  { g: 42, l: 68, c: 0.28, h: 305 },
  { g: 52, l: 66, c: 0.26, h: 278 },
  { g: 61, l: 74, c: 0.25, h: 255 },
  { g: 69, l: 88, c: 0.19, h: 200 },
  { g: 77, l: 90, c: 0.24, h: 150 },
  { g: 87, l: 95, c: 0.2, h: 100 },
  { g: 99, l: 86, c: 0.22, h: 58 },
  { g: 111, l: 72, c: 0.26, h: 25 },
];
const RIM_LOWER_DEG = RIM_APEX_DEG - RIM_SPAN_DEG / 2; // 32 -- transparent bookend
const RIM_UPPER_DEG = RIM_APEX_DEG + RIM_SPAN_DEG / 2; // 122 -- transparent bookend
const HUE_LOWER_DEG = HUE_STOPS[0].g; // 42 -- first real color, emission range starts here
const HUE_UPPER_DEG = HUE_STOPS[HUE_STOPS.length - 1].g; // 111 -- emission range ends here

const MAX_DPR = 3;
// Bloom rebuild -- Ryan, after the multi-stroke version: "the bloom reads
// as several distinct concentric lines instead of one continuous glow."
// Root cause was structural, not a tuning problem: a canvas stroke is
// opaque across its full width and antialiased only at its two edges, so
// stacking N of them produces N visible bands no matter how many passes
// or how the widths/alphas are spaced -- it approximates a blur with
// discrete steps, which doesn't converge to one. Real `ctx.filter:
// blur()`, additively stacked in octaves (each radius roughly doubling),
// produces the inverse-power falloff real bloom has, with no hard edges
// anywhere to read as a band. See `buildBufferB()` below for the
// two-buffer structure this requires (sharp arc vs. its blurred cache),
// and why blurring can stay entirely outside the animation loop: the arc
// itself never changes frame to frame, only the particles do.
// Raised 2 -> 2.75 (Ryan, second bloom round: "the rim is slightly too
// thin... a small weight increase, not a return to the thick band"). Core
// width/alpha untouched -- raising those to compensate for a dim halo is
// exactly what desaturated it earlier (a wide additive blur stack that
// keeps re-including the white core pushes the average toward grey); the
// per-octave scratch buffers (see BLOOM_OCTAVES) are the actual fix for
// that -- they never include the white core in the first place. This
// constant is buffer A's own crisp-line width only, untouched this round.
const RIM_STROKE_WIDTH_PX = 2.75;
const CORE_WIDTH_PX = 1.5;
const CORE_ALPHA = 0.9;
// Third bloom round -- Ryan: the repeat-pass gain from round 2 was
// amplifying quantization, not fixing dimness. A thin (2.75px) line
// blurred at 140px radius has peak alpha spanning maybe 0-3 out of 255 --
// ~4 distinct 8-bit levels -- and compositing that 8.5x additively
// multiplies the levels along with the brightness, spreading those 4
// levels 8.5 steps apart: flat posterized chunks with hard contours, and
// MORE passes make it worse, not better, since it's amplifying an
// already-coarse quantization rather than adding real precision.
// Fix: apply the gain BEFORE the blur, not after. Stroke each octave at a
// width proportional to its own blur radius (below), blur it once, then
// composite it ONCE -- a stroke that wide retains most of its peak
// brightness through the blur, so the result already sits in a high,
// well-quantized 8-bit range and never needs repeat-compositing to reach
// visible brightness. `BLOOM_GAIN` stays as a single master multiplier,
// now applied directly to alpha (no more pass-count math) -- default 1.0.
const BLOOM_GAIN = 1.0;
const BLOOM_OCTAVES = [
  // { blurCssPx, strokeWidthCssPx, alpha } -- blur and strokeWidth both
  // multiplied by dpr at the point of use (see `buildBufferBBloom`),
  // never assumed to inherit DPR scaling from a transform. Every octave
  // now strokes its own temp buffer with the SAME boosted-chroma, no-
  // white-core gradient (previously only the 4 wider octaves used this;
  // buffer A2 as a separate persistent buffer is gone -- each octave gets
  // a freshly-stroked scratch buffer at its own width instead, see
  // `octaveScratch` below) -- buffer A (with the white core) is no longer
  // blurred into the bloom at all, only ever drawn crisp, directly, in
  // `drawFrame`.
  { blur: 3, strokeWidth: 3, alpha: 0.9 },
  { blur: 8, strokeWidth: 9, alpha: 0.55 },
  { blur: 22, strokeWidth: 24, alpha: 0.38 },
  { blur: 60, strokeWidth: 70, alpha: 0.26 },
  { blur: 120, strokeWidth: 140, alpha: 0.16 },
];
// Boost for every octave's own scratch-buffer gradient (see
// BLOOM_OCTAVES) -- buffer A (the crisp line + white core) and particle
// color sampling both still use the unboosted `HUE_STOPS` chroma via
// `buildRimGradient`'s default.
const CHROMA_BOOST = 1.25;
// Edge fade -- Ryan: "the red terminates abruptly at the right viewport
// edge and the violet does the same on the left... the transparent stops
// [RIM_LOWER_DEG/RIM_UPPER_DEG] exist in the conic gradient but have ended
// up outside the visible span as the arc widened." Confirmed by direct
// computation, not assumed: at this build's own geometry (radius = canvas
// width), the hue stop at G=42 (violet) resolves to x ~= -167px --
// already off the LEFT edge of a ~1900px-wide canvas before the fade to
// transparent even begins, which is exactly why the visible edge shows an
// abrupt cut of saturated color instead of a fade -- the fade is real, it
// just happens somewhere the viewer can never see it.
// Fix: don't touch RIM_LOWER_DEG/RIM_UPPER_DEG (still there, still
// irrelevant in practice, harmless) -- add a SEPARATE alpha-only fade
// computed from where the circle's own edge actually crosses the canvas
// boundary (`computeHalfSpanDeg` below), expressed as fractions of that
// geometric half-span rather than fixed degrees, so it's correct at any
// viewport width rather than needing to be re-tuned per breakpoint.
const FADE_FULL_FRACTION = 0.78; // full opacity out to this fraction of the half-span
const FADE_TRANSPARENT_FRACTION = 0.96; // fully transparent by this fraction
// BANDING FIX (Ryan, real iPhone: "there's no blurring or smooth fading...
// you can see all the color bands"). This is a DIFFERENT bug from the
// crown-position fix a round ago -- that one was about the arc's Y
// position relative to the Name field; this one is about the bloom's own
// visible quantization, which the codebase's own "bloom rebuild" history
// already identifies as the widest/faintest octave (blur:120, alpha:0.16)
// landing in a low, coarse 8-bit range on a large area -- exactly the
// low-luminance/large-area combination 8-bit displays band on. A dither
// already exists specifically as the fix for this (see `buildDitherTile`
// below), but at 0.02 (2%) it's subtle enough that it may not be doing
// enough work on a real device's actual screen -- this session's own
// testing can't perceive banding severity the way a real iPhone's display
// can, so this is tuned up meaningfully rather than left at a value only
// ever verified as "not obviously wrong" on a lower-density test render.
// Not a guess pulled from nowhere: same mechanism this exact codebase
// already used once to fix a worse version of this same problem (the
// "third bloom round"), just given more strength.
const DITHER_ALPHA = 0.05;
const DITHER_TILE_PX = 64;

// ROUND 10 (build-log.md -- "BLOOM BANDING, ROUND 10"): the bloom blur is
// feature-forked again, but on a BEHAVIORAL test this time. Round 7 was
// right that iOS Safari silently ignores `ctx.filter` during `drawImage`
// (measured from Ryan's own screenshot: octave edges at exactly
// strokeWidth/2), and right that the old get/set string round-trip check
// (`supportsCanvasFilter`) couldn't catch it -- but wrong to respond by
// abandoning the true Gaussian blur on EVERY browser. The rounds 7-9
// replacement (downscale-then-upscale via `drawImage`) is a lossy
// approximation: measured against a true `ctx.filter` render of the same
// octaves in this session's Chrome, its falloff profiles missed in BOTH
// directions at once (blur:8 octave FWHM 14px vs the true 20px -- too
// tight; blur:120 octave 232px vs 304px -- 24% under-spread; peak alpha
// off by up to 17%), because a single downscale divisor cannot match a
// true Gaussian across a 3px-to-120px radius range -- retuning it (round
// 9) just moved which octaves were wrong. That mismatch on the tight
// octaves (blur:3/8, the ones hugging the line) is exactly Ryan's "not as
// high resolution as it once was," and it degraded desktop -- where
// `ctx.filter` always worked perfectly -- for no benefit.
//
// The fork: `canvasFilterBlursDrawImage()` below actually EXERCISES the
// broken operation -- draws an opaque square through `filter:'blur(4px)'`
// + `drawImage`, reads pixels back, and requires both real alpha spread
// OUTSIDE the square and real attenuation INSIDE it. Browsers that pass
// (Chrome/Firefox/desktop -- every engine where the bloom always looked
// right) get the original `ctx.filter` path back verbatim; browsers that
// fail (real iOS Safari) get a genuine separable box-blur convolution
// (`blurPremultiplied` below) instead of the scale round-trip -- three box
// passes approximate a Gaussian closely (standard result), and measured
// RMS profile error vs the true filter render is 0.001-0.007 across all
// five octaves, vs 0.004-0.045 for the round-9 mip-chain it replaces.
// `?manualBloom` in the URL forces the fallback path so it stays testable
// in Chrome -- the fallback must never again be a path only real Safari
// ever executes (that hidden divergence is what made rounds 1-6 blind).
let filterDrawImageVerdict = null;
function canvasFilterBlursDrawImage() {
  if (filterDrawImageVerdict !== null) return filterDrawImageVerdict;
  try {
    if (typeof window !== 'undefined' && /[?&]manualBloom\b/.test(window.location.search)) {
      filterDrawImageVerdict = false;
      return filterDrawImageVerdict;
    }
    const size = 32;
    const src = document.createElement('canvas');
    src.width = size;
    src.height = size;
    const sctx = src.getContext('2d');
    sctx.fillStyle = '#fff';
    sctx.fillRect(12, 12, 8, 8);
    const dst = document.createElement('canvas');
    dst.width = size;
    dst.height = size;
    const dctx = dst.getContext('2d', { willReadFrequently: true });
    dctx.filter = 'blur(4px)';
    dctx.drawImage(src, 0, 0);
    dctx.filter = 'none';
    const px = dctx.getImageData(0, 0, size, size).data;
    const alphaAt = (x, y) => px[(y * size + x) * 4 + 3];
    // 4px outside the square's top edge: 0 if the blur silently no-ops,
    // clearly nonzero if it ran. Center of the square: 255 if no-op,
    // well below if the blur genuinely spread it. Requiring BOTH means a
    // pass can only come from the blur actually executing, not from any
    // one artifact (antialiasing, rounding) faking one signal.
    const spread = alphaAt(16, 8);
    const attenuated = alphaAt(16, 16);
    filterDrawImageVerdict = spread > 8 && attenuated < 250;
  } catch {
    filterDrawImageVerdict = false;
  }
  return filterDrawImageVerdict;
}

// Fallback-path blur strength constants (see `drawBlurredOctave`):
// `blur(N)` measured in Chrome as a Gaussian with sigma ~= N (a 140px
// stroke through blur(120) came out FWHM 304px; deconvolving the stroke
// width gives sigma ~114 -- and sigma = N matched the true render's
// profile to RMS <= 0.007 at every octave, which is the calibration that
// actually matters). The downscale before the convolution is ONLY a cost
// bound now -- the box passes do the blurring, so the factor is chosen to
// keep the in-small-space sigma at a fixed, well-resolved size
// (FALLBACK_SIGMA_SMALL_PX) rather than being the magic constant that
// controls the look, which is what made rounds 7-9 untunable.
const FALLBACK_SIGMA_SMALL_PX = 6;
const FALLBACK_BOX_PASSES = 3;

// Standard box-sizes-for-Gaussian decomposition ("Fastest Gaussian blur"
// algorithm): n box passes whose widths are chosen so their combined
// variance matches the target Gaussian's. Widths are always odd.
function boxesForGauss(sigma, n) {
  const wIdeal = Math.sqrt((12 * sigma * sigma) / n + 1);
  let wl = Math.floor(wIdeal);
  if (wl % 2 === 0) wl -= 1;
  if (wl < 1) wl = 1;
  const wu = wl + 2;
  const m = Math.round((12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4));
  const sizes = [];
  for (let i = 0; i < n; i++) sizes.push(i < m ? wl : wu);
  return sizes;
}

// One sliding-window box-blur pass over a single Float32 channel -- O(n)
// regardless of radius (the window slides, adding one texel and dropping
// one per step), edge-clamped. Called horizontally then vertically per
// box (separable).
function boxBlurPass(src, dst, w, h, r, horizontal) {
  const norm = 1 / (2 * r + 1);
  if (horizontal) {
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let acc = 0;
      for (let x = -r; x <= r; x++) acc += src[row + Math.min(w - 1, Math.max(0, x))];
      dst[row] = acc * norm;
      for (let x = 1; x < w; x++) {
        acc += src[row + Math.min(w - 1, x + r)] - src[row + Math.max(0, x - r - 1)];
        dst[row + x] = acc * norm;
      }
    }
  } else {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += src[(Math.min(h - 1, Math.max(0, y))) * w + x];
      dst[x] = acc * norm;
      for (let y = 1; y < h; y++) {
        acc += src[Math.min(h - 1, y + r) * w + x] - src[Math.max(0, y - r - 1) * w + x];
        dst[y * w + x] = acc * norm;
      }
    }
  }
}

// In-place ~Gaussian blur of an ImageData via FALLBACK_BOX_PASSES
// separable box passes. Works on PREMULTIPLIED values: `getImageData`
// returns straight (non-premultiplied) RGBA, and box-blurring straight
// RGBA would average the arbitrary RGB of fully-transparent pixels into
// colored edges -- dark fringing, i.e. new "smoke". Premultiply RGB by
// alpha first, blur all four channels, un-premultiply at the end.
function blurPremultiplied(imageData, w, h, sigma) {
  const n = w * h;
  const data = imageData.data;
  const channels = [new Float32Array(n), new Float32Array(n), new Float32Array(n), new Float32Array(n)];
  for (let i = 0; i < n; i++) {
    const a = data[i * 4 + 3] / 255;
    channels[0][i] = data[i * 4] * a;
    channels[1][i] = data[i * 4 + 1] * a;
    channels[2][i] = data[i * 4 + 2] * a;
    channels[3][i] = data[i * 4 + 3];
  }
  const boxes = boxesForGauss(sigma, FALLBACK_BOX_PASSES);
  const tmp = new Float32Array(n);
  for (const channel of channels) {
    for (const boxWidth of boxes) {
      const r = (boxWidth - 1) / 2;
      boxBlurPass(channel, tmp, w, h, r, true);
      boxBlurPass(tmp, channel, w, h, r, false);
    }
  }
  for (let i = 0; i < n; i++) {
    const a = channels[3][i];
    data[i * 4 + 3] = Math.round(a);
    const inv = a > 0 ? 255 / a : 0;
    data[i * 4] = Math.min(255, Math.round(channels[0][i] * inv));
    data[i * 4 + 1] = Math.min(255, Math.round(channels[1][i] * inv));
    data[i * 4 + 2] = Math.min(255, Math.round(channels[2][i] * inv));
  }
}

const HUE_BUCKET_COUNT = 12;
const PARTICLE_POOL_SIZE = 600;
const PARTICLE_SPRITE_PX = 16; // offscreen sprite render size (CSS px, pre-DPR)
const EMIT_DURATION_MS = 6000;
const GAP_MIN_MS = 2000;
const GAP_MAX_MS = 4000;
const SPAWN_PER_SECOND = 40;
const RADIAL_SPEED = 26; // CSS px/s, outward
const TANGENTIAL_SPEED = 34; // CSS px/s, direction of sweep travel
const NOISE_SPATIAL_SCALE = 0.01;
const NOISE_TIME_SCALE = 0.00025;
const NOISE_STEER_STRENGTH = 90; // px/s^2-ish nudge applied to velocity

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

// The one conversion point between the CSS gradient's angle frame and
// canvas's native angle frame -- see the file-level comment.
function gToCanvasRad(gDeg) {
  return degToRad(RIM_FROM_DEG + gDeg - 90);
}

// `chromaMultiplier` defaults to 1 (buffer A's crisp line, and particle
// color sampling via `buildHueBuckets`, both want the UNBOOSTED hue --
// only each bloom octave's own scratch-buffer gradient passes
// CHROMA_BOOST here, see BLOOM_OCTAVES).
function buildRimGradient(ctx, cx, cy, chromaMultiplier = 1) {
  const gradient = ctx.createConicGradient(gToCanvasRad(0), cx, cy);
  gradient.addColorStop(RIM_LOWER_DEG / 360, 'transparent');
  for (const stop of HUE_STOPS) {
    gradient.addColorStop(stop.g / 360, `oklch(${stop.l}% ${(stop.c * chromaMultiplier).toFixed(4)} ${stop.h})`);
  }
  gradient.addColorStop(RIM_UPPER_DEG / 360, 'transparent');
  return gradient;
}

// Angle (gradient-angle degrees, same frame as everything else in this
// file) from the circle's center to where it crosses a given vertical
// edge (`edgeX` = 0 for the left edge, `cssW` for the right) -- the upper
// (visible, sin<0 in canvas-angle terms) intersection of the circle
// `x = cx + radius*cos(theta)` with `x = edgeX`. Clamped to [-1,1] before
// `acos` so an edge the circle can't geometrically reach (a very tall,
// narrow viewport) degrades to the widest possible span (90deg) rather
// than producing NaN.
function computeHalfSpanDeg(edgeX, cx, radius) {
  const cosTheta = Math.min(1, Math.max(-1, (edgeX - cx) / radius));
  const edgeCanvasAngleDeg = (-Math.acos(cosTheta) * 180) / Math.PI;
  const apexCanvasAngleDeg = RIM_FROM_DEG + RIM_APEX_DEG - 90;
  return Math.abs(edgeCanvasAngleDeg - apexCanvasAngleDeg);
}

// Pure alpha mask (white, never a color) -- applied via
// `globalCompositeOperation:'destination-in'` (see `applyEdgeFade`), so it
// only ever multiplies existing alpha, never mixes in black -- Ryan's
// explicit "the fade must be an alpha fade, not a fade to black... a
// black fade would punch a hole in [the bloom]". Left and right half-
// spans computed independently (not assumed symmetric) since the apex
// (RIM_APEX_DEG=77) isn't perfectly centered in the rim's own "from
// -78deg" frame to begin with (a pre-existing 1deg offset, untouched --
// "do not... change... crown position").
function buildEdgeFadeGradient(ctx, cx, cy, cssW, radius) {
  const halfSpanLeft = computeHalfSpanDeg(0, cx, radius);
  const halfSpanRight = computeHalfSpanDeg(cssW, cx, radius);
  const lowFade = RIM_APEX_DEG - halfSpanLeft * FADE_TRANSPARENT_FRACTION;
  const lowFull = RIM_APEX_DEG - halfSpanLeft * FADE_FULL_FRACTION;
  const highFull = RIM_APEX_DEG + halfSpanRight * FADE_FULL_FRACTION;
  const highFade = RIM_APEX_DEG + halfSpanRight * FADE_TRANSPARENT_FRACTION;
  const gradient = ctx.createConicGradient(gToCanvasRad(0), cx, cy);
  gradient.addColorStop(lowFade / 360, 'rgba(255,255,255,0)');
  gradient.addColorStop(lowFull / 360, 'rgba(255,255,255,1)');
  gradient.addColorStop(highFull / 360, 'rgba(255,255,255,1)');
  gradient.addColorStop(highFade / 360, 'rgba(255,255,255,0)');
  return gradient;
}

// Applies the edge fade to whatever is already drawn on `ctx` (buffer A's
// crisp line, or an octave's scratch buffer) -- `destination-in` keeps
// only existing pixels where the new shape has alpha, multiplying by it,
// so this can only ever reduce alpha, never paint a new color. Must run
// AFTER the sharp/scratch content is fully stroked, before that buffer is
// read from (composited into buffer B, or drawn directly in `drawFrame`).
function applyEdgeFade(ctx, cx, cy, cssW, cssH, radius) {
  const gradient = buildEdgeFadeGradient(ctx, cx, cy, cssW, radius);
  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, cssW, cssH);
  ctx.restore();
}

// Cached once (not per resize -- the texture itself is resolution-
// independent, only ever used as a repeating pattern) -- see the bloom
// rebuild's own comment for why this exists: the widest, faintest bloom
// octave is exactly the low-luminance/large-area combination 8-bit
// displays band on, and a fixed low-alpha noise pattern breaks up the
// banding without needing to be regenerated.
function buildDitherTile() {
  const tile = document.createElement('canvas');
  tile.width = DITHER_TILE_PX;
  tile.height = DITHER_TILE_PX;
  const tctx = tile.getContext('2d');
  const imageData = tctx.createImageData(DITHER_TILE_PX, DITHER_TILE_PX);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.floor(Math.random() * 256);
    imageData.data[i] = v;
    imageData.data[i + 1] = v;
    imageData.data[i + 2] = v;
    imageData.data[i + 3] = 255;
  }
  tctx.putImageData(imageData, 0, 0);
  return tile;
}

// Renders the SAME conic gradient once to a small offscreen canvas and
// reads real pixel colors back -- guarantees particle tints are exactly
// what the arc itself renders (the browser's own OKLCH->sRGB conversion),
// rather than a hand-ported color-math approximation that could drift out
// of sync if the hue stops above ever change. Bucketed (not continuous)
// so particle spawn only does an array lookup, never a canvas read.
function buildHueBuckets() {
  const size = 200;
  const off = document.createElement('canvas');
  off.width = size;
  off.height = size;
  const octx = off.getContext('2d', { willReadFrequently: true });
  const cx = size / 2;
  const cy = size / 2;
  const gradient = buildRimGradient(octx, cx, cy);
  octx.fillStyle = gradient;
  octx.fillRect(0, 0, size, size);

  const sampleRadius = size * 0.42;
  const buckets = [];
  for (let i = 0; i < HUE_BUCKET_COUNT; i++) {
    const g = HUE_LOWER_DEG + (i / (HUE_BUCKET_COUNT - 1)) * (HUE_UPPER_DEG - HUE_LOWER_DEG);
    const rad = gToCanvasRad(g);
    const px = Math.round(cx + Math.cos(rad) * sampleRadius);
    const py = Math.round(cy + Math.sin(rad) * sampleRadius);
    const [r, gr, b, a] = octx.getImageData(px, py, 1, 1).data;
    buckets.push({ g, rgba: `rgba(${r},${gr},${b},${a / 255})` });
  }
  return buckets;
}

// One warm-white dot pre-rendered per hue bucket, tinted via
// `source-atop` (cheap, done once at setup) -- every particle every frame
// then costs exactly one `drawImage`, never a gradient construction.
function buildParticleSprites(dpr, buckets) {
  const px = Math.max(1, Math.round(PARTICLE_SPRITE_PX * dpr));
  return buckets.map(({ rgba }) => {
    const off = document.createElement('canvas');
    off.width = px;
    off.height = px;
    const octx = off.getContext('2d');
    const r = px / 2;
    const grad = octx.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    octx.fillStyle = grad;
    octx.fillRect(0, 0, px, px);
    octx.globalCompositeOperation = 'source-atop';
    octx.fillStyle = rgba;
    octx.fillRect(0, 0, px, px);
    return off;
  });
}

function nearestBucketIndex(gDeg, buckets) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < buckets.length; i++) {
    const d = Math.abs(buckets[i].g - gDeg);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

function createParticlePool(size) {
  const pool = new Array(size);
  for (let i = 0; i < size; i++) {
    pool[i] = { alive: false, x: 0, y: 0, vx: 0, vy: 0, age: 0, lifetime: 0, size: 0, bucketIndex: 0 };
  }
  return pool;
}

function particleAlpha(ageFrac) {
  if (ageFrac < 0.1) return ageFrac / 0.1;
  if (ageFrac > 0.6) return Math.max(0, 1 - (ageFrac - 0.6) / 0.4);
  return 1;
}

// TWO-CANVAS SPLIT (build-log.md, "CHROMA: BLOOM/RIM CANVAS SPLIT" round).
// Ryan: the scrim (index.css) sits above the whole arc, so it was dimming
// the sharp rim along with the bloom -- the line read visibly darker
// behind the form than at the apex, when only the wash needed taming.
// Fix is structural, not a scrim tweak: split the single canvas into two
// stacked elements so the scrim's DOM position sits BETWEEN them --
// bloomCanvas (z-index 1, renders buffer B, drawn once per resize, never
// touched by the rAF loop) -- scrim (z-index 2, unchanged CSS) -- rimCanvas
// (z-index 3, renders buffer A + every particle, the ONLY canvas an rAF
// loop ever touches) -- content (z-index 4). Both canvases are sized,
// DPR-scaled and given their circle geometry from the SAME `geom` object,
// computed exactly once per resize in `measureAndResize` below and never
// recomputed independently for either canvas -- any drift between two
// separate geometry calculations would show up as a doubled/offset edge,
// which is exactly the failure mode Ryan flagged as unacceptable.
export default function ChromaCanvas({ crownY, children }) {
  const bloomCanvasRef = useRef(null);
  const rimCanvasRef = useRef(null);
  const [wrapperRef, inView] = useInView({ rootMargin: '200px 0px' });
  const reducedMotion = usePrefersReducedMotion();
  const crownYRef = useRef(crownY);
  crownYRef.current = crownY;
  // `inView` is read via a ref inside the rAF loop (see `loop()` below)
  // rather than closed over directly and put in the setup effect's own
  // dependency array -- Threads.jsx (this codebase's most complete
  // resize/visibility model) gates its update loop the same way, inside a
  // single persistent effect, specifically so scrolling the section in
  // and out of view doesn't tear down and rebuild the whole particle pool
  // and flare state every time; it should pause and resume in place, not
  // reset.
  const inViewRef = useRef(inView);
  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);
  // Exposes the setup effect's own `measureAndResize` so the crownY-change
  // effect below can trigger a remeasure without needing `crownY` in the
  // heavy effect's dependency array either (that would tear down/rebuild
  // the canvas engine on every font-load/resize re-measurement, not just
  // resize the geometry).
  const measureAndResizeRef = useRef(() => {});

  useEffect(() => {
    measureAndResizeRef.current();
  }, [crownY]);

  useEffect(() => {
    const bloomCanvas = bloomCanvasRef.current;
    const rimCanvas = rimCanvasRef.current;
    const wrapper = wrapperRef.current;
    if (!bloomCanvas || !rimCanvas || !wrapper) return;

    const bloomCtx = bloomCanvas.getContext('2d');
    const rimCtx = rimCanvas.getContext('2d');
    // imageSmoothingEnabled/Quality are set on both `bloomCtx` and `rimCtx`
    // inside `measureAndResize`, AFTER each canvas's `.width`/`.height`,
    // not here -- resizing a canvas element resets its ENTIRE 2D context
    // state (including smoothing settings) back to defaults, so a one-time
    // set here would just get silently wiped on the very first resize call.
    // Buffer A -- the sharp arc (colored rim stroke at its final width,
    // plus the white core), DPR-sized, drawn through the same dpr
    // transform as the rim canvas so its own geometry math is identical to
    // before. Never blurred in place -- only ever read from via
    // `drawImage`, into rimCanvas every frame for the crisp line (the ONLY
    // per-frame draw either canvas gets -- see `drawRimFrame`/`loop`
    // below). No longer composited into the bloom at all (third bloom
    // round) -- see BLOOM_OCTAVES and `octaveScratch` below.
    const bufferA = document.createElement('canvas');
    const bufferACtx = bufferA.getContext('2d');
    // One reusable scratch buffer for building each bloom octave (third
    // round) -- cleared and re-stroked at that octave's own width every
    // iteration of the loop in `buildBufferBBloom`, rather than a
    // separate persistent buffer per octave (there's no need to keep more
    // than one around at a time; each is fully consumed by its own
    // `drawImage` into buffer B before the next octave overwrites it).
    // Full DPR resolution, same as every other buffer here -- see the
    // build-log entry for this round for why that was checked explicitly.
    const octaveScratch = document.createElement('canvas');
    const octaveScratchCtx = octaveScratch.getContext('2d');
    // Downscale target for `drawBlurredOctave` (round 7 -- see its own
    // comment). Resized per-octave (each blur radius wants a different
    // downscale factor), so this can't be a fixed-size buffer the way
    // `octaveScratch` is.
    const blurScratch = document.createElement('canvas');
    const blurScratchCtx = blurScratch.getContext('2d');
    // Ping-pong mip buffers for `drawBlurredOctave`'s round-8 mip-chain
    // downscale (see its own comment) -- two reusable buffers, resized to
    // whatever the current halving step needs, alternated so each step
    // reads from the one the previous step just wrote.
    const mipA = document.createElement('canvas');
    const mipACtx = mipA.getContext('2d');
    const mipB = document.createElement('canvas');
    const mipBCtx = mipB.getContext('2d');
    // Buffer B -- the bloom cache. Built by compositing each octave's own
    // freshly-stroked-and-blurred scratch buffer into it exactly once
    // (third round -- see BLOOM_OCTAVES's own comment for why repeat
    // compositing was removed). Deliberately drawn in raw device-pixel
    // space (identity transform), not through the dpr transform: the blur
    // radius passed to `ctx.filter` is multiplied by dpr explicitly at the
    // point of use instead, so the scaling is a single visible
    // multiplication here rather than a browser-dependent side effect of
    // an active transform.
    const bufferB = document.createElement('canvas');
    const bufferBCtx = bufferB.getContext('2d');
    // Same reasoning as `ctx` above -- set in `buildBufferBBloom`,
    // after `bufferB.width`/`.height` are (re)assigned there, not here.
    const ditherTile = buildDitherTile();

    const noise2D = createNoise2D(7);
    const pool = createParticlePool(PARTICLE_POOL_SIZE);
    let spawnAccumulator = 0;

    let geom = { cssW: 0, cssH: 0, dpr: 1, cx: 0, cy: 0, radius: 0 };
    let hueBuckets = [];
    let sprites = [];

    let flare = { state: 'gap', stateEnd: performance.now() + 500, offsetX: 0, offsetY: 0 };

    function buildBufferA() {
      const { cssW, cssH, dpr, cx, cy, radius } = geom;
      bufferA.width = Math.max(1, Math.round(cssW * dpr));
      bufferA.height = Math.max(1, Math.round(cssH * dpr));
      bufferACtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bufferACtx.clearRect(0, 0, cssW, cssH);

      const startRad = gToCanvasRad(RIM_LOWER_DEG);
      const endRad = gToCanvasRad(RIM_UPPER_DEG);
      const gradient = buildRimGradient(bufferACtx, cx, cy);

      bufferACtx.lineCap = 'round';
      bufferACtx.globalCompositeOperation = 'source-over';
      bufferACtx.beginPath();
      bufferACtx.arc(cx, cy, radius, startRad, endRad);
      bufferACtx.lineWidth = RIM_STROKE_WIDTH_PX;
      bufferACtx.strokeStyle = gradient;
      bufferACtx.globalAlpha = 1;
      bufferACtx.stroke();

      bufferACtx.beginPath();
      bufferACtx.arc(cx, cy, radius, startRad, endRad);
      bufferACtx.lineWidth = CORE_WIDTH_PX;
      bufferACtx.strokeStyle = '#fff';
      bufferACtx.globalAlpha = CORE_ALPHA;
      bufferACtx.stroke();
      bufferACtx.globalAlpha = 1;

      applyEdgeFade(bufferACtx, cx, cy, cssW, cssH, radius);
    }

    // FALLBACK-ONLY MANUAL BLUR (rounds 7-10 -- see the ROUND 10 comment
    // at `canvasFilterBlursDrawImage` for the full account). Round 7
    // proved, by pixel-measuring Ryan's own screenshot, that iOS Safari
    // retains the `ctx.filter = 'blur(Npx)'` string but silently ignores
    // it during `drawImage` -- every octave landed as a hard-edged ring at
    // exactly strokeWidth/2 (measured 13/37/73 CSS px vs half-widths
    // 12/35/70). Its replacement (downscale-then-upscale on every browser)
    // and rounds 8-9's repairs of it (mip chain, divisor retune) could
    // never match the true Gaussian across all five octave radii at once
    // -- that's ROUND 10's measured finding, and why this function now
    // runs ONLY where the behavioral feature test proves `ctx.filter` is
    // actually broken (real iOS Safari, or `?manualBloom` for testing).
    //
    // How it blurs now: the round-8 mip chain still does the downscale,
    // but the downscale is purely a COST BOUND -- it stops once the
    // octave's sigma, in small-canvas space, reaches
    // FALLBACK_SIGMA_SMALL_PX (well-resolved, cheap), instead of scaling
    // all the way down to where bilinear upscale interpolation itself has
    // to act as the "blur" (rounds 7-9's actual fidelity mistake). The
    // real blurring is a genuine separable box-blur convolution
    // (`blurPremultiplied`, 3 passes ~= Gaussian) on the downscaled
    // pixels. Detail below the blur's own sigma is gone anyway, so a
    // downscale that keeps sigma at ~6 small-px loses essentially nothing
    // -- classic pyramid-blur practice. Measured against the true
    // `ctx.filter` render in Chrome: RMS profile error 0.001-0.007 per
    // octave (the shipped round-9 version measured 0.004-0.045, with
    // FWHM errors in both directions). Runs once per resize, never in
    // the rAF loop. putImageData goes to `blurScratch` only, never to
    // the composited target -- putImageData ignores globalAlpha and
    // composite mode, so compositing into buffer B must stay a
    // `drawImage` with 'lighter' active.
    function drawBlurredOctave(destCtx, source, devW, devH, blurDevicePx, alpha) {
      // blur(N) == Gaussian sigma ~N, measured (see FALLBACK_* comment).
      const sigmaDev = blurDevicePx;
      const scale = Math.max(1, sigmaDev / FALLBACK_SIGMA_SMALL_PX);
      const finalW = Math.max(1, Math.round(devW / scale));
      const finalH = Math.max(1, Math.round(devH / scale));

      let srcCanvas = source;
      let srcW = devW;
      let srcH = devH;
      let useA = true;

      while (srcW > finalW * 2 && srcH > finalH * 2) {
        const nextW = Math.max(finalW, Math.round(srcW / 2));
        const nextH = Math.max(finalH, Math.round(srcH / 2));
        const mip = useA ? mipA : mipB;
        const mipCtx = useA ? mipACtx : mipBCtx;
        mip.width = nextW;
        mip.height = nextH;
        mipCtx.imageSmoothingEnabled = true;
        mipCtx.imageSmoothingQuality = 'high';
        mipCtx.clearRect(0, 0, nextW, nextH);
        mipCtx.drawImage(srcCanvas, 0, 0, srcW, srcH, 0, 0, nextW, nextH);
        srcCanvas = mip;
        srcW = nextW;
        srcH = nextH;
        useA = !useA;
      }

      blurScratch.width = finalW;
      blurScratch.height = finalH;
      blurScratchCtx.imageSmoothingEnabled = true;
      blurScratchCtx.imageSmoothingQuality = 'high';
      blurScratchCtx.clearRect(0, 0, finalW, finalH);
      blurScratchCtx.drawImage(srcCanvas, 0, 0, srcW, srcH, 0, 0, finalW, finalH);

      // The actual blur: convolution on the downscaled pixels, sigma
      // expressed in small-canvas units.
      const imageData = blurScratchCtx.getImageData(0, 0, finalW, finalH);
      blurPremultiplied(imageData, finalW, finalH, sigmaDev / scale);
      blurScratchCtx.putImageData(imageData, 0, 0);

      destCtx.imageSmoothingEnabled = true;
      destCtx.imageSmoothingQuality = 'high';
      destCtx.globalAlpha = alpha;
      destCtx.drawImage(blurScratch, 0, 0, finalW, finalH, 0, 0, devW, devH);
      destCtx.globalAlpha = 1;
    }

    // For each octave, stroke a wide, boosted-chroma, no-core line into the
    // shared scratch buffer, blur it via `drawBlurredOctave` as it's
    // composited into buffer B, ONCE, at that octave's own alpha (times
    // BLOOM_GAIN) -- see BLOOM_OCTAVES's own comment for why a stroke
    // width proportional to its own blur radius is what keeps this out of
    // the low, coarsely-quantized 8-bit range a thin line blurred wide
    // would otherwise land in, and why repeat-compositing (previous round)
    // made that problem worse rather than fixing it.
    function buildBufferBBloom() {
      const { cssW, cssH, dpr, cx, cy, radius } = geom;
      // ROUND 10: behavioral test, cached after the first call -- true on
      // every engine where `ctx.filter` demonstrably blurs `drawImage`
      // (Chrome/Firefox/desktop), false on real iOS Safari and under the
      // `?manualBloom` test override. See the comment at its definition.
      const filterWorks = canvasFilterBlursDrawImage();
      const devW = bufferA.width;
      const devH = bufferA.height;
      bufferB.width = devW;
      bufferB.height = devH;
      // Must come AFTER the width/height assignment above -- resizing a
      // canvas resets its whole context state, smoothing settings
      // included (see `measureAndResize`'s own comment on `ctx` for the
      // same issue, caught live this round).
      bufferBCtx.imageSmoothingEnabled = true;
      bufferBCtx.imageSmoothingQuality = 'high';
      bufferBCtx.setTransform(1, 0, 0, 1, 0, 0);
      bufferBCtx.clearRect(0, 0, devW, devH);
      bufferBCtx.globalCompositeOperation = 'lighter';

      const startRad = gToCanvasRad(RIM_LOWER_DEG);
      const endRad = gToCanvasRad(RIM_UPPER_DEG);

      // Scratch buffer allocated at the SAME full-DPR device resolution as
      // buffer A/B (devW x devH) -- never a downscaled buffer scaled back
      // up, which would itself be a second source of blockiness distinct
      // from the quantization bug this round actually fixes.
      octaveScratch.width = devW;
      octaveScratch.height = devH;

      for (const { blur, strokeWidth, alpha } of BLOOM_OCTAVES) {
        octaveScratchCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        octaveScratchCtx.clearRect(0, 0, cssW, cssH);
        const gradient = buildRimGradient(octaveScratchCtx, cx, cy, CHROMA_BOOST);
        octaveScratchCtx.lineCap = 'round';
        octaveScratchCtx.globalCompositeOperation = 'source-over';
        octaveScratchCtx.beginPath();
        octaveScratchCtx.arc(cx, cy, radius, startRad, endRad);
        octaveScratchCtx.lineWidth = strokeWidth;
        octaveScratchCtx.strokeStyle = gradient;
        octaveScratchCtx.globalAlpha = 1;
        octaveScratchCtx.stroke();
        octaveScratchCtx.globalAlpha = 1;
        // Deliberately no white-core pass -- see CHROMA_BOOST's comment.

        // Same fade as buffer A, applied here too (Ryan: "apply the same
        // fade to buffer A, buffer A2 and every bloom octave, so the halo
        // fades with the rim rather than outliving it") -- BEFORE the
        // blur below, so the faded edge itself gets softened by the same
        // blur as everything else in this octave, not left with its own
        // separate hard-ish edge.
        applyEdgeFade(octaveScratchCtx, cx, cy, cssW, cssH, radius);

        if (filterWorks) {
          // The original, full-fidelity path (restored verbatim in round
          // 10 from the pre-round-7 code): a true, analytically-computed
          // Gaussian blur applied by the engine itself during the
          // composite -- this is exactly the rendering desktop always had
          // through rounds 1-6, when it always looked right.
          bufferBCtx.filter = `blur(${blur * dpr}px)`;
          bufferBCtx.globalAlpha = alpha * BLOOM_GAIN;
          bufferBCtx.drawImage(octaveScratch, 0, 0);
        } else {
          drawBlurredOctave(bufferBCtx, octaveScratch, devW, devH, blur * dpr, alpha * BLOOM_GAIN);
        }
      }

      // COMPOSITE-MODE BUG (round 6, found by reading the code, not
      // guessed): this reset used to run AFTER the dither fillRect below,
      // so the dither was painted while `globalCompositeOperation` was
      // still 'lighter' (set above, for the additive octave stack) --
      // 'lighter' can only ADD alpha/brightness, never blend a pixel DOWN
      // toward a neighbor. Real anti-banding dither needs to nudge pixels
      // randomly both above and below a quantization threshold so a hard
      // level boundary scatters into speckle instead of a visible edge --
      // additive-only noise can't do that, it just washes a near-uniform
      // extra brightness over everything. This is almost certainly why
      // round 5 (raising DITHER_ALPHA 0.02 -> 0.05) made no visible
      // difference on a real device: the mechanism was never actually
      // dithering, just adding flat haze. Moved the reset here, before the
      // dither pass, so it blends with real (non-directional) alpha
      // compositing instead.
      bufferBCtx.globalCompositeOperation = 'source-over';
      // Same state-reset class of bug as the composite-mode one above
      // (round 6): the filter path leaves `bufferBCtx.filter` holding the
      // last octave's blur string -- it MUST be cleared before the dither
      // fillRect below, or the dither noise itself gets blurred into a
      // flat wash. No-op (and harmless) on the fallback path.
      bufferBCtx.filter = 'none';
      bufferBCtx.globalAlpha = DITHER_ALPHA;
      const pattern = bufferBCtx.createPattern(ditherTile, 'repeat');
      bufferBCtx.fillStyle = pattern;
      bufferBCtx.fillRect(0, 0, devW, devH);
      bufferBCtx.globalAlpha = 1;
    }

    // Path history: the original `buildBufferBStroke` fallback (gated on
    // the get/set string check `supportsCanvasFilter`) was removed in
    // round 7 -- that gate only proved iOS Safari RETAINS the filter
    // string, not that `drawImage` honors it, so Safari ran the "real"
    // path and silently produced unblurred rings. Round 7's answer (one
    // manual path everywhere) traded that bug for a measurable fidelity
    // loss on every browser (rounds 8-9). Round 10 reintroduced a fork,
    // but gated on `canvasFilterBlursDrawImage()` -- a test that runs the
    // actual operation and measures the pixels -- with `?manualBloom`
    // keeping the fallback executable in Chrome so it can never again be
    // a code path only real Safari ever exercises.
    function rebuildBuffers() {
      buildBufferA();
      buildBufferBBloom();
      hueBuckets = buildHueBuckets();
      sprites = buildParticleSprites(geom.dpr, hueBuckets);
    }

    // The ONE shared geometry calculation both canvases are sized and
    // drawn from -- see the file-top comment on the two-canvas split for
    // why this can't be two independent per-canvas calculations (any
    // drift between them would show up as a doubled/offset edge).
    function measureAndResize() {
      const rect = wrapper.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      // ARC-OVER-NAME FIX (build-log.md): ChromaContact.jsx's
      // `updateCrownY` mirrors this exact circle geometry (radius = the
      // section's width, cx = its midpoint) to compute how far the arc
      // drops below the crown at the Name field's x extent -- if the
      // radius/cx rule here ever changes, that calculation must change
      // with it (see the FIELD_CLEARANCE_PX comment there).
      const radius = cssW;
      const cy = (crownYRef.current ?? cssH * 0.33) + radius;
      const cx = cssW / 2;

      // ROUND 10: skip the rebuild when nothing geometric actually
      // changed. iOS fires `window.resize` on every toolbar
      // collapse/expand while scrolling -- and the contact section sits at
      // the bottom of the page, exactly where the toolbar animates -- but
      // the wrapper's own size (100svh-based) doesn't change with it. A
      // no-op rebuild used to be merely wasteful; on the fallback path it
      // is now a full-price JS convolution of all five octaves on the main
      // thread, on precisely the device (a real iPhone) that runs the
      // fallback. `cy` folds in crownY, so crownY remeasures still rebuild;
      // `cx`/`radius` derive from cssW, so these four comparisons cover
      // the whole geom object. The initial call always passes (geom starts
      // zeroed).
      if (cssW === geom.cssW && cssH === geom.cssH && dpr === geom.dpr && cy === geom.cy) return;

      geom = { cssW, cssH, dpr, cx, cy, radius };

      // Identical sizing applied to both canvases in one loop -- same
      // cssW/cssH/dpr, same transform, same smoothing settings -- rather
      // than duplicating this block once per canvas, which is exactly the
      // kind of copy-paste drift that could quietly desync them.
      for (const [canvasEl, canvasCtx] of [
        [bloomCanvas, bloomCtx],
        [rimCanvas, rimCtx],
      ]) {
        canvasEl.width = Math.max(1, Math.round(cssW * dpr));
        canvasEl.height = Math.max(1, Math.round(cssH * dpr));
        canvasEl.style.width = `${cssW}px`;
        canvasEl.style.height = `${cssH}px`;
        canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // Setting `.width`/`.height` (just above) resets the ENTIRE
        // context state, not just the transform -- including
        // imageSmoothingEnabled/Quality back to their defaults ('low'
        // quality). Caught live in the bloom-rebuild round: a one-time set
        // at effect setup was silently getting wiped by this exact resize
        // on every single call -- must be re-applied here, after the
        // resize, every time, not once at setup. Same fix applied to
        // `bufferBCtx` in `buildBufferBBloom`, which resizes buffer B
        // the same way.
        canvasCtx.imageSmoothingEnabled = true;
        canvasCtx.imageSmoothingQuality = 'high';
      }

      rebuildBuffers();
      // Bloom is static -- drawn once here, never again until the next
      // resize/crownY change. The rim canvas also gets one synchronous
      // draw here (not just left to the rAF loop) so there's a correct
      // frame on screen immediately, and so the reduced-motion path (which
      // never starts the loop at all) still shows the finished arc.
      drawBloomStatic();
      drawRimFrame();
    }

    function spawnParticle(gDeg) {
      let slot = null;
      for (let i = 0; i < pool.length; i++) {
        if (!pool[i].alive) {
          slot = pool[i];
          break;
        }
      }
      if (!slot) return; // pool exhausted -- cap holds, per spec

      const rad = gToCanvasRad(gDeg);
      const rx = Math.cos(rad);
      const ry = Math.sin(rad);
      const tx = -Math.sin(rad);
      const ty = Math.cos(rad);
      const jitter = () => (Math.random() - 0.5) * 0.6;

      slot.alive = true;
      slot.x = geom.cx + rx * geom.radius;
      slot.y = geom.cy + ry * geom.radius;
      slot.vx = rx * RADIAL_SPEED * (0.7 + Math.random() * 0.6) + tx * TANGENTIAL_SPEED * (0.7 + Math.random() * 0.6) + jitter() * 10;
      slot.vy = ry * RADIAL_SPEED * (0.7 + Math.random() * 0.6) + ty * TANGENTIAL_SPEED * (0.7 + Math.random() * 0.6) + jitter() * 10;
      slot.age = 0;
      slot.lifetime = 1.5 + Math.random() * 1.5;
      slot.size = 1 + Math.random() * 2;
      slot.bucketIndex = nearestBucketIndex(gDeg, hueBuckets);
    }

    function updateFlare(now, dtSec) {
      if (flare.state === 'gap') {
        if (now >= flare.stateEnd) {
          flare = {
            state: 'emitting',
            startTime: now,
            stateEnd: now + EMIT_DURATION_MS,
            offsetX: Math.random() * 1000,
            offsetY: Math.random() * 1000,
          };
          spawnAccumulator = 0;
        }
        return;
      }
      // emitting
      if (now >= flare.stateEnd) {
        flare = { state: 'gap', stateEnd: now + GAP_MIN_MS + Math.random() * (GAP_MAX_MS - GAP_MIN_MS) };
        return;
      }
      const progress = (now - flare.startTime) / EMIT_DURATION_MS;
      const gDeg = HUE_LOWER_DEG + progress * (HUE_UPPER_DEG - HUE_LOWER_DEG);
      spawnAccumulator += dtSec * SPAWN_PER_SECOND;
      while (spawnAccumulator >= 1) {
        spawnParticle(gDeg);
        spawnAccumulator -= 1;
      }
    }

    function updateParticles(now, dtSec) {
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.alive) continue;
        p.age += dtSec;
        if (p.age >= p.lifetime) {
          p.alive = false;
          continue;
        }
        const n = noise2D(p.x * NOISE_SPATIAL_SCALE + flare.offsetX, p.y * NOISE_SPATIAL_SCALE + flare.offsetY + now * NOISE_TIME_SCALE);
        const fieldAngle = n * Math.PI * 2;
        p.vx += Math.cos(fieldAngle) * NOISE_STEER_STRENGTH * dtSec;
        p.vy += Math.sin(fieldAngle) * NOISE_STEER_STRENGTH * dtSec;
        p.x += p.vx * dtSec;
        p.y += p.vy * dtSec;
      }
    }

    // Particles draw onto rimCanvas, above the scrim -- unaffected by its
    // dimming, per Ryan's spec ("particles stay on canvas 2... unaffected
    // by dimming").
    function drawParticles() {
      rimCtx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.alive) continue;
        const alpha = particleAlpha(p.age / p.lifetime);
        if (alpha <= 0) continue;
        rimCtx.globalAlpha = alpha;
        const sprite = sprites[p.bucketIndex];
        if (!sprite) continue;
        // Sprite source bitmap is pre-rendered larger (PARTICLE_SPRITE_PX)
        // for crisp downscaling; drawImage's destination size here is the
        // actual on-screen particle size (1-3 CSS px), independent of the
        // sprite's own source resolution -- `rimCtx` already carries the
        // DPR transform, so these are CSS-px units like everything else
        // drawn through it.
        rimCtx.drawImage(sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      rimCtx.globalAlpha = 1;
      rimCtx.globalCompositeOperation = 'source-over';
    }

    // Bloom canvas -- drawn ONLY from `measureAndResize` (resize, DPR
    // change, or a crownY update), never from the rAF loop. Buffer B
    // itself doesn't change frame to frame (only the particles do), so
    // redrawing this canvas every frame would have been pure waste even
    // before the split -- now it's structurally impossible to do so by
    // accident, since `loop()` below never calls this function at all.
    function drawBloomStatic() {
      bloomCtx.clearRect(0, 0, geom.cssW, geom.cssH);
      bloomCtx.drawImage(bufferB, 0, 0, geom.cssW, geom.cssH);
    }

    // Rim canvas -- the sharp arc (buffer A) plus every live particle.
    // This is the only per-frame draw in the whole component; called once
    // synchronously from `measureAndResize` (so there's a correct frame
    // immediately, and so reduced motion -- which never starts `loop` --
    // still shows the finished static arc) and then every tick of `loop`.
    function drawRimFrame() {
      rimCtx.clearRect(0, 0, geom.cssW, geom.cssH);
      rimCtx.drawImage(bufferA, 0, 0, geom.cssW, geom.cssH);
      if (!reducedMotion) drawParticles();
    }

    let rafId = 0;
    let lastTime = performance.now();
    function loop(now) {
      rafId = requestAnimationFrame(loop);
      if (!inViewRef.current) return;
      const dtSec = Math.min((now - lastTime) / 1000, 0.05); // clamp: avoid a huge step after a background pause
      lastTime = now;
      updateFlare(now, dtSec);
      updateParticles(now, dtSec);
      drawRimFrame(); // bloomCanvas is never touched here -- see drawBloomStatic's own comment
    }

    const resizeObserver = new ResizeObserver(measureAndResize);
    resizeObserver.observe(wrapper);
    window.addEventListener('resize', measureAndResize);

    // DPR-change watcher (e.g. window dragged to a different-DPI monitor)
    // -- devicePixelRatio itself isn't reactive, so MDN's own documented
    // pattern is a `matchMedia('(resolution: ...dppx)')` query that fires
    // once on change and must be re-registered with the new ratio.
    let dprQuery = null;
    function watchDpr() {
      const dpr = window.devicePixelRatio || 1;
      dprQuery = window.matchMedia(`(resolution: ${dpr}dppx)`);
      dprQuery.addEventListener('change', onDprChange);
    }
    function onDprChange() {
      dprQuery?.removeEventListener('change', onDprChange);
      measureAndResize();
      watchDpr();
    }
    watchDpr();

    measureAndResizeRef.current = measureAndResize;
    measureAndResize();

    if (!reducedMotion) {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureAndResize);
      dprQuery?.removeEventListener('change', onDprChange);
      measureAndResizeRef.current = () => {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <div ref={wrapperRef} className="chroma__canvas-wrapper" aria-hidden="true">
      {/* SAFARI STACKING FIX (build-log.md): `children` (the scrim, passed
          in by ChromaContact.jsx) now renders INSIDE this wrapper instead
          of as a sibling in ChromaContact.jsx's own markup. Stacking
          between all three is still z-index, not DOM order -- the scrim
          can render anywhere in this JSX and still sandwich correctly
          between the two canvases (index.css). The reason for moving it
          in here at all: this wrapper can now safely take its OWN
          explicit z-index (index.css), sealing bloom/scrim/rim into one
          real, unambiguous stacking context instead of relying on
          `position:absolute` + `z-index:auto` passing its children's
          z-index through to the wrapper's own parent -- a spec behavior
          Safari's canvas GPU-layer promotion was suspected of not
          honoring consistently, which is what let the rim canvas paint
          over `.chroma__content` on a real iPhone despite the z-index
          math already being correct on every other engine tested. */}
      <canvas ref={bloomCanvasRef} className="chroma__canvas chroma__canvas--bloom" />
      {children}
      <canvas ref={rimCanvasRef} className="chroma__canvas chroma__canvas--rim" />
    </div>
  );
}
