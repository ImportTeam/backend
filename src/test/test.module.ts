import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { PortOneModule } from '../portone/portone.module';

@Module({
  imports: [],
  controllers: [TestController],
})
export class TestModule {}
