// /apps/worker/src/lib/prisma.ts
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});