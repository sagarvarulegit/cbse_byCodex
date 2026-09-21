# ChapterReady.in Platform Test Plan

> Test plan generated for ChapterReady.in live platform verification and automated Playwright agent loops (Planner, Generator, Healer).

**Seed:** `apps/web/e2e/seed.spec.ts`

---

### 1. Student Portal Homepage & Navigation
**Seed:** `apps/web/e2e/seed.spec.ts`

#### 1.1 Verify Homepage Hero and Navigation Bar
**Steps:**
1. Navigate to `/`
2. Verify that `main.home-page` is visible
3. Verify that `h1#hero-title` contains "ChapterReady" or CBSE Class 10 branding
4. Verify that navigation bar with links (Subjects, Notes, Practice) is visible

**Expected:**
- Homepage loads with HTTP 200
- Core branding and navigation elements are in viewport

#### 1.2 Navigate from Home to Class 10 Subjects
**Steps:**
1. Navigate to `/`
2. Click on the subjects section or browse subjects link
3. Verify navigation to `/subjects` or subject cards (Mathematics, Science, English, Social Science) are displayed

**Expected:**
- All Class 10 pilot subjects are visible and clickable

---

### 2. Complete Chapter Notes & PYQ Drill
**Seed:** `apps/web/e2e/seed.spec.ts`

#### 2.1 Chapter Notes Interactive Accordion
**Steps:**
1. Navigate to `/chapters/life-processes/notes`
2. Verify `#chapter-notes` is visible
3. Verify parts accordion (`details.complete-chapter-part`) are rendered
4. Click on a chapter part link in the sidebar (`.complete-chapter-sidebar a.chapter-part-link`)
5. Verify the target part expands (`open` attribute) and scrolls into view

**Expected:**
- Chapter notes render with textbook-aligned section numbering
- Expanding sections toggles without layout shifts

#### 2.2 Board Exam Drill PYQ Cards & Rubric Reveal
**Steps:**
1. Navigate to `/chapters/life-processes/notes`
2. Scroll to or click `#board-exam-drill` anchor link
3. Verify board question cards `.pyq-card` are displayed
4. Click "Reveal Answer Demand" button
5. Verify answer demand points and official source attribution appear
6. Click "Reveal Step Marking" button
7. Verify official CBSE marking rubric is displayed

**Expected:**
- Demands and marking schemes stay hidden until student intentionally reveals them
- Accurate CBSE marking scheme steps are shown

---

### 3. Student Authentication Guard
**Seed:** `apps/web/e2e/seed.spec.ts`

#### 3.1 Unauthenticated Redirect on Protected Routes
**Steps:**
1. In a fresh context without auth cookies, navigate to `/dashboard`
2. Verify redirection to `/login` or auth modal prompt

**Expected:**
- Protected student learning state is shielded from anonymous access
