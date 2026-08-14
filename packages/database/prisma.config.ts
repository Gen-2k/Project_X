// Prisma 7 configuration. Run CLI commands from this package:
//   pnpm --filter @project/database exec prisma migrate dev
import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Prisma no longer loads .env files automatically. Load the app's env file so
// migrate/generate resolve the same DATABASE_URL the server uses.
loadEnv({ path: ['../../.env', '../../apps/server/.env'], quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
