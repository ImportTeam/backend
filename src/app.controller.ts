import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import * as os from 'os';
import { SystemHealthResponseDto } from './common/dto/system-health-response.dto';

@ApiExtraModels(SystemHealthResponseDto)
@ApiTags('시스템')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: '기본 헬스체크 + 서버 성능/상태 정보' })
  @ApiResponse({ status: 200, type: SystemHealthResponseDto })
  health(): SystemHealthResponseDto {
    const start = process.hrtime.bigint();

    const serverTime = new Date().toISOString();
    const uptimeSeconds = Math.floor(process.uptime());
    const memory = process.memoryUsage();

    const end = process.hrtime.bigint();
    const durationNs = Number(end - start);
    const responseTimeMs = Math.round((durationNs / 1_000_000) * 100) / 100;

    return {
      status: 'ok',
      message: '서버 정상 작동',
      serverTime,
      uptimeSeconds,
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch(),
      cpuCount: os.cpus?.().length ?? 0,
      totalMemBytes: os.totalmem?.() ?? 0,
      freeMemBytes: os.freemem?.() ?? 0,
      processMemory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: (memory as unknown as { external?: number }).external ?? 0,
      },
      loadavg: os.loadavg?.() ?? [0, 0, 0],
      responseTimeMs,
    } as SystemHealthResponseDto;
  }
}
