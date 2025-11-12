import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { BenefitsModule } from './benefits/benefits.module';
import { PaymentsModule } from './payments/payments.module';
import { CrawlerModule } from './crawler/crawler.module';
import { validate } from './config/env.validation';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      validate 
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minute
        limit: 10,  // 10 requests per minute (default)
      },
      {
        name: 'long',
        ttl: 300000, // 5 minutes
        limit: 30,  // 30 requests per 5 minutes (default)
      },
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    AdminModule,
    PaymentMethodsModule,
    BenefitsModule,
    PaymentsModule,
    CrawlerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
