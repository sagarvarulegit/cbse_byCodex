import React from 'react';
import Link from 'next/link';

import QuizArenaClient, { type ChapterQuizCardItem } from '../../components/QuizArenaClient';
import StudentTopbar from '../../components/StudentTopbar';
import {
  getStudentSession,
  getStudentSessionToken,
} from '../../lib/auth';
import { getChapterEntries } from '../../lib/course-content';
import { getVisibleCurriculumSubjects } from '../../lib/curriculum/registry';
import { getStudentMastery } from '../../lib/mastery';
import {
  checkHasUnlimitedQuizzes,
  fetchStudentEntitlements,
} from '../../lib/payments';

import { getExemplarCountForChapter } from '../../lib/exemplar';

const INDIA_TIME_ZONE = 'Asia/Kolkata';

function getTodayIndiaDateString(): string {
  const parts = new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: '2-digit',
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric',
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export default async function QuizzesPage() {
  const [session, token, mastery] = await Promise.all([
    getStudentSession(),
    getStudentSessionToken(),
    getStudentMastery(),
  ]);

  const entitlements = token ? await fetchStudentEntitlements(token) : null;
  const hasUnlimited = checkHasUnlimitedQuizzes(entitlements);

  const todayStr = getTodayIndiaDateString();

  // Compute daily quizzes taken today
  const dailyQuizzesTakenToday = mastery.masteries.filter((m) => {
    if (!m.lastActivityAt) return false;
    const itemDate = new Intl.DateTimeFormat('en', {
      day: '2-digit',
      month: '2-digit',
      timeZone: INDIA_TIME_ZONE,
      year: 'numeric',
    }).formatToParts(new Date(m.lastActivityAt));
    const vals = Object.fromEntries(
      itemDate
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, part.value]),
    );
    const formatted = `${vals.year}-${vals.month}-${vals.day}`;
    return formatted === todayStr;
  }).length;

  const subjects = getVisibleCurriculumSubjects();
  const chapterEntries = getChapterEntries();
  const chapterEntryMap = new Map(chapterEntries);
  const masteryMap = new Map(mastery.masteries.map((m) => [m.chapterSlug, m]));

  // Core Class 10 subjects (Mathematics Standard and Basic share the identical 14 NCERT chapters)
  const targetSubjectConfigs = [
    {
      curriculumSlug: 'science',
      slug: 'science',
      title: 'Science',
      code: '086',
      icon: '🔬',
    },
    {
      curriculumSlug: 'mathematics-standard',
      slug: 'mathematics',
      title: 'Mathematics',
      code: '041 / 241',
      icon: '📐',
    },
    {
      curriculumSlug: 'social-science',
      slug: 'social-science',
      title: 'Social Science',
      code: '087',
      icon: '🌍',
    },
    {
      curriculumSlug: 'english-language-and-literature',
      slug: 'english-language-and-literature',
      title: 'English Language & Literature',
      code: '184',
      icon: '📚',
    },
  ];

  const chapterItems: ChapterQuizCardItem[] = [];
  const seenSlugs = new Set<string>();

  for (const config of targetSubjectConfigs) {
    const subject = subjects.find((s) => s.slug === config.curriculumSlug);
    if (!subject) continue;

    for (const unit of subject.units) {
      for (const curriculumChapter of unit.chapters) {
        if (curriculumChapter.scope === 'excluded') continue;

        for (const chapterSlug of curriculumChapter.platformChapterSlugs) {
          if (seenSlugs.has(chapterSlug)) continue;
          seenSlugs.add(chapterSlug);

          const chapterEntry = chapterEntryMap.get(chapterSlug);
          if (!chapterEntry) continue;

          const chapterMastery = masteryMap.get(chapterSlug);
          const exemplarCount = getExemplarCountForChapter(chapterSlug);

          let unitTitle = unit.title;
          const unitMarks = unit.marks;

          // Provide clean sub-unit organization for English literature & language
          if (subject.slug === 'english-language-and-literature') {
            if (curriculumChapter.id.startsWith('prose-')) {
              unitTitle = 'First Flight: Prose & Drama';
            } else if (curriculumChapter.id.startsWith('poem-')) {
              unitTitle = 'First Flight: Poetry';
            } else if (curriculumChapter.id.startsWith('supplementary-')) {
              unitTitle = 'Footprints Without Feet: Supplementary Reader';
            } else if (unit.id === 'reading') {
              unitTitle = 'Reading Comprehension';
            } else if (unit.id === 'writing-and-grammar') {
              unitTitle = 'Writing Skills & Grammar';
            } else if (unit.id === 'words-and-expressions-2') {
              unitTitle = 'Words & Expressions - II (Workbook)';
            }
          }

          chapterItems.push({
            slug: chapterSlug,
            title: chapterEntry.title,
            subjectSlug: config.slug,
            subjectTitle: config.title,
            subjectCode: config.code,
            unitId: unit.id,
            unitTitle,
            unitMarks,
            questionCount: 10,
            exemplarQuestionCount: exemplarCount,
            bestScorePercent: chapterMastery?.bestQuizScorePercent ?? 0,
            masteryScore: chapterMastery?.masteryScore ?? 0,
          });
        }
      }
    }
  }

  return (
    <main>
      <StudentTopbar contextLabel="Quiz Arena" session={session} />
      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href={session ? '/dashboard' : '/'}>{session ? 'Dashboard' : 'Home'}</Link>
            <span>/</span>
            <span aria-current="page">Quiz Arena &amp; Challenges</span>
          </nav>

          <QuizArenaClient
            chapters={chapterItems}
            hasUnlimitedQuizzes={hasUnlimited}
            dailyQuizzesTakenToday={dailyQuizzesTakenToday}
            token={token}
            userFullName={session?.fullName ?? 'Student'}
            userEmail={session?.email ?? undefined}
          />
        </div>
      </section>
    </main>
  );
}
