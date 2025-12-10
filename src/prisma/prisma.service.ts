import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  constructor() {
    // 환경에 따라 로깅 레벨 조정
    const logLevels: any[] = process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'];

    super({
      log: logLevels,
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    
    // 개발 환경에서 느린 쿼리 로깅
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore - Prisma internal API
      this.$on('query', (e: any) => {
        if (e.duration > 1000) { // 1초 이상 걸리는 쿼리
          this.logger.warn(`Slow query detected (${e.duration}ms): ${e.query}`);
        }
      });
    }

    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
