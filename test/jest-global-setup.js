const { spawnSync } = require('child_process');
const path = require('path');

module.exports = async () => {
  if (process.env.SKIP_DB_SEED === 'true') {
    // Allows running unit tests without DB.
    return;
  }

  const seedPath = path.join(__dirname, '..', 'prisma', 'seed.ts');

  // Ensure predictable mode for PrismaService logs
  process.env.NODE_ENV = process.env.NODE_ENV || 'test';

  const result = spawnSync(process.execPath, ['-r', 'ts-node/register', seedPath], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(`DB seed failed (exit code: ${result.status})`);
  }
};
