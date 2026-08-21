import React from 'react';
import ClientStudentTopbar from '../../components/ClientStudentTopbar';
import GamesArcadeHub from '../../components/games/GamesArcadeHub';

export const revalidate = false;

export const metadata = {
  title: 'Fun & Games Arcade | CBSE Class 10 Learning Platform',
  description: 'Gamified CBSE Class 10 revision games based 100% on NCERT textbooks. Formula drills, puzzles, and quick quizzes.',
};

export default function GamesPage() {
  return (
    <div className="arcade-page-wrapper">
      <ClientStudentTopbar
        contextLabel="🎮 Fun &amp; Games Arcade"
      />
      <main className="arcade-main-container">
        <GamesArcadeHub />
      </main>
    </div>
  );
}
