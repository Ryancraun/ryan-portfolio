import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router does not reset scroll position on navigation. Without this,
// clicking the Copia teaser's CTA (which sits ~2 viewport-heights down the
// home page's card stack) would land the visitor mid-case-study, and going
// "back to work" would land them wherever the card stack last scrolled to
// rather than at the top of the case study. Runs on every pathname change,
// including the initial mount.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
