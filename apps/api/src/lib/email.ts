export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export type SendEmailResult = {
  success: boolean;
  messageId?: string;
  provider?: string;
  error?: string;
};

/**
 * Sends a transactional email using Resend, Brevo, SendGrid, or SMTP if configured.
 * Uses native fetch to avoid heavy third-party dependencies.
 */
export async function sendEmail(
  params: SendEmailParams,
  injectedFetch: typeof fetch = fetch,
): Promise<SendEmailResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'ChapterReady <onboarding@resend.dev>';

  // 1. Resend REST API
  if (resendApiKey) {
    try {
      let response = await injectedFetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [params.to],
          subject: params.subject,
          html: params.html,
          text: params.text || params.subject,
        }),
      });

      // If initial attempt fails (e.g. domain not verified), retry with onboarding@resend.dev
      if (!response.ok && fromEmail !== 'ChapterReady <onboarding@resend.dev>') {
        const initialError = await response.text();
        console.warn('Initial Resend dispatch failed, retrying with onboarding@resend.dev:', initialError);
        response = await injectedFetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ChapterReady <onboarding@resend.dev>',
            to: [params.to],
            subject: params.subject,
            html: params.html,
            text: params.text || params.subject,
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resend email delivery failed:', errorText);
        return { success: false, error: errorText, provider: 'resend' };
      }

      const data = (await response.json()) as { id: string };
      console.log(`[EMAIL_SENT] Email delivered to ${params.to} via Resend (ID: ${data.id})`);
      return { success: true, messageId: data.id, provider: 'resend' };
    } catch (err: unknown) {
      console.error('Error sending email via Resend:', err);
      return { success: false, error: err instanceof Error ? err.message : String(err), provider: 'resend' };
    }
  }

  // 2. Brevo (Sendinblue) REST API
  if (brevoApiKey) {
    try {
      const response = await injectedFetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'ChapterReady Support', email: 'support@chapterready.in' },
          to: [{ email: params.to }],
          subject: params.subject,
          htmlContent: params.html,
          textContent: params.text || params.subject,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Brevo email delivery failed:', errorText);
        return { success: false, error: errorText, provider: 'brevo' };
      }

      const data = (await response.json()) as { messageId?: string };
      return { success: true, messageId: data.messageId, provider: 'brevo' };
    } catch (err: unknown) {
      console.error('Error sending email via Brevo:', err);
      return { success: false, error: err instanceof Error ? err.message : String(err), provider: 'brevo' };
    }
  }

  // 3. SendGrid REST API
  if (sendgridApiKey) {
    try {
      const response = await injectedFetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: params.to }] }],
          from: { email: 'support@chapterready.in', name: 'ChapterReady' },
          subject: params.subject,
          content: [
            { type: 'text/html', value: params.html },
            { type: 'text/plain', value: params.text || params.subject },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('SendGrid email delivery failed:', errorText);
        return { success: false, error: errorText, provider: 'sendgrid' };
      }

      return { success: true, provider: 'sendgrid' };
    } catch (err: unknown) {
      console.error('Error sending email via SendGrid:', err);
      return { success: false, error: err instanceof Error ? err.message : String(err), provider: 'sendgrid' };
    }
  }

  // Fallback: When no external email provider is configured yet
  console.log(`[EMAIL_MOCK] No RESEND_API_KEY, BREVO_API_KEY, or SENDGRID_API_KEY configured. Email to ${params.to} simulated. Subject: "${params.subject}"`);
  return {
    success: true,
    provider: 'simulated_logger',
  };
}

/**
 * Builds standard, clean HTML template for 6-digit recovery code email.
 */
