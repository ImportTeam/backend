import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { IamportTestController } from './iamport-test.controller';

@Module({
  controllers: [TestController, IamportTestController],
})
export class TestModule {}
