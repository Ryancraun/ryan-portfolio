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
      <Fade className="intro__statement">Real use is messier than the demo.</Fade>
      <div className="intro__lede">
        <Fade className="intro__p">
          People use software with one hand, in bad lighting, halfway through something else. My work lives there:
          the grocery run, the stuck boss fight, the bet placed before the line moves.
        </Fade>
      </div>
    </section>
  );
}
