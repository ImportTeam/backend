import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

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
      // @ts-ignore - Prisma internal API
      this.$on('query', (e: any) => {
        if (e.duration > 1000) {
          this.logger.warn(`Slow query detected (${e.duration}ms): ${e.query}`);
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
