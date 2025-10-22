import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AdminService {
  private readonly log = new Logger(AdminService.name);
  constructor(private prisma: PrismaService) {}

  // 1분마다 실행
  @Cron(CronExpression.EVERY_MINUTE)
  async autoResetSequences() {
    try {
      const needsReset = await this.checkSequenceGaps();
      
      if (!needsReset) {
        this.log.debug('시퀀스 정리가 필요하지 않습니다. 스킵합니다.');
        return;
      }

      this.log.log('시퀀스 갭이 감지되었습니다. 자동 정리를 시작합니다...');
      await this.resetSequences();
    } catch (error) {
      this.log.error('자동 시퀀스 정리 중 오류 발생:', error);
    }
  }

  // 시퀀스에 갭이 있는지 체크
  async checkSequenceGaps(): Promise<boolean> {
    try {
      // users 테이블 체크
      const usersGap: any = await this.prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as gap_count
        FROM (
          SELECT seq, ROW_NUMBER() OVER (ORDER BY seq) AS expected_seq
          FROM users
        ) AS check_table
        WHERE seq != expected_seq
      `);

      // payment_methods 테이블 체크
      const paymentGap: any = await this.prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as gap_count
        FROM (
          SELECT seq, ROW_NUMBER() OVER (ORDER BY seq) AS expected_seq
          FROM payment_methods
        ) AS check_table
        WHERE seq != expected_seq
      `);

      // user_sessions 테이블 체크
      const sessionsGap: any = await this.prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as gap_count
        FROM (
          SELECT seq, ROW_NUMBER() OVER (ORDER BY seq) AS expected_seq
          FROM user_sessions
        ) AS check_table
        WHERE seq != expected_seq
      `);

      const hasGap = 
        Number(usersGap[0]?.gap_count ?? 0) > 0 ||
        Number(paymentGap[0]?.gap_count ?? 0) > 0 ||
        Number(sessionsGap[0]?.gap_count ?? 0) > 0;

      return hasGap;
    } catch (error) {
      this.log.error('시퀀스 갭 체크 중 오류:', error);
      return false;
    }
  }

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
