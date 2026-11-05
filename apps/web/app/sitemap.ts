import type { MetadataRoute } from 'next';
import { getAllSeoQuestionSlugs } from '../lib/seo-questions';
import { getChapterEntries } from '../lib/course-content';

const BASE_URL = 'https://www.chapterready.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Static key landing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/questions`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/exam-papers`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pitch`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Chapter Hubs & Revision routes
  const chapters = getChapterEntries();
  const chapterRoutes: MetadataRoute.Sitemap = chapters.flatMap(([slug]) => [
    {
      url: `${BASE_URL}/chapters/${slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/chapters/${slug}/revision`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/chapters/${slug}/quiz`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]);

  // Programmatic Question Detail Pages (Exemplar HOTS + 2022-2026 PYQs)
  const questionSlugs = getAllSeoQuestionSlugs();
  const questionRoutes: MetadataRoute.Sitemap = questionSlugs.map((slug) => ({
    url: `${BASE_URL}/questions/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...chapterRoutes, ...questionRoutes];
}
