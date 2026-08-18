'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  findAccountByIdentifier,
  requestForgotPasswordOtp,
  resetPasswordWithToken,
  verifyRecoveryOtp,
} from '../../lib/recovery';

function RecoverAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'find' ? 'find' : 'password';

  // Step state: 1 = Identifier, 2 = Verify OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [activeTab, setActiveTab] = useState<'password' | 'find'>(initialMode);

  // Form fields
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  
  // Find account fields
  const [findType, setFindType] = useState<'phone' | 'payment_order' | 'guardian_details'>('phone');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [guardianEmailQuery, setGuardianEmailQuery] = useState('');
  const [studentNameQuery, setStudentNameQuery] = useState('');

  // OTP fields (6 digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Reset Token & Password fields
  const [resetSessionToken, setResetSessionToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Handle Step 1: Submit Email (Forgot Password)
  async function handleSendEmailOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await requestForgotPasswordOtp(email);
      if (res.success) {
        setMaskedEmail(res.maskedEmail || email);
        setStep(2);
        setResendTimer(60);
        setCanResend(false);
        setSuccessMessage(res.message);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send recovery code.');
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Step 1: Find Account by Identifier
  async function handleFindAccount(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    let query = '';
    let extra = '';

    if (findType === 'phone') {
      query = phoneQuery;
    } else if (findType === 'payment_order') {
      query = orderQuery;
    } else if (findType === 'guardian_details') {
      query = guardianEmailQuery;
      extra = studentNameQuery;
    }

    try {
      const res = await findAccountByIdentifier({
        searchType: findType,
        query,
        extra,
      });

      if (res.found && res.email) {
        setEmail(res.email);
        setMaskedEmail(res.maskedEmail || res.email);
        setStudentName(res.studentName || '');
        setStep(2);
        setResendTimer(60);
        setCanResend(false);
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message || 'No student account found matching these details.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Could not find account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Handle OTP digit inputs
  function handleOtpDigitChange(index: number, value: string) {
    const cleanChar = value.replace(/[^\d]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanChar;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (cleanChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^\d]/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);
    const nextEmptyIndex = newDigits.findIndex((d) => !d);
    if (nextEmptyIndex !== -1) {
      otpInputRefs.current[nextEmptyIndex]?.focus();
    } else {
      otpInputRefs.current[5]?.focus();
    }
  }

  // Handle Step 2: Verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit recovery code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await verifyRecoveryOtp({ email, otp });
      if (res.success && res.resetSessionToken) {
        setResetSessionToken(res.resetSessionToken);
        setStep(3);
        setSuccessMessage('Recovery code verified! Now choose a new password.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Invalid or expired recovery code.');
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Step 3: Reset Password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setErrorMessage('Password must include at least one letter and one number.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPasswordWithToken({
        email,
        resetSessionToken,
        newPassword,
      });

      if (res.success) {
        setStep(4);
        setSuccessMessage('Password reset successfully!');

        // Save token to localStorage for instant auto-login
        if (res.token) {
          try {
            localStorage.setItem('cbse_auth_token', res.token);
          } catch {
            // ignore storage errors
          }
        }

        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2500);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="recovery-page">
      <section className="recovery-card">
        {/* Header */}
        <div className="recovery-header">
          <Link href="/login" className="back-link">
            ← Back to Login
          </Link>
          <p className="eyebrow">Student Account Recovery</p>
          <h1>
            {step === 1 && (activeTab === 'password' ? 'Reset Your Password' : 'Find Your Account')}
            {step === 2 && 'Enter 6-Digit Recovery Code'}
            {step === 3 && 'Create a New Password'}
            {step === 4 && 'Account Recovered! 🎉'}
          </h1>
          <p className="subtext">
            {step === 1 &&
              (activeTab === 'password'
                ? 'Enter your registered email address and we will send you a 6-digit verification code.'
                : 'Forgot which email you used? Search using your phone number, payment reference, or guardian details.')}
            {step === 2 &&
              `We have sent a 6-digit verification code to ${maskedEmail || email}. It will expire in 15 minutes.`}
            {step === 3 && 'Choose a strong password with at least 8 characters (letters and numbers).'}
            {step === 4 && 'Your password has been reset successfully. Redirecting you to your study hub…'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="step-stepper" aria-label="Recovery steps">
          <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
            <span className="node-num">1</span>
            <span className="node-label">Identify</span>
          </div>
          <div className="step-line" />
          <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
            <span className="node-num">2</span>
            <span className="node-label">Verify Code</span>
          </div>
          <div className="step-line" />
          <div className={`step-node ${step >= 3 ? 'active' : ''} ${step > 3 ? 'done' : ''}`}>
            <span className="node-num">3</span>
            <span className="node-label">New Password</span>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="recovery-alert error" role="alert">
            <span>⚠️</span> {errorMessage}
          </div>
        )}
        {successMessage && step !== 4 && (
          <div className="recovery-alert success" role="status">
            <span>✓</span> {successMessage}
          </div>
        )}

        {/* STEP 1: Identification (Tabs: Reset Password vs Find Account) */}
        {step === 1 && (
          <div className="step-content">
            <div className="mode-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'password'}
                className={`mode-tab ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('password');
                  setErrorMessage(null);
                }}
              >
                🔑 Reset Password
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'find'}
                className={`mode-tab ${activeTab === 'find' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('find');
                  setErrorMessage(null);
                }}
              >
                🔍 Forgot Email / Find Account
              </button>
            </div>

            {activeTab === 'password' ? (
              <form onSubmit={handleSendEmailOtp} className="recovery-form">
                <label className="auth-field">
                  <span>Registered Email Address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    autoComplete="email"
                    required
                  />
                </label>
                <button type="submit" className="auth-submit" disabled={isLoading || !email}>
                  {isLoading ? 'Sending Code…' : 'Send 6-Digit Recovery Code →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleFindAccount} className="recovery-form">
                <div className="find-options">
                  <label className="find-radio">
                    <input
                      type="radio"
                      name="findType"
                      checked={findType === 'phone'}
                      onChange={() => setFindType('phone')}
                    />
                    <span>📱 Registered Phone Number</span>
                  </label>
                  <label className="find-radio">
                    <input
                      type="radio"
                      name="findType"
                      checked={findType === 'payment_order'}
                      onChange={() => setFindType('payment_order')}
                    />
                    <span>🧾 Payment / Order Reference ID</span>
                  </label>
                  <label className="find-radio">
                    <input
                      type="radio"
                      name="findType"
                      checked={findType === 'guardian_details'}
                      onChange={() => setFindType('guardian_details')}
                    />
                    <span>👨‍👩‍👦 Parent Email + Student Name</span>
                  </label>
                </div>

                {findType === 'phone' && (
                  <label className="auth-field">
                    <span>10-Digit Mobile Number</span>
                    <input
                      type="tel"
                      value={phoneQuery}
                      onChange={(e) => setPhoneQuery(e.target.value)}
                      placeholder="e.g. 9876543210"
                      required
                    />
                  </label>
                )}

                {findType === 'payment_order' && (
                  <label className="auth-field">
                    <span>Cashfree / UPI Order ID or Receipt Number</span>
                    <input
                      type="text"
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      placeholder="e.g. order_rh5zhk_... or rcpt_..."
                      required
                    />
                    <span className="field-hint">
                      Found on your UPI app transaction history (Google Pay, PhonePe, Paytm) or SMS receipt.
                    </span>
                  </label>
                )}

                {findType === 'guardian_details' && (
                  <>
                    <label className="auth-field">
                      <span>Parent / Guardian Email</span>
                      <input
                        type="email"
                        value={guardianEmailQuery}
                        onChange={(e) => setGuardianEmailQuery(e.target.value)}
                        placeholder="parent@example.com"
                        required
                      />
                    </label>
                    <label className="auth-field">
                      <span>Student Full Name</span>
                      <input
                        type="text"
                        value={studentNameQuery}
                        onChange={(e) => setStudentNameQuery(e.target.value)}
                        placeholder="e.g. Sagar Varule"
                        required
                      />
                    </label>
                  </>
                )}

                <button type="submit" className="auth-submit" disabled={isLoading}>
                  {isLoading ? 'Searching…' : 'Locate Account & Send Code →'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* STEP 2: Verify 6-Digit OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="step-content recovery-form">
            <div className="account-badge">
              <span className="badge-icon">👤</span>
              <div>
                <strong className="badge-title">
                  {studentName ? `${studentName}'s Account` : 'Class 10 Student Account'}
                </strong>
                <p className="badge-subtitle">Code sent to {maskedEmail || email}</p>
              </div>
            </div>

            <label className="auth-field">
              <span>Enter 6-Digit Verification Code</span>
              <div className="otp-boxes" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="otp-box"
                    autoFocus={idx === 0}
                    required
                  />
                ))}
              </div>
            </label>

            <div className="resend-row">
              {canResend ? (
                <button
                  type="button"
                  onClick={() => handleSendEmailOtp()}
                  className="resend-btn"
                  disabled={isLoading}
                >
                  Resend Verification Code
                </button>
              ) : (
                <span className="resend-countdown">Resend code in {resendTimer}s</span>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading || otpDigits.some((d) => !d)}
            >
              {isLoading ? 'Verifying Code…' : 'Verify Code & Proceed →'}
            </button>

            <button
              type="button"
              className="ghost-btn"
              onClick={() => {
                setStep(1);
                setOtpDigits(['', '', '', '', '', '']);
                setErrorMessage(null);
              }}
            >
              ← Change Email or Search Method
            </button>
          </form>
        )}

        {/* STEP 3: Create New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="step-content recovery-form">
            <label className="auth-field">
              <span>New Password</span>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter at least 8 characters"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="show-pwd-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <label className="auth-field">
              <span>Confirm New Password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type your new password"
                autoComplete="new-password"
                required
              />
            </label>

            {/* Live Password Strength Checklist */}
            <div className="password-rules">
              <p className={`rule-item ${newPassword.length >= 8 ? 'pass' : ''}`}>
                {newPassword.length >= 8 ? '✓' : '○'} Minimum 8 characters
              </p>
              <p className={`rule-item ${/[A-Za-z]/.test(newPassword) && /\d/.test(newPassword) ? 'pass' : ''}`}>
                {/[A-Za-z]/.test(newPassword) && /\d/.test(newPassword) ? '✓' : '○'} Letters and numbers
              </p>
              <p className={`rule-item ${newPassword && newPassword === confirmPassword ? 'pass' : ''}`}>
                {newPassword && newPassword === confirmPassword ? '✓' : '○'} Passwords match
              </p>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={
                isLoading ||
                newPassword.length < 8 ||
                newPassword !== confirmPassword ||
                !/[A-Za-z]/.test(newPassword) ||
                !/\d/.test(newPassword)
              }
            >
              {isLoading ? 'Resetting Password…' : 'Save New Password & Log In →'}
            </button>
          </form>
        )}

        {/* STEP 4: Success Screen */}
        {step === 4 && (
          <div className="step-content success-view">
            <div className="celebration-circle">✓</div>
            <h2>Password Reset Complete!</h2>
            <p className="success-subtext">
              Your ChapterReady student account password has been updated securely. You are now logged in.
            </p>
            <Link href="/dashboard" className="auth-submit link-btn">
              Go to Dashboard Now →
            </Link>
          </div>
        )}
      </section>

      <style jsx>{`
        .recovery-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: #fbf8f3;
        }

        .recovery-card {
          width: 100%;
          max-width: 520px;
          background: #ffffff;
          border: 1px solid rgba(23, 21, 19, 0.1);
          border-radius: 20px;
          padding: 2.25rem;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
        }

        .recovery-header {
          margin-bottom: 1.5rem;
        }

        .back-link {
          display: inline-block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #c25e00;
          text-decoration: none;
          margin-bottom: 0.75rem;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #c25e00;
          margin-bottom: 0.25rem;
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #171513;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }

        .subtext {
          font-size: 0.9375rem;
          color: #5d5750;
          line-height: 1.5;
        }

        .step-stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding: 0.75rem 1rem;
          background: #f8f6f0;
          border-radius: 12px;
        }

        .step-node {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.45;
          transition: opacity 0.2s;
        }

        .step-node.active {
          opacity: 1;
        }

        .node-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e4decb;
          color: #171513;
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-node.active .node-num {
          background: #c25e00;
          color: #ffffff;
        }

        .step-node.done .node-num {
          background: #1e7e34;
          color: #ffffff;
        }

        .node-label {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #171513;
        }

        .step-line {
          flex: 1;
          height: 2px;
          background: #e4decb;
          margin: 0 0.5rem;
        }

        .recovery-alert {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .recovery-alert.error {
          background: #fff0ed;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }

        .recovery-alert.success {
          background: #effaf3;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .mode-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          background: #f4f0e6;
          padding: 4px;
          border-radius: 12px;
        }

        .mode-tab {
          padding: 0.625rem 0.5rem;
          border: none;
          background: transparent;
          font-size: 0.8125rem;
          font-weight: 700;
          color: #5d5750;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mode-tab.active {
          background: #ffffff;
          color: #171513;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .find-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #faf8f4;
          border: 1px solid #ece7db;
          border-radius: 12px;
        }

        .find-radio {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #2e2a25;
          cursor: pointer;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          margin-bottom: 1rem;
        }

        .auth-field span {
          font-size: 0.875rem;
          font-weight: 700;
          color: #171513;
        }

        .auth-field input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #dcd6c8;
          border-radius: 10px;
          font-size: 0.9375rem;
          color: #171513;
          outline: none;
          transition: border-color 0.15s;
        }

        .auth-field input:focus {
          border-color: #c25e00;
        }

        .field-hint {
          font-size: 0.75rem;
          color: #797167;
          line-height: 1.4;
          margin-top: 0.25rem;
        }

        .otp-boxes {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .otp-box {
          width: 48px;
          height: 56px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 800;
          border: 2px solid #dcd6c8;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.15s;
        }

        .otp-box:focus {
          border-color: #c25e00;
          background: #fffcf8;
        }

        .resend-row {
          text-align: center;
          margin: 0.75rem 0 1.25rem;
        }

        .resend-btn {
          background: none;
          border: none;
          color: #c25e00;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }

        .resend-countdown {
          font-size: 0.8125rem;
          color: #797167;
        }

        .account-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #fbf6ec;
          border: 1px solid #eedec4;
          border-radius: 12px;
          margin-bottom: 1.25rem;
        }

        .badge-icon {
          font-size: 1.5rem;
        }

        .badge-title {
          font-size: 0.875rem;
          font-weight: 800;
          color: #171513;
        }

        .badge-subtitle {
          font-size: 0.75rem;
          color: #5d5750;
        }

        .password-input-wrap {
          position: relative;
        }

        .show-pwd-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 0.75rem;
          font-weight: 700;
          color: #5d5750;
          cursor: pointer;
        }

        .password-rules {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 1.25rem;
          padding: 0.625rem 0.875rem;
          background: #f8f6f0;
          border-radius: 8px;
        }

        .rule-item {
          font-size: 0.75rem;
          font-weight: 600;
          color: #797167;
        }

        .rule-item.pass {
          color: #166534;
          font-weight: 700;
        }

        .auth-submit {
          width: 100%;
          padding: 0.875rem;
          background: #171513;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .auth-submit:hover:not(:disabled) {
          background: #c25e00;
        }

        .auth-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ghost-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.625rem;
          background: transparent;
          border: none;
          color: #5d5750;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
        }

        .ghost-btn:hover {
          color: #171513;
          text-decoration: underline;
        }

        .success-view {
          text-align: center;
          padding: 1.5rem 0;
        }

        .celebration-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #1e7e34;
          color: #ffffff;
          font-size: 2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .success-subtext {
          font-size: 0.9375rem;
          color: #5d5750;
          margin: 0.5rem 0 1.5rem;
        }
      `}</style>
    </main>
  );
}

export default function RecoverAccountPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading account recovery…</div>}>
      <RecoverAccountContent />
    </Suspense>
  );
}