export function buildRecoveryEmailHtml({
  otp,
  studentName,
}: {
  otp: string;
  studentName?: string;
}): string {
  const greeting = studentName ? `Hello ${studentName},` : 'Hello Student,';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChapterReady Account Recovery</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf8f3; margin: 0; padding: 24px; color: #171513;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e7e2d6; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <tr>
      <td style="padding: 28px 32px; background-color: #171513; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">ChapterReady</h1>
        <p style="color: #ff8c37; margin: 4px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">CBSE Class 10 Learning Platform</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 32px 24px 32px;">
        <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 12px 0; color: #171513;">Account Recovery Code</h2>
        <p style="font-size: 15px; line-height: 1.5; color: #5d5750; margin: 0 0 20px 0;">${greeting}</p>
        <p style="font-size: 15px; line-height: 1.5; color: #5d5750; margin: 0 0 24px 0;">
          We received a request to recover your ChapterReady student account and reset your password. Use the 6-digit verification code below to proceed:
        </p>

        <div style="background-color: #f8f5ee; border: 2px dashed #c25e00; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #c25e00; font-family: monospace; display: block;">${otp}</span>
          <span style="display: block; font-size: 12px; color: #797167; margin-top: 8px; font-weight: 600;">Valid for 15 minutes · Single-use code</span>
        </div>

        <p style="font-size: 14px; line-height: 1.5; color: #5d5750; margin: 0 0 16px 0;">
          If you did not request this password reset, you can safely ignore this email. Your password will remain unchanged and your account is secure.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 32px; background-color: #fbf8f3; border-top: 1px solid #e7e2d6; text-align: center;">
        <p style="font-size: 12px; color: #8c8276; margin: 0; line-height: 1.4;">
          🔒 Secure automated notification from ChapterReady India.<br>
          For student support, visit <a href="https://www.chapterready.in" style="color: #c25e00; text-decoration: none; font-weight: 600;">chapterready.in</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Builds standard, clean HTML template for feedback notification sent to support@chapterready.in.
 */
export function buildFeedbackEmailHtml({
  feedbackId,
  category,
  subject,
  chapter,
  title,
  description,
  rating,
  studentName,
  studentEmail,
  studentPhone,
  classLevel,
  createdAt = new Date(),
}: {
  feedbackId: string;
  category: string;
  subject?: string | null;
  chapter?: string | null;
  title: string;
  description: string;
  rating?: number | null;
  studentName?: string | null;
  studentEmail?: string | null;
  studentPhone?: string | null;
  classLevel?: number | null;
  createdAt?: Date;
}): string {
  const categoryLabels: Record<string, string> = {
    suggestion: '💡 Suggestion',
    bug: '🐛 Bug Report',
    content_error: '📝 Content Error',
    general: '💬 General Feedback',
  };
  const categoryLabel = categoryLabels[category] || category;

  const formattedDate = createdAt.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const ratingStars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Not provided';
  const submitterName = studentName || (studentEmail ? 'Registered Student' : 'Anonymous Student');
  const submitterEmail = studentEmail || 'Not provided (Guest)';
  const submitterPhone = studentPhone || 'N/A';
  const submitterClass = classLevel ? `Class ${classLevel}` : 'Class 10';

  const escapedDescription = description
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  const escapedTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Feedback Received</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf8f3; margin: 0; padding: 24px; color: #171513;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e7e2d6; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <tr>
      <td style="padding: 24px 32px; background-color: #171513; text-align: left;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">ChapterReady Feedback</h1>
              <p style="color: #ff8c37; margin: 2px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Support Inbox Notification</p>
            </td>
            <td style="text-align: right;">
              <span style="background-color: #ff8c37; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;">${categoryLabel}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 32px 24px 32px;">
        <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; color: #171513; border-bottom: 2px solid #f0eae1; padding-bottom: 12px;">
          ${escapedTitle}
        </h2>

        <div style="background-color: #fcfbf9; border: 1px solid #e7e2d6; border-radius: 8px; padding: 16px; margin: 0 0 24px 0;">
          <p style="font-size: 15px; line-height: 1.6; color: #2a2622; margin: 0;">
            ${escapedDescription}
          </p>
        </div>

        <table width="100%" border="0" cellspacing="0" cellpadding="6" style="margin-bottom: 24px; font-size: 14px;">
          <tr>
            <td width="30%" style="color: #797167; font-weight: 600;">Category:</td>
            <td style="color: #171513; font-weight: 700;">${categoryLabel}</td>
          </tr>
          ${subject ? `<tr>
            <td style="color: #797167; font-weight: 600;">Subject:</td>
            <td style="color: #171513; text-transform: capitalize;">${subject.replace(/_/g, ' ')}</td>
          </tr>` : ''}
          ${chapter ? `<tr>
            <td style="color: #797167; font-weight: 600;">Chapter:</td>
            <td style="color: #171513;">${chapter}</td>
          </tr>` : ''}
          <tr>
            <td style="color: #797167; font-weight: 600;">Rating:</td>
            <td style="color: #c25e00; font-weight: 700;">${ratingStars}</td>
          </tr>
          <tr>
            <td style="color: #797167; font-weight: 600;">Submitted At:</td>
            <td style="color: #171513;">${formattedDate}</td>
          </tr>
        </table>

        <div style="border-top: 1px solid #e7e2d6; padding-top: 20px;">
          <h3 style="font-size: 14px; font-weight: 700; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #797167;">Student Details</h3>
          <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 13px;">
            <tr>
              <td width="30%" style="color: #797167;">Name:</td>
              <td style="color: #171513; font-weight: 600;">${submitterName}</td>
            </tr>
            <tr>
              <td style="color: #797167;">Email:</td>
              <td style="color: #171513;">${submitterEmail}</td>
            </tr>
            <tr>
              <td style="color: #797167;">Phone:</td>
              <td style="color: #171513;">${submitterPhone}</td>
            </tr>
            <tr>
              <td style="color: #797167;">Level:</td>
              <td style="color: #171513;">${submitterClass}</td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 32px; background-color: #fbf8f3; border-top: 1px solid #e7e2d6; text-align: center;">
        <p style="font-size: 12px; color: #8c8276; margin: 0; line-height: 1.4;">
          Feedback ID: <code>${feedbackId}</code><br>
          Delivered to ChapterReady Support (<a href="mailto:support@chapterready.in" style="color: #c25e00; text-decoration: none;">support@chapterready.in</a>)
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Builds standard, clean HTML template for purchase confirmation and instant access.
 */
export function buildPurchaseAccessEmailHtml({
  studentName,
  productTitle,
  accessUrl,
  orderId,
  amountInr,
  receiptNo,
  userEmail,
}: {
  studentName?: string | null;
  productTitle: string;
  accessUrl: string;
  orderId: string;
  amountInr: number;
  receiptNo?: string | null;
  userEmail: string;
}): string {
  const greeting = studentName ? `Hello ${studentName},` : 'Hello Student,';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ChapterReady Access is Ready</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf8f3; margin: 0; padding: 24px; color: #171513;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e7e2d6; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    <tr>
      <td style="padding: 28px 32px; background-color: #171513; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">ChapterReady</h1>
        <p style="color: #ff8c37; margin: 4px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">CBSE Class 10 Board Excellence</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 32px 24px 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 44px; display: block; margin-bottom: 8px;">🎉</span>
          <h2 style="font-size: 22px; font-weight: 800; color: #15803d; margin: 0 0 8px 0;">Payment Successful &amp; Unlocked!</h2>
          <p style="font-size: 15px; color: #5d5750; margin: 0;">${greeting} your study pack is now active with instant access.</p>
        </div>

        <div style="background-color: #f8fbf8; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 14px;">
            <tr>
              <td width="35%" style="color: #52525b; font-weight: 600;">Purchased Pack:</td>
              <td style="color: #15803d; font-weight: 800; font-size: 15px;">${productTitle}</td>
            </tr>
            <tr>
              <td style="color: #52525b; font-weight: 600;">Amount Paid:</td>
              <td style="color: #171513; font-weight: 700;">₹${amountInr}</td>
            </tr>
            <tr>
              <td style="color: #52525b; font-weight: 600;">Order Reference ID:</td>
              <td style="color: #171513; font-family: monospace;">${orderId}</td>
            </tr>
            ${receiptNo ? `
            <tr>
              <td style="color: #52525b; font-weight: 600;">Receipt No:</td>
              <td style="color: #171513; font-family: monospace;">${receiptNo}</td>
            </tr>` : ''}
            <tr>
              <td style="color: #52525b; font-weight: 600;">Registered Email:</td>
              <td style="color: #171513;">${userEmail}</td>
            </tr>
          </table>
        </div>

        <!-- 1-Click Access CTA Button -->
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${accessUrl}" style="background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(22,163,74,0.3);">
            ⚡ Open Your Material Now →
          </a>
          <p style="font-size: 12px; color: #71717a; margin-top: 10px;">Click the button above to view your study sheets directly in your browser.</p>
        </div>

        <div style="border-top: 1px solid #e7e2d6; padding-top: 20px; font-size: 13px; color: #52525b; line-height: 1.6;">
          <h3 style="font-size: 14px; font-weight: 700; color: #171513; margin: 0 0 8px 0;">📱 Studying on a Laptop or Tablet?</h3>
          <p style="margin: 0 0 12px 0;">
            You can access your purchases across all your devices anytime. Just visit <a href="${accessUrl}" style="color: #16a34a; font-weight: 600; text-decoration: underline;">${accessUrl}</a>. Your access is tied to your email <strong>${userEmail}</strong>.
          </p>
          <p style="margin: 0;">
            🛡️ <strong>ChapterReady 48-Hour Guarantee:</strong> If you need any assistance, have questions, or need a subject swap, simply reply to this email or reach us at <a href="mailto:support@chapterready.in" style="color: #c25e00; text-decoration: none;">support@chapterready.in</a>.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 32px; background-color: #fbf8f3; border-top: 1px solid #e7e2d6; text-align: center;">
        <p style="font-size: 12px; color: #8c8276; margin: 0; line-height: 1.4;">
          ChapterReady India · Official CBSE Class 10 Learning Platform<br>
          Order Management: <a href="https://www.chapterready.in/orders" style="color: #c25e00; text-decoration: none; font-weight: 600;">chapterready.in/orders</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Builds welcoming onboarding email sent immediately upon student registration.
 */
export function buildStudentWelcomeEmailHtml({
  studentName,
  userEmail,
  dashboardUrl = 'https://www.chapterready.in/dashboard',
}: {
  studentName?: string | null;
  userEmail: string;
  dashboardUrl?: string;
}): string {
  const firstName = studentName?.split(/\s+/)[0] || 'Student';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ChapterReady Class 10</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf8f3; margin: 0; padding: 24px; color: #171513;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e7e2d6; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    <tr>
      <td style="padding: 28px 32px; background-color: #171513; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">ChapterReady</h1>
        <p style="color: #ff8c37; margin: 4px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">CBSE Class 10 Board Excellence</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 32px 24px 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 44px; display: block; margin-bottom: 8px;">🎯</span>
          <h2 style="font-size: 22px; font-weight: 800; color: #171513; margin: 0 0 8px 0;">Welcome to ChapterReady, ${firstName}!</h2>
          <p style="font-size: 15px; color: #5d5750; margin: 0; line-height: 1.5;">
            Your free Class 10 board prep hub is now ready. We simplify NCERT textbooks so you can understand concepts faster and score higher in boards.
          </p>
        </div>

        <div style="background-color: #fcfbf9; border: 1px solid #e7e2d6; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 15px; font-weight: 800; color: #171513; margin: 0 0 12px 0;">⚡ Your 3-Minute Quick Start:</h3>
          <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 14px;">
            <tr>
              <td width="32px" style="vertical-align: top; font-size: 18px;">🧪</td>
              <td style="color: #2a2622;">
                <strong>1. Test Recall with a 3-Min Quiz</strong><br>
                <span style="color: #5d5750; font-size: 13px;">5 high-yield CBSE board questions with instant NCERT explanations.</span>
              </td>
            </tr>
            <tr>
              <td width="32px" style="vertical-align: top; font-size: 18px;">🤖</td>
              <td style="color: #2a2622;">
                <strong>2. Ask Tara AI Any Doubt</strong><br>
                <span style="color: #5d5750; font-size: 13px;">Stuck on balancing equations or proofs? Tara is trained directly on NCERT.</span>
              </td>
            </tr>
            <tr>
              <td width="32px" style="vertical-align: top; font-size: 18px;">🔥</td>
              <td style="color: #2a2622;">
                <strong>3. Build Your Daily Study Streak</strong><br>
                <span style="color: #5d5750; font-size: 13px;">Just 10 minutes a day builds unstoppable momentum for CBSE Board exams.</span>
              </td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${dashboardUrl}" style="background-color: #c95014; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(201,80,20,0.3);">
            🚀 Open Your Study Dashboard →
          </a>
        </div>

        <div style="border-top: 1px solid #e7e2d6; padding-top: 20px; font-size: 13px; color: #52525b; line-height: 1.6;">
          <p style="margin: 0 0 8px 0;">
            ✉️ <strong>Have any question or feedback?</strong> Just reply directly to this email or write to <a href="mailto:support@chapterready.in" style="color: #c95014; font-weight: 600;">support@chapterready.in</a>. We are here to help you ace your boards.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 32px; background-color: #fbf8f3; border-top: 1px solid #e7e2d6; text-align: center;">
        <p style="font-size: 12px; color: #8c8276; margin: 0; line-height: 1.4;">
          ChapterReady India · Simplified NCERT Textbook — One Source of Truth<br>
          Account: <strong>${userEmail}</strong>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Builds personalized re-engagement email for inactive registered students.
 */
export function buildStudentReengagementEmailHtml({
  studentName,
  userEmail,
  quizUrl = 'https://www.chapterready.in/chapters/chemical-reactions-and-equations/quiz',
  dashboardUrl = 'https://www.chapterready.in/dashboard',
}: {
  studentName?: string | null;
  userEmail: string;
  quizUrl?: string;
  dashboardUrl?: string;
}): string {
  const firstName = studentName?.split(/\s+/)[0] || 'there';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Class 10 Science & Maths Board Booster</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf8f3; margin: 0; padding: 24px; color: #171513;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e7e2d6; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    <tr>
      <td style="padding: 28px 32px; background-color: #171513; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">ChapterReady</h1>
        <p style="color: #ff8c37; margin: 4px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">CBSE Class 10 Board Excellence</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 32px 24px 32px;">
        <p style="font-size: 16px; line-height: 1.6; color: #171513; margin: 0 0 16px 0;">
          Hi ${firstName},
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #2a2622; margin: 0 0 16px 0;">
          I'm Sagar, the founder of <strong>ChapterReady.in</strong>.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #2a2622; margin: 0 0 16px 0;">
          I noticed you created your free Class 10 account on ChapterReady a few days ago, but you haven't had a chance to test our revision tools yet.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #2a2622; margin: 0 0 20px 0;">
          Class 10 Board exams can get overwhelming with massive textbooks and heavy guides. We built ChapterReady with one simple motto: <em>"Simplified NCERT — One Source of Truth"</em>.
        </p>

        <!-- Value Box -->
        <div style="background-color: #fff9f5; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 15px; font-weight: 800; color: #9a3412; margin: 0 0 12px 0;">🎁 3 Free Things to Kickstart Your Board Prep:</h3>
          
          <div style="margin-bottom: 14px;">
            <strong style="color: #171513; font-size: 14px;">1. 3-Minute Diagnostic Quiz (Chemical Reactions)</strong>
            <p style="font-size: 13px; color: #5d5750; margin: 4px 0 0 0;">
              Test yourself on 5 high-yield CBSE board questions with instant step-by-step NCERT explanations.
            </p>
          </div>

          <div style="margin-bottom: 14px;">
            <strong style="color: #171513; font-size: 14px;">2. Tara AI NCERT Tutor (Free Access)</strong>
            <p style="font-size: 13px; color: #5d5750; margin: 4px 0 0 0;">
              Got a doubt in Science or Maths? Tara is trained strictly on NCERT textbooks to give 100% curriculum-safe answers.
            </p>
          </div>

          <div>
            <strong style="color: #171513; font-size: 14px;">3. Free 1-Page Formula Summary</strong>
            <p style="font-size: 13px; color: #5d5750; margin: 4px 0 0 0;">
              Reply to this email with <strong>"FORMULA"</strong> and I'll personally send you our high-yield Class 10 formula cheatsheet.
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${quizUrl}" style="background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(22,163,74,0.3);">
            ⚡ Take the 3-Minute Chemical Reactions Quiz →
          </a>
          <p style="font-size: 12px; color: #71717a; margin-top: 10px;">
            Takes only 3 minutes · Instant score &amp; marks breakdown
          </p>
        </div>

        <div style="border-top: 1px solid #e7e2d6; padding-top: 20px; font-size: 14px; color: #2a2622; line-height: 1.6;">
          <p style="margin: 0 0 8px 0;">
            Which subject is giving you the most difficulty right now — Maths, Science, or Social Science?
          </p>
          <p style="margin: 0 0 16px 0;">
            Just reply directly to this email. I read and answer every student email personally!
          </p>
          <p style="margin: 0; font-weight: 600; color: #171513;">
            Warm regards,<br>
            <strong>Sagar Varule</strong><br>
            <span style="font-size: 12px; font-weight: 400; color: #71717a;">Founder, ChapterReady.in</span>
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 32px; background-color: #fbf8f3; border-top: 1px solid #e7e2d6; text-align: center;">
        <p style="font-size: 12px; color: #8c8276; margin: 0; line-height: 1.4;">
          ChapterReady India · Simplified NCERT Textbook — One Source of Truth<br>
          Student: <strong>${userEmail}</strong>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
