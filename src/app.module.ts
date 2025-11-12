import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { BenefitsModule } from './benefits/benefits.module';
import { PaymentsModule } from './payments/payments.module';
import { CrawlerModule } from './crawler/crawler.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      validate 
    }),
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
})
export class AppModule {}
