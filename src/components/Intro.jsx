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
      <Fade className="intro__statement">I design for people, and let the data settle the rest.</Fade>
      <div className="intro__lede">
        <Fade className="intro__p">
          Human-centered from the first sketch: decisions start from how people actually use a product &mdash;
          not opinions in a room &mdash; and get validated against real behavior. Clarity and accessibility are
          the starting point, not a final polish. And because I build what I design, it holds up in production,
          not just the mockup.
        </Fade>
      </div>
    </section>
  );
}
