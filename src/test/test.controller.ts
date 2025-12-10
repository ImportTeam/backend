import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExtraModels, ApiExcludeEndpoint } from '@nestjs/swagger';
import { HealthResponseDto } from './dto/health-response.dto';
import * as os from 'os';

@ApiExtraModels(HealthResponseDto)
@ApiTags('테스트')
@Controller('test')
export class TestController {
  @Get('health')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: '서버 헬스 체크 및 진단 정보' })
  @ApiResponse({ status: 200, description: '서버 및 응답 시간 정보', type: HealthResponseDto })
  async health() {
    const start = process.hrtime.bigint();

    const serverTime = new Date().toISOString();
    const uptimeSeconds = Math.floor(process.uptime());
    const memory = process.memoryUsage();
    const loadavg = os.loadavg ? os.loadavg() : [0, 0, 0];

    const end = process.hrtime.bigint();
    const durationNs = Number(end - start);
    const responseTimeMs = Math.round(durationNs / 1_000_000 * 100) / 100; // ms with 2 decimals

    return {
      status: 'ok',
      message: 'Pass 테스트 서버 정상 작동',
      serverTime,
      uptimeSeconds,
      memory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: (memory as any).external ?? 0,
      },
      loadavg,
      responseTimeMs,
    } as HealthResponseDto;
  }
}
