import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  private readonly log = new Logger(AdminService.name);
  constructor(private prisma: PrismaService) {}

  async resetSequences() {
    // users
    await this.prisma.$executeRawUnsafe(`
      UPDATE users u
      JOIN (
        SELECT seq AS old_seq, ROW_NUMBER() OVER (ORDER BY seq) AS new_seq
        FROM users
      ) AS sorted ON u.seq = sorted.old_seq
      SET u.seq = sorted.new_seq;
    `);
    const usersCount: any = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*) AS count FROM users`);
    await this.prisma.$executeRawUnsafe(`ALTER TABLE users AUTO_INCREMENT = ${Number(usersCount[0]?.count ?? 0) + 1}`);

    // payment_methods
    await this.prisma.$executeRawUnsafe(`
      UPDATE payment_methods p
      JOIN (
        SELECT seq AS old_seq, ROW_NUMBER() OVER (ORDER BY seq) AS new_seq
        FROM payment_methods
      ) AS sorted ON p.seq = sorted.old_seq
      SET p.seq = sorted.new_seq;
    `);
    const payCount: any = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*) AS count FROM payment_methods`);
    await this.prisma.$executeRawUnsafe(`ALTER TABLE payment_methods AUTO_INCREMENT = ${Number(payCount[0]?.count ?? 0) + 1}`);

    // user_sessions
    await this.prisma.$executeRawUnsafe(`
      UPDATE user_sessions s
      JOIN (
        SELECT seq AS old_seq, ROW_NUMBER() OVER (ORDER BY seq) AS new_seq
        FROM user_sessions
      ) AS sorted ON s.seq = sorted.old_seq
      SET s.seq = sorted.new_seq;
    `);
    const sessCount: any = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*) AS count FROM user_sessions`);
    await this.prisma.$executeRawUnsafe(`ALTER TABLE user_sessions AUTO_INCREMENT = ${Number(sessCount[0]?.count ?? 0) + 1}`);

    this.log.log('Sequence reset completed.');
    return { ok: true };
  }
}
