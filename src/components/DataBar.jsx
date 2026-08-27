import { useInView } from '@/hooks/useInView';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// One labeled horizontal bar -- label / track+fill / value -- reused
// wherever a case study needs to compare a handful of real numbers at a
// glance (a guide-by-guide CTR comparison, a device-split breakdown) One
// component, one visual language, instead of a one-off chart per section --
// consistency here is itself part of "purposefully designed" rather than
// improvised per-instance.
//
// `pct` is the bar's fill width (0-100). For an absolute share of a whole
// (a device split that sums to ~100%) pass the real percentage directly.
// For a comparison between independent values with no shared total (a
// CTR-by-guide ranking), normalize the caller's own values against the
// group's max before passing `pct` in, so the highest bar in the group
// reads as full and the rest read proportionally -- this component only
// draws the width it's given, it doesn't infer a scale.
export default function DataBar({ label, valueLabel, pct, highlight = false }) {
  const [ref, inView] = useInView({ once: true, rootMargin: '0px' });
  const reducedMotion = usePrefersReducedMotion();
  const width = inView || reducedMotion ? `${Math.max(0, Math.min(100, pct))}%` : '0%';

  return (
    <div className={`data-bar${highlight ? ' data-bar--highlight' : ''}`} ref={ref}>
      <span className="data-bar__label">{label}</span>
      <span className="data-bar__track">
        <span className="data-bar__fill" style={{ width }} />
      </span>
      <span className="data-bar__value">{valueLabel}</span>
    </div>
  );
}
