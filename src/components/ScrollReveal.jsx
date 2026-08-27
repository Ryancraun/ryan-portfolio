import { useScrollFade } from '@/hooks/useScrollFade';

// Generic version of Intro.jsx's local `Fade` -- reuses the exact same
// `useScrollFade` hook/`[data-fade]`/`.is-visible` mechanism already proven
// on the home page, so the case-study page's "a little restrained motion"
// (scroll-reveal on section entry, per the task's own instruction) is the
// SAME system already on the site, not a second competing one.
export default function ScrollReveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useScrollFade();
  // `cs-reveal` is its OWN class (not the bare `[data-fade]` attribute
  // selector Intro.jsx's rules key off) specifically so its base/visible
  // opacity rules (index.css, Copia case-study section) can never collide
  // with `.intro__statement`/`.intro__p`'s own opacity values via selector
  // specificity/source-order -- two independent rule sets sharing only the
  // same JS toggle mechanism (`.is-visible`), not the same CSS selector.
  return (
    <Tag className={`cs-reveal ${className}`} data-fade ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
