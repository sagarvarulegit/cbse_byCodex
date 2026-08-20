---
type: ProjectMemoryTopic
title: Payments, Monetization and Content Protection Memory
description: Durable learnings on micro-monetization pricing under ₹200, payment gateway integrations, student entitlements, and digital DRM watermarking.
tags: ['memory', 'payments', 'cashfree', 'razorpay', 'store', 'drm', 'monetization']
timestamp: 2026-08-20T00:00:00Z
---

# Payments, Monetization & Content Protection Memory

Read this file for commercial catalog structure, payment order lifecycle, student entitlements, digital watermarking, and the ChapterReady Store.

## Product & Pricing Philosophy

1. **Free Core Hierarchy**: Core NCERT chapter notes, video lessons, and 3 daily quizzes remain **100% free forever** for all Indian students.
2. **Micro-Pricing Ceiling (< ₹200 INR)**: Every purchasable tool is strictly priced under ₹200 INR to eliminate high-price friction and make piracy unappealing compared to instant UPI checkout:
   - `cbse10-formula-cheatsheet-pack` (**₹49**): 1-page summary sheets + 3D flashcards.
   - `cbse10-activity-diagram-pack` (**₹99**): 13 Science experimental setups, observations, reactions, and 3/5-mark board Q&As.
   - `cbse10-activity-formula-combo` (**₹129**): Upsell bundle for both revision tools.
   - `cbse10-mock-pass-<subject>` (**₹99**): 5 CBT board mock papers for a single subject.
   - `cbse10-all-subjects-mock-pack` (**₹199**): 20 full-length 80-mark mock papers (Maths, Science, SST, English).
   - `cbse10-unlimited-quizzes-all` (**₹199**): Unlimited daily quizzes across all 48 NCERT chapters + Mistake Vault.

## Architecture & Entitlements

- **Product Catalog**: Defined in `apps/api/src/lib/payments/products.ts` with prices in paise. `apps/web/lib/payments.ts` maintains matching frontend product keys.
- **Order Lifecycle**:
  - `POST /v1/payments/create-order` creates a Cashfree payment session (supporting UPI, GPay, PhonePe, Paytm, RuPay/Visa/MasterCard, NetBanking) with fallback support for Razorpay. Records `PaymentOrder` in PostgreSQL.
  - `POST /v1/payments/verify` verifies transaction signatures, updates order status to `paid`, and upserts `UserEntitlement` with `status: active`.
  - Buying the Combo pack (`cbse10-activity-formula-combo`) automatically satisfies both `checkHasActivityDiagramPack()` and `checkHasFormulaCheatsheetPack()`.
- **Modals**:
  - `ProductCheckoutModal.tsx`: Dynamic single/combo selector modal for micro-packs.
  - `PaywallModal.tsx`: Dedicated modal for 80-mark Mock Paper test series.
  - `QuizPaywallModal.tsx`: Paywall modal triggered when exceeding the 3 daily quiz limit.
  - All modals cleanly redirect unauthenticated guests to login/register and resume checkout upon return.

## Digital Content Protection & Anti-Piracy DRM

- **Forensic Dynamic Watermarking**:
  - Screen and print views render a personalized license header: `🔐 Single-Student License: [Name] ([Email]) • Official ChapterReady™`.
  - Diagonal background watermark (`[Name] • [Email] • ChapterReady Official`) bakes across all printable 1-page summary sheets and experiment cards.
- **Anti-Scrape DOM Protections**:
  - `user-select: none` and `-webkit-user-select: none` applied to curated formula vaults, common trap warnings, experimental observations, and model answers.
- **Viral Print Footers**:
  - Every printed sheet includes a promotional QR / URL callout driving classmates to ChapterReady's interactive 3D flashcards and CBT mock timers.
