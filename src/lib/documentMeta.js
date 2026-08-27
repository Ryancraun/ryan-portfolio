// WEB QUALITY AUDIT FIX (high priority #4): extends the existing per-route
// `document.title` pattern (CopiaCaseStudy.jsx already did this before this
// fix, Home.jsx did not) to also set `meta[name="description"]` per route,
// client-side. This does NOT by itself fix the raw-HTML crawlability
// problem (see finding #3 / scripts/prerender.mjs) -- a fetch/curl that
// never executes JS never sees this run. It's for the case where JS DOES
// execute: Google's second-wave render, a share sheet that runs JS, or an
// SPA-internal navigation where the tab's live state should reflect the
// current route even though index.html's static tags are for the home
// route by default.
const DEFAULT_TITLE = 'Ryan Craun | Product Design';
const DEFAULT_DESCRIPTION =
  'Ryan Craun, product designer. Selected work in consumer iOS, content platforms, and B2B SaaS / sports analytics, including Copia, a native iOS grocery app launching on the App Store, and Vault, a live ad-free gaming guide platform.';

function setMetaDescription(content) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setOgMeta(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

// Call from a route's `useEffect`. Returns a cleanup that restores the site
// default title/description, same lifecycle CopiaCaseStudy.jsx already used
// for `document.title` alone.
export function setDocumentMeta({ title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION } = {}) {
  document.title = title;
  setMetaDescription(description);
  setOgMeta('og:title', title);
  setOgMeta('og:description', description);

  return () => {
    document.title = DEFAULT_TITLE;
    setMetaDescription(DEFAULT_DESCRIPTION);
    setOgMeta('og:title', DEFAULT_TITLE);
    setOgMeta('og:description', DEFAULT_DESCRIPTION);
  };
}

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION };
