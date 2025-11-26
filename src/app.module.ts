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
import { PortOneModule } from './portone/portone.module';
import { IdentityVerificationsModule } from './identity-verifications/identity-verifications.module';
import { BillingKeysModule } from './billing-keys/billing-keys.module';
import { TestModule } from './test/test.module';
import { join } from 'path';
import { validate } from './config/env.validation';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    // Serve only the test static files under /api/test
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/test',
      // Exclude all API routes from static file serving; use '/api' and '/api/*' to be compatible with path-to-regexp
      exclude: ['/api', '/api/*'],
    }),
    ConfigModule.forRoot({ 
      isGlobal: true, 
      validate 
    }),
    // Keep simple global throttling; cast to any to avoid typing mismatch with custom named throttler config
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 10,
          ttl: 60,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    // Note: ServeStaticModule for serving the test files is configured above
    PrismaModule,
    UsersModule,
    AuthModule,
    AdminModule,
    PaymentMethodsModule,
    BenefitsModule,
    PaymentsModule,
    CrawlerModule,
    PortOneModule,
    IdentityVerificationsModule,
    BillingKeysModule,
    // TestModule removed: unify tests to /api/identity-verifications/verify-pass/test
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
