import path from 'path';
import fs from 'fs';

// Fix stale Windows environment variables if present
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
import { buildStudentReengagementEmailHtml, sendEmail } from '../lib/email.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const emailArg = args.find((a) => a.startsWith('--email='))?.split('=')[1] ?? 'rneeru4600@gmail.com';

  console.log(`[RE-ENGAGEMENT] Targeting student: ${emailArg} (Dry run: ${isDryRun})`);

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: emailArg,
        mode: 'insensitive',
      },
    },
    include: {
      profile: true,
    },
  });

  const studentName = user?.profile?.fullName ?? 'Aditya Rathor';
  const targetEmail = user?.email ?? emailArg;
  const firstName = studentName.split(/\s+/)[0];

  const subject = `${firstName}, here is your Class 10 Science booster (+ a quick question for you)`;
  const html = buildStudentReengagementEmailHtml({
    studentName,
    userEmail: targetEmail,
  });

  console.log('\n--- EMAIL METADATA ---');
  console.log(`To: ${targetEmail}`);
  console.log(`Student Name: ${studentName}`);
  console.log(`Subject: ${subject}`);
  console.log('----------------------\n');

  if (isDryRun) {
    console.log('[DRY-RUN] Email generated successfully. Skipping actual network dispatch.');
    console.log(`[DRY-RUN] HTML length: ${html.length} characters.`);
    return;
  }

  console.log('[RE-ENGAGEMENT] Dispatching email via configured email providers...');
  const result = await sendEmail({
    to: targetEmail,
    subject,
    html,
  });

  console.log('[RE-ENGAGEMENT RESULT]:', JSON.stringify(result, null, 2));

  if (!result.success) {
    console.log('\n[NOTE] If no transactional email provider (Resend/Brevo/SMTP) is active in local .env,');
    console.log('you can copy the plain text email template from the plan artifact and send it directly via Gmail or WhatsApp.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
