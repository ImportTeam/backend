import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  private getSlowQueryThresholdMs(): number {
    const raw = (process.env.PRISMA_SLOW_QUERY_MS ?? '').trim();
    const parsed = Number(raw);
    if (raw && Number.isFinite(parsed) && parsed > 0) return parsed;
    return 1000;
  }

  private shouldIncludeSlowQueryText(): boolean {
    const explicit = (process.env.PRISMA_LOG_SLOW_QUERY_TEXT ?? '')
      .trim()
      .toLowerCase()
      .startsWith('t');
    if (explicit) return true;

    const logLevel = (process.env.LOG_LEVEL ?? '').trim().toLowerCase();
    return ['debug', 'verbose', 'silly'].includes(logLevel);
  }

  constructor() {
    const logLevels: any[] = process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'];

    super({
      log: logLevels,
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');

    const env = (process.env.NODE_ENV ?? '').trim().toLowerCase();
    const forceFailFast = (process.env.PRISMA_FAIL_FAST ?? '')
      .trim()
      .toLowerCase()
      .startsWith('t');
    const isProd = env === 'production';
    const shouldFailFast = isProd || forceFailFast;

    if (process.env.NODE_ENV === 'development') {
      const slowQueryMs = this.getSlowQueryThresholdMs();
      const includeQueryText = this.shouldIncludeSlowQueryText();

      // @ts-ignore - Prisma internal API
      this.$on('query', (e: any) => {
        const durationMs = Number(e?.duration);
        if (!Number.isFinite(durationMs)) return;

        if (durationMs > slowQueryMs) {
          const query = includeQueryText && typeof e?.query === 'string' ? e.query : '';
          this.logger.warn(
            `Slow query detected (${durationMs}ms)${query ? `: ${query}` : ''}`,
          );
        }
      });
    }

    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database:', error);

      if (shouldFailFast) {
        throw error;
      }

      this.logger.warn(
        '⚠️ Continuing without database connection (non-production mode). ' +
          'DB-dependent APIs will fail until the database is available. ' +
          '(Set PRISMA_FAIL_FAST=true to fail hard.)',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
