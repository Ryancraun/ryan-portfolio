import { useScrollFade } from '@/hooks/useScrollFade';

function Fade({ as: Tag = 'p', className, children }) {
  const ref = useScrollFade();
  return (
    <Tag className={className} data-fade ref={ref}>
      {children}
    </Tag>
  );
}

export default function Intro() {
  return (
    <section className="intro" id="intro">
      <Fade className="intro__statement">I&rsquo;d rather ship and measure than polish a mockup.</Fade>
      <div className="intro__lede">
        <Fade className="intro__p">
          In Copia I took item counts off the list because one shopper misread them, then put them back weeks
          later when users told me I was wrong. Both versions shipped. Because I build what I design, the fix
          is days, not a sprint.
        </Fade>
      </div>
    </section>
  );
}
