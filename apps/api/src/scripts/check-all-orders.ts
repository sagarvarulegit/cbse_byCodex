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
  // Check any PaymentOrder across the whole database
  const totalOrders = await prisma.paymentOrder.count();
  console.log(`Total payment orders across entire DB: ${totalOrders}`);

  const allOrders = await prisma.paymentOrder.findMany({
    include: {
      user: {
        select: { email: true, profile: true },
      },
    },
  });
  console.log('All payment orders:', JSON.stringify(allOrders, null, 2));

  // Check total registered users in DB
  const totalUsers = await prisma.user.count();
  console.log(`Total users across entire DB: ${totalUsers}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
