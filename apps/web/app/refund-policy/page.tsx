import Link from 'next/link';
import BrandLockup from '../../components/BrandLockup';

export const metadata = {
  title: 'Refund & Cancellation Policy · ChapterReady',
  description: 'Fair, transparent refund policy for CBSE Class 10 Mock Test Series and educational passes.',
};

export default function RefundPolicyPage() {
  return (
    <main className="legal-page">
      <nav className="topbar legal-topbar" aria-label="Main navigation">
        <Link className="brand" href="/">
          <BrandLockup />
        </Link>
        <div className="legal-topbar-actions">
          <Link className="ghost-link" href="/dashboard">
            Dashboard
          </Link>
          <Link className="ghost-link" href="/exam-papers">
            Mock Test Series
          </Link>
        </div>
      </nav>

      <div className="legal-shell">
        <div className="legal-header">
          <span className="legal-badge">ChapterReady Transparency</span>
          <h1>Refund & Cancellation Policy</h1>
          <p className="legal-date">Last Updated: August 17, 2026 · Effective Academic Year 2026-27</p>
        </div>

        <div className="legal-content">
          <section className="policy-highlight-card">
            <h2>🛡️ Our 100% Peace of Mind Promise</h2>
            <p>
              We believe in giving every CBSE Class 10 student and parent complete confidence. 
              <strong> Mock Paper 1 is 100% Free Forever</strong> across all subjects so you can test our 3-hour CBT simulator, 
              marking scheme solutions, and chapter diagnostics with zero financial commitment.
            </p>
          </section>

          <section>
            <h2>1. 48-Hour Satisfaction Guarantee</h2>
            <p>
              If you purchase the <strong>Class 10 All-Subjects Board Mock Pack (₹199)</strong> or <strong>Single-Subject Pass (₹99)</strong> 
              and feel it does not meet your academic expectations, you are entitled to a <strong>100% Full Refund</strong> within 
              <strong> 48 hours of purchase</strong>, provided you have attempted <strong>fewer than 2 premium mock papers</strong>.
            </p>
          </section>

          <section>
            <h2>2. Duplicate / Double Charge Protection</h2>
            <p>
              If a network glitch or UPI delay causes your bank account to be debited twice for the same pass, 
              our system automatically detects the duplicate charge and initiates an <strong>instant 100% refund</strong> for the duplicate payment. 
              You can also claim an instant refund with 1 click in your student dashboard.
            </p>
          </section>

          <section>
            <h2>3. Zero-Fee Subject Swap</h2>
            <p>
              Bought the wrong subject by mistake (e.g., Mathematics instead of Science)? 
              Instead of waiting for bank refund cycles, we offer a <strong>1-Click Free Subject Swap</strong> within 7 days of purchase. 
              Your pass will immediately switch to the desired subject with zero processing fees.
            </p>
          </section>

          <section>
            <h2>4. Refund Processing Timelines & Modes</h2>
            <p>All refunds are processed directly back to the original payment method through Razorpay:</p>
            <ul>
              <li><strong>UPI (Google Pay, PhonePe, Paytm, BHIM):</strong> Instant to 2 hours.</li>
              <li><strong>NetBanking:</strong> 1 to 2 business days.</li>
              <li><strong>Debit / Credit Cards:</strong> 2 to 4 business days depending on your issuing bank.</li>
            </ul>
          </section>

          <section>
            <h2>5. How to Initiate a Refund in 1 Click</h2>
            <p>
              You don&apos;t need to write long emails or wait on customer support calls:
            </p>
            <ol>
              <li>Log in to your ChapterReady account.</li>
              <li>Go to <Link href="/exam-papers">Mock Test Series</Link> or Dashboard.</li>
              <li>Click <strong>&ldquo;Request Refund / Need Help?&rdquo;</strong> on your active pass card.</li>
              <li>Select your reason and click Confirm. Eligible refunds are dispatched instantly.</li>
            </ol>
          </section>

          <section className="contact-box">
            <h3>Need personal assistance?</h3>
            <p>
              Our academic and payment support team is available at <a href="mailto:support@chapterready.in">support@chapterready.in</a>. 
              We respond to all student and parent queries within 24 hours.
            </p>
          </section>
        </div>
      </div>

      <style jsx>{`
        .legal-page {
          min-height: 100vh;
          background: #faf8f5;
          color: #171513;
          padding-bottom: 4rem;
        }
        .legal-topbar {
          background: #ffffff;
          border-bottom: 2px solid #171513;
          padding: 0.85rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .legal-topbar-actions {
          display: flex;
          gap: 1rem;
        }
        .legal-shell {
          max-width: 800px;
          margin: 2.5rem auto 0;
          padding: 0 1.25rem;
        }
        .legal-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          background: #ffe9b8;
          color: #171513;
          border: 1px solid #171513;
          border-radius: 999px;
          padding: 0.25rem 0.75rem;
          margin-bottom: 0.5rem;
        }
        .legal-header h1 {
          font-size: 2.25rem;
          margin: 0.2rem 0;
          color: #171513;
        }
        .legal-date {
          font-size: 0.85rem;
          color: #666;
          margin: 0.25rem 0 2rem 0;
        }
        .legal-content {
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 18px;
          padding: 2.25rem 2.5rem;
          box-shadow: 4px 4px 0 #171513;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        @media (max-width: 600px) {
          .legal-content { padding: 1.5rem; }
        }
        .policy-highlight-card {
          background: #f0fdf4;
          border: 1.5px solid #16a34a;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
        }
        .policy-highlight-card h2 {
          color: #15803d;
          font-size: 1.15rem;
          margin: 0 0 0.5rem 0;
        }
        .policy-highlight-card p {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.5;
          color: #166534;
        }
        .legal-content h2 {
          font-size: 1.25rem;
          margin: 0 0 0.5rem 0;
          color: #171513;
        }
        .legal-content p, .legal-content li {
          font-size: 0.92rem;
          line-height: 1.6;
          color: #444;
        }
        .legal-content ul, .legal-content ol {
          padding-left: 1.25rem;
          margin: 0.5rem 0;
        }
        .contact-box {
          background: #f8fafc;
          border: 1.5px dashed #cbd5e1;
          border-radius: 12px;
          padding: 1.25rem;
        }
        .contact-box h3 { margin: 0 0 0.25rem 0; font-size: 1rem; color: #171513; }
        .contact-box p { margin: 0; font-size: 0.88rem; color: #64748b; }
        .contact-box a { color: #0284c7; font-weight: 700; }
      `}</style>
    </main>
  );
}
