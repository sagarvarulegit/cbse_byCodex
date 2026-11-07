import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'ChapterReady: CBSE Class 10 Notes, PYQs & Mock Papers',
    short_name: 'ChapterReady',
    description:
      'Textbook-faithful CBSE Class 10 NCERT notes, 1,669+ PYQs & Exemplar questions, 20 free 80-mark mock papers, 3D Science Lab, and Tara AI tutor.',
    start_url: '/?utm_source=twa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fffdf8',
    theme_color: '#171513',
    categories: ['education', 'books', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Question Bank (PYQs)',
        short_name: 'PYQs',
        description: 'Practice 1,669+ CBSE Board PYQs & NCERT Exemplar questions',
        url: '/questions?utm_source=twa_shortcut',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Free 80-Mark Mock Papers',
        short_name: 'Mock Papers',
        description: '20 full-length CBSE Class 10 Board Mock Test Papers',
        url: '/exam-papers?utm_source=twa_shortcut',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Formula Cheatsheets',
        short_name: 'Formulas',
        description: '1-Page Maths & Science Formula & Reaction Sheets',
        url: '/formula-cheatsheets?utm_source=twa_shortcut',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
