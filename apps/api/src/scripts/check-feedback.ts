import path from 'path';
import fs from 'fs';

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
  const userId = 'cmubcc49z0000l804rqv0pe19';
  const feedbacks = await prisma.studentFeedback.findMany({
    where: {
      OR: [
        { userId: userId },
        { description: { contains: 'rneeru4600', mode: 'insensitive' } },
      ],
    },
  });
  console.log('Feedback from this user:', JSON.stringify(feedbacks, null, 2));

  const allRecentFeedback = await prisma.studentFeedback.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });
  console.log('Recent feedbacks:', JSON.stringify(allRecentFeedback, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
