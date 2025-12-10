import { ApiProperty } from '@nestjs/swagger';

export class MemoryUsageDto {
  @ApiProperty({ example: 12345678 })
  rss: number;

  @ApiProperty({ example: 1234567 })
  heapTotal: number;

  @ApiProperty({ example: 987654 })
  heapUsed: number;

  @ApiProperty({ example: 12345 })
  external: number;
}

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: 'Pass 테스트 서버 정상 작동' })
  message: string;

  @ApiProperty({ example: '2025-12-03T12:34:56.789Z' })
  serverTime: string;

  @ApiProperty({ example: 12345 })
  uptimeSeconds: number;

  @ApiProperty({ type: MemoryUsageDto })
  memory: MemoryUsageDto;

  @ApiProperty({ example: [0.1, 0.05, 0.0] })
  loadavg: number[];

  @ApiProperty({ example: 2.34 })
  responseTimeMs: number;
}
