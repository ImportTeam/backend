import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('health')
  health() {
    return { status: 'ok', message: 'Pass 테스트 서버 정상 작동' };
  }
}
