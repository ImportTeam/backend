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
    // DB 종류에 따라 시퀀스 동기화 방식 분기
    const provider = this.getDbProvider();
    const tasks = [] as Promise<any>[];
    if (provider === 'mysql') {
      // ALTER TABLE 작업은 MySQL에서 메타데이터 락을 유발하여
      // 동시에 여러 테이블에 대해 실행하면 데드락이 발생할 수 있습니다.
      // 따라서 MySQL의 경우 각 테이블을 순차적으로 처리합니다.
      await this.syncSequenceMySQL('users');
      await this.syncSequenceMySQL('payment_methods');
      await this.syncSequenceMySQL('user_sessions');
      this.log.log('MySQL AUTO_INCREMENT synced to MAX(seq)+1.');
      return { ok: true };
    } else {
      // 기본은 Postgres 방식 유지
      tasks.push(this.syncSequence('users', 'seq'));
      tasks.push(this.syncSequence('payment_methods', 'seq'));
      tasks.push(this.syncSequence('user_sessions', 'seq'));
      await Promise.all(tasks);
      this.log.log('Postgres sequences synced to MAX(seq)+1.');
      return { ok: true };
    }
  }

  private async syncSequence(
    tableName: 'users' | 'payment_methods' | 'user_sessions',
    columnName: 'seq',
  ) {
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

  // MySQL용: AUTO_INCREMENT 값을 MAX(seq) + 1 로 맞춤
  private async syncSequenceMySQL(
    tableName: 'users' | 'payment_methods' | 'user_sessions',
  ) {
    // 화이트리스트로 tableName을 제한했으므로 문자열 직접 사용
    const maxRes: any = await this.prisma.$queryRawUnsafe(
      `SELECT COALESCE(MAX(seq), 0) as max_id FROM ${tableName};`,
    );
    const maxId = Number(maxRes[0]?.max_id ?? 0);
    const next = Math.max(1, maxId + 1);
    const sql = `ALTER TABLE ${tableName} AUTO_INCREMENT = ${next};`;

    // MySQL에서 ALTER TABLE은 메타데이터 락을 요구할 수 있고, 동시에 실행되는 트랜잭션/쿼리와 충돌하면 데드락(1213)이 발생할 수 있습니다.
    // 따라서 named GET_LOCK으로 직렬화하고, 데드락 발생 시 재시도하도록 안전 장치를 둡니다.
    const lockName = `picsel_auto_increment_${tableName}`;
    const maxAttempts = 5;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // 락 획득: 타임아웃 10초
        const got: any = await this.prisma.$queryRawUnsafe(
          `SELECT GET_LOCK('${lockName}', 10) as got;`,
        );
        const acquired = Number(got?.[0]?.got ?? 0) === 1;
        if (!acquired) {
          throw new Error(`GET_LOCK(${lockName}) 실패`);
        }

        // 실제 ALTER 수행
        await this.prisma.$executeRawUnsafe(sql);

        // 락 해제
        try {
          await this.prisma.$queryRawUnsafe(
            `SELECT RELEASE_LOCK('${lockName}') as released;`,
          );
        } catch (releaseErr) {
          this.log.debug('RELEASE_LOCK 실패 (무시):', releaseErr);
        }

        return;
      } catch (error) {
        // 안전하게 락을 해제 시도
        try {
          await this.prisma.$queryRawUnsafe(
            `SELECT RELEASE_LOCK('${lockName}')`,
          );
        } catch (_) {}

        // Prisma의 Raw 실패는 PrismaClientKnownRequestError로 래핑됩니다. MySQL 데드락 코드는 1213입니다.
        const code =
          (error && error.meta && error.meta.code) ||
          (error && error.code) ||
          null;
        this.log.error(
          `AUTO_INCREMENT 설정 시도 실패 (${tableName}) 시도=${attempt}`,
          error,
        );

        // 데드락일 경우 재시도 (지수 백오프)
        if ((code === '1213' || code === 1213) && attempt < maxAttempts) {
          const waitMs = attempt * 200;
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }

        // 재시도해도 안 되거나 다른 에러인 경우, 현재 프로세스 상태를 찍어 진단에 도움
        try {
          const procs: any = await this.prisma.$queryRawUnsafe(
            `SELECT ID, USER, HOST, DB, COMMAND, TIME, STATE, INFO FROM INFORMATION_SCHEMA.PROCESSLIST LIMIT 20;`,
          );
          this.log.debug('MySQL processlist snapshot:', JSON.stringify(procs));
        } catch (plErr) {
          this.log.debug('processlist 조회 실패:', plErr);
        }

        // 더 이상 재시도 불가하면 예외를 던져 상위에서 처리하도록 함
        throw error;
      }
    }
  }

  private getDbProvider(): 'postgresql' | 'mysql' {
    const url = process.env.DATABASE_URL || '';
    if (url.startsWith('mysql://') || url.startsWith('mysql2://'))
      return 'mysql';
    return 'postgresql';
  }
}
