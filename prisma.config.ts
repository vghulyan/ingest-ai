// /prisma.config.ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const DATABASE_URL = process.env.DATABASE_URL

export default defineConfig({
  schema: 'apps/api/prisma/schema.prisma',
  datasource: {
    url: DATABASE_URL,
  },
});
