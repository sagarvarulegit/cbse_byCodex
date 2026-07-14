'use client';

type StaticFigure = {
  alt: string;
  caption: string;
  eyebrow: string;
  src: string;
  title: string;
};

const STATIC_FIGURES: Record<string, StaticFigure> = {
  'figure-6-1-neuron-neuromuscular-junction': {
    alt: 'Platform redraw of NCERT Figure 6.1 showing the structure of a neuron and a neuromuscular junction with labels.',
    caption: 'Original platform redraw based on NCERT Figure 6.1',
    eyebrow: 'NCERT figure redraw',
    src: '/figures/figure-6-1-neuron-neuromuscular-junction-redraw.png',
    title: 'Neuron and neuromuscular junction',
  },
  'figure-6-2-reflex-arc': {
    alt: 'Platform redraw of NCERT Figure 6.2 showing the reflex arc from receptors in skin to the spinal cord and back to an effector muscle.',
    caption: 'Original platform redraw based on NCERT Figure 6.2',
    eyebrow: 'NCERT figure redraw',
    src: '/figures/figure-6-2-reflex-arc-redraw.png',
    title: 'Reflex arc',
  },
  'figure-6-3-human-brain': {
    alt: 'Platform redraw of NCERT Figure 6.3 showing the human brain with cerebrum, cranium, mid-brain, hypothalamus, pituitary gland, pons, medulla, cerebellum, and spinal cord.',
    caption: 'Original platform redraw based on NCERT Figure 6.3',
    eyebrow: 'NCERT figure redraw',
    src: '/figures/figure-6-3-human-brain-redraw.png',
    title: 'Human brain',
  },
  'figure-6-4-sensitive-plant': {
    alt: 'NCERT Figure 6.4 source image showing the sensitive plant before and after its leaves fold when touched.',
    caption: 'Figure 6.4: The sensitive plant',
    eyebrow: 'NCERT source figure',
    src: '/figures/figure-6-4-sensitive-plant-source.png',
    title: 'Sensitive plant',
  },
};

export function hasStaticFigureDemo(demoId: string) {
  return demoId in STATIC_FIGURES;
}

export default function StaticFigureDemo({ demoId }: { demoId: string }) {
  const figure = STATIC_FIGURES[demoId];

  if (!figure) {
    return null;
  }

  return (
    <figure className="static-figure-card">
      <div className="static-figure-header">
        <div>
          <p className="eyebrow">{figure.eyebrow}</p>
          <h4>{figure.title}</h4>
        </div>
      </div>
      <div className="static-figure-frame">
        <img alt={figure.alt} decoding="async" loading="lazy" src={figure.src} />
      </div>
      <figcaption>{figure.caption}</figcaption>
    </figure>
  );
}
