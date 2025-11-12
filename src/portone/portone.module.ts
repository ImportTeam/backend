import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PortOneService } from './portone.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [PortOneService],
  exports: [PortOneService],
})
export class PortOneModule {}
