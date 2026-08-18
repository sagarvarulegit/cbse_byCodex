import { notFound } from 'next/navigation';

import PrintableExamPaper from '../../../../components/PrintableExamPaper';
import {
  getStudentSessionToken,
  requireStudentSession,
} from '../../../../lib/auth';
import { getExamPaper } from '../../../../lib/exam-papers';

export default async function ExamPaperPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const { mode } = await searchParams;
  await requireStudentSession();
  const token = await getStudentSessionToken();
  const data = await getExamPaper(token, id);

  if (!data?.paper) {
    notFound();
  }

  const initialMode = mode === 'solutions' ? 'solutions' : 'questions';

  const titleLower = data.paper.title.toLowerCase();
  let subjectTitle = 'Mathematics (Standard)';
  let subjectCode = '041';

  if (titleLower.includes('social')) {
    subjectTitle = 'Social Science';
    subjectCode = '087';
  } else if (titleLower.includes('science')) {
    subjectTitle = 'Science';
    subjectCode = '086';
  } else if (titleLower.includes('english')) {
    subjectTitle = 'English Language and Literature';
    subjectCode = '184';
  }

  return (
    <PrintableExamPaper
      paper={data.paper}
      initialMode={initialMode}
      subjectTitle={subjectTitle}
      subjectCode={subjectCode}
    />
  );
}
