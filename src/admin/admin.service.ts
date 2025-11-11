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
      // Postgres에서는 PK 갭 자체는 문제가 아니고, 시퀀스 값이 MAX(seq)보다 작은 경우만 문제
      const rows: any = await this.prisma.$queryRawUnsafe(`
        WITH t AS (
          SELECT 'users' AS table_name, 'seq' AS column_name
          UNION ALL SELECT 'payment_methods','seq'
          UNION ALL SELECT 'user_sessions','seq'
        )
        SELECT 
          t.table_name,
          COALESCE((SELECT MAX(seq) FROM users), 0) AS users_max,
          COALESCE((SELECT MAX(seq) FROM payment_methods), 0) AS payment_methods_max,
          COALESCE((SELECT MAX(seq) FROM user_sessions), 0) AS user_sessions_max
        FROM t LIMIT 1;
      `);

      // 단일 로우에 각 max 값이 들어오도록 구성
      const usersMax = Number(rows[0]?.users_max ?? 0);
      const pmMax = Number(rows[0]?.payment_methods_max ?? 0);
      const usMax = Number(rows[0]?.user_sessions_max ?? 0);

      // 시퀀스 현재 값이 max 보다 작은지 간접 판단은 어렵기 때문에, 보수적으로 true 반환하여 주기적 setval 수행
      return usersMax > 0 || pmMax > 0 || usMax > 0;
    } catch (error) {
      this.log.error('시퀀스 상태 점검 중 오류:', error);
      return false;
    }
  }

  async resetSequences() {
    // Postgres: 각 테이블 시퀀스를 MAX(seq)+1 로 동기화 (행 재번호 부여 없음)
    // 안전을 위해 허용된 테이블만 처리
    const tasks = [
      this.syncSequence('users', 'seq'),
      this.syncSequence('payment_methods', 'seq'),
      this.syncSequence('user_sessions', 'seq'),
    ];

    await Promise.all(tasks);
    this.log.log('Postgres sequences synced to MAX(seq)+1.');
    return { ok: true };
  }

  private async syncSequence(tableName: 'users' | 'payment_methods' | 'user_sessions', columnName: 'seq') {
    // 식별자 바인딩이 어려워 화이트리스트 기반 문자열 구성
    const sql = `
      DO $$
      DECLARE
        seq_name text;
        max_id bigint;
      BEGIN
        SELECT pg_get_serial_sequence('${tableName}', '${columnName}') INTO seq_name;
        IF seq_name IS NOT NULL THEN
          EXECUTE format('SELECT COALESCE(MAX(%I), 0) FROM %I', '${columnName}', '${tableName}') INTO max_id;
          PERFORM setval(seq_name, max_id + 1, false);
        END IF;
      END
      $$;`;
    await this.prisma.$executeRawUnsafe(sql);
  }
}
