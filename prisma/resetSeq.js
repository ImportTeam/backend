import { prisma } from './client.js';

export async function resetSequences() {
  console.log('🔄 Checking and resetting table sequences...');

  try {
    // users
    await prisma.$executeRawUnsafe(`
      UPDATE users u
      JOIN (
        SELECT seq AS old_seq,
               ROW_NUMBER() OVER (ORDER BY seq) AS new_seq
        FROM users
      ) AS sorted ON u.seq = sorted.old_seq
      SET u.seq = sorted.new_seq;
    `);

    const userCountResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) AS count FROM users`);
    const userCount = Number(userCountResult[0].count) || 0;
    await prisma.$executeRawUnsafe(`ALTER TABLE users AUTO_INCREMENT = ${userCount + 1}`);

    // payment_methods
    await prisma.$executeRawUnsafe(`
      UPDATE payment_methods p
      JOIN (
        SELECT seq AS old_seq,
               ROW_NUMBER() OVER (ORDER BY seq) AS new_seq
        FROM payment_methods
      ) AS sorted ON p.seq = sorted.old_seq
      SET p.seq = sorted.new_seq;
    `);

    const payCountResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) AS count FROM payment_methods`);
    const payCount = Number(payCountResult[0].count) || 0;
    await prisma.$executeRawUnsafe(`ALTER TABLE payment_methods AUTO_INCREMENT = ${payCount + 1}`);

    // user_sessions
    await prisma.$executeRawUnsafe(`
      UPDATE user_sessions s
      JOIN (
        SELECT seq AS old_seq,
               ROW_NUMBER() OVER (ORDER BY seq) AS new_seq
        FROM user_sessions
      ) AS sorted ON s.seq = sorted.old_seq
      SET s.seq = sorted.new_seq;
    `);

    const sessCountResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) AS count FROM user_sessions`);
    const sessCount = Number(sessCountResult[0].count) || 0;
    await prisma.$executeRawUnsafe(`ALTER TABLE user_sessions AUTO_INCREMENT = ${sessCount + 1}`);

    console.log('✅ Sequence reset completed.');
  } catch (err) {
    console.error('❌ Error while resetting sequences:', err);
  }
}
