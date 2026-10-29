import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const repoRoot = path.resolve(__dirname, '../../../../');
const queryEngineDll = path.join(repoRoot, 'node_modules/@prisma/engines/query_engine-windows.dll.node');
const schemaEngineExe = path.join(repoRoot, 'node_modules/@prisma/engines/schema-engine-windows.exe');

if (fs.existsSync(queryEngineDll)) {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = queryEngineDll;
} else {
  delete process.env.PRISMA_QUERY_ENGINE_LIBRARY;
}

if (fs.existsSync(schemaEngineExe)) {
  process.env.PRISMA_SCHEMA_ENGINE_BINARY = schemaEngineExe;
} else {
  delete process.env.PRISMA_SCHEMA_ENGINE_BINARY;
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

const args = process.argv.slice(2);
const emailArg = args.find((a) => a.startsWith('--email='))?.split('=')[1] || args[0] || 'shubanpandey@gmail.com';
const TARGET_EMAIL = emailArg.trim().toLowerCase();

const PRODUCTS_TO_GRANT = [
  // Commercial Flagship Packs
  {
    productKey: 'cbse10-all-subjects-mock-pack',
    subjectSlug: null,
    scope: 'mock_test_series',
    title: 'Class 10 All-Subjects Board Mock Pack (35 Full Papers)',
  },
  {
    productKey: 'cbse10-unlimited-quizzes-all',
    subjectSlug: null,
    scope: 'quiz',
    title: 'Class 10 Unlimited CBSE Quiz Pass (All Subjects & Chapters)',
  },
  {
    productKey: 'cbse10-activity-formula-combo',
    subjectSlug: null,
    scope: 'content_pack',
    title: 'Class 10 Activity, Diagram & Formula Super Combo',
  },
  {
    productKey: 'cbse10-activity-diagram-pack',
    subjectSlug: null,
    scope: 'content_pack',
    title: 'NCERT Activity & Diagram Mastery Pack',
  },
  {
    productKey: 'cbse10-formula-cheatsheet-pack',
    subjectSlug: null,
    scope: 'content_pack',
    title: 'Class 10 Formula & Reaction Cheatsheet Pack',
  },
  {
    productKey: 'cbse10-science-ch1-5-pack',
    subjectSlug: null,
    scope: 'science_pack',
    title: 'Class 10 Science (Ch 1–5) Board Blueprint & PYQ Pack',
  },

  // Single Subject Mock Passes (All 7 Class 10 Board Subjects)
  {
    productKey: 'cbse10-mock-pass-mathematics-standard',
    subjectSlug: 'mathematics-standard',
    scope: 'mock_test_series',
    title: 'Mathematics Standard (041) — 5 Board Mock Papers',
  },
  {
    productKey: 'cbse10-mock-pass-mathematics-basic',
    subjectSlug: 'mathematics-basic',
    scope: 'mock_test_series',
    title: 'Mathematics Basic (241) — 5 Board Mock Papers',
  },
  {
    productKey: 'cbse10-mock-pass-science',
    subjectSlug: 'science',
    scope: 'mock_test_series',
    title: 'Science (086) — 5 Board Mock Papers',
  },
  {
    productKey: 'cbse10-mock-pass-social-science',
    subjectSlug: 'social-science',
    scope: 'mock_test_series',
    title: 'Social Science (087) — 5 Board Mock Papers',
  },
  {
    productKey: 'cbse10-mock-pass-english-language-and-literature',
    subjectSlug: 'english-language-and-literature',
    scope: 'mock_test_series',
    title: 'English Language & Lit (184) — 5 Board Mock Papers',
  },
  {
    productKey: 'cbse10-mock-pass-hindi-course-a',
    subjectSlug: 'hindi-course-a',
    scope: 'mock_test_series',
    title: 'Hindi Course A (002) — 5 Board Mock Papers',
  },
  {
    productKey: 'cbse10-mock-pass-hindi-course-b',
    subjectSlug: 'hindi-course-b',
    scope: 'mock_test_series',
    title: 'Hindi Course B (085) — 5 Board Mock Papers',
  },
];

async function main() {
  console.log(`Looking up user: ${TARGET_EMAIL}`);

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: TARGET_EMAIL,
        mode: 'insensitive',
      },
    },
    include: {
      profile: true,
      guardianConsent: true,
      entitlements: true,
      paymentOrders: true,
    },
  });

  if (!user) {
    throw new Error(`User with email "${TARGET_EMAIL}" not found in database!`);
  }

  console.log(`Found student: ${user.profile?.fullName || 'Student'} (ID: ${user.id})`);
  console.log(`Current active entitlements count: ${user.entitlements.length}`);
  console.log(`Current orders count: ${user.paymentOrders.length}`);

  // Create zero-amount paid payment orders for the primary commercial packages so order receipts appear in /orders
  const primaryPacks = [
    {
      productKey: 'cbse10-all-subjects-mock-pack',
      title: 'Class 10 All-Subjects Board Mock Pack (35 Full Papers)',
      originalPaise: 49900,
    },
    {
      productKey: 'cbse10-unlimited-quizzes-all',
      title: 'Class 10 Unlimited CBSE Quiz Pass (All Subjects & Chapters)',
      originalPaise: 59900,
    },
    {
      productKey: 'cbse10-activity-formula-combo',
      title: 'Class 10 Activity, Diagram & Formula Super Combo',
      originalPaise: 39900,
    },
    {
      productKey: 'cbse10-science-ch1-5-pack',
      title: 'Class 10 Science (Ch 1–5) Board Blueprint & PYQ Pack',
      originalPaise: 29900,
    },
  ];

  const orderMap = new Map<string, string>();

  for (const pack of primaryPacks) {
    const existingOrder = await prisma.paymentOrder.findFirst({
      where: {
        userId: user.id,
        productKey: pack.productKey,
        status: 'paid',
      },
    });

    if (existingOrder) {
      console.log(`Found existing paid order for ${pack.productKey}: ${existingOrder.id}`);
      orderMap.set(pack.productKey, existingOrder.id);
    } else {
      const orderCode = `grant_${pack.productKey.replace(/-/g, '_')}_${user.id.slice(-6)}`;
      const newOrder = await prisma.paymentOrder.create({
        data: {
          userId: user.id,
          razorpayOrderId: orderCode,
          paymentGateway: 'cashfree',
          amount: 0,
          currency: 'INR',
          productKey: pack.productKey,
          status: 'paid',
          razorpayPaymentId: `free_grant_${Date.now()}_${pack.productKey}`,
          receipt: `rcpt_free_${user.id.slice(-6)}_${pack.productKey}`,
          notesJson: {
            grantedBy: 'admin',
            grantType: 'complimentary_all_access',
            recipientEmail: user.email,
            recipientName: user.profile?.fullName,
            description: `${pack.title} - Complimentary Full Access (CBSE Class 10)`,
          },
        },
      });
      console.log(`Created complimentary order for ${pack.productKey}: ${newOrder.id}`);
      orderMap.set(pack.productKey, newOrder.id);
    }
  }

  // Now create/update active entitlements for all products
  console.log('\nActivating entitlements...');
  const results = [];

  for (const item of PRODUCTS_TO_GRANT) {
    const paymentOrderId = orderMap.get(item.productKey) || null;

    // Look for existing entitlement record for this user and product
    const existing = await prisma.userEntitlement.findFirst({
      where: {
        userId: user.id,
        productKey: item.productKey,
        subjectSlug: item.subjectSlug,
      },
    });

    let entitlement;
    if (existing) {
      entitlement = await prisma.userEntitlement.update({
        where: { id: existing.id },
        data: {
          status: 'active',
          paymentOrderId: paymentOrderId || existing.paymentOrderId,
          validFrom: new Date(),
          validUntil: null, // Lifetime / permanent
        },
      });
      console.log(`Updated active entitlement: ${item.productKey} (${item.title})`);
    } else {
      entitlement = await prisma.userEntitlement.create({
        data: {
          userId: user.id,
          productKey: item.productKey,
          subjectSlug: item.subjectSlug,
          scope: item.scope,
          status: 'active',
          paymentOrderId,
          validFrom: new Date(),
          validUntil: null, // Lifetime / permanent
        },
      });
      console.log(`Created new active entitlement: ${item.productKey} (${item.title})`);
    }
    results.push(entitlement);
  }

  console.log(`\nSuccessfully granted ${results.length} active entitlements to ${TARGET_EMAIL}!`);

  // Verify the user's entitlements
  const verifiedEntitlements = await prisma.userEntitlement.findMany({
    where: {
      userId: user.id,
      status: 'active',
    },
    orderBy: { createdAt: 'asc' },
  });

  console.log('\n--- VERIFIED ACTIVE ENTITLEMENTS ---');
  for (const ent of verifiedEntitlements) {
    console.log(`- ${ent.productKey} (scope: ${ent.scope}, subjectSlug: ${ent.subjectSlug || 'ALL'}, validUntil: ${ent.validUntil ?? 'LIFETIME'})`);
  }
}

main()
  .catch((e) => {
    console.error('Error granting access:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
