import Link from 'next/link';

import type { SubjectCatalogItem } from '../lib/curriculum/subject-navigation';

export default function SyllabusLibraryGrid({
  subjects,
}: {
  subjects: SubjectCatalogItem[];
}) {
  return (
    <div className="syllabus-library-grid" aria-label="Class 10 subject coverage">
      {subjects.map((subject) => (
        <article className="syllabus-library-item" key={subject.slug}>
          <div className="syllabus-library-topline">
            <span>Code {subject.subjectCode}</span>
            <strong>
              {subject.availableCount > 0
                ? `${subject.availableCount} available`
                : 'Coming soon'}
            </strong>
          </div>
          <h3>{subject.title}</h3>
          <p>{subject.description}</p>
          <div className="syllabus-library-counts">
            <span>{subject.chapterCount} syllabus chapters</span>
            <span>{subject.lessonWiseCount} lesson-wise</span>
            <span>{subject.revisionPackCount} revision packs</span>
          </div>
          <Link className="card-link" href={`/subjects/${subject.slug}`}>
            View chapter coverage
          </Link>
        </article>
      ))}
    </div>
  );
}
