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
  const fromEmail = process.env.EMAIL_FROM || 'ChapterReady <support@chapterready.in>';

  // 1. Resend REST API
  if (resendApiKey) {
    try {
      const response = await injectedFetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail.includes('@') ? fromEmail : 'ChapterReady <onboarding@resend.dev>',
          to: [params.to],
          subject: params.subject,
          html: params.html,
          text: params.text || params.subject,
        }),
      });

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
