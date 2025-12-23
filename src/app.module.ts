import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
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
import { DashboardModule } from './dashboard/dashboard.module';
import { ExternalModule } from './external';
import { AnalyticsModule } from './analytics/analytics.module';
import { join } from 'path';
import { validate } from './config/env.validation';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/test',
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          limit: 10,
          ttl: 60,
        },
        {
          name: 'short',
          limit: 10,
          ttl: 60,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    ExternalModule,
    UsersModule,
    AuthModule,
    AdminModule,
    PaymentMethodsModule,
    BenefitsModule,
    PaymentsModule,
    CrawlerModule,
    DashboardModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
