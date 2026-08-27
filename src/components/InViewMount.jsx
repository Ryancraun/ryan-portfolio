import { useInView } from '@/hooks/useInView';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Mounts `children` (a live reactbits.dev canvas/WebGL background) only
// while its container is on screen or about to be, and never mounts it at
// all under prefers-reduced-motion -- `fallback` (a plain CSS surface)
// renders in both of those cases instead. This is what keeps 6 real,
// continuously-animating reactbits components on one page from all running
// at once on a phone.
export default function InViewMount({ children, fallback = null, rootMargin = '200px 0px', className }) {
  const [ref, inView] = useInView({ rootMargin });
  const reduced = usePrefersReducedMotion();
  const mount = inView && !reduced;

  return (
    <div ref={ref} className={className} style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
      {fallback}
      {mount ? children : null}
    </div>
  );
}
