import React from 'react';
import Link from 'next/link';

import QuizArenaClient, { type ChapterQuizCardItem } from '../../components/QuizArenaClient';
import StudentTopbar from '../../components/StudentTopbar';
import {
  getStudentSessionToken,
  requireStudentSession,
} from '../../lib/auth';
import { getChapterEntries } from '../../lib/course-content';
import { getVisibleCurriculumSubjects } from '../../lib/curriculum/registry';
import {
  buildCurriculumChapterCards,
  buildSubjectCatalog,
} from '../../lib/curriculum/subject-navigation';
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
    requireStudentSession(),
    getStudentSessionToken(),
    getStudentMastery(),
  ]);

  const entitlements = await fetchStudentEntitlements(token);
  const hasUnlimited = checkHasUnlimitedQuizzes(entitlements);

  const subjectCatalog = buildSubjectCatalog(
    getVisibleCurriculumSubjects(),
    getChapterEntries(),
  );

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

  // Build chapter quiz card items
  const chapterItems: ChapterQuizCardItem[] = [];
  const masteryMap = new Map(mastery.masteries.map((m) => [m.chapterSlug, m]));

  for (const subject of subjects) {
    // Focus on the core Class 10 subjects
    if (
      ![
        'mathematics-standard',
        'mathematics-basic',
        'science',
        'social-science',
        'english-language-and-literature',
      ].includes(subject.slug)
    ) {
      continue;
    }

    const cards = buildCurriculumChapterCards(subject, chapterEntries);
    for (const card of cards) {
      const chapterMastery = masteryMap.get(card.chapterSlug);
      const exemplarCount = getExemplarCountForChapter(card.chapterSlug);

      chapterItems.push({
        slug: card.chapterSlug,
        title: card.content.title,
        subjectSlug: subject.slug,
        subjectTitle: subject.title,
        subjectCode: subject.subjectCode,
        questionCount: 10,
        exemplarQuestionCount: exemplarCount,
        bestScorePercent: chapterMastery?.bestQuizScorePercent ?? 0,
        masteryScore: chapterMastery?.masteryScore ?? 0,
      });
    }
  }

  return (
    <main>
      <StudentTopbar contextLabel="Quiz Arena" session={session} />
      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <span aria-current="page">Quiz Arena &amp; Challenges</span>
          </nav>

          <QuizArenaClient
            chapters={chapterItems}
            hasUnlimitedQuizzes={hasUnlimited}
            dailyQuizzesTakenToday={dailyQuizzesTakenToday}
            token={token}
            userFullName={session.fullName}
            userEmail={session.email || undefined}
          />
        </div>
      </section>
    </main>
  );
}
