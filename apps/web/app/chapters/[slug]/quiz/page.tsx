import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getQuizContent } from '../../../lib/course-content';

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quizContent = await getQuizContent(slug);

  if (!quizContent) {
    notFound();
  }

  // Simple rendering – replace with markdown renderer as needed
  return (
    <main className="section-shell">
      <h1>Quiz – {slug}</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{quizContent}</pre>
      <Link className="button-link" href={`/chapters/${slug}`}>Back to chapter</Link>
    </main>
  );
}
