import { Module } from '@nestjs/common';
import { BillingKeysService } from './billing-keys.service';
import { BillingKeysController } from './billing-keys.controller';
import { PortOneModule } from '../portone/portone.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PortOneModule, PrismaModule],
  providers: [BillingKeysService],
  controllers: [BillingKeysController],
  exports: [BillingKeysService],
})
export class BillingKeysModule {}
