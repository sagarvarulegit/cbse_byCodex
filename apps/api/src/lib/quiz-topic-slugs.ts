const PILOT_CHAPTER_WEAK_TOPIC_SLUGS: Record<string, string[]> = {
  'chemical-reactions-and-equations': [
    'chemical-equations',
    'balancing-equations',
    'combination-and-decomposition-reactions',
    'displacement-and-double-displacement-reactions',
    'oxidation-and-reduction',
  ],
  'real-numbers': [
    'euclid-division-lemma',
    'fundamental-theorem-of-arithmetic',
    'hcf-and-lcm-by-prime-factorisation',
    'irrational-numbers',
    'decimal-expansion-of-rational-numbers',
  ],
  'two-stories-about-flying': [
    'his-first-flight-fear-and-hunger',
    'his-first-flight-courage-and-family-pressure',
    'the-black-aeroplane-storm-and-mystery',
    'the-black-aeroplane-unknown-helper',
    'poems-wild-animals-and-the-ball-poem',
  ],
};

export function getAllowedWeakTopicSlugs(chapterSlug: string, chapterTopicSlugs: string[]) {
  return new Set([...chapterTopicSlugs, ...(PILOT_CHAPTER_WEAK_TOPIC_SLUGS[chapterSlug] ?? [])]);
}

export function findInvalidWeakTopicSlug(params: {
  chapterSlug: string;
  chapterTopicSlugs: string[];
  weakTopicSlugs: string[];
}) {
  const allowedWeakTopicSlugs = getAllowedWeakTopicSlugs(params.chapterSlug, params.chapterTopicSlugs);

  return params.weakTopicSlugs.find((weakTopicSlug) => !allowedWeakTopicSlugs.has(weakTopicSlug)) ?? null;
}
