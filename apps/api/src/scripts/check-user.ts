import path from 'path';
import fs from 'fs';

// Fix stale Windows environment variables pointing to old directory name
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

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  const targetEmail = 'rneeru4600@gmail.com';
  console.log(`Searching for user with email: ${targetEmail}`);

  // Search case-insensitively or contains
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: 'rneeru4600',
        mode: 'insensitive',
      },
    },
    include: {
      profile: true,
      guardianConsent: true,
      subscriptions: true,
      paymentOrders: true,
      entitlements: true,
      quizAttempts: {
        include: {
          chapter: {
            select: { title: true, slug: true, ncertChapterNumber: true },
          },
        },
      },
      writtenPracticeAttempts: {
        include: {
          chapter: {
            select: { title: true, slug: true },
          },
        },
      },
      examPaperAttempts: true,
      tutorConversations: {
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
      progressEvents: {
        orderBy: { occurredAt: 'desc' },
        take: 50,
      },
      chapterMasteries: true,
      studyStreak: true,
      userBadges: true,
    },
  });

  console.log(`Found ${users.length} matching user(s).`);

  if (users.length === 0) {
    console.log('Listing latest 10 registered users in DB:');
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });
    console.log(JSON.stringify(recentUsers, null, 2));

    console.log('Listing latest 10 payment orders in DB:');
    const recentOrders = await prisma.paymentOrder.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        amount: true,
        productKey: true,
        status: true,
        paymentGateway: true,
        createdAt: true,
      },
    });
    console.log(JSON.stringify(recentOrders, null, 2));
    return;
  }

  for (const user of users) {
    console.log('====================================');
    console.log(`User ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Phone: ${user.phone}`);
    console.log(`Role: ${user.role}`);
    console.log(`Status: ${user.status}`);
    console.log(`Created At: ${user.createdAt.toISOString()}`);
    console.log(`Updated At: ${user.updatedAt.toISOString()}`);

    console.log('\n--- Profile ---');
    console.log(JSON.stringify(user.profile, null, 2));

    console.log('\n--- Guardian Consent ---');
    console.log(JSON.stringify(user.guardianConsent, null, 2));

    console.log('\n--- Payment Orders (Purchases) ---');
    console.log(`Total Orders: ${user.paymentOrders.length}`);
    console.log(JSON.stringify(user.paymentOrders, null, 2));

    console.log('\n--- Entitlements ---');
    console.log(`Total Entitlements: ${user.entitlements.length}`);
    console.log(JSON.stringify(user.entitlements, null, 2));

    console.log('\n--- Subscriptions ---');
    console.log(`Total Subscriptions: ${user.subscriptions.length}`);
    console.log(JSON.stringify(user.subscriptions, null, 2));

    console.log('\n--- Quiz Attempts ---');
    console.log(`Total Quiz Attempts: ${user.quizAttempts.length}`);
    console.log(JSON.stringify(user.quizAttempts, null, 2));

    console.log('\n--- Written Practice Attempts ---');
    console.log(`Total Written Practice Attempts: ${user.writtenPracticeAttempts.length}`);
    console.log(JSON.stringify(user.writtenPracticeAttempts, null, 2));

    console.log('\n--- Exam Paper Attempts ---');
    console.log(`Total Exam Paper Attempts: ${user.examPaperAttempts.length}`);
    console.log(JSON.stringify(user.examPaperAttempts, null, 2));

    console.log('\n--- Tara AI Tutor Conversations ---');
    console.log(`Total Tutor Conversations: ${user.tutorConversations.length}`);
    for (const conv of user.tutorConversations) {
      console.log(`  Conversation "${conv.title}" (${conv.id}) - ${conv.messages.length} messages:`);
      for (const msg of conv.messages) {
        console.log(`    [${msg.role}] ${msg.contentMarkdown.slice(0, 150)}...`);
      }
    }

    console.log('\n--- Progress Events (Last 50) ---');
    console.log(`Total Progress Events retrieved: ${user.progressEvents.length}`);
    for (const evt of user.progressEvents) {
      console.log(`  [${evt.occurredAt.toISOString()}] ${evt.eventType} | ${JSON.stringify(evt.metadata)}`);
    }

    console.log('\n--- Chapter Masteries ---');
    console.log(JSON.stringify(user.chapterMasteries, null, 2));

    console.log('\n--- Study Streak ---');
    console.log(JSON.stringify(user.studyStreak, null, 2));

    console.log('\n--- Badges ---');
    console.log(JSON.stringify(user.userBadges, null, 2));
    console.log('====================================\n');
  }
}

main()
  .catch((e) => {
    console.error('Error running query:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
