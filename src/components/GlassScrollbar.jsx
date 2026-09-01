import { useEffect, useRef } from 'react';

// Custom overlay scrollbar. The native scrollbar is hidden in index.css; this
// draws a real glass thumb on the right edge whose height/position mirror the
// page scroll. It never intercepts scrolling itself -- wheel, trackpad,
// keyboard and drag-on-thumb all work -- so hiding the native bar loses nothing
// but the (unstyleable) default look. Purely decorative, so aria-hidden.
//
// Position is written straight to the DOM inside a rAF (not React state) so a
// fast scroll doesn't trigger a re-render every frame. Skips touch/coarse
// devices, where the native overlay bar is already fine and a custom one feels
// off.
export default function GlassScrollbar() {
  const rootRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const root = rootRef.current;
    const thumb = thumbRef.current;
    if (!root || !thumb) return;

    let raf = 0;
    const MIN_THUMB = 44;

    const measure = () => {
      raf = 0;
      const scrollH = document.documentElement.scrollHeight;
      const clientH = window.innerHeight;
      // Nothing to scroll -> hide the thumb entirely.
      if (scrollH <= clientH + 1) {
        root.style.display = 'none';
        return;
      }
      root.style.display = '';
      const trackH = clientH;
      const thumbH = Math.max(MIN_THUMB, (clientH / scrollH) * trackH);
      const maxTop = trackH - thumbH;
      const range = scrollH - clientH;
      const top = range > 0 ? (window.scrollY / range) * maxTop : 0;
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translateY(${top}px)`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);

    // Drag the thumb to scroll.
    const onPointerDown = (event) => {
      // Intentionally NOT calling event.preventDefault() here: preventDefault
      // on pointerdown suppresses the compatibility mouse events, which would
      // freeze the site's CustomCursor (it tracks `mousemove`) for the whole
      // drag -- the cursor would stick where it was grabbed. Text selection is
      // prevented by userSelect:none below instead.
      const startY = event.clientY;
      const startScroll = window.scrollY;
      const clientH = window.innerHeight;
      const scrollH = document.documentElement.scrollHeight;
      const thumbH = thumb.offsetHeight;
      const maxTop = clientH - thumbH;
      const range = scrollH - clientH;
      document.body.style.userSelect = 'none';

      const onMove = (moveEvent) => {
        const dy = moveEvent.clientY - startY;
        const next = maxTop > 0 ? startScroll + (dy / maxTop) * range : startScroll;
        window.scrollTo(0, next);
      };
      const onUp = () => {
        document.body.style.userSelect = '';
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };
    thumb.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      thumb.removeEventListener('pointerdown', onPointerDown);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="glass-scrollbar" ref={rootRef} aria-hidden="true">
      <div className="glass-scrollbar__thumb" ref={thumbRef} />
    </div>
  );
}
