import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // keep existing seed command used by the project (ts-node)
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    // Type-safe env helper; DATABASE_URL must be present in .env
    url: env('DATABASE_URL'),
  },
})
