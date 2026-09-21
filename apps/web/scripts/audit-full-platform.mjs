import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('output/playwright/live-audit');
const screensDir = path.join(outDir, 'screenshots');
fs.mkdirSync(screensDir, { recursive: true });

const authStatePath = path.join(outDir, 'auth-state.json');

const pagesToAudit = [
  { name: '01-homepage', path: '/' },
  { name: '02-dashboard', path: '/dashboard' },
  { name: '03-subjects-hub', path: '/subjects' },
  { name: '04-subject-mathematics', path: '/subjects/mathematics' },
  { name: '05-subject-science', path: '/subjects/science' },
  { name: '06-subject-english', path: '/subjects/english' },
  { name: '07-subject-social-science', path: '/subjects/social-science' },
  { name: '08-board-prep-math', path: '/subjects/mathematics/board-preparation' },
  { name: '09-chapters-directory', path: '/chapters' },
  { name: '10-chapter-life-processes', path: '/chapters/life-processes' },
  { name: '11-chapter-notes-life-processes', path: '/chapters/life-processes/notes' },
  { name: '12-chapter-quiz-life-processes', path: '/chapters/life-processes/quiz' },
  { name: '13-chapter-chemical-reactions', path: '/chapters/chemical-reactions-and-equations' },
  { name: '14-chapter-notes-chemical-reactions', path: '/chapters/chemical-reactions-and-equations/notes' },
  { name: '15-chapter-real-numbers', path: '/chapters/real-numbers' },
  { name: '16-chapter-notes-real-numbers', path: '/chapters/real-numbers/notes' },
  { name: '17-quizzes-arena', path: '/quizzes' },
  { name: '18-readiness-dashboard', path: '/readiness' },
  { name: '19-my-mistakes', path: '/my-mistakes' },
  { name: '20-pyq-trends', path: '/pyq-trends' },
  { name: '21-exam-papers', path: '/exam-papers' },
  { name: '22-formula-cheatsheets', path: '/formula-cheatsheets' },
  { name: '23-virtual-lab', path: '/virtual-lab' },
  { name: '24-activities-and-diagrams', path: '/activities-and-diagrams' },
  { name: '25-profile', path: '/profile' },
  { name: '26-store', path: '/store' },
  { name: '27-feedback', path: '/feedback' },
  { name: '28-privacy', path: '/privacy' },
  { name: '29-refund-policy', path: '/refund-policy' },
];

async function run() {
  console.log('Starting full ChapterReady.in platform audit...');
  const browser = await chromium.launch({ headless: true });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    storageState: fs.existsSync(authStatePath) ? authStatePath : undefined,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 ChapterReadyAuditBot/1.0'
  });

  const auditResults = [];

  for (let i = 0; i < pagesToAudit.length; i++) {
    const item = pagesToAudit[i];
    const fullUrl = `https://www.chapterready.in${item.path}`;
    console.log(`\n[${i + 1}/${pagesToAudit.length}] Auditing: ${fullUrl}`);

    const page = await context.newPage();
    const consoleLogs = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleLogs.push({ type: msg.type(), text: msg.text() });
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err.message);
    });

    page.on('requestfailed', req => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
    });

    let httpStatus = null;
    try {
      const response = await page.goto(fullUrl, { waitUntil: 'load', timeout: 30000 });
      httpStatus = response?.status() ?? null;
    } catch (e) {
      console.log(`Navigation warning for ${item.path}: ${e.message}`);
    }

    // Give dynamic client rendering 2.5 seconds to settle
    await page.waitForTimeout(2500);

    const currentUrl = page.url();
    const title = await page.title().catch(() => '');

    // Check broken images and layout issues
    const domCheck = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const brokenImgs = imgs
        .filter(img => img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:'))
        .map(img => ({ src: img.src, alt: img.alt }));

      const h1 = document.querySelector('h1')?.textContent?.trim() || '';
      const bodyScrollWidth = document.documentElement.scrollWidth;
      const windowWidth = window.innerWidth;
      const hasHorizontalOverflow = bodyScrollWidth > windowWidth + 5;

      const mainText = document.querySelector('main')?.textContent?.trim() || '';
      const isEmptyMain = mainText.length < 20;

      return {
        brokenImgs,
        h1,
        hasHorizontalOverflow,
        bodyScrollWidth,
        windowWidth,
        isEmptyMain
      };
    }).catch(e => ({ error: e.message }));

    // Screenshot Desktop
    const desktopScreenshotPath = path.join(screensDir, `${item.name}-desktop.png`);
    await page.screenshot({ path: desktopScreenshotPath, fullPage: true }).catch(e => console.log('Screenshot failed:', e.message));

    const result = {
      name: item.name,
      requestedPath: item.path,
      finalUrl: currentUrl,
      httpStatus,
      title,
      h1: domCheck.h1,
      hasHorizontalOverflow: domCheck.hasHorizontalOverflow,
      brokenImages: domCheck.brokenImgs || [],
      isEmptyMain: domCheck.isEmptyMain,
      consoleLogs,
      pageErrors,
      failedRequests,
      screenshot: path.relative(process.cwd(), desktopScreenshotPath)
    };

    console.log(`  -> Status: ${httpStatus}, Final: ${currentUrl}`);
    if (result.pageErrors.length) console.log(`  -> Page Errors (${result.pageErrors.length}):`, result.pageErrors[0]);
    if (result.brokenImages.length) console.log(`  -> Broken Images:`, result.brokenImages);
    if (result.hasHorizontalOverflow) console.log(`  -> Horizontal overflow detected (${domCheck.bodyScrollWidth}px > ${domCheck.windowWidth}px)`);

    auditResults.push(result);
    await page.close();
  }

  // Mobile Audit for Key Pages
  console.log('\nStarting Mobile Viewport Audit for Key Pages...');
  const mobilePages = [
    { name: '01-homepage', path: '/' },
    { name: '02-dashboard', path: '/dashboard' },
    { name: '04-subject-mathematics', path: '/subjects/mathematics' },
    { name: '11-chapter-notes-life-processes', path: '/chapters/life-processes/notes' },
    { name: '17-quizzes-arena', path: '/quizzes' },
  ];

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14/15 size
    isMobile: true,
    hasTouch: true,
    storageState: fs.existsSync(authStatePath) ? authStatePath : undefined,
  });

  const mobileResults = [];
  for (const item of mobilePages) {
    const page = await mobileContext.newPage();
    const fullUrl = `https://www.chapterready.in${item.path}`;
    await page.goto(fullUrl, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const overflowCheck = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 5;
    }).catch(() => false);

    const mobileScreenshotPath = path.join(screensDir, `${item.name}-mobile.png`);
    await page.screenshot({ path: mobileScreenshotPath, fullPage: true }).catch(() => {});
    mobileResults.push({
      name: item.name,
      path: item.path,
      overflow: overflowCheck,
      screenshot: path.relative(process.cwd(), mobileScreenshotPath)
    });
    console.log(`Mobile ${item.name}: overflow=${overflowCheck}`);
    await page.close();
  }

  const finalReport = {
    timestamp: new Date().toISOString(),
    totalDesktopPages: auditResults.length,
    desktopResults: auditResults,
    mobileResults
  };

  fs.writeFileSync(path.join(outDir, 'audit-report.json'), JSON.stringify(finalReport, null, 2));
  console.log(`\nAudit complete! Full report saved to ${path.join(outDir, 'audit-report.json')}`);

  await browser.close();
}

run().catch(console.error);
