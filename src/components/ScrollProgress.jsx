import { useRef } from 'react';
import { useScrollDriver } from '@/hooks/useScrollDriver';

export default function ScrollProgress() {
  const barRef = useRef(null);

  useScrollDriver((y) => {
    const bar = barRef.current;
    if (!bar) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    bar.style.transform = `scaleX(${progress})`;
  });

  return <div className="progress" ref={barRef} aria-hidden="true" />;
}
