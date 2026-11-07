# CBSE Learning Portal Admin Dashboard (@cbse/admin)

## Overview
Next.js 14 administrative portal providing internal operational dashboards, student feedback triage, and pilot curriculum completion analytics for ChapterReady administrators. Operates on port 3001.

## Interface
- Routes & Pages:
  - [`app/page.tsx`](app/page.tsx): Main admin overview and pilot metrics dashboard
  - [`app/login/page.tsx`](app/login/page.tsx): Administrator credential login screen
- Server Actions & Auth Utilities:
  - [`app/auth-actions.ts`](app/auth-actions.ts):
    - `loginAction(formData: FormData)`: Admin login handler validating credentials against backend
    - `logoutAction()`: Destroys admin session cookie and redirects to `/login`
  - [`lib/auth.ts`](lib/auth.ts):
    - `getAdminSession()`, `getAdminSessionToken()`: Extracts and verifies admin JWT from cookies
    - `requireAdminSession()`: Guard requiring valid administrator credentials before page render
    - `clearAdminSession()`: Clears HTTP-only admin cookie
  - [`lib/pilot-review.ts`](lib/pilot-review.ts):
    - `getPilotReview(windowDays = 14)`: Queries completion statistics and qualitative student reviews
    - `createEmptyPilotReview()`: Fallback empty metrics payload generator

## Invariants
- All non-login admin routes require a verified admin JWT with `UserRole.ADMIN`; unauthenticated requests must be redirected immediately to `/login`.
- Session token is stored in a secure cookie with `httpOnly: true` and `sameSite: 'lax'`.

## Side Effects
- Modifies client browser session cookies (`admin_session`).
- Performs authenticated HTTP requests to ChapterReady backend API (`/v1/admin/*`).

## Verification
- Run: `cd apps/admin && npm run lint`
