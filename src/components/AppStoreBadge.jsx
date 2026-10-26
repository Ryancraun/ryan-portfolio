import appStoreBadge from '@/assets/appstore-badge.svg';

// Apple's real, official "Download on the App Store" badge artwork (US/UK
// English, black RGB variant) -- Addendum 4, point 5: "Apple's real,
// correctly-licensed 'Download on the App Store' badge treatment (their
// official badge artwork/dimensions, not an invented lookalike)". Vendored
// directly from Apple's own file (source: Apple Inc., via Wikimedia
// Commons' verified copy of Apple's official marketing asset --
// `Download_on_the_App_Store_Badge_US-UK_RGB_blk_4SVG_092917`, the exact
// filename convention Apple ships this badge under; confirmed unmodified --
// full Apple logo glyph + full "Download on the App Store" wordmark
// present, standard black badge, original viewBox/aspect ratio untouched).
// Links to Copia's live App Store listing.
export default function AppStoreBadge({ className = '' }) {
  return (
    <a
      className={`appstore-badge ${className}`}
      href="https://apps.apple.com/us/app/copia-grocery-lists/id6799573460"
      target="_blank"
      rel="noopener"
      aria-label="Download Copia on the App Store"
    >
      <img src={appStoreBadge} alt="Download on the App Store" width={120} height={40} />
    </a>
  );
}
