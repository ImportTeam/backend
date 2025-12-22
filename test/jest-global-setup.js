const { spawnSync } = require('child_process');
const path = require('path');

module.exports = async () => {
  if (process.env.SKIP_DB_SEED === 'true') {
    // Allows running unit tests without DB.
    return;
  }

  // If there is no DATABASE_URL, don't attempt DB seed.
  if (!process.env.DATABASE_URL) {
    return;
  }

  const requireDbSeed = (process.env.REQUIRE_DB_SEED ?? '')
    .trim()
    .toLowerCase()
    .startsWith('t');

  const seedPath = path.join(__dirname, '..', 'prisma', 'seed.ts');

  // Ensure predictable mode for PrismaService logs
  process.env.NODE_ENV = process.env.NODE_ENV || 'test';

  const result = spawnSync(process.execPath, ['-r', 'ts-node/register', seedPath], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    if (requireDbSeed) {
      throw new Error(`DB seed failed (exit code: ${result.status})`);
    }
    // Default: don't block unit tests when DB is unavailable.
    // (Integration/E2E can opt-in via REQUIRE_DB_SEED=true)
    // eslint-disable-next-line no-console
    console.warn(
      `[jest-global-setup] DB seed failed (exit code: ${result.status}). Skipping seed. ` +
        `Set REQUIRE_DB_SEED=true to fail hard or SKIP_DB_SEED=true to skip explicitly.`,
    );
    return;
  }
};
