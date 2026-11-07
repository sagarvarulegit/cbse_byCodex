import { test, expect } from '@playwright/test';
import { createHmac } from 'node:crypto';

function createStudentToken(userId: string, fullName: string, email: string): string {
  const secret = process.env.AUTH_TOKEN_SECRET ?? 'local-dev-auth-secret';
  const payload = {
    userId,
    role: 'student',
    fullName,
    classLevel: 10,
    email,
    exp: Math.floor(Date.now() / 1000) + 7200,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

test.describe('Tara chat session isolation across student accounts', () => {
  test('Student2 does not see Student1 chat sessions ("TestSession1") after account switch in the same browser session', async ({
    page,
    context,
  }) => {
    const student1Token = createStudentToken('student-1', 'Student One', 'student1@example.com');
    const student2Token = createStudentToken('student-2', 'Student Two', 'student2@example.com');

    // Mock the backend conversations per authenticated student cookie
    const dbByStudent: Record<
      string,
      Array<{
        id: string;
        title: string;
        updatedAt: string;
        messages: Array<{ id: string; role: 'user' | 'assistant'; contentMarkdown: string }>;
      }>
    > = {
      'student-1': [
        {
          id: 'conv-s1-1',
          title: 'TestSession1',
          updatedAt: new Date().toISOString(),
          messages: [
            { id: 'm1', role: 'user', contentMarkdown: 'Private question from Student 1' },
            { id: 'm2', role: 'assistant', contentMarkdown: 'Answer for Student 1 only' },
          ],
        },
      ],
      'student-2': [],
    };

    const getCurrentStudentId = async () => {
      const cookies = await context.cookies();
      const sessionCookie = cookies.find((c) => c.name === 'cbse_student_session');
      if (!sessionCookie?.value) return null;
      const payloadStr = sessionCookie.value.split('.')[0];
      if (!payloadStr) return null;
      try {
        const parsed = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
        return parsed.userId as string;
      } catch {
        return null;
      }
    };

    await page.route('**/api/tutor/conversations', async (route) => {
      const studentId = await getCurrentStudentId();
      if (!studentId) {
        return route.fulfill({
          status: 401,
          contentType: 'application/json',
          headers: { 'Cache-Control': 'no-store, max-age=0' },
          body: JSON.stringify({ message: 'Sign in to view your chats.' }),
        });
      }
      if (route.request().method() === 'GET') {
        const list = (dbByStudent[studentId] ?? []).map(({ id, title, updatedAt }) => ({
          id,
          title,
          updatedAt,
        }));
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: { 'Cache-Control': 'no-store, max-age=0' },
          body: JSON.stringify({ conversations: list }),
        });
      }
      return route.continue();
    });

    await page.route('**/api/tutor/conversations/*', async (route) => {
      const studentId = await getCurrentStudentId();
      if (!studentId) {
        return route.fulfill({ status: 401, contentType: 'application/json', body: '{}' });
      }
      const url = new URL(route.request().url());
      const convId = url.pathname.split('/').pop()!;
      const conv = (dbByStudent[studentId] ?? []).find((c) => c.id === convId);
      if (!conv) {
        return route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Not found' }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'Cache-Control': 'no-store, max-age=0' },
        body: JSON.stringify({ conversation: conv }),
      });
    });

    // 1. Sign in as Student 1 (httpOnly: false matches saveSessionToken in lib/auth.ts)
    await context.addCookies([
      {
        name: 'cbse_student_session',
        value: student1Token,
        domain: '127.0.0.1',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    await page.goto('/questions');

    // Open Tara chat
    const taraBubble = page.locator('button.tara-bubble');
    await expect(taraBubble).toBeVisible();
    await taraBubble.click();

    // Student 1 sees their session "TestSession1" and its message
    await expect(page.locator('.tara-window')).toBeVisible();
    await expect(page.locator('.tara-subtitle')).toHaveText('TestSession1');
    await expect(page.locator('.tara-sessions-badge')).toHaveText('1');
    await expect(page.locator('.tara-thread')).toContainText('Private question from Student 1');

    // Open the sessions drawer to verify "TestSession1" is listed
    await page.locator('button.tara-sessions-toggle').click();
    await expect(page.locator('.tara-session-title', { hasText: 'TestSession1' })).toBeVisible();

    // 2. Simulate Student 1 logging out and Student 2 logging in within the same SPA tab (no full page reload!)
    await page.evaluate((token2) => {
      document.cookie = `cbse_student_session=${token2}; path=/; SameSite=Lax`;
      window.dispatchEvent(new Event('cbse:auth-change'));
    }, student2Token);

    // 3. Verify Student 2 DOES NOT see "TestSession1" or Student 1's messages
    await expect(page.locator('.tara-sessions-badge')).toHaveText('0');
    await expect(page.locator('.tara-subtitle')).toHaveText('Your Class 10 AI tutor');
    await expect(page.locator('.tara-session-title', { hasText: 'TestSession1' })).toHaveCount(0);
    await expect(page.locator('.tara-thread')).toHaveCount(0);
    await expect(page.locator('.tara-empty')).toBeVisible();

    // 4. Simulate Student 2 logging out completely
    await page.evaluate(() => {
      document.cookie = 'cbse_student_session=; path=/; max-age=0; SameSite=Lax';
      window.dispatchEvent(new Event('cbse:auth-change'));
    });

    await expect(page.locator('.tara-auth-gate')).toBeVisible();
    await expect(page.locator('button.tara-sessions-toggle')).toHaveCount(0);
  });
});
