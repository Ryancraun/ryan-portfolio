import { Outlet } from 'react-router-dom';
import LoadWash from '@/components/LoadWash';
import ScrollProgress from '@/components/ScrollProgress';
import SiteNav from '@/components/SiteNav';
import CustomCursor from '@/components/CustomCursor';
import GlassScrollbar from '@/components/GlassScrollbar';
import ScrollToTop from './ScrollToTop';

// Persistent app chrome, mounted once for the whole app lifetime regardless
// of which route is active -- moved out of App.jsx (now Home.jsx) so a
// route change (e.g. into /work/copia) never remounts LoadWash (the one
// capped, non-repeating personal touch would replay on every navigation if
// it lived inside a per-route component instead), ScrollProgress, SiteNav,
// or CustomCursor.
export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <LoadWash />
      <ScrollProgress />
      <SiteNav />
      <CustomCursor />
      <GlassScrollbar />
      <Outlet />
    </>
  );
}
