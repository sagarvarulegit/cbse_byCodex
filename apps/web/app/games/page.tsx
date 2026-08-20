import React from 'react';
import StudentTopbar from '../../components/StudentTopbar';
import GamesArcadeHub from '../../components/games/GamesArcadeHub';
import { getStudentSession } from '../../lib/auth';

export const metadata = {
  title: 'Fun & Games Arcade | CBSE Class 10 Learning Platform',
  description: 'Gamified CBSE Class 10 revision games based 100% on NCERT textbooks. Formula drills, puzzles, and quick quizzes.',
};

export default async function GamesPage() {
  const session = await getStudentSession();

  return (
    <div className="arcade-page-wrapper">
      <StudentTopbar
        contextLabel="🎮 Fun &amp; Games Arcade"
        session={session}
      />
      <main className="arcade-main-container">
        <GamesArcadeHub userFullName={session?.fullName} />
      </main>
    </div>
  );
}
