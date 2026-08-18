'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { SessionUser } from '../lib/auth';
import {
  updateStudentProfile,
  type StudentProfileDetails,
} from '../lib/profile';

export type ProfileSettingsViewProps = {
  session: SessionUser;
  token: string;
  initialProfile: StudentProfileDetails;
};

export default function ProfileSettingsView({
  session,
  token,
  initialProfile,
}: ProfileSettingsViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfileDetails>(initialProfile);

  // Form states
  const [fullName, setFullName] = useState(initialProfile.fullName || '');
  const [phone, setPhone] = useState(initialProfile.phone ? initialProfile.phone.replace(/^\+91/, '') : '');
  const [schoolName, setSchoolName] = useState(initialProfile.schoolName || '');
  const [targetExamYear, setTargetExamYear] = useState<number>(initialProfile.targetExamYear || 2026);
  const [guardianFullName, setGuardianFullName] = useState(initialProfile.guardianFullName || '');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate phone number if provided
    const cleanPhone = phone.trim();
    if (cleanPhone && cleanPhone.replace(/[^\d]/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await updateStudentProfile(token, {
        fullName,
        phone: cleanPhone || undefined,
        schoolName: schoolName || undefined,
        targetExamYear,
        guardianFullName: guardianFullName || undefined,
      });

      if (res.success) {
        setProfile(res.profile);
        setSuccessMessage('Profile and mobile phone number updated successfully! 🎉');
        setTimeout(() => {
          router.refresh();
        }, 1500);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <Link href="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <p className="eyebrow">Account Settings</p>
        <h1>Student Profile &amp; Contact Details</h1>
        <p className="subtext">
          Manage your registered contact information, mobile phone number, school details, and guardian consent records.
        </p>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="profile-alert error" role="alert">
          <span>⚠️</span> {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="profile-alert success" role="status">
          <span>✓</span> {successMessage}
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="profile-form-grid">
        {/* Card 1: Personal & Contact Details */}
        <section className="settings-card">
          <div className="card-header">
            <span className="card-icon">📱</span>
            <div>
              <h3>Personal &amp; Contact Information</h3>
              <p>Your primary student identification and mobile phone number.</p>
            </div>
          </div>

          <div className="fields-stack">
            <label className="field-group">
              <span>Student Full Name</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sagar Varule"
                required
              />
            </label>

            <label className="field-group">
              <span>Mobile Phone Number</span>
              <div className="phone-input-wrap">
                <span className="phone-prefix">🇮🇳 +91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                  placeholder="9876543210"
                />
              </div>
              <span className="field-hint">
                Adding your 10-digit mobile number enables instant account recovery by phone and SMS OTP support.
              </span>
            </label>

            <label className="field-group">
              <span>Registered Email Address</span>
              <div className="readonly-input-wrap">
                <input
                  type="email"
                  value={profile.email || ''}
                  disabled
                  className="input-disabled"
                />
                <span className="verified-badge">✓ Primary Login</span>
              </div>
              <span className="field-hint">
                Your email is used for login authentication and receiving recovery verification codes.
              </span>
            </label>
          </div>
        </section>

        {/* Card 2: Academic & School Profile */}
        <section className="settings-card">
          <div className="card-header">
            <span className="card-icon">🎓</span>
            <div>
              <h3>Academic Profile</h3>
              <p>Your CBSE Class 10 board curriculum target.</p>
            </div>
          </div>

          <div className="fields-stack">
            <label className="field-group">
              <span>Class Level</span>
              <input
                type="text"
                value={`Class ${profile.classLevel} (CBSE Secondary)`}
                disabled
                className="input-disabled"
              />
            </label>

            <label className="field-group">
              <span>Target Board Exam Year</span>
              <select
                value={targetExamYear}
                onChange={(e) => setTargetExamYear(Number(e.target.value))}
                className="select-input"
              >
                <option value={2026}>Class 10 Board Exams 2026</option>
                <option value={2027}>Class 10 Board Exams 2027</option>
                <option value={2028}>Class 10 Board Exams 2028</option>
              </select>
            </label>

            <label className="field-group">
              <span>School / Institution Name (Optional)</span>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Kendriya Vidyalaya / Delhi Public School"
              />
            </label>
          </div>
        </section>

        {/* Card 3: Guardian / Parent Details */}
        <section className="settings-card">
          <div className="card-header">
            <span className="card-icon">👨‍👩‍👦</span>
            <div>
              <h3>Parent / Guardian Record</h3>
              <p>Under-18 digital consent &amp; recovery contact details.</p>
            </div>
          </div>

          <div className="fields-stack">
            <label className="field-group">
              <span>Parent / Guardian Full Name</span>
              <input
                type="text"
                value={guardianFullName}
                onChange={(e) => setGuardianFullName(e.target.value)}
                placeholder="e.g. Parent Name"
              />
            </label>

            <label className="field-group">
              <span>Parent Email Address</span>
              <input
                type="email"
                value={profile.guardianEmail || 'Not recorded'}
                disabled
                className="input-disabled"
              />
            </label>

            <div className="relationship-tag">
              <span>Relationship:</span> <strong>{profile.guardianRelationship || 'Parent'}</strong>
            </div>
          </div>
        </section>

        {/* Card 4: Security & Account Tools */}
        <section className="settings-card">
          <div className="card-header">
            <span className="card-icon">🔒</span>
            <div>
              <h3>Security &amp; Password</h3>
              <p>Manage your login credentials and recovery methods.</p>
            </div>
          </div>

          <div className="security-actions">
            <p className="security-note">
              Need to change your password? You can securely update your credentials via the ChapterReady recovery engine.
            </p>
            <div className="security-buttons">
              <Link href="/recover-account?mode=password" className="btn-security">
                🔑 Reset Account Password →
              </Link>
              <Link href="/orders" className="btn-security secondary">
                📦 My Purchases &amp; Invoices →
              </Link>
            </div>
          </div>
        </section>

        {/* Submit Action Bar */}
        <div className="form-submit-bar">
          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? 'Saving Changes…' : '💾 Save Profile & Phone Number'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .profile-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .profile-header {
          margin-bottom: 2rem;
        }

        .back-link {
          display: inline-block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #c25e00;
          text-decoration: none;
          margin-bottom: 0.75rem;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .eyebrow {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #c25e00;
          margin-bottom: 0.25rem;
        }

        h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #171513;
          letter-spacing: -0.02em;
          margin: 0 0 0.5rem 0;
        }

        .subtext {
          font-size: 1rem;
          color: #5d5750;
          line-height: 1.5;
          margin: 0;
        }

        .profile-alert {
          padding: 0.875rem 1.25rem;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .profile-alert.error {
          background: #fff0ed;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }

        .profile-alert.success {
          background: #effaf3;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .profile-form-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-card {
          background: #ffffff;
          border: 1px solid #e7e2d6;
          border-radius: 18px;
          padding: 1.75rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .card-icon {
          font-size: 1.75rem;
          line-height: 1;
        }

        .card-header h3 {
          font-size: 1.125rem;
          font-weight: 800;
          color: #171513;
          margin: 0 0 0.25rem 0;
        }

        .card-header p {
          font-size: 0.8125rem;
          color: #797167;
          margin: 0;
        }

        .fields-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .field-group span {
          font-size: 0.875rem;
          font-weight: 700;
          color: #171513;
        }

        .field-group input,
        .select-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #dcd6c8;
          border-radius: 10px;
          font-size: 0.9375rem;
          color: #171513;
          outline: none;
          transition: border-color 0.15s;
          background: #ffffff;
        }

        .field-group input:focus,
        .select-input:focus {
          border-color: #c25e00;
        }

        .phone-input-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid #dcd6c8;
          border-radius: 10px;
          background: #ffffff;
          overflow: hidden;
        }

        .phone-prefix {
          padding: 0.75rem 0.875rem;
          background: #f8f6f0;
          font-size: 0.875rem;
          font-weight: 700;
          color: #5d5750;
          border-right: 1px solid #dcd6c8;
          white-space: nowrap;
        }

        .phone-input-wrap input {
          border: none;
          border-radius: 0;
        }

        .readonly-input-wrap {
          position: relative;
        }

        .input-disabled {
          background: #f8f6f0 !important;
          color: #5d5750 !important;
          cursor: not-allowed;
        }

        .verified-badge {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          font-weight: 800;
          color: #166534;
          background: #dcfce7;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .field-hint {
          font-size: 0.75rem;
          color: #797167;
          line-height: 1.4;
        }

        .relationship-tag {
          font-size: 0.8125rem;
          color: #5d5750;
        }

        .security-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .security-note {
          font-size: 0.875rem;
          color: #5d5750;
          margin: 0;
        }

        .security-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-security {
          padding: 0.625rem 1rem;
          background: #171513;
          color: #ffffff;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .btn-security:hover {
          background: #c25e00;
        }

        .btn-security.secondary {
          background: #ffffff;
          color: #171513;
          border: 1.5px solid #171513;
        }

        .btn-security.secondary:hover {
          background: #f8f6f0;
        }

        .form-submit-bar {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .save-btn {
          padding: 0.875rem 2rem;
          background: #171513;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .save-btn:hover:not(:disabled) {
          background: #c25e00;
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
