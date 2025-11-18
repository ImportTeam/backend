import { Module } from '@nestjs/common';
import { IdentityVerificationsService } from './identity-verifications.service';
import { IdentityVerificationsController } from './identity-verifications.controller';
import { IdentityVerificationsTestController } from './test.controller';
import { PortOneModule } from '../portone/portone.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PortOneModule, PrismaModule],
  providers: [IdentityVerificationsService],
  controllers: [IdentityVerificationsController, IdentityVerificationsTestController],
  exports: [IdentityVerificationsService],
})
export class IdentityVerificationsModule {}
