import Link from 'next/link';

import BrandLockup from '../../components/BrandLockup';
import {
  getPrivacyContactEmail,
  PILOT_PRIVACY_NOTICE_VERSION,
} from '../../lib/privacy';

export const metadata = {
  title: 'Pilot Privacy Notice',
  description:
    'How ChapterReady handles student, guardian, learning-progress, and pilot-feedback data.',
};

export default function PrivacyPage() {
  const contactEmail = getPrivacyContactEmail();

  return (
    <main className="privacy-page">
      <nav aria-label="Privacy page navigation" className="privacy-nav">
        <Link className="brand" href="/">
          <BrandLockup />
        </Link>
        <Link className="ghost-link" href="/register">
          Create account
        </Link>
      </nav>

      <header className="privacy-hero">
        <p className="eyebrow">Student and guardian information</p>
        <h1>Pilot Privacy Notice</h1>
        <p>
          This notice explains the small amount of information used to run the
          controlled Class 10 learning pilot. Version {PILOT_PRIVACY_NOTICE_VERSION}.
        </p>
      </header>

      <div className="privacy-content">
        <section>
          <h2>Government Non-Affiliation Disclaimer &amp; Official Curriculum Sources</h2>
          <p>
            <strong>Disclaimer:</strong> ChapterReady is an independent private educational platform and does <strong>not</strong> represent, endorse, or have any affiliation with the Central Board of Secondary Education (CBSE), the National Council of Educational Research and Training (NCERT), the Ministry of Education, or any government entity.
          </p>
          <p>
            All public curriculum structure, rationalized Class 10 syllabus references, textbook chapters, exemplar problems, and past board examination papers referenced on this platform are sourced from publicly available official government educational portals:
          </p>
          <ul>
            <li>
              <strong>Central Board of Secondary Education (CBSE):</strong>{' '}
              <a href="https://www.cbse.gov.in" target="_blank" rel="noopener noreferrer">https://www.cbse.gov.in</a>
            </li>
            <li>
              <strong>CBSE Academic (Syllabus, Sample Question Papers &amp; Marking Schemes):</strong>{' '}
              <a href="https://cbseacademic.nic.in" target="_blank" rel="noopener noreferrer">https://cbseacademic.nic.in</a>
            </li>
            <li>
              <strong>National Council of Educational Research and Training (NCERT Textbooks &amp; Exemplar):</strong>{' '}
              <a href="https://ncert.nic.in" target="_blank" rel="noopener noreferrer">https://ncert.nic.in</a>
            </li>
          </ul>
        </section>
        <section>
          <h2>What we collect</h2>
          <ul>
            <li>Student name, email, class level, and encrypted password.</li>
            <li>
              Guardian name, guardian email, relationship, consent timestamp,
              notice version, and self-attestation status.
            </li>
            <li>
              Learning activity such as chapter opens, lesson completion,
              quiz scores and selected answers, structured practice scores,
              hints used, missed marking-point ids, retry dates, streaks, and badges.
            </li>
            <li>
              Feedback submitted by the student and technical logs needed to
              keep the service secure and working.
            </li>
          </ul>
          <p>
            Written-practice answer text and guided-practice draft text stay in
            the student&apos;s browser and are not sent to the account database.
            Only structured self-check evidence is saved. The pilot does not ask for a
            school name, government identity number, payment details, or a
            public student profile.
          </p>
        </section>

        <section>
          <h2>Why we use it</h2>
          <ul>
            <li>Create and protect the student account.</li>
            <li>Save learning progress and return the student to useful work.</li>
            <li>Find confusing lessons, broken flows, and weak quiz topics.</li>
            <li>Review the pilot before access is widened.</li>
          </ul>
          <p>
            We do not sell student data, run targeted advertising, or create
            public rankings from pilot activity.
          </p>
        </section>

        <section>
          <h2>Guardian permission</h2>
          <p>
            A parent or lawful guardian must complete the permission section
            during registration. The MVP stores a self-attestation and the
            notice version accepted. It does not verify identity or age through
            DigiLocker, Aadhaar, or another government identity source.
          </p>
          <p>
            This flow supports a small supervised pilot. It must not be
            described as full legal verification, and it should receive a
            compliance review before unrestricted public onboarding.
          </p>
        </section>

        <section>
          <h2>Service providers and retention</h2>
          <p>
            The web apps and API are hosted on Vercel. Account and progress
            records are stored in PostgreSQL through Supabase. Bunny Stream may
            deliver lesson video. These providers process technical request
            data as needed to deliver their part of the service.
          </p>
          <p>
            Pilot records are kept while the account is active and while they
            are needed to review the pilot, secure the service, or meet an
            applicable record-keeping requirement. A student or guardian may
            ask for correction, consent withdrawal, or account deletion.
          </p>
        </section>

        <section className="privacy-contact">
          <h2>Questions or requests</h2>
          {contactEmail ? (
            <p>
              Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> for
              privacy questions, correction, consent withdrawal, or deletion.
            </p>
          ) : (
            <p>
              Use the contact details in the pilot invitation to ask the pilot
              coordinator for access, correction, consent withdrawal, or
              deletion. A dedicated privacy email must be configured before
              unrestricted public onboarding.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
